import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addCommaInNumber } from "@/utils/string";
import { type ReactTable, type RowData, type TableFeatures } from "@tanstack/react-table";

/** Props for the DataTablePagination component. */
export interface DataTablePaginationProps<TData extends RowData> {
  table: ReactTable<TableFeatures, TData>;
}
/** Renders pagination controls and summary text for a data table. */
const DataTablePagination = <TData extends RowData>({ table }: DataTablePaginationProps<TData>) => {
  const allDataCount = table.getPrePaginatedRowModel().rows.length;
  const currentPage = allDataCount == 0 ? 0 : table.state.pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const { pageSize, pageIndex } = table.state.pagination;
  const from = pageIndex * pageSize + 1;
  const to = Math.min(from + pageSize - 1, allDataCount);

  const textCls = cn("text-muted-foreground text-sm");
  return (
    <div className="data-paginator flex flex-wrap items-center justify-between gap-2 py-4">
      <span className={textCls}>
        {allDataCount == 0
          ? "No items to show"
          : `Showing ${addCommaInNumber(from)}-${addCommaInNumber(to)} of ${addCommaInNumber(allDataCount)} Item${allDataCount != 1 ? "s" : ""}`}
      </span>
      <span className={textCls}>
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DataTablePagination;
