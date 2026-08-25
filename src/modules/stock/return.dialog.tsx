import { type FC } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import StockTransactionForm from "./stock-transaction-form";
import type { StockTransactionMode } from "./stock.types";

interface ReturnDialogProps {
  open: boolean;
  mode?: Exclude<StockTransactionMode, "borrow" | "po">;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ReturnDialog: FC<ReturnDialogProps> = ({
  open,
  mode = "return",
  onOpenChange,
  onSuccess,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[calc(100vh-2rem)] gap-5 overflow-y-auto sm:max-w-6xl">
      <DialogHeader>
        <DialogTitle>{getTitle(mode)}</DialogTitle>
        <DialogDescription>กรอกรายละเอียดรายการสินค้า</DialogDescription>
      </DialogHeader>

      <StockTransactionForm
        key={open ? `${mode}-open` : `${mode}-closed`}
        mode={mode}
        onCancel={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </DialogContent>
  </Dialog>
);

export default ReturnDialog;

const getTitle = (mode: Exclude<StockTransactionMode, "borrow" | "po">) => {
  if (mode === "keyin") return "คีย์ของเข้าระบบ";
  return "คืนสินค้า";
};
