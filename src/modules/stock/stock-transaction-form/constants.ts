import { DeliveryStatus } from "@/apis/stock";

import type {
  StockTransactionDetailFormRow,
  StockTransactionFormValues,
  StockTransactionMode,
} from "../stock.types";

export const STOCK_ENTRY_TYPE_GIR_BORROW = "GIR ใบเบิกส่วนกลาง";
export const STOCK_ENTRY_TYPE_KEY_IN = "คีย์ของเข้าระบบ";
export const STOCK_ENTRY_TYPE_PO = "ใบสั่งซื้อสินค้า";
export const CONDITION_NONE_VALUE = "__none__";

export const STOCK_ENTRY_TYPES_BY_MODE = {
  borrow: [STOCK_ENTRY_TYPE_GIR_BORROW, "PIR ใบเบิกส่วนตัว"],
  return: ["GIR ใบคืนส่วนกลาง", "PIRN ใบคืนส่วนตัว"],
  keyin: [STOCK_ENTRY_TYPE_KEY_IN],
  po: [STOCK_ENTRY_TYPE_PO],
} as const;

export const DELIVERY_STATUS_OPTIONS = [DeliveryStatus.PENDING, DeliveryStatus.COMPLETED] as const;

export const getModeLabel = (mode: StockTransactionMode) => {
  if (mode === "borrow") return "เบิกสินค้า";
  if (mode === "keyin") return "คีย์ของเข้าระบบ";
  if (mode === "po") return "สั่งซื้อสินค้า";
  return "คืนสินค้า";
};

export const getInitialStockTransactionFormValues = (
  mode: StockTransactionMode,
): StockTransactionFormValues => {
  const stockEntryType = STOCK_ENTRY_TYPES_BY_MODE[mode][0];

  return {
    employee_id: "",
    department: "",
    issuer_name: "",
    stock_entry_type: stockEntryType,
    stock_transaction_id: "",
    po_number: "",
    stock_flow: getStockFlow(mode),
    delivery_status: DeliveryStatus.PENDING,
    reason: "",
    remark: "",
    details: [createStockTransactionDetailFormRow("1")],
  };
};

export const createStockTransactionDetailFormRow = (id: string): StockTransactionDetailFormRow => ({
  id,
  stock_id: "",
  condition_value: "",
  quantity: "1",
  stock_name: "",
  stock_remaining: "",
  selling_price: "",
  condition_price: "",
});

export const getStockFlow = (
  mode: StockTransactionMode,
): StockTransactionFormValues["stock_flow"] => {
  return mode === "borrow" ? "Stock Out" : "Stock In";
};
