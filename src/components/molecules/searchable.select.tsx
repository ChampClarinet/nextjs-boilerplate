"use client";

import { type FC, type ReactNode, useState } from "react";

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
import { ChevronsUpDown } from "lucide-react";

export interface SearchableSelectOptions {
  /**
   * Value to identify each items
   */
  value: string;
  /**
   * Label to display in UI
   */
  label: string;
}
export interface SearchableSelectProps {
  value: string | null;
  options: SearchableSelectOptions[];
  placeholder?: string;
  overrideWidth?: number | string;
  noDataPlaceholder?: string;
  searchPlaceholder?: string;
  onChange?: (value: string) => unknown;
  onSearchChange?: (value: string) => unknown;
  onRenderValue?: (value: string) => string | undefined;
  onRenderOption?: (option: SearchableSelectOptions) => ReactNode;
}
const SearchableSelect: FC<SearchableSelectProps> = ({
  value,
  options,
  placeholder = "Select...",
  overrideWidth,
  searchPlaceholder = "Type here to search...",
  noDataPlaceholder = "No results.",
  onChange,
  onSearchChange,
  onRenderValue,
  onRenderOption,
}) => {
  const [open, setOpen] = useState(false);

  const _renderValue = (value: string) => {
    if (onRenderValue) return onRenderValue(value);
    return options.find((option) => option.value === value)?.label;
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-50 justify-between"
            style={{ width: overrideWidth }}
          />
        }
      >
        <span className="mr-2 min-w-0 flex-1 truncate text-left">
          {value ? _renderValue(value) : placeholder}
        </span>
        <ChevronsUpDown className="opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0" style={{ width: overrideWidth }}>
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            onValueChange={onSearchChange}
          />
          <CommandList>
            <CommandEmpty>{noDataPlaceholder}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  className="w-full min-w-0 justify-start"
                  onSelect={() => {
                    onChange?.(option.value);
                    setOpen(false);
                  }}
                >
                  {onRenderOption ? (
                    onRenderOption(option)
                  ) : (
                    <span className="min-w-0 truncate">{option.label}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableSelect;
