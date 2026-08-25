import type {
  StockItem as ApiStockItem,
  BaseStockTransaction,
  StockTransactionType,
} from "@/apis/stock";
import { DeliveryStatus } from "@/apis/stock";

import type { DisplayStockItem, DisplayStockTransaction } from "./stock.types";

export const DELIVERY_STATUS_FILTER_OPTIONS = Object.values(DeliveryStatus);

export const STOCK_ENTRY_TYPE_OPTIONS = [
  "GIR ใบเบิกส่วนกลาง",
  "PIR ใบเบิกส่วนตัว",
  "GIR ใบคืนส่วนกลาง",
  "GIRN ใบคืนส่วนกลาง",
  "PIRN ใบคืนส่วนตัว",
  "คีย์ของเข้าระบบ",
  "ใบสั่งซื้อสินค้า",
  "Stock ของใหม่เข้า",
].map((type) => ({ value: type, label: type }));

export const mapStockItem = (item: ApiStockItem): DisplayStockItem => {
  const name = item.stock_name;
  const variant = item.size ?? "-";
  const { available, total } = parseAvailableTotal(item.available_total);
  const isBelowMinimum = item.stock_status.toLowerCase() !== "normal";
  const statusLabel = isBelowMinimum ? "ต่ำกว่าขั้นต่ำ" : "ปกติ";
  const stockMinimum = toNumber(item.stock_minimum);
  const size = item.size ?? (variant === "-" ? "" : variant);

  return {
    id: item.stock_id,
    name,
    status: isBelowMinimum ? "below_minimum" : "normal",
    statusLabel,
    size,
    variant: size || variant,
    category: item.stock_category || "-",
    costPrice: toNumber(item.cost_price),
    sellingPrice: toNumber(item.selling_price),
    orderMinimum: toNumber(item.order_minimum),
    availableTotal: item.available_total,
    createdAt: formatDate(item.create_at),
    imageUrl: item.stock_image ?? undefined,
    condition: item.stock_condition,
    available,
    total,
    borrowed: Math.max(total - available, 0),
    opening: item.opening,
    incoming: item.incoming,
    outgoing: item.outgoing,
    current: item.current,
    minimum: stockMinimum,
  };
};

export const mapStockTransaction = (item: BaseStockTransaction): DisplayStockTransaction => ({
  id: item.transaction_id || "-",
  transactionNumber: item.stock_transaction_number || "-",
  transactionType: item.stock_transaction_type,
  transactionTypeLabel: getStockTransactionTypeLabel(item.stock_transaction_type),
  entryType: item.stock_entry_type || "-",
  deliveryStatus: item.delivery_status || "-",
  createdAt: formatDate(item.create_at),
});

export const parseAvailableTotal = (availableTotal: string) => {
  const [availableText, totalText] = availableTotal.split("/");

  return {
    available: toNumber(availableText),
    total: toNumber(totalText),
  };
};

export const toNumber = (value: string | number | undefined) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const getLocalISODate = () => formatISODate(new Date());

export const getCurrentMonthDateRange = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);

  return {
    date_from: formatISODate(firstDate),
    date_to: formatISODate(lastDate),
  };
};

export const formatISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formatNullableDate = (value: unknown) => {
  if (typeof value !== "string" || value.length === 0) return "-";
  return formatDate(value);
};

export const formatNullableValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatFormNumber = (value: number) => {
  if (!Number.isFinite(value)) return "";
  return String(value);
};

export const getStockTransactionTypeLabel = (type: StockTransactionType) => {
  if (type === "Stock In") return "รับเข้า";
  if (type === "Stock Out") return "จ่ายออก";
  return type;
};

export const getStockTransactionTypeFilterLabel = (type: string) => {
  if (type === "all") return "ทั้งหมด";
  if (type === "Stock In") return "รับเข้า";
  if (type === "Stock Out") return "จ่ายออก";
  return type;
};
