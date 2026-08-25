import type { StockTransactionType } from "@/apis/stock";

export enum StockTransactionReportPresentation {
  INOUT = "แยกประเภทเข้าออก",
  DATE_AND_TRANSACTIONS = "เรียงตามวันและรายการสินค้า",
}

export interface StockTransactionReportRow {
  id: string;
  stockName: string;
  startingQty: number;
  totalStockIn: number;
  totalStockOut: number;
  endingQty: number;
  rowType?: StockTransactionType;
  stockInByDate: Record<string, number>;
  stockOutByDate: Record<string, number>;
}
