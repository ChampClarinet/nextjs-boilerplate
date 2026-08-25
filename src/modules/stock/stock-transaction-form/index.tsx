"use client";

import { type FC } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type { StockTransactionMode } from "../stock.types";
import DetailTable from "./detail-table";
import InfoFields from "./info-fields";
import { useStockTransactionForm } from "./use-stock-transaction-form";

interface StockTransactionFormProps {
  mode: StockTransactionMode;
  onCancel: () => void;
  onSuccess?: () => void;
}

const StockTransactionForm: FC<StockTransactionFormProps> = ({ mode, onCancel, onSuccess }) => {
  const form = useStockTransactionForm({ mode, onCancel, onSuccess });

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit}>
      {form.isLoadingPrerequisites ? (
        <p className="text-muted-foreground py-8 text-center">กำลังโหลดข้อมูล...</p>
      ) : (
        <>
          <DetailTable
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

          <InfoFields
            control={form.control}
            register={form.register}
            values={form.values}
            mode={mode}
            employeeOptions={form.employeeOptions}
            departmentOptions={form.departmentOptions}
            poOptions={form.poOptions}
            employeeComboboxOptions={form.employeeComboboxOptions}
            departmentComboboxOptions={form.departmentComboboxOptions}
            poComboboxOptions={form.poComboboxOptions}
            employeeOptionLabelsById={form.employeeOptionLabelsById}
            departmentOptionLabelsById={form.departmentOptionLabelsById}
            poOptionLabelsById={form.poOptionLabelsById}
            isLoadingEmployeeOptions={form.isLoadingEmployeeOptions}
            isLoadingDepartmentOptions={form.isLoadingDepartmentOptions}
            isLoadingPO={form.isLoadingPO}
            isLoadingTransactionNumber={form.isLoadingTransactionNumber}
            shouldShowEntryTypeSelect={form.shouldShowEntryTypeSelect}
            shouldShowDepartment={form.shouldShowDepartment}
            shouldShowPO={form.shouldShowPO}
            setEmployeeSearchQuery={form.setEmployeeSearchQuery}
            setDepartmentSearchQuery={form.setDepartmentSearchQuery}
            setPOSearchQuery={form.setPOSearchQuery}
            handleEntryTypeChange={form.handleEntryTypeChange}
            clearFormError={form.clearFormError}
          />

          <input type="hidden" {...form.register("stock_flow")} />
          <input type="hidden" {...form.register("stock_transaction_id")} />

          {mode === "return" && (
            <label className="grid gap-2">
              <span className="text-muted-foreground text-sm font-semibold">สาเหตุที่คืน</span>
              <Textarea
                {...form.register("reason", {
                  onChange: form.clearFormError,
                  validate: (value) => Boolean(value.trim()) || "กรุณากรอกสาเหตุที่คืน",
                })}
                placeholder="กรอกสาเหตุที่คืน"
              />
            </label>
          )}

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
        <Button
          type="submit"
          className={cn(mode === "borrow" && "bg-destructive hover:bg-destructive/80")}
          disabled={form.isSubmitting || form.isLoadingPrerequisites}
        >
          {form.isSubmitting ? "กำลังบันทึก..." : form.modeLabel}
        </Button>
      </div>
    </form>
  );
};

export default StockTransactionForm;
