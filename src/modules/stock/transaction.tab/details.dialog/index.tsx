"use client";

import { type FC, useState } from "react";

import StockAPI from "@/apis/stock";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { downloadBlob } from "@/utils/download";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { useStockTransactionDetail } from "../../hooks/use-stock-transaction-detail";
import type { DisplayStockTransaction } from "../../stock.types";
import StockTransactionDetailContent from "./content";

interface StockTransactionDetailsDialogProps {
  transaction?: DisplayStockTransaction;
  onOpenChange: (open: boolean) => void;
}

const StockTransactionDetailsDialog: FC<StockTransactionDetailsDialogProps> = ({
  transaction,
  onOpenChange,
}) => {
  const { data, isLoading, error } = useStockTransactionDetail(transaction?.id);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const handleExportToExcel = async () => {
    if (!transaction || isExportingExcel) return;

    const exportTransaction =
      data?.stock_entry_type === "ใบสั่งซื้อสินค้า"
        ? () => StockAPI.exportTransactionToExcel(transaction.id)
        : () => StockAPI.exportTransaction(transaction.id);

    setIsExportingExcel(true);

    try {
      const file = await exportTransaction();
      downloadBlob(file, getExcelFileName(transaction));
      toast.success("ดาวน์โหลด Excel สำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("ดาวน์โหลด Excel ไม่สำเร็จ");
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <Dialog open={Boolean(transaction)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] gap-5 overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>รายละเอียดรายการสินค้าเข้าออก</DialogTitle>
          <DialogDescription>ข้อมูลรายการและสินค้าในรายการ</DialogDescription>
        </DialogHeader>

        {transaction && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-muted-foreground text-sm font-semibold">เลขที่รายการ</p>
                <p className="text-foreground mt-1 text-xl font-bold break-all">
                  {transaction.transactionNumber}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExportToExcel}
                  disabled={isExportingExcel}
                >
                  <Download aria-hidden="true" data-icon="inline-start" />
                  {isExportingExcel ? "กำลัง Export..." : "Export Excel"}
                </Button>
                <span
                  className={cn(
                    "inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold",
                    transaction.transactionType === "Stock In"
                      ? "bg-success-soft text-success"
                      : "bg-destructive-soft text-destructive",
                  )}
                >
                  {transaction.transactionTypeLabel}
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="text-muted-foreground rounded-xl border p-6 text-center font-medium">
                กำลังโหลดรายละเอียดรายการสินค้าเข้าออก...
              </div>
            ) : error ? (
              <div className="text-destructive bg-destructive-soft rounded-xl border p-6 text-center font-semibold">
                {error}
              </div>
            ) : (
              <StockTransactionDetailContent transaction={data} fallbackTransaction={transaction} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StockTransactionDetailsDialog;

const getExcelFileName = (tx: DisplayStockTransaction) => {
  const safeTransactionNumber = tx.transactionNumber.replace(/[^\w.-]+/g, "_");
  const type = tx.entryType.split(" ").at(-1);
  return `${type}-${safeTransactionNumber}.xlsx`;
};
