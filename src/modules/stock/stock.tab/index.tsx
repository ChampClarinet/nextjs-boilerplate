"use client";

import { type FC, useEffect, useMemo, useState } from "react";

import type { GetAllStockParams } from "@/apis/stock";
import DateRangePicker from "@/components/molecules/date-range-picker";
import SearchBox from "@/components/molecules/search";
import { DataTable } from "@/components/organisms/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";

import { useStockCategories } from "../hooks/use-stock-categories";
import { useStockQuery } from "../hooks/use-stock-query";
import type { DisplayStockItem, StockFilters } from "../stock.types";
import { getLocalISODate, mapStockItem } from "../utils";
import StockDetailsDialog from "./details.dialog";
import EditStockDialog from "./edit.dialog";

interface StockTabContentProps {
  refreshKey?: number;
  onStockChanged?: () => void;
}

const StockTabContent: FC<StockTabContentProps> = ({ refreshKey = 0, onStockChanged }) => {
  const defaultDateRange = useMemo(() => {
    const today = getLocalISODate();
    return { date_from: today, date_to: today };
  }, []);
  const [filters, setFilters] = useState<StockFilters>({
    stock_filter: "",
    date_from: defaultDateRange.date_from,
    date_to: defaultDateRange.date_to,
    category: "all",
    is_below_minimum: false,
  });
  const [debouncedStockFilter, setDebouncedStockFilter] = useState(filters.stock_filter);
  const [selectedStock, setSelectedStock] = useState<DisplayStockItem | undefined>();
  const [editingStock, setEditingStock] = useState<DisplayStockItem | undefined>();
  const stockRequestParams = useMemo<GetAllStockParams>(
    () => ({
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined,
      category: filters.category === "all" ? undefined : filters.category,
      is_below_minimum: filters.is_below_minimum || undefined,
      stock_filter: debouncedStockFilter.trim() || undefined,
    }),
    [
      debouncedStockFilter,
      filters.category,
      filters.date_from,
      filters.date_to,
      filters.is_below_minimum,
    ],
  );
  const { data, isLoading, error, refetch } = useStockQuery(stockRequestParams, { refreshKey });
  const stockItems = useMemo(() => data.map(mapStockItem), [data]);
  const { categories } = useStockCategories();
  const visibleCategoryOptions = useMemo(() => {
    if (categories.length > 0) return categories;
    return Array.from(new Set(stockItems.map((item) => item.category))).filter(Boolean);
  }, [categories, stockItems]);
  const incomingItems = stockItems.reduce((sum, item) => sum + item.incoming, 0);
  const outgoingItems = stockItems.reduce((sum, item) => sum + item.outgoing, 0);
  const stockTable = useTable({
    features: stockTableFeatures,
    columns: stockColumns,
    data: stockItems,
  });

  useEffect(() => {
    const debounceId = window.setTimeout(() => {
      setDebouncedStockFilter(filters.stock_filter);
    }, 400);

    return () => window.clearTimeout(debounceId);
  }, [filters.stock_filter]);

  const updateFilter = <TKey extends keyof StockFilters>(key: TKey, value: StockFilters[TKey]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      stock_filter: "",
      date_from: defaultDateRange.date_from,
      date_to: defaultDateRange.date_to,
      category: "all",
      is_below_minimum: false,
    });
    setDebouncedStockFilter("");
  };

  const handleEditStock = (stock: DisplayStockItem) => {
    setSelectedStock(undefined);
    setEditingStock(stock);
  };

  const handleStockUpdated = () => {
    refetch();
    onStockChanged?.();
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
            <span className="text-muted-foreground text-sm font-semibold">ค้นหา</span>
            <SearchBox
              search={filters.stock_filter}
              onChange={(value) => updateFilter("stock_filter", value)}
              placeholder="ชื่อ / หมวดหมู่..."
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm font-semibold">หมวดหมู่</span>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                updateFilter("category", (value ?? "all") as StockFilters["category"])
              }
            >
              <SelectTrigger className="h-9 w-56">
                <SelectValue placeholder="ทั้งหมด">
                  {(value) => (value && value !== "all" ? String(value) : "ทั้งหมด")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {visibleCategoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="text-foreground flex h-11 items-center gap-3 text-base font-medium">
            <Checkbox
              name="is_below_minimum"
              checked={filters.is_below_minimum}
              onCheckedChange={(checked) => updateFilter("is_below_minimum", checked === true)}
            />
            เฉพาะคงเหลือต่ำกว่าขั้นต่ำ
          </label>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={clearFilters}
            disabled={
              filters.stock_filter.length === 0 &&
              filters.date_from === defaultDateRange.date_from &&
              filters.date_to === defaultDateRange.date_to &&
              filters.category === "all" &&
              !filters.is_below_minimum
            }
            className="h-11 px-4 text-base"
          >
            ล้างค่าตัวกรอง
          </Button>

          <div className="ml-auto flex items-center gap-3">
            <span className="bg-success-soft text-success rounded-full px-4 py-1.5 font-semibold">
              รับเข้า +{incomingItems}
            </span>
            <span className="bg-warning-soft text-warning rounded-full px-4 py-1.5 font-semibold">
              จ่ายออก -{outgoingItems}
            </span>
          </div>
        </div>
      </section>

      <DataTable
        table={stockTable}
        className="bg-card overflow-hidden rounded-2xl shadow-sm"
        tableClassName="min-w-220"
        nodataPlaceholder={
          isLoading
            ? "กำลังโหลดข้อมูลสินค้า..."
            : error
              ? "โหลดข้อมูลสินค้าไม่สำเร็จ"
              : "ไม่พบข้อมูลสินค้า"
        }
        getRowClassName={() => "cursor-pointer"}
        onRowClick={(row) => setSelectedStock(row.original)}
      />

      <StockDetailsDialog
        stock={selectedStock}
        onOpenChange={(open) => !open && setSelectedStock(undefined)}
        onEdit={handleEditStock}
      />
      <EditStockDialog
        stock={editingStock}
        categoryOptions={categories}
        onOpenChange={(open) => !open && setEditingStock(undefined)}
        onSuccess={handleStockUpdated}
      />
    </>
  );
};

export default StockTabContent;

const stockTableFeatures = tableFeatures({});
const stockColumnHelper = createColumnHelper<typeof stockTableFeatures, DisplayStockItem>();
const stockColumns = stockColumnHelper.columns([
  stockColumnHelper.display({
    id: "sequence",
    header: "ลำดับ",
    cell: ({ row }) => <span className="text-muted-foreground">{row.index + 1}</span>,
  }),
  stockColumnHelper.accessor("name", {
    header: "ชื่อสินค้า",
    cell: ({ getValue }) => <span className="text-foreground font-semibold">{getValue()}</span>,
  }),
  stockColumnHelper.accessor("status", {
    header: "สถานะ",
    cell: ({ row, getValue }) => {
      const isBelowMinimum = getValue() === "below_minimum";

      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
            isBelowMinimum
              ? "bg-destructive-soft text-destructive"
              : "bg-success-soft text-success",
          )}
        >
          {row.original.statusLabel}
        </span>
      );
    },
  }),
  stockColumnHelper.accessor("variant", {
    header: "ขนาด/ประเภท",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockColumnHelper.accessor("category", {
    header: "หมวดหมู่สินค้า",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockColumnHelper.accessor("availableTotal", {
    header: "จำนวนพร้อมใช้/ทั้งหมด",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockColumnHelper.accessor("createdAt", {
    header: "วันที่สินค้าถูกสร้าง",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
]);
