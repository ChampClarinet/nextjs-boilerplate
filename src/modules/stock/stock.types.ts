import type { StockSize, StockTransactionType } from "@/apis/stock";
import type { DeliveryStatus } from "@/apis/stock";
import type { ReportGroupBy, StockReportType } from "@/apis/stock-report";

export interface DisplayStockItem {
  id: string;
  name: string;
  status: "below_minimum" | "normal";
  statusLabel: string;
  size: string;
  variant: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  orderMinimum: number;
  availableTotal: string;
  createdAt: string;
  imageUrl?: string;
  condition: Record<`${number}%`, number>;
  available: number;
  total: number;
  borrowed: number;
  opening: number;
  incoming: number;
  outgoing: number;
  current: number;
  minimum: number;
}

export interface StockFilters {
  stock_filter: string;
  date_from: string;
  date_to: string;
  category: string;
  is_below_minimum: boolean;
}

export interface DisplayStockTransaction {
  id: string;
  transactionNumber: string;
  transactionType: StockTransactionType;
  transactionTypeLabel: string;
  entryType: string;
  deliveryStatus: string;
  createdAt: string;
}

export interface StockTransactionFilters {
  transaction_number: string;
  stock_transaction_type: StockTransactionType | "all";
  stock_entry_type: string;
  delivery_status: string;
  date_from: string;
  date_to: string;
}

export interface DisplayStockReport {
  reportType: string;
  stockEntryType: string;
  createdDate: string;
  stockName: string;
  totalRemainingStock: string;
  netPrice: string;
  deliveryStatus: string;
  issuerName: string;
}

export interface StockReportFilters {
  date_from: string;
  date_to: string;
  report_type: StockReportType;
  delivery_status: DeliveryStatus[];
  stock_entry_type: string[];
  group_by: ReportGroupBy;
}

export interface StockFormValues {
  stock_name: string;
  size: string;
  stock_category: string;
  cost_price: string;
  stock_price: string;
  stock_minimum: string;
  order_minimum: string;
  stock_image?: File;
  remove_image: boolean;
}

export type StockTransactionMode = "borrow" | "return" | "keyin" | "po";

export interface StockTransactionDetailFormRow {
  id: string;
  stock_id: string;
  condition_value: string;
  quantity: string;
  stock_name: string;
  stock_remaining: string;
  selling_price: string;
  condition_price: string;
}

export interface StockTransactionFormValues {
  employee_id: string;
  department: string;
  issuer_name: string;
  stock_entry_type: string;
  stock_transaction_id: string;
  po_number: string;
  stock_flow: "Stock In" | "Stock Out";
  delivery_status: string;
  reason: string;
  remark: string;
  details: StockTransactionDetailFormRow[];
}

export const STOCK_SIZE_OPTIONS: StockSize[] = [
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
];

export const MAX_STOCK_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
