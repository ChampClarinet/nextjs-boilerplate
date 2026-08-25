"use client";

import { type FC } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import PurchaseOrderDetailTable from "./detail-table";
import { usePurchaseOrderForm } from "./use-purchase-order-form";

interface PurchaseOrderFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

const PurchaseOrderForm: FC<PurchaseOrderFormProps> = ({ onCancel, onSuccess }) => {
  const form = usePurchaseOrderForm({ onCancel, onSuccess });

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit}>
      {form.isLoadingPrerequisites ? (
        <p className="text-muted-foreground py-8 text-center">กำลังโหลดข้อมูล...</p>
      ) : (
        <>
          <PurchaseOrderDetailTable
            control={form.control}
            fields={form.fields}
            details={form.details}
            stockComboboxOptions={form.stockComboboxOptions}
            stockOptionLabelsById={form.stockOptionLabelsById}
            orderedConditionOptions={form.orderedConditionOptions}
            isLoadingStockOptions={form.isLoadingStockOptions}
            setStockSearchQuery={form.setStockSearchQuery}
            clearFormError={form.clearFormError}
            removeDetail={form.removeDetail}
            addDetail={form.addDetail}
            register={form.register}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-muted-foreground text-sm font-semibold">ซัพพลายเออร์</span>
              <Input
                {...form.register("supplier", {
                  onChange: form.clearFormError,
                  validate: (value) => Boolean(value.trim()) || "กรุณากรอกซัพพลายเออร์",
                })}
                placeholder="กรอกซัพพลายเออร์"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-muted-foreground text-sm font-semibold">เลขที่รายการ</span>
              <Input
                value={form.isLoadingTransactionNumber ? "กำลังโหลด..." : form.transactionNumber}
                disabled
              />
              <input type="hidden" {...form.register("stock_transaction_id")} />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-muted-foreground text-sm font-semibold">ผู้ทำรายการ</span>
              <Input
                {...form.register("issuer_name", {
                  onChange: form.clearFormError,
                  validate: (value) => Boolean(value.trim()) || "กรุณากรอกผู้ทำรายการ",
                })}
                placeholder="กรอกผู้ทำรายการ"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-muted-foreground text-sm font-semibold">หมายเหตุ</span>
            <Textarea
              {...form.register("remark", { onChange: form.clearFormError })}
              placeholder="กรอกหมายเหตุ"
            />
          </label>
        </>
      )}

      {(form.firstFieldError || form.formError) && (
        <p className="text-destructive text-sm font-medium">
          {form.firstFieldError ?? form.formError}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={form.isSubmitting}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={form.isSubmitting || form.isLoadingPrerequisites}>
          {form.isSubmitting ? "กำลังบันทึก..." : "สั่งซื้อสินค้า"}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
