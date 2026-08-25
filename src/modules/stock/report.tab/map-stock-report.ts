import type { StockReportItem } from "@/apis/stock-report";

import type { DisplayStockReport } from "../stock.types";
import { formatCurrency, formatNullableDate, formatNullableValue } from "../utils";

export const mapStockReportItem = (item: StockReportItem): DisplayStockReport => ({
  reportType: formatNullableValue(item.report_type),
  stockEntryType: formatNullableValue(item.stock_entry_type),
  createdDate: formatNullableDate(item.created_date),
  stockName: formatNullableValue(item.stock_name),
  totalRemainingStock: formatNullableValue(item.total_remaining_stock),
  netPrice:
    item.net_price === null || item.net_price === undefined ? "-" : formatCurrency(item.net_price),
  deliveryStatus: formatNullableValue(item.delivery_status),
  issuerName: formatNullableValue(item.issuer_name),
});
