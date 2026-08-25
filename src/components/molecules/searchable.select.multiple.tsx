"use client";

import { type FC, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

export interface SearchableSelectMultileOptions {
  /**
   * Value to identify each items
   */
  value: string;
  /**
   * Label to display in UI
   */
  label: string;
}
export interface SearchableSelectMultipleProps {
  values: string[];
  options: SearchableSelectMultileOptions[];
  placeholder?: string;
  overrideWidth?: number | string;
  noDataPlaceholder?: string;
  searchPlaceholder?: string;
  onChange?: (value: string[]) => unknown;
  sortLabel?: boolean;
  onRenderEachValue?: (value: string) => string;
}
const SearchableSelectMultiple: FC<SearchableSelectMultipleProps> = ({
  values,
  options,
  placeholder = "Select...",
  overrideWidth,
  searchPlaceholder = "Type here to search...",
  noDataPlaceholder = "No results.",
  onChange,
  sortLabel = true,
  onRenderEachValue,
}) => {
  const [open, setOpen] = useState(false);

  const renderedValue = useMemo(() => {
    if (values.length === 0) return placeholder;
    return values
      .map((value) => {
        const option = options.find((option) => option.value === value);
        if (onRenderEachValue) return onRenderEachValue(option?.label || value);
        return option?.label || value;
      })
      .join(", ");
  }, [values, placeholder, options, onRenderEachValue]);

  const _options = useMemo(() => {
    if (sortLabel)
      return [...options].sort((a, b) => {
        return a.label.localeCompare(b.label);
      });
    return options;
  }, [options, sortLabel]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-50 max-w-full items-center justify-between"
            style={{ width: overrideWidth }}
            title={typeof renderedValue == "string" ? renderedValue : undefined}
          />
        }
      >
        <span className="mr-2 min-w-0 flex-1 truncate text-left">{renderedValue}</span>
        <ChevronsUpDown className="shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        className="w-50 p-0"
        style={{ width: overrideWidth }}
        onWheelCapture={(e) => e.stopPropagation()}
        onTouchMoveCapture={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{noDataPlaceholder}</CommandEmpty>
            <CommandGroup>
              {_options.map((option) => {
                const isInList = values.find((value) => value == option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    className="w-full min-w-0 justify-between"
                    onSelect={() => {
                      if (onChange) {
                        if (isInList) {
                          onChange(values.filter((value) => value != option.value));
                        } else {
                          onChange([...values, option.value]);
                        }
                      }
                    }}
                  >
                    <span className="mr-2 min-w-0 flex-1 truncate text-left">{option.label}</span>

                    {isInList && <Check />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableSelectMultiple;
