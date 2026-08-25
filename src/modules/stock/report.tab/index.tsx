"use client";

import { type FC, useMemo, useState } from "react";

import { ReportGroupBy, StockReportType } from "@/apis/stock-report";
import type { GetStockReportParams } from "@/apis/stock-report";

import { useStockReport } from "../hooks/use-stock-report";
import type { DisplayStockReport, StockReportFilters } from "../stock.types";
import { getCurrentMonthDateRange } from "../utils";
import { mapStockReportItem } from "./map-stock-report";
import StockReportFilterPanel from "./stock-report-filter-panel";
import StockReportTable from "./stock-report.table";

interface StockReportTabContentProps {
  enabled?: boolean;
  refreshKey?: number;
}

const StockReportTabContent: FC<StockReportTabContentProps> = ({
  enabled = true,
  refreshKey = 0,
}) => {
  const defaultDateRange = useMemo(() => getCurrentMonthDateRange(), []);
  const [filters, setFilters] = useState<StockReportFilters>({
    date_from: defaultDateRange.date_from,
    date_to: defaultDateRange.date_to,
    report_type: StockReportType.BY_DEPARTMENTS,
    delivery_status: [],
    stock_entry_type: [],
    group_by: ReportGroupBy.SUMMATION,
  });
  const requestParams = useMemo<GetStockReportParams>(
    () => ({
      date_from: filters.date_from,
      date_to: filters.date_to,
      report_type: filters.report_type,
      delivery_status: filters.delivery_status,
      stock_entry_type: filters.stock_entry_type,
      group_by: filters.group_by,
    }),
    [filters],
  );
  const { data, isLoading, error } = useStockReport(requestParams, { enabled, refreshKey });
  const reportItems = useMemo<DisplayStockReport[]>(() => data.map(mapStockReportItem), [data]);

  const updateFilter = <TKey extends keyof StockReportFilters>(
    key: TKey,
    value: StockReportFilters[TKey],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      date_from: defaultDateRange.date_from,
      date_to: defaultDateRange.date_to,
      report_type: StockReportType.BY_DEPARTMENTS,
      delivery_status: [],
      stock_entry_type: [],
      group_by: ReportGroupBy.SUMMATION,
    });
  };

  return (
    <>
      <StockReportFilterPanel
        filters={filters}
        defaultDateRange={defaultDateRange}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
      />
      <StockReportTable data={reportItems} isLoading={isLoading} error={error} />
    </>
  );
};

export default StockReportTabContent;
