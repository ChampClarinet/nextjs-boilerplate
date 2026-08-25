"use client";

import { type FC, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import type { CreateStockParams, StockSize } from "@/apis/stock";
import SearchableSelect from "@/components/molecules/searchable.select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, X } from "lucide-react";

import {
  MAX_STOCK_IMAGE_SIZE_BYTES,
  STOCK_SIZE_OPTIONS,
  type StockFormValues,
} from "./stock.types";

export type StockFormSubmitValues = CreateStockParams & {
  remove_image: boolean;
};

interface StockFormProps {
  categoryOptions: string[];
  error?: string;
  initialValues?: StockFormValues;
  isSubmitting?: boolean;
  mode?: "create" | "update";
  submitLabel: string;
  submittingLabel: string;
  onCancel: () => void;
  onErrorChange?: (error: string | undefined) => void;
  onSubmit: (params: StockFormSubmitValues) => unknown;
}

const StockForm: FC<StockFormProps> = ({
  categoryOptions,
  error,
  initialValues = EMPTY_STOCK_FORM_VALUES,
  isSubmitting = false,
  mode = "create",
  submitLabel,
  submittingLabel,
  onCancel,
  onErrorChange,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<StockFormValues>({
    defaultValues: initialValues,
  });
  const stockImage = watch("stock_image");
  const imagePreviewUrl = useMemo(() => {
    if (!stockImage) return undefined;
    return URL.createObjectURL(stockImage);
  }, [stockImage]);
  const categoryComboboxOptions = useMemo(
    () => categoryOptions.map((category) => ({ value: category, label: category })),
    [categoryOptions],
  );

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const clearParentError = () => onErrorChange?.(undefined);

  const clearImage = () => {
    setValue("stock_image", undefined, { shouldDirty: true, shouldValidate: true });
    clearParentError();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submitForm = (values: StockFormValues) => {
    const imageValidation = isValidImage(values.stock_image);
    if (imageValidation !== true) {
      onErrorChange?.(imageValidation);
      return;
    }

    onSubmit({
      stock_name: values.stock_name.trim(),
      size: values.size as StockSize,
      stock_category: values.stock_category,
      cost_price: Number(values.cost_price),
      stock_price: Number(values.stock_price),
      stock_minimum: Number(values.stock_minimum),
      order_minimum: Number(values.order_minimum),
      stock_image: values.stock_image,
      remove_image: values.remove_image,
    });
  };

  const formError = getFirstErrorMessage(errors) ?? error;

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(submitForm)}>
      <label className="grid gap-2">
        <span className="text-muted-foreground text-sm font-semibold">ชื่อสินค้า</span>
        <Input
          {...register("stock_name", {
            onChange: clearParentError,
            validate: (value) => Boolean(value.trim()) || "กรุณากรอกชื่อสินค้า",
          })}
          placeholder="กรอกชื่อสินค้า"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-muted-foreground text-sm font-semibold">ขนาด</span>
          <Controller
            control={control}
            name="size"
            rules={{ validate: (value) => isStockSize(value) || "กรุณาเลือกขนาดสินค้า" }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value ?? "");
                  clearParentError();
                }}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="เลือกขนาด">
                    {(value) => (value ? String(value) : "เลือกขนาด")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {STOCK_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-muted-foreground text-sm font-semibold">หมวดหมู่สินค้า</span>
          <Controller
            control={control}
            name="stock_category"
            rules={{
              validate: (value) => {
                if (!value) return "กรุณาเลือกหมวดหมู่สินค้า";
                return stockCategoriesIncludes(categoryOptions, value)
                  ? true
                  : "หมวดหมู่สินค้าต้องตรงกับรายการที่มี";
              },
            }}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || null}
                options={categoryComboboxOptions}
                placeholder="เลือกหมวดหมู่"
                searchPlaceholder="ค้นหาหมวดหมู่..."
                noDataPlaceholder="ไม่พบหมวดหมู่"
                overrideWidth="auto"
                onChange={(value) => {
                  field.onChange(value);
                  clearParentError();
                }}
              />
            )}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-muted-foreground text-sm font-semibold">ต้นทุน</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register("cost_price", {
              onChange: clearParentError,
              validate: (value) => isValidFloat(value) || "กรุณากรอกต้นทุนให้ถูกต้อง",
            })}
            placeholder="0.00"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-muted-foreground text-sm font-semibold">ราคาขาย</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register("stock_price", {
              onChange: clearParentError,
              validate: (value) => isValidFloat(value) || "กรุณากรอกราคาให้ถูกต้อง",
            })}
            placeholder="0.00"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-muted-foreground text-sm font-semibold">จำนวนขั้นต่ำสต็อก</span>
          <Input
            type="number"
            min="0"
            step="1"
            {...register("stock_minimum", {
              onChange: clearParentError,
              validate: (value) =>
                isValidInteger(value) || "กรุณากรอกจำนวนขั้นต่ำสต็อกเป็นจำนวนเต็ม",
            })}
            placeholder="0"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-muted-foreground text-sm font-semibold">จำนวนสั่งซื้อขั้นต่ำ</span>
          <Input
            type="number"
            min="0"
            step="1"
            {...register("order_minimum", {
              onChange: clearParentError,
              validate: (value) =>
                isValidInteger(value) || "กรุณากรอกจำนวนสั่งซื้อขั้นต่ำเป็นจำนวนเต็ม",
            })}
            placeholder="0"
          />
        </label>
      </div>

      <div className="grid gap-2">
        <span className="text-muted-foreground text-sm font-semibold">รูปภาพสินค้า</span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-muted border-border flex size-24 items-center justify-center overflow-hidden rounded-2xl border">
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="ตัวอย่างรูปภาพสินค้า"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlus aria-hidden="true" className="text-muted-foreground size-9" />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              เลือกรูปภาพ
            </Button>
            {stockImage && (
              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={clearImage}
                disabled={isSubmitting}
              >
                <X aria-hidden="true" className="size-4" />
                ล้างรูปภาพ
              </Button>
            )}
          </div>
        </div>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            setValue("stock_image", event.target.files?.[0], {
              shouldDirty: true,
              shouldValidate: true,
            });
            clearParentError();
          }}
        />
        <span className="text-muted-foreground text-xs">รองรับไฟล์รูปภาพ ขนาดไม่เกิน 10MB</span>
        {mode === "update" && (
          <label className="text-foreground mt-1 flex items-center gap-3 text-sm font-medium">
            <Controller
              control={control}
              name="remove_image"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked === true);
                    clearParentError();
                  }}
                  disabled={isSubmitting}
                />
              )}
            />
            ลบรูปภาพเดิม
          </label>
        )}
      </div>

      {formError && <p className="text-destructive text-sm font-medium">{formError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default StockForm;

export const getInitialStockFormValues = (): StockFormValues => ({
  stock_name: "",
  size: "",
  stock_category: "",
  cost_price: "",
  stock_price: "",
  stock_minimum: "",
  order_minimum: "",
  remove_image: false,
});

export const EMPTY_STOCK_FORM_VALUES = getInitialStockFormValues();

const getFirstErrorMessage = (
  errors: Partial<Record<keyof StockFormValues, { message?: string }>>,
) => {
  const error = Object.values(errors).find((error) => error?.message);
  return error?.message;
};

const stockCategoriesIncludes = (stockCategories: string[], value: string) => {
  return stockCategories.length === 0 || stockCategories.includes(value);
};

const isStockSize = (value: string): value is StockSize => {
  return STOCK_SIZE_OPTIONS.includes(value as StockSize);
};

const isValidFloat = (value: string) => {
  if (value === "") return false;

  const number = Number(value);
  return Number.isFinite(number) && number >= 0;
};

const isValidInteger = (value: string) => {
  if (value === "") return false;

  const number = Number(value);
  return Number.isInteger(number) && number >= 0;
};

const isValidImage = (value?: File) => {
  if (!value) return true;
  if (!value.type.startsWith("image/")) return "ไฟล์รูปภาพไม่ถูกต้อง";
  return value.size <= MAX_STOCK_IMAGE_SIZE_BYTES || "รูปภาพต้องมีขนาดไม่เกิน 10MB";
};
