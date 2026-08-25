"use client";

import type { FC } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";

interface SearchableMultiSelectProps {
  label: string;
  placeholder: string;
  emptyText: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

const SearchableMultiSelect: FC<SearchableMultiSelectProps> = ({
  label,
  placeholder,
  emptyText,
  options,
  value,
  onChange,
}) => {
  const selectedLabel = value.length > 0 ? `${value.length} รายการ` : placeholder;

  const toggleValue = (option: string) => {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  };

  return (
    <label className="flex flex-col gap-2">
      <span className="text-muted-foreground text-sm font-semibold">{label}</span>
      <Popover>
        <PopoverTrigger
          render={
            <Button type="button" variant="outline" className="h-9 w-56 justify-between px-3" />
          }
        >
          <span className={cn("truncate", value.length === 0 && "text-muted-foreground")}>
            {selectedLabel}
          </span>
          <ChevronsUpDown aria-hidden="true" className="text-muted-foreground size-4" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0">
          <Command>
            <CommandInput placeholder={`ค้นหา${label}...`} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.includes(option);

                  return (
                    <CommandItem
                      key={option}
                      value={option}
                      data-checked={isSelected}
                      onSelect={() => toggleValue(option)}
                    >
                      <Checkbox checked={isSelected} className="pointer-events-none" />
                      <span>{option}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </label>
  );
};

export default SearchableMultiSelect;
