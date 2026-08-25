"use client";

import type { FC } from "react";

import type { DeliveryStatus } from "@/apis/stock";
import { ReportGroupBy, StockReportType } from "@/apis/stock-report";
import DateRangePicker from "@/components/molecules/date-range-picker";
import { Button } from "@/components/ui/button";

import type { StockReportFilters } from "../stock.types";
import { DELIVERY_STATUS_FILTER_OPTIONS, STOCK_ENTRY_TYPE_OPTIONS } from "../utils";
import EnumSwitch from "./enum-switch";
import SearchableMultiSelect from "./searchable-multi-select";

interface StockReportFilterPanelProps {
  filters: StockReportFilters;
  defaultDateRange: Pick<StockReportFilters, "date_from" | "date_to">;
  onFilterChange: <TKey extends keyof StockReportFilters>(
    key: TKey,
    value: StockReportFilters[TKey],
  ) => void;
  onClearFilters: () => void;
}

const StockReportFilterPanel: FC<StockReportFilterPanelProps> = ({
  filters,
  defaultDateRange,
  onFilterChange,
  onClearFilters,
}) => {
  const isClearDisabled =
    filters.date_from === defaultDateRange.date_from &&
    filters.date_to === defaultDateRange.date_to &&
    filters.report_type === StockReportType.BY_DEPARTMENTS &&
    filters.delivery_status.length === 0 &&
    filters.stock_entry_type.length === 0 &&
    filters.group_by === ReportGroupBy.SUMMATION;

  return (
    <section className="bg-card rounded-2xl border p-5 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-muted-foreground text-sm font-semibold">ช่วงวันที่</span>
          <DateRangePicker
            range={[filters.date_from, filters.date_to]}
            onDateChange={([dateFrom, dateTo]) => {
              onFilterChange("date_from", dateFrom ?? "");
              onFilterChange("date_to", dateTo ?? dateFrom ?? "");
            }}
            shrinkWhenSmallScreen={false}
            triggerClassName="h-9"
            useBD
          />
        </label>

        <EnumSwitch
          label="รูปแบบรายงาน"
          checked={filters.report_type === StockReportType.BY_EMPLOYEE}
          uncheckedLabel={StockReportType.BY_DEPARTMENTS}
          checkedLabel={StockReportType.BY_EMPLOYEE}
          onCheckedChange={(checked) =>
            onFilterChange(
              "report_type",
              checked ? StockReportType.BY_EMPLOYEE : StockReportType.BY_DEPARTMENTS,
            )
          }
        />

        <SearchableMultiSelect
          label="สถานะการส่ง"
          placeholder="ทั้งหมด"
          emptyText="ไม่พบสถานะการส่ง"
          options={DELIVERY_STATUS_FILTER_OPTIONS}
          value={filters.delivery_status}
          onChange={(value) => onFilterChange("delivery_status", value as DeliveryStatus[])}
        />

        <SearchableMultiSelect
          label="ประเภทรายการ"
          placeholder="ทั้งหมด"
          emptyText="ไม่พบประเภทรายการ"
          options={STOCK_ENTRY_TYPE_OPTIONS.map((option) => option.value)}
          value={filters.stock_entry_type}
          onChange={(value) => onFilterChange("stock_entry_type", value)}
        />

        <EnumSwitch
          label="การจัดกลุ่ม"
          checked={filters.group_by === ReportGroupBy.BY_TRANSACTIONS}
          uncheckedLabel={ReportGroupBy.SUMMATION}
          checkedLabel={ReportGroupBy.BY_TRANSACTIONS}
          onCheckedChange={(checked) =>
            onFilterChange(
              "group_by",
              checked ? ReportGroupBy.BY_TRANSACTIONS : ReportGroupBy.SUMMATION,
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

export default StockReportFilterPanel;
