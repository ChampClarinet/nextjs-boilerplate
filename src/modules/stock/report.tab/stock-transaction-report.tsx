"use client";

import { type FC, useMemo, useState } from "react";

import type { GetStockTransactionReportParams } from "@/apis/stock-report";

import { getCurrentMonthDateRange } from "../utils";
import { buildDateKeys, buildStockTransactionReportRows } from "./stock-transaction-report-data";
import StockTransactionReportFilterPanel from "./stock-transaction-report-filter-panel";
import StockTransactionReportTable from "./stock-transaction-report.table";
import { StockTransactionReportPresentation } from "./stock-transaction-report.types";
import { useStockTransactionReport } from "./use-stock-transaction-report";

interface StockTransactionReportTabContentProps {
  enabled?: boolean;
  refreshKey?: number;
}

const StockTransactionReportTabContent: FC<StockTransactionReportTabContentProps> = ({
  enabled = true,
  refreshKey = 0,
}) => {
  const defaultDateRange = useMemo(() => getCurrentMonthDateRange(), []);
  const [dateFrom, setDateFrom] = useState(defaultDateRange.date_from);
  const [dateTo, setDateTo] = useState(defaultDateRange.date_to);
  const [reportType, setReportType] = useState(StockTransactionReportPresentation.INOUT);
  const requestParams = useMemo<GetStockTransactionReportParams>(
    () => ({
      date_from: dateFrom,
      date_to: dateTo,
    }),
    [dateFrom, dateTo],
  );
  const dateKeys = useMemo(() => buildDateKeys(dateFrom, dateTo), [dateFrom, dateTo]);
  const { data, isLoading, error } = useStockTransactionReport(requestParams, {
    enabled,
    refreshKey,
  });
  const rows = useMemo(
    () =>
      buildStockTransactionReportRows(
        data,
        dateKeys,
        reportType === StockTransactionReportPresentation.DATE_AND_TRANSACTIONS,
      ),
    [data, dateKeys, reportType],
  );

  const handleDateChange = (nextDateFrom: string, nextDateTo: string) => {
    setDateFrom(nextDateFrom);
    setDateTo(nextDateTo);
  };

  const clearFilters = () => {
    setDateFrom(defaultDateRange.date_from);
    setDateTo(defaultDateRange.date_to);
    setReportType(StockTransactionReportPresentation.INOUT);
  };

  return (
    <>
      <StockTransactionReportFilterPanel
        dateFrom={dateFrom}
        dateTo={dateTo}
        reportType={reportType}
        onDateChange={handleDateChange}
        onReportTypeChange={setReportType}
        onClearFilters={clearFilters}
      />
      <StockTransactionReportTable
        data={rows}
        dateKeys={dateKeys}
        reportType={reportType}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
};

export default StockTransactionReportTabContent;
