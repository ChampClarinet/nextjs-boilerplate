"use client";

import type { FC, HTMLAttributes } from "react";
import { useEffect, useMemo, useState } from "react";
import type { DateRange as DR } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import DateHelper from "@cantabile/date-helper";
import { CalendarRangeIcon } from "lucide-react";

/**
 * YYYY-MM-DD
 */
export type DateRange = [string | undefined, string | undefined];

/** Props for the DateRangePicker component. */
export interface DateRangePickerProps extends HTMLAttributes<HTMLDivElement> {
  onDateChange: (range: DateRange) => void;
  range: DateRange;
  shrinkWhenSmallScreen?: boolean;
  useBD?: boolean;
  triggerClassName?: string;
}
/** Renders a date range picker with optional responsive label behavior. */
const DateRangePicker: FC<DateRangePickerProps> = (props) => {
  const {
    onDateChange,
    className,
    range,
    shrinkWhenSmallScreen = true,
    useBD = true,
    triggerClassName,
  } = props;
  const [rangeFrom, rangeTo] = range;
  const isMobile = useIsMobile();

  const today = useMemo(() => newDateHelper(undefined, useBD), [useBD]);

  const [_dateRange, setDateRange] = useState({
    from: today,
    to: today,
  });

  const handleDateChange = (date?: DR) => {
    const from = date?.from ? newDateHelper(+date.from, useBD) : undefined;
    const to = date?.to ? newDateHelper(+date.to, useBD) : undefined;

    setDateRange((prev) => {
      if (from) {
        prev = {
          ...prev,
          from,
        };
      }
      if (to) {
        prev = {
          ...prev,
          to,
        };
      }
      return prev;
    });
    onDateChange([from?.toISODate(), to?.toISODate()]);
  };

  useEffect(() => {
    setDateRange({
      from: newDateHelper(rangeFrom, useBD),
      to: newDateHelper(rangeTo, useBD),
    });
  }, [rangeFrom, rangeTo, useBD]);
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className={cn(
                "dark:text-darktext h-9 w-max justify-start gap-2 rounded-lg px-3 text-left font-normal lg:px-4",
                "min-w-0 [&_svg]:shrink-0",
                !_dateRange && "text-muted-foreground",
                triggerClassName,
              )}
            />
          }
        >
          <div
            className={cn(
              "min-w-0 justify-start gap-2",
              shrinkWhenSmallScreen ? "hidden @min-[340px]:flex" : "flex",
            )}
          >
            {_dateRange?.from ? (
              _dateRange.to ? (
                <span className={labelCls}>
                  {[_dateRange.from.getDisplayDate(), _dateRange.to.getDisplayDate()].join(" - ")}
                </span>
              ) : (
                <span className={labelCls}>{_dateRange.from.getDisplayDate()}</span>
              )
            ) : (
              <></>
            )}
          </div>
          <CalendarRangeIcon />
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "h-auto max-h-[calc(100vh-6rem)] overflow-x-hidden overflow-y-auto p-0 sm:max-h-none",
            isMobile ? "w-[calc(100vw-1rem)] max-w-88" : "w-auto max-w-none",
          )}
          align={isMobile ? "center" : "start"}
        >
          <Calendar
            mode="range"
            required={false}
            defaultMonth={_dateRange.from.getDate()}
            selected={{
              from: _dateRange.from.getDate(),
              to: _dateRange.to.getDate(),
            }}
            onSelect={handleDateChange}
            numberOfMonths={isMobile ? 1 : 2}
            className={cn(
              "rounded-lg border shadow-sm md:min-w-125",
              isMobile &&
                "w-full! [&_.rdp-day]:h-auto [&_.rdp-day]:w-full [&_.rdp-day_button]:w-full [&_.rdp-day_button]:min-w-0 [&_.rdp-month]:w-full [&_.rdp-month_grid]:w-full [&_.rdp-months]:w-full [&_.rdp-week]:grid [&_.rdp-week]:w-full [&_.rdp-week]:grid-cols-7 [&_.rdp-weekday]:w-auto [&_.rdp-weekdays]:grid [&_.rdp-weekdays]:w-full [&_.rdp-weekdays]:grid-cols-7",
            )}
            useBD={useBD}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;

const labelCls = cn("mt-0.75 truncate font-ibm");

const newDateHelper = (dateStringOrNumberInMs: string | number | undefined, useBD: boolean) =>
  new DateHelper(dateStringOrNumberInMs, { useBD, isUTC: true, lang: "th" });
