"use client";

import { type FC, useState } from "react";

import StockAPI from "@/apis/stock";
import type { CreateStockParams } from "@/apis/stock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { useStockCategories } from "./hooks/use-stock-categories";
import StockForm from "./stock-form";

interface CreateStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateStockDialog: FC<CreateStockDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const { categories } = useStockCategories();
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    setError(undefined);
  };

  const handleSubmit = async (params: CreateStockParams) => {
    setIsSubmitting(true);
    setError(undefined);

    try {
      await StockAPI.createStock(params);
      toast.success("สร้างสินค้าสำเร็จ");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      const errorMessage = "สร้างสินค้าไม่สำเร็จ";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] gap-5 overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>เพิ่มสินค้า</DialogTitle>
          <DialogDescription>กรอกข้อมูลสินค้าใหม่</DialogDescription>
        </DialogHeader>

        <StockForm
          key={open ? "create-stock-open" : "create-stock-closed"}
          categoryOptions={categories}
          error={error}
          isSubmitting={isSubmitting}
          submitLabel="สร้างสินค้า"
          submittingLabel="กำลังสร้าง..."
          onCancel={() => handleOpenChange(false)}
          onErrorChange={setError}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateStockDialog;
