import { type FC } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Boxes } from "lucide-react";
import Image from "next/image";

import type { DisplayStockItem } from "../stock.types";
import { formatCurrency } from "../utils";

interface StockDetailsDialogProps {
  stock?: DisplayStockItem;
  onOpenChange: (open: boolean) => void;
  onEdit: (stock: DisplayStockItem) => void;
}

const StockDetailsDialog: FC<StockDetailsDialogProps> = ({ stock, onOpenChange, onEdit }) => (
  <Dialog open={Boolean(stock)} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[calc(100vh-2rem)] gap-5 overflow-y-auto sm:max-w-4xl">
      {stock && (
        <>
          <DialogHeader>
            <DialogTitle>รายละเอียดสินค้า</DialogTitle>
            <DialogDescription>ข้อมูลสินค้าและจำนวนคงคลัง</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => onEdit(stock)}>
              แก้ไขสินค้า
            </Button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[15rem_1fr]">
            <div className="border-border bg-muted relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border">
              {stock.imageUrl ? (
                <Image
                  src={`/stock/image?url=${encodeURIComponent(stock.imageUrl)}`}
                  alt={stock.name}
                  className="h-full w-full object-cover"
                  fill
                  sizes="(min-width: 1024px) 15rem, 100vw"
                  unoptimized
                />
              ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                  <Boxes aria-hidden="true" className="size-12" />
                  <span className="text-sm font-medium">ไม่มีรูปภาพ</span>
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "ชื่อสินค้า", value: stock.name },
                { label: "สถานะ", value: stock.statusLabel },
                { label: "ขนาด/ประเภท", value: stock.variant },
                { label: "หมวดหมู่สินค้า", value: stock.category },
                { label: "ต้นทุน", value: formatCurrency(stock.costPrice) },
                { label: "ราคาขาย", value: formatCurrency(stock.sellingPrice) },
                { label: "จำนวนขั้นต่ำสต็อก", value: stock.minimum },
                { label: "จำนวนสั่งซื้อขั้นต่ำ", value: stock.orderMinimum },
                { label: "จำนวนพร้อมใช้/ทั้งหมด", value: stock.availableTotal },
                { label: "วันที่สินค้าถูกสร้าง", value: stock.createdAt },
              ].map((detail) => (
                <div key={detail.label} className="rounded-xl border p-3">
                  <p className="text-muted-foreground text-xs font-semibold">{detail.label}</p>
                  <p className="text-foreground mt-1 font-semibold">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "ยอดตั้งต้น", value: stock.opening },
              { label: "รับเข้า", value: stock.incoming },
              { label: "จ่ายออก", value: stock.outgoing },
              { label: "คงเหลือ", value: stock.current },
            ].map((card) => (
              <div key={card.label} className="bg-card rounded-xl border p-4">
                <p className="text-muted-foreground text-sm font-medium">{card.label}</p>
                <p className="text-card-foreground mt-2 text-2xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border">
            <table className="w-full border-collapse text-left">
              <thead className="bg-muted text-muted-foreground text-sm">
                <tr>
                  <th className="px-4 py-3 font-semibold">สภาพสินค้า</th>
                  <th className="px-4 py-3 font-semibold">จำนวน</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {getConditionRows(stock.condition).map(([condition, count]) => (
                  <tr key={condition}>
                    <td className="px-4 py-3 font-medium">{condition}</td>
                    <td className="text-muted-foreground px-4 py-3">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);

export default StockDetailsDialog;

const getConditionRows = (condition: DisplayStockItem["condition"]) => {
  return Object.entries(condition).sort(([a], [b]) => Number.parseFloat(b) - Number.parseFloat(a));
};
