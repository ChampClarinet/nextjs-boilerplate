import type { FC } from "react";

import type { StockTransaction } from "@/apis/stock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DisplayStockTransaction } from "../../stock.types";
import { formatCurrency, formatDate, formatNullableDate, toNumber } from "../../utils";
import DetailTile from "./detail.tile";
import SummaryTile from "./summary.tile";

export interface StockTransactionDetailContentProps {
  transaction?: StockTransaction;
  fallbackTransaction: DisplayStockTransaction;
}

const StockTransactionDetailContent: FC<StockTransactionDetailContentProps> = ({
  transaction,
  fallbackTransaction,
}) => {
  const detailRows = transaction?.stock_transaction_list ?? [];
  const totalQty = detailRows.reduce((sum, item) => sum + toNumber(item.qty), 0);
  const totalNetPrice = detailRows.reduce((sum, item) => sum + toNumber(item.net_price), 0);

  const overviewItems = [
    { label: "ID", value: transaction?.transaction_id ?? fallbackTransaction.id },
    {
      label: "ประเภทรายการ",
      value: transaction?.stock_entry_type ?? fallbackTransaction.entryType,
    },
    {
      label: "สถานะการนำส่ง",
      value: transaction?.delivery_status ?? fallbackTransaction.deliveryStatus,
    },
    { label: "วันที่ทำรายการ", value: formatDate(transaction?.create_at ?? "") },
  ];
  const partyItems = [
    { label: "ผู้ทำรายการ", value: transaction?.issuer_name },
    { label: "พนักงาน", value: transaction?.employee },
    { label: "แผนกพนักงาน", value: transaction?.employee_department },
    { label: "แผนก", value: transaction?.department },
    { label: "เลขที่ PO", value: transaction?.po_number },
    { label: "สถานะ PO", value: transaction?.po_status },
    { label: "ซัพพลายเออร์", value: transaction?.supplier },
    { label: "วันที่รับสินค้า", value: formatNullableDate(transaction?.receive_date) },
  ];

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {overviewItems.map((detail) => (
          <DetailTile key={detail.label} label={detail.label} value={detail.value} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryTile label="จำนวนรายการสินค้า" value={detailRows.length} />
        <SummaryTile label="จำนวนรวม" value={totalQty} />
        <SummaryTile label="ยอดสุทธิ" value={formatCurrency(totalNetPrice)} />
        <SummaryTile label="ประเภทเข้าออก" value={fallbackTransaction.transactionTypeLabel} />
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-foreground text-base font-bold">ข้อมูลผู้เกี่ยวข้อง</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {partyItems.map((detail) => (
            <DetailTile key={detail.label} label={detail.label} value={detail.value} />
          ))}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <DetailTile label="เหตุผล" value={transaction?.reason} />
        <DetailTile label="หมายเหตุ" value={transaction?.remark} />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-foreground text-base font-bold">รายการสินค้า</h3>
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-muted text-muted-foreground">
              <TableRow>
                <TableHead>สินค้า</TableHead>
                <TableHead>สภาพสินค้า</TableHead>
                <TableHead className="text-right">คงเหลือ</TableHead>
                <TableHead className="text-right">จำนวน</TableHead>
                <TableHead className="text-right">ราคาตั้งต้น</TableHead>
                <TableHead className="text-right">ราคาตามสภาพ</TableHead>
                <TableHead className="text-right">ยอดสุทธิ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailRows.length > 0 ? (
                detailRows.map((item) => (
                  <TableRow key={`${item.stock_id}-${item.stock_condition}`}>
                    <TableCell>
                      <div className="flex min-w-48 flex-col">
                        <span className="text-foreground font-semibold">{item.stock_name}</span>
                        <span className="text-muted-foreground text-xs">{item.stock_id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.stock_condition}</TableCell>
                    <TableCell className="text-muted-foreground text-right">
                      {item.stock_remaining}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right">{item.qty}</TableCell>
                    <TableCell className="text-muted-foreground text-right">
                      {formatCurrency(toNumber(item.base_price))}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right">
                      {formatCurrency(toNumber(item.condition_price))}
                    </TableCell>
                    <TableCell className="text-foreground text-right font-semibold">
                      {formatCurrency(toNumber(item.net_price))}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-20 text-center">
                    ไม่พบรายการสินค้า
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
};

export default StockTransactionDetailContent;
