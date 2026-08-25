import { type FC } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import PurchaseOrderForm from "./purchase-order-form";

interface PurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PurchaseOrderDialog: FC<PurchaseOrderDialogProps> = ({ open, onOpenChange, onSuccess }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[calc(100vh-2rem)] gap-5 overflow-y-auto sm:max-w-6xl">
      <DialogHeader>
        <DialogTitle>สั่งซื้อสินค้า</DialogTitle>
        <DialogDescription>กรอกรายละเอียดรายการสั่งซื้อสินค้า</DialogDescription>
      </DialogHeader>

      <PurchaseOrderForm
        key={open ? "purchase-order-open" : "purchase-order-closed"}
        onCancel={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </DialogContent>
  </Dialog>
);

export default PurchaseOrderDialog;
