"use client";

import NodataPlaceholder from "@/components/atom/nodata.placeholder";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  type Row,
  type RowData,
  type TableFeatures,
  type Table as TableType,
  flexRender,
} from "@tanstack/react-table";

/** Props for the DataTable component. */
interface DataTableProps<TFeatures extends TableFeatures, TData extends RowData> {
  table: TableType<TFeatures, TData>;
  nodataPlaceholder?: string;
  className?: string;
  tableClassName?: string;
  getRowClassName?: (row: Row<TFeatures, TData>) => string | undefined;
  onRowClick?: (row: Row<TFeatures, TData>) => void;
}

/** Renders a table from a TanStack table instance with empty-state handling. */
export function DataTable<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  nodataPlaceholder,
  className,
  tableClassName,
  getRowClassName,
  onRowClick,
}: DataTableProps<TFeatures, TData>) {
  const columns = table.getAllColumns();
  return (
    <div className={cn("rounded-md border", className)}>
      <ShadcnTable className={tableClassName}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                role={onRowClick ? "button" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                className={getRowClassName?.(row)}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(event) => {
                  if (!onRowClick) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onRowClick(row);
                  }
                }}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <NodataPlaceholder text={nodataPlaceholder} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ShadcnTable>
    </div>
  );
}
