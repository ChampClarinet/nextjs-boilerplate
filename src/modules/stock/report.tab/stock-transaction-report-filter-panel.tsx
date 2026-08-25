"use client";

import type { FC } from "react";

import DateRangePicker from "@/components/molecules/date-range-picker";
import { Button } from "@/components/ui/button";

import { getCurrentMonthDateRange } from "../utils";
import EnumSwitch from "./enum-switch";
import { StockTransactionReportPresentation } from "./stock-transaction-report.types";

interface StockTransactionReportFilterPanelProps {
  dateFrom: string;
  dateTo: string;
  reportType: StockTransactionReportPresentation;
  onDateChange: (dateFrom: string, dateTo: string) => void;
  onReportTypeChange: (reportType: StockTransactionReportPresentation) => void;
  onClearFilters: () => void;
}

const StockTransactionReportFilterPanel: FC<StockTransactionReportFilterPanelProps> = ({
  dateFrom,
  dateTo,
  reportType,
  onDateChange,
  onReportTypeChange,
  onClearFilters,
}) => {
  const defaultDateRange = getCurrentMonthDateRange();
  const isClearDisabled =
    dateFrom === defaultDateRange.date_from &&
    dateTo === defaultDateRange.date_to &&
    reportType === StockTransactionReportPresentation.INOUT;

  return (
    <section className="bg-card rounded-2xl border p-5 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-muted-foreground text-sm font-semibold">ช่วงวันที่</span>
          <DateRangePicker
            range={[dateFrom, dateTo]}
            onDateChange={([nextDateFrom, nextDateTo]) => {
              onDateChange(nextDateFrom ?? "", nextDateTo ?? nextDateFrom ?? "");
            }}
            shrinkWhenSmallScreen={false}
            triggerClassName="h-9"
            useBD
          />
        </label>

        <EnumSwitch
          label="รูปแบบรายงาน"
          checked={reportType === StockTransactionReportPresentation.DATE_AND_TRANSACTIONS}
          uncheckedLabel={StockTransactionReportPresentation.INOUT}
          checkedLabel={StockTransactionReportPresentation.DATE_AND_TRANSACTIONS}
          onCheckedChange={(checked) =>
            onReportTypeChange(
              checked
                ? StockTransactionReportPresentation.DATE_AND_TRANSACTIONS
                : StockTransactionReportPresentation.INOUT,
            )
          }
        />

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onClearFilters}
          disabled={isClearDisabled}
          className="h-11 px-4 text-base"
        >
          ล้างค่าตัวกรอง
        </Button>
      </div>
    </section>
  );
};

export default StockTransactionReportFilterPanel;
