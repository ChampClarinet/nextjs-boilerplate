"use client";

import { type FC, useState } from "react";

import StockAPI from "@/apis/stock";
import type { UpdateStockParams } from "@/apis/stock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import StockForm, { type StockFormSubmitValues } from "../stock-form";
import type { DisplayStockItem } from "../stock.types";
import { formatFormNumber } from "../utils";

interface EditStockDialogProps {
  stock?: DisplayStockItem;
  categoryOptions: string[];
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditStockDialog: FC<EditStockDialogProps> = ({
  stock,
  categoryOptions,
  onOpenChange,
  onSuccess,
}) => {
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    setError(undefined);
  };

  const handleSubmit = async (params: StockFormSubmitValues) => {
    if (!stock) return;

    setIsSubmitting(true);
    setError(undefined);

    const updateParams: UpdateStockParams = {
      ...params,
      stock_id: stock.id,
    };

    try {
      await StockAPI.updateStock(updateParams);
      toast.success("แก้ไขสินค้าสำเร็จ");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      const errorMessage = "แก้ไขสินค้าไม่สำเร็จ";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={Boolean(stock)} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] gap-5 overflow-y-auto sm:max-w-xl">
        {stock && (
          <>
            <DialogHeader>
              <DialogTitle>แก้ไขสินค้า</DialogTitle>
              <DialogDescription>แก้ไขข้อมูลสินค้า</DialogDescription>
            </DialogHeader>

            <StockForm
              key={stock.id}
              mode="update"
              categoryOptions={categoryOptions}
              error={error}
              initialValues={getStockFormValues(stock)}
              isSubmitting={isSubmitting}
              submitLabel="บันทึก"
              submittingLabel="กำลังบันทึก..."
              onCancel={() => handleOpenChange(false)}
              onErrorChange={setError}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditStockDialog;

const getStockFormValues = (stock: DisplayStockItem) => ({
  stock_name: stock.name === "-" ? "" : stock.name,
  size: stock.size,
  stock_category: stock.category === "-" ? "" : stock.category,
  cost_price: formatFormNumber(stock.costPrice),
  stock_price: formatFormNumber(stock.sellingPrice),
  stock_minimum: formatFormNumber(stock.minimum),
  order_minimum: formatFormNumber(stock.orderMinimum),
  remove_image: false,
});
