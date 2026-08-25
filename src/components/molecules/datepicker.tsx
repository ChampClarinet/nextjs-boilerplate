import { type FC, useEffect, useMemo, useState } from "react";
import { th } from "react-day-picker/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import DateHelper from "@cantabile/date-helper";
import { CalendarIcon } from "lucide-react";

/** Props for the DatePicker component. */
export interface DatePickerProps {
  onChange?: (date?: DateHelper) => unknown;
  date?: DateHelper;
  shrinkWhenSmallScreen?: boolean;
  useBD?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
}
/** Renders a single-date picker with a popover calendar. */
const DatePicker: FC<DatePickerProps> = (props) => {
  const {
    date,
    onChange,
    shrinkWhenSmallScreen = true,
    useBD = true,
    placeholder = "Select Date...",
    fullWidth = false,
  } = props;

  const today = useMemo(() => newDateHelper(undefined, useBD), [useBD]);

  const [_date, setDate] = useState<DateHelper | undefined>(today);

  const dSignature = _date?.toISODate();
  const propMs = date?.toMs();

  const onDateChange = (d?: Date) => {
    const newDate = d ? newDateHelper(+d, useBD) : undefined;
    setDate(newDate);
    onChange?.(newDate);
  };

  useEffect(() => {
    if (propMs === undefined) {
      setDate(undefined);
      return;
    }
    const next = newDateHelper(propMs, useBD);
    if (next.toISODate() === dSignature) return;
    setDate(next);
  }, [useBD, propMs, dSignature]);
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "dark:text-darktext h-9 justify-start gap-2 rounded-lg px-3 text-left font-normal lg:px-4",
              fullWidth ? "w-full max-w-full" : "w-max",
              !_date && "text-muted-foreground",
            )}
          />
        }
      >
        <div
          className={cn(
            "justify-start gap-2",
            shrinkWhenSmallScreen ? "hidden @min-[340px]:flex" : "flex",
          )}
        >
          <span className="mt-0.75">{_date?.getDisplayDate() ?? placeholder}</span>
        </div>
        <CalendarIcon />
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          required={false}
          defaultMonth={_date?.getDate()}
          selected={_date?.getDate()}
          onSelect={onDateChange}
          numberOfMonths={1}
          className="min-w-62.5 rounded-lg border shadow-sm"
          locale={th}
          useBD={useBD}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;

const newDateHelper = (dateStringOrNumberInMs: string | number | undefined, useBD: boolean) => {
  return new DateHelper(dateStringOrNumberInMs, {
    useBD,
    lang: "th",
    isUTC: true,
  });
};
