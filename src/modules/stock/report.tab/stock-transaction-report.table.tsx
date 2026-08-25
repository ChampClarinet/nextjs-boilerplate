"use client";

import type { FC } from "react";
import { useMemo } from "react";

import type { StockTransactionType } from "@/apis/stock";
import { DataTable } from "@/components/organisms/data-table";
import { cn } from "@/lib/utils";
import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";

import {
  formatDateHeader,
  formatTransactionQuantity,
  toReportNumber,
} from "./stock-transaction-report-data";
import {
  StockTransactionReportPresentation,
  type StockTransactionReportRow,
} from "./stock-transaction-report.types";

interface StockTransactionReportTableProps {
  data: StockTransactionReportRow[];
  dateKeys: string[];
  reportType: StockTransactionReportPresentation;
  isLoading: boolean;
  error?: string;
}

const StockTransactionReportTable: FC<StockTransactionReportTableProps> = ({
  data,
  dateKeys,
  reportType,
  isLoading,
  error,
}) => {
  const columns = useMemo(
    () =>
      stockTransactionReportColumnHelper.columns([
        ...fixedColumns,
        ...buildDynamicColumns(dateKeys, reportType),
      ]),
    [dateKeys, reportType],
  );
  const table = useTable({
    features: stockTransactionReportTableFeatures,
    columns,
    data,
  });

  return (
    <DataTable
      table={table}
      className="bg-card overflow-hidden rounded-2xl shadow-sm"
      tableClassName="min-w-320"
      nodataPlaceholder={
        isLoading
          ? "กำลังโหลดข้อมูลรายงานการเคลื่อนไหว..."
          : error
            ? "โหลดข้อมูลรายงานการเคลื่อนไหวไม่สำเร็จ"
            : "ไม่พบข้อมูลรายงานการเคลื่อนไหว"
      }
    />
  );
};

export default StockTransactionReportTable;

const stockTransactionReportTableFeatures = tableFeatures({});
const stockTransactionReportColumnHelper = createColumnHelper<
  typeof stockTransactionReportTableFeatures,
  StockTransactionReportRow
>();

const fixedColumns = stockTransactionReportColumnHelper.columns([
  stockTransactionReportColumnHelper.display({
    id: "sequence",
    header: "ลำดับ",
    cell: ({ row }) => <span className="text-muted-foreground">{row.index + 1}</span>,
  }),
  stockTransactionReportColumnHelper.accessor("stockName", {
    header: "ชื่อสินค้า",
    cell: ({ getValue }) => <span className="text-foreground font-semibold">{getValue()}</span>,
  }),
  stockTransactionReportColumnHelper.accessor("startingQty", {
    header: "ยอดตั้งต้น",
    cell: ({ getValue }) => renderFixedQuantity(getValue()),
  }),
  stockTransactionReportColumnHelper.accessor("totalStockIn", {
    header: "ยอดรวมเข้า",
    cell: ({ getValue }) => renderFixedQuantity(getValue()),
  }),
  stockTransactionReportColumnHelper.accessor("totalStockOut", {
    header: "ยอดรวมออก",
    cell: ({ getValue }) => renderFixedQuantity(getValue()),
  }),
  stockTransactionReportColumnHelper.accessor("endingQty", {
    header: "ยอดคงเหลือ",
    cell: ({ getValue }) => renderFixedQuantity(getValue()),
  }),
]);

const buildDynamicColumns = (
  dateKeys: string[],
  reportType: StockTransactionReportPresentation,
) => {
  if (reportType === StockTransactionReportPresentation.DATE_AND_TRANSACTIONS) {
    return dateKeys.map((dateKey) =>
      stockTransactionReportColumnHelper.display({
        id: `date-${dateKey}`,
        header: formatDateHeader(dateKey),
        cell: ({ row }) => {
          const transactionType = row.original.rowType;
          const value =
            transactionType === "Stock In"
              ? row.original.stockInByDate[dateKey]
              : transactionType === "Stock Out"
                ? row.original.stockOutByDate[dateKey]
                : 0;

          return renderTransactionQuantity(value, transactionType);
        },
      }),
    );
  }

  return [
    ...dateKeys.map((dateKey) =>
      stockTransactionReportColumnHelper.display({
        id: `stock-in-${dateKey}`,
        header: formatDateHeader(dateKey),
        cell: ({ row }) =>
          renderTransactionQuantity(row.original.stockInByDate[dateKey], "Stock In"),
      }),
    ),
    ...dateKeys.map((dateKey) =>
      stockTransactionReportColumnHelper.display({
        id: `stock-out-${dateKey}`,
        header: formatDateHeader(dateKey),
        cell: ({ row }) =>
          renderTransactionQuantity(row.original.stockOutByDate[dateKey], "Stock Out"),
      }),
    ),
  ];
};

const renderFixedQuantity = (value: unknown) => (
  <span className="text-muted-foreground">{toReportNumber(value)}</span>
);

const renderTransactionQuantity = (value: unknown, transactionType?: StockTransactionType) => {
  const quantity = formatTransactionQuantity(value, transactionType);

  return <span className={cn(quantity.className)}>{quantity.text}</span>;
};
