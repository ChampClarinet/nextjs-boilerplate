"use client";

import { type FC, useEffect, useMemo, useState } from "react";

import type { GetAllStockTransactionParams } from "@/apis/stock";
import DateRangePicker from "@/components/molecules/date-range-picker";
import SearchBox from "@/components/molecules/search";
import { DataTable } from "@/components/organisms/data-table";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";

import { useStockTransactions } from "../hooks/use-stock-transactions";
import type { DisplayStockTransaction, StockTransactionFilters } from "../stock.types";
import {
  DELIVERY_STATUS_FILTER_OPTIONS,
  STOCK_ENTRY_TYPE_OPTIONS,
  getCurrentMonthDateRange,
  getStockTransactionTypeFilterLabel,
} from "../utils";
import StockTransactionDetailsDialog from "./details.dialog";

interface StockTransactionTabContentProps {
  refreshKey?: number;
}

const StockTransactionTabContent: FC<StockTransactionTabContentProps> = ({ refreshKey = 0 }) => {
  const defaultDateRange = useMemo(() => getCurrentMonthDateRange(), []);
  const [filters, setFilters] = useState<StockTransactionFilters>({
    transaction_number: "",
    stock_transaction_type: "all",
    stock_entry_type: "",
    delivery_status: "all",
    date_from: defaultDateRange.date_from,
    date_to: defaultDateRange.date_to,
  });
  const [debouncedTransactionNumber, setDebouncedTransactionNumber] = useState(
    filters.transaction_number,
  );
  const [selectedTransaction, setSelectedTransaction] = useState<
    DisplayStockTransaction | undefined
  >();
  const requestParams = useMemo<GetAllStockTransactionParams>(
    () => ({
      date_from: filters.date_from,
      date_to: filters.date_to,
      transaction_number: debouncedTransactionNumber.trim() || undefined,
      stock_transaction_type:
        filters.stock_transaction_type === "all" ? undefined : filters.stock_transaction_type,
      stock_entry_type: filters.stock_entry_type || undefined,
      delivery_status: filters.delivery_status === "all" ? undefined : filters.delivery_status,
    }),
    [
      debouncedTransactionNumber,
      filters.date_from,
      filters.date_to,
      filters.delivery_status,
      filters.stock_entry_type,
      filters.stock_transaction_type,
    ],
  );
  const { data, isLoading, error } = useStockTransactions(requestParams, { refreshKey });
  const table = useTable({
    features: stockTransactionTableFeatures,
    columns: stockTransactionColumns,
    data,
  });

  useEffect(() => {
    const debounceId = window.setTimeout(() => {
      setDebouncedTransactionNumber(filters.transaction_number);
    }, 400);

    return () => window.clearTimeout(debounceId);
  }, [filters.transaction_number]);

  const updateFilter = <TKey extends keyof StockTransactionFilters>(
    key: TKey,
    value: StockTransactionFilters[TKey],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      transaction_number: "",
      stock_transaction_type: "all",
      stock_entry_type: "",
      delivery_status: "all",
      date_from: defaultDateRange.date_from,
      date_to: defaultDateRange.date_to,
    });
    setDebouncedTransactionNumber("");
  };

  return (
    <>
      <section className="bg-card rounded-2xl border p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm font-semibold">ช่วงวันที่</span>
            <DateRangePicker
              range={[filters.date_from, filters.date_to]}
              onDateChange={([dateFrom, dateTo]) => {
                updateFilter("date_from", dateFrom ?? "");
                updateFilter("date_to", dateTo ?? dateFrom ?? "");
              }}
              shrinkWhenSmallScreen={false}
              triggerClassName="h-9"
              useBD
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm font-semibold">เลขที่รายการ</span>
            <SearchBox
              search={filters.transaction_number}
              onChange={(value) => updateFilter("transaction_number", value)}
              placeholder="ค้นหาเลขที่รายการ..."
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm font-semibold">เข้าออก</span>
            <Select
              value={filters.stock_transaction_type}
              onValueChange={(value) =>
                updateFilter(
                  "stock_transaction_type",
                  (value ?? "all") as StockTransactionFilters["stock_transaction_type"],
                )
              }
            >
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="ทั้งหมด">
                  {(value) => getStockTransactionTypeFilterLabel(String(value))}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="Stock In">รับเข้า</SelectItem>
                <SelectItem value="Stock Out">จ่ายออก</SelectItem>
              </SelectContent>
            </Select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm font-semibold">ประเภทรายการ</span>
            <StockEntryTypeFilter
              value={filters.stock_entry_type}
              onChange={(value) => updateFilter("stock_entry_type", value)}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm font-semibold">สถานะการนำส่ง</span>
            <Select
              value={filters.delivery_status}
              onValueChange={(value) => updateFilter("delivery_status", value ?? "all")}
            >
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="ทั้งหมด">
                  {(value) => (value && value !== "all" ? String(value) : "ทั้งหมด")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {DELIVERY_STATUS_FILTER_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={clearFilters}
            disabled={
              filters.transaction_number.length === 0 &&
              filters.stock_transaction_type === "all" &&
              filters.stock_entry_type.length === 0 &&
              filters.delivery_status === "all" &&
              filters.date_from === defaultDateRange.date_from &&
              filters.date_to === defaultDateRange.date_to
            }
            className="h-11 px-4 text-base"
          >
            ล้างค่าตัวกรอง
          </Button>
        </div>
      </section>

      <DataTable
        table={table}
        className="bg-card overflow-hidden rounded-2xl shadow-sm"
        tableClassName="min-w-200"
        nodataPlaceholder={
          isLoading
            ? "กำลังโหลดข้อมูลรายการสินค้าเข้าออก..."
            : error
              ? "โหลดข้อมูลรายการสินค้าเข้าออกไม่สำเร็จ"
              : "ไม่พบข้อมูลรายการสินค้าเข้าออก"
        }
        getRowClassName={() => "cursor-pointer"}
        onRowClick={(row) => setSelectedTransaction(row.original)}
      />

      <StockTransactionDetailsDialog
        transaction={selectedTransaction}
        onOpenChange={(open) => !open && setSelectedTransaction(undefined)}
      />
    </>
  );
};

export default StockTransactionTabContent;

interface StockEntryTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const StockEntryTypeFilter: FC<StockEntryTypeFilterProps> = ({ value, onChange }) => {
  const selectedOption =
    STOCK_ENTRY_TYPE_OPTIONS.find((option) => option.value === value) ??
    (value ? { value, label: value } : null);

  return (
    <Combobox
      items={STOCK_ENTRY_TYPE_OPTIONS}
      value={selectedOption}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      isItemEqualToValue={(option, selectedOption) => option.value === selectedOption.value}
      onValueChange={(option) => onChange(option?.value ?? "")}
    >
      <ComboboxInput placeholder="ทั้งหมด" className="h-9 w-56" showClear />
      <ComboboxContent>
        <ComboboxEmpty>ไม่พบประเภทรายการ</ComboboxEmpty>
        <ComboboxList>
          {(option) => (
            <ComboboxItem key={option.value} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

const stockTransactionTableFeatures = tableFeatures({});
const stockTransactionColumnHelper = createColumnHelper<
  typeof stockTransactionTableFeatures,
  DisplayStockTransaction
>();
const stockTransactionColumns = stockTransactionColumnHelper.columns([
  stockTransactionColumnHelper.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockTransactionColumnHelper.accessor("transactionNumber", {
    header: "เลขที่รายการ",
    cell: ({ getValue }) => <span className="text-foreground font-semibold">{getValue()}</span>,
  }),
  stockTransactionColumnHelper.accessor("transactionType", {
    header: "เข้าออก",
    cell: ({ row, getValue }) => {
      const isStockIn = getValue() === "Stock In";

      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
            isStockIn ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive",
          )}
        >
          {row.original.transactionTypeLabel}
        </span>
      );
    },
  }),
  stockTransactionColumnHelper.accessor("entryType", {
    header: "ประเภทรายการ",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockTransactionColumnHelper.accessor("deliveryStatus", {
    header: "สถานะการนำส่ง",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockTransactionColumnHelper.accessor("createdAt", {
    header: "วันที่ทำรายการ",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
]);
