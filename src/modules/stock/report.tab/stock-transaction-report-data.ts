import type { StockTransactionType } from "@/apis/stock";
import type { StockTransactionReportItem } from "@/apis/stock-report";

import type { StockTransactionReportRow } from "./stock-transaction-report.types";

export const buildDateKeys = (dateFrom: string, dateTo: string) => {
  const from = parseISODate(dateFrom);
  const to = parseISODate(dateTo);
  if (!from || !to) return [];

  const start = from <= to ? from : to;
  const end = from <= to ? to : from;
  const dates: string[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    dates.push(formatISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

export const buildStockTransactionReportRows = (
  items: StockTransactionReportItem[],
  dateKeys: string[],
  splitByTransactionType: boolean,
) => {
  const dateKeySet = new Set(dateKeys);

  return items.flatMap((item, index) => {
    const stockInByDate = createEmptyDateMap(dateKeys);
    const stockOutByDate = createEmptyDateMap(dateKeys);

    item.stock_details?.forEach((detail) => {
      const dateKey = getDetailDateKey(detail.create_at);
      if (!dateKeySet.has(dateKey)) return;

      const qty = toReportNumber(detail.qty);
      if (detail.stock_transaction_type === "Stock In") {
        stockInByDate[dateKey] = (stockInByDate[dateKey] ?? 0) + qty;
        return;
      }

      if (detail.stock_transaction_type === "Stock Out") {
        stockOutByDate[dateKey] = (stockOutByDate[dateKey] ?? 0) + qty;
      }
    });

    const baseRow = {
      stockName: item.stock_name || "-",
      startingQty: toReportNumber(item.starting_qty),
      totalStockIn: toReportNumber(item.total_stock_in),
      totalStockOut: toReportNumber(item.total_stock_out),
      endingQty: toReportNumber(item.ending_qty),
      stockInByDate,
      stockOutByDate,
    };

    if (!splitByTransactionType) {
      return [{ ...baseRow, id: `${index}` }];
    }

    const rows: StockTransactionReportRow[] = [];
    if (hasNonZeroQuantity(stockInByDate)) {
      rows.push({ ...baseRow, id: `${index}-in`, rowType: "Stock In" });
    }
    if (hasNonZeroQuantity(stockOutByDate)) {
      rows.push({ ...baseRow, id: `${index}-out`, rowType: "Stock Out" });
    }

    return rows.length > 0 ? rows : [{ ...baseRow, id: `${index}-empty` }];
  });
};

export const formatDateHeader = (dateKey: string) => {
  const date = parseISODate(dateKey);
  if (!date) return dateKey;

  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
  }).format(date);
};

export const toReportNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const formatTransactionQuantity = (
  value: unknown,
  transactionType?: StockTransactionType,
) => {
  const qty = Math.abs(toReportNumber(value));
  if (qty === 0) return { text: "0", className: "text-muted-foreground" };

  if (transactionType === "Stock In") {
    return { text: `+${qty}`, className: "text-success font-semibold" };
  }

  if (transactionType === "Stock Out") {
    return { text: `-${qty}`, className: "text-destructive font-semibold" };
  }

  return { text: String(qty), className: "text-muted-foreground" };
};

const createEmptyDateMap = (dateKeys: string[]) =>
  Object.fromEntries(dateKeys.map((dateKey) => [dateKey, 0])) as Record<string, number>;

const hasNonZeroQuantity = (quantityByDate: Record<string, number>) =>
  Object.values(quantityByDate).some((quantity) => Math.abs(toReportNumber(quantity)) > 0);

const getDetailDateKey = (value: string) => value.split(/[ T]/)[0] ?? "";

const parseISODate = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
};

const formatISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
