import { type FC } from "react";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

/** Props for the SearchBox component. */
export interface SearchBoxProps {
  search: string;
  onChange?: (search: string) => unknown;
  placeholder?: string;
}
/** Renders a search input with an icon and controlled value. */
const SearchBox: FC<SearchBoxProps> = (props) => {
  const { search, onChange, placeholder = "Search..." } = props;
  return (
    <div className="border-input flex items-center rounded-md border border-solid pl-3 shadow-sm transition-colors">
      <SearchIcon className="text-primary dark:text-primary-foreground size-4" />
      <Input
        value={search}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="border-transparent bg-transparent! shadow-none focus-visible:border-transparent focus-visible:ring-transparent"
      />
    </div>
  );
};

export default SearchBox;
