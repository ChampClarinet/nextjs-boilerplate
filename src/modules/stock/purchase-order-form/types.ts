export interface PurchaseOrderDetailFormRow {
  id: string;
  stock_id: string;
  stock_condition: string;
  stock_qty: string;
  stock_name: string;
  stock_remaining: string;
  selling_price: string;
  condition_price: string;
}

export interface PurchaseOrderFormValues {
  issuer_name: string;
  supplier: string;
  stock_transaction_id: string;
  remark: string;
  details: PurchaseOrderDetailFormRow[];
}
