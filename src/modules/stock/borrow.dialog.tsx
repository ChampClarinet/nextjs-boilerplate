import { type FC } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import StockTransactionForm from "./stock-transaction-form";

interface BorrowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const BorrowDialog: FC<BorrowDialogProps> = ({ open, onOpenChange, onSuccess }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[calc(100vh-2rem)] gap-5 overflow-y-auto sm:max-w-6xl">
      <DialogHeader>
        <DialogTitle>เบิกสินค้า</DialogTitle>
        <DialogDescription>กรอกรายละเอียดรายการสินค้า</DialogDescription>
      </DialogHeader>

      <StockTransactionForm
        key={open ? "borrow-open" : "borrow-closed"}
        mode="borrow"
        onCancel={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </DialogContent>
  </Dialog>
);

export default BorrowDialog;
