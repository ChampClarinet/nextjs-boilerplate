"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import type { StockPriceDetail } from "@/apis/stock";
import StockAPI from "@/apis/stock";
import { toast } from "sonner";

import { useStockConditions } from "../hooks/use-stock-conditions";
import { useStockQuery } from "../hooks/use-stock-query";
import { STOCK_ENTRY_TYPE_PO } from "../stock-transaction-form/constants";
import type { PurchaseOrderFormValues } from "./types";

interface UsePurchaseOrderFormParams {
  onCancel: () => void;
  onSuccess?: () => void;
}

export const usePurchaseOrderForm = ({ onCancel, onSuccess }: UsePurchaseOrderFormParams) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<PurchaseOrderFormValues>({
    defaultValues: getInitialPurchaseOrderFormValues(),
  });
  const { append, fields, remove, replace } = useFieldArray({
    control,
    name: "details",
  });
  const transactionNumber = useWatch({ control, name: "stock_transaction_id" });
  const details = useWatch({ control, name: "details" });
  const nextDetailIdRef = useRef(2);
  const priceRequestKeysRef = useRef<Record<string, string>>({});
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [stockOptionLabelsById, setStockOptionLabelsById] = useState<Record<string, string>>({});
  const [isLoadingTransactionNumber, setIsLoadingTransactionNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const stockQueryParams = useMemo(
    () => (stockSearchQuery.trim() ? { stock_filter: stockSearchQuery.trim() } : {}),
    [stockSearchQuery],
  );
  const {
    data: stockOptions,
    isLoading: isLoadingStockOptions,
    error: stockOptionsError,
  } = useStockQuery(stockQueryParams);
  const {
    data: conditionOptions,
    isLoading: isLoadingStockConditions,
    error: conditionOptionsError,
  } = useStockConditions();
  const stockComboboxOptions = useMemo(
    () => stockOptions.map((stock) => ({ value: stock.stock_id, label: stock.stock_name })),
    [stockOptions],
  );
  const orderedConditionOptions = useMemo(
    () => [...conditionOptions].sort((a, b) => b.condition_value - a.condition_value),
    [conditionOptions],
  );
  const conditionLabelsByValue = useMemo(
    () =>
      Object.fromEntries(
        conditionOptions.map((condition) => [
          String(condition.condition_value),
          condition.condition,
        ]),
      ),
    [conditionOptions],
  );
  const isLoadingPrerequisites =
    (isLoadingStockOptions && stockOptions.length === 0) ||
    (isLoadingStockConditions && conditionOptions.length === 0);

  useEffect(() => {
    setStockOptionLabelsById((current) => {
      let didChange = false;
      const next = { ...current };

      stockOptions.forEach((option) => {
        if (next[option.stock_id] === option.stock_name) return;
        next[option.stock_id] = option.stock_name;
        didChange = true;
      });

      return didChange ? next : current;
    });
  }, [stockOptions]);

  useEffect(() => {
    const nextError = stockOptionsError ?? conditionOptionsError;
    if (nextError) setFormError(nextError);
  }, [conditionOptionsError, stockOptionsError]);

  useEffect(() => {
    let isMounted = true;

    const fetchTransactionNumber = async () => {
      setIsLoadingTransactionNumber(true);

      try {
        const response = await StockAPI.getStockTransactionNumber({
          stock_entry_type: STOCK_ENTRY_TYPE_PO,
        });
        if (!isMounted) return;

        setValue("stock_transaction_id", response.data);
      } catch (error) {
        console.error(error);
        if (isMounted) setFormError("โหลดเลขที่รายการไม่สำเร็จ");
      } finally {
        if (isMounted) setIsLoadingTransactionNumber(false);
      }
    };

    void fetchTransactionNumber();

    return () => {
      isMounted = false;
    };
  }, [setValue]);

  const clearFormError = () => setFormError(undefined);

  const clearDetailPrice = useCallback(
    (index: number) => {
      setValue(`details.${index}.stock_name`, "");
      setValue(`details.${index}.stock_remaining`, "");
      setValue(`details.${index}.selling_price`, "");
      setValue(`details.${index}.condition_price`, "");
    },
    [setValue],
  );

  const setDetailPrice = useCallback(
    (index: number, detail: StockPriceDetail) => {
      setValue(`details.${index}.stock_name`, detail.stock_name);
      setValue(`details.${index}.stock_remaining`, String(detail.stock_remaining));
      setValue(`details.${index}.selling_price`, String(detail.selling_price));
      setValue(`details.${index}.condition_price`, String(detail.condition_price));
    },
    [setValue],
  );

  const fetchDetailPrice = useCallback(
    async (
      index: number,
      fieldId: string,
      requestKey: string,
      params: { stock_id: string; stock_condition: string },
    ) => {
      try {
        const detail = await StockAPI.getStockPriceDetails(params);
        if (priceRequestKeysRef.current[fieldId] !== requestKey) return;

        setDetailPrice(index, detail);
      } catch (error) {
        console.error(error);
        if (priceRequestKeysRef.current[fieldId] === requestKey) {
          clearDetailPrice(index);
          setFormError("โหลดราคาสินค้าไม่สำเร็จ");
        }
      }
    },
    [clearDetailPrice, setDetailPrice],
  );

  useEffect(() => {
    if (!details) return;

    details.forEach((detail, index) => {
      const fieldId = fields[index]?.id;
      if (!fieldId) return;

      if (!detail.stock_id || !detail.stock_condition) {
        priceRequestKeysRef.current[fieldId] = "";
        clearDetailPrice(index);
        return;
      }

      const requestKey = `${detail.stock_id}:${detail.stock_condition}`;
      if (priceRequestKeysRef.current[fieldId] === requestKey) return;

      priceRequestKeysRef.current[fieldId] = requestKey;
      void fetchDetailPrice(index, fieldId, requestKey, {
        stock_id: detail.stock_id,
        stock_condition: conditionLabelsByValue[detail.stock_condition] ?? detail.stock_condition,
      });
    });
  }, [clearDetailPrice, conditionLabelsByValue, details, fetchDetailPrice, fields]);

  const addDetail = () => {
    append(createPurchaseOrderDetailFormRow(String(nextDetailIdRef.current++)));
  };

  const removeDetail = (index: number) => {
    if (fields.length === 1) {
      replace([createPurchaseOrderDetailFormRow(String(nextDetailIdRef.current++))]);
      priceRequestKeysRef.current = {};
      return;
    }

    const fieldId = fields[index]?.id;
    if (fieldId) delete priceRequestKeysRef.current[fieldId];
    remove(index);
  };

  const submitForm = async (formValues: PurchaseOrderFormValues) => {
    const details = formValues.details.filter((detail) => detail.stock_id);

    if (details.length === 0) {
      setFormError("กรุณาเพิ่มรายการสินค้า");
      return;
    }

    if (details.some((detail) => !detail.stock_id || !detail.stock_condition)) {
      setFormError("กรุณาเลือกสินค้าและสภาพสินค้าให้ครบ");
      return;
    }

    if (details.some((detail) => !isValidQuantity(detail.stock_qty))) {
      setFormError("กรุณากรอกจำนวนสินค้าให้ถูกต้อง");
      return;
    }

    if (details.some((detail) => detail.condition_price === "")) {
      setFormError("กรุณารอโหลดราคาสินค้าให้ครบ");
      return;
    }

    setIsSubmitting(true);
    setFormError(undefined);

    try {
      await StockAPI.createPurchaseOrder({
        issuer_name: formValues.issuer_name.trim(),
        supplier: formValues.supplier.trim(),
        remark: formValues.remark,
        stock_id: details.map((detail) => detail.stock_id),
        stock_qty: details.map((detail) => detail.stock_qty),
        stock_condition: details.map(
          (detail) => conditionLabelsByValue[detail.stock_condition] ?? detail.stock_condition,
        ),
      });

      toast.success("สั่งซื้อสินค้าสำเร็จ");
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error(error);
      const errorMessage = "สั่งซื้อสินค้าไม่สำเร็จ";
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    control,
    register,
    fields,
    details,
    transactionNumber,
    stockComboboxOptions,
    stockOptionLabelsById,
    orderedConditionOptions,
    isLoadingStockOptions,
    isLoadingPrerequisites,
    isLoadingTransactionNumber,
    isSubmitting,
    firstFieldError: getFirstFieldError(errors),
    formError,
    clearFormError,
    setStockSearchQuery,
    addDetail,
    removeDetail,
    handleSubmit: handleSubmit(submitForm),
  };
};

const getInitialPurchaseOrderFormValues = (): PurchaseOrderFormValues => ({
  issuer_name: "",
  supplier: "",
  stock_transaction_id: "",
  remark: "",
  details: [createPurchaseOrderDetailFormRow("1")],
});

const createPurchaseOrderDetailFormRow = (id: string) => ({
  id,
  stock_id: "",
  stock_condition: "",
  stock_qty: "1",
  stock_name: "",
  stock_remaining: "",
  selling_price: "",
  condition_price: "",
});

const isValidQuantity = (value: string) => {
  if (value === "") return false;

  const number = Number(value);
  return Number.isInteger(number) && number > 0;
};

const getFirstFieldError = (errors: unknown): string | undefined => {
  if (!errors || typeof errors !== "object") return undefined;

  for (const error of Object.values(errors)) {
    if (!error || typeof error !== "object") continue;
    if ("message" in error && typeof error.message === "string") return error.message;

    const nestedError = getFirstFieldError(error);
    if (nestedError) return nestedError;
  }

  return undefined;
};
