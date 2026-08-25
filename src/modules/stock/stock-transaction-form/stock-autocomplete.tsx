"use client";

import type { FC, ReactNode } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useDebounce } from "@cantabile/hooks";

import type { AutocompleteOption } from "./types";

export interface StockAutocompleteProps {
  value: string;
  options: AutocompleteOption[];
  placeholder: string;
  noDataPlaceholder: string;
  selectedLabel?: string;
  isLoading?: boolean;
  className?: string;
  onChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onRenderOption?: (option: AutocompleteOption) => ReactNode;
}
const StockAutocomplete: FC<StockAutocompleteProps> = ({
  value,
  options,
  placeholder,
  noDataPlaceholder,
  selectedLabel,
  isLoading = false,
  className,
  onChange,
  onSearchChange,
  onRenderOption,
}) => {
  const debouncedSearchChange = useDebounce((searchValue: string) => {
    onSearchChange(searchValue);
  }, 300);
  const selectedOption =
    options.find((option) => option.value === value) ??
    (value ? { value, label: selectedLabel ?? value } : null);

  return (
    <Combobox
      items={options}
      value={selectedOption}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      isItemEqualToValue={(option, selectedOption) => option.value === selectedOption.value}
      filter={null}
      onInputValueChange={(inputValue, eventDetails) => {
        if (eventDetails.reason === "input-change" || eventDetails.reason === "input-clear") {
          debouncedSearchChange(inputValue);
        }
      }}
      onValueChange={(option) => onChange(option?.value ?? "")}
    >
      <ComboboxInput placeholder={placeholder} className={className} showClear />
      <ComboboxContent>
        <ComboboxEmpty>{isLoading ? "กำลังโหลด..." : noDataPlaceholder}</ComboboxEmpty>
        <ComboboxList>
          {(option) => (
            <ComboboxItem key={option.value} value={option}>
              {onRenderOption ? onRenderOption(option) : option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default StockAutocomplete;
