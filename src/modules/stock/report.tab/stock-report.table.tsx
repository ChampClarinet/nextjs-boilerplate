"use client";

import type { FC } from "react";

import { DataTable } from "@/components/organisms/data-table";
import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";

import type { DisplayStockReport } from "../stock.types";

interface StockReportTableProps {
  data: DisplayStockReport[];
  isLoading: boolean;
  error?: string;
}

const StockReportTable: FC<StockReportTableProps> = ({ data, isLoading, error }) => {
  const table = useTable({
    features: stockReportTableFeatures,
    columns: stockReportColumns,
    data,
  });

  return (
    <DataTable
      table={table}
      className="bg-card overflow-hidden rounded-2xl shadow-sm"
      tableClassName="min-w-280"
      nodataPlaceholder={
        isLoading
          ? "กำลังโหลดข้อมูลรายงานสต็อก..."
          : error
            ? "โหลดข้อมูลรายงานสต็อกไม่สำเร็จ"
            : "ไม่พบข้อมูลรายงานสต็อก"
      }
    />
  );
};

export default StockReportTable;

const stockReportTableFeatures = tableFeatures({});
const stockReportColumnHelper = createColumnHelper<
  typeof stockReportTableFeatures,
  DisplayStockReport
>();
const stockReportColumns = stockReportColumnHelper.columns([
  stockReportColumnHelper.display({
    id: "sequence",
    header: "ลำดับ",
    cell: ({ row }) => <span className="text-muted-foreground">{row.index + 1}</span>,
  }),
  stockReportColumnHelper.accessor("reportType", {
    header: "ชื่อหน่วยงาน",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockReportColumnHelper.accessor("stockEntryType", {
    header: "ประเภทรายการ",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockReportColumnHelper.accessor("createdDate", {
    header: "วันที่ทำรายการ",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockReportColumnHelper.accessor("stockName", {
    header: "ชื่อสินค้า",
    cell: ({ getValue }) => <span className="text-foreground font-semibold">{getValue()}</span>,
  }),
  stockReportColumnHelper.accessor("totalRemainingStock", {
    header: "จำนวนสินค้า",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockReportColumnHelper.accessor("netPrice", {
    header: "ยอดเงิน",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockReportColumnHelper.accessor("deliveryStatus", {
    header: "สถานะการส่ง",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  stockReportColumnHelper.accessor("issuerName", {
    header: "ผู้รับคืน/เจ้าหน้าที่ธุรการ",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
]);
