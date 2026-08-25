import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import type { PO, StockPriceDetail } from "@/apis/stock";
import StockAPI from "@/apis/stock";
import type { DeliveryStatus } from "@/apis/stock";
import { toast } from "sonner";

import { useDepartments } from "../hooks/use-departments";
import { useEmployees } from "../hooks/use-employees";
import { useStockConditions } from "../hooks/use-stock-conditions";
import { useStockQuery } from "../hooks/use-stock-query";
import type { StockTransactionFormValues, StockTransactionMode } from "../stock.types";
import {
  STOCK_ENTRY_TYPES_BY_MODE,
  STOCK_ENTRY_TYPE_GIR_BORROW,
  STOCK_ENTRY_TYPE_KEY_IN,
  createStockTransactionDetailFormRow,
  getInitialStockTransactionFormValues,
  getModeLabel,
  getStockFlow,
} from "./constants";
import { getFirstFieldError, isAmountHigherThanRemaining, isValidAmount } from "./format";

interface UseStockTransactionFormParams {
  mode: StockTransactionMode;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const useStockTransactionForm = ({
  mode,
  onCancel,
  onSuccess,
}: UseStockTransactionFormParams) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<StockTransactionFormValues>({
    defaultValues: getInitialStockTransactionFormValues(mode),
  });
  const { append, fields, remove, replace } = useFieldArray({
    control,
    name: "details",
  });
  const nextDetailIdRef = useRef(2);
  const priceRequestKeysRef = useRef<Record<string, string>>({});
  const [poOptions, setPOOptions] = useState<PO[]>([]);
  const [stockOptionLabelsById, setStockOptionLabelsById] = useState<Record<string, string>>({});
  const [employeeOptionLabelsById, setEmployeeOptionLabelsById] = useState<Record<string, string>>(
    {},
  );
  const [departmentOptionLabelsById, setDepartmentOptionLabelsById] = useState<
    Record<string, string>
  >({});
  const [poOptionLabelsById, setPOOptionLabelsById] = useState<Record<string, string>>({});
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState("");
  const [poSearchQuery, setPOSearchQuery] = useState("");
  const [isLoadingPO, setIsLoadingPO] = useState(false);
  const [isLoadingTransactionNumber, setIsLoadingTransactionNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const values = useWatch({ control });
  const details = useWatch({ control, name: "details" });
  const stockEntryType = values.stock_entry_type ?? "";
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
  const {
    data: employeeOptions,
    isLoading: isLoadingEmployeeOptions,
    error: employeeOptionsError,
  } = useEmployees(employeeSearchQuery);
  const {
    data: departmentOptions,
    isLoading: isLoadingDepartmentOptions,
    error: departmentOptionsError,
  } = useDepartments(departmentSearchQuery);
  const isLoadingPrerequisites =
    (isLoadingStockOptions && stockOptions.length === 0) ||
    (isLoadingStockConditions && conditionOptions.length === 0);
  const stockComboboxOptions = useMemo(
    () => stockOptions.map((stock) => ({ value: stock.stock_id, label: stock.stock_name })),
    [stockOptions],
  );
  const employeeComboboxOptions = useMemo(
    () =>
      employeeOptions.map((employee) => ({
        value: employee.employee_id,
        label: `${employee.employee_name} ${employee.employee_id}`,
      })),
    [employeeOptions],
  );
  const departmentComboboxOptions = useMemo(
    () =>
      departmentOptions.map((department) => ({
        value: department.department_id,
        label: department.department_id,
      })),
    [departmentOptions],
  );
  const poComboboxOptions = useMemo(
    () =>
      poOptions.map((po) => ({
        value: po.po_id,
        label: `${po.po_number} ${po.po_id}`,
      })),
    [poOptions],
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
  const modeLabel = getModeLabel(mode);
  const shouldShowPO = stockEntryType === STOCK_ENTRY_TYPE_KEY_IN;
  const shouldShowDepartment = stockEntryType === STOCK_ENTRY_TYPE_GIR_BORROW;
  const shouldShowEntryTypeSelect = STOCK_ENTRY_TYPES_BY_MODE[mode].length > 1;

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
    setEmployeeOptionLabelsById((current) => {
      let didChange = false;
      const next = { ...current };

      employeeOptions.forEach((option) => {
        if (next[option.employee_id] === option.employee_name) return;
        next[option.employee_id] = option.employee_name;
        didChange = true;
      });

      return didChange ? next : current;
    });
  }, [employeeOptions]);

  useEffect(() => {
    setDepartmentOptionLabelsById((current) => {
      let didChange = false;
      const next = { ...current };

      departmentOptions.forEach((option) => {
        if (next[option.department_id] === option.department_id) return;
        next[option.department_id] = option.department_id;
        didChange = true;
      });

      return didChange ? next : current;
    });
  }, [departmentOptions]);

  const updatePOOptions = useCallback((nextOptions: PO[]) => {
    setPOOptions(nextOptions);
    setPOOptionLabelsById((current) => {
      let didChange = false;
      const next = { ...current };

      nextOptions.forEach((option) => {
        if (next[option.po_id] === option.po_number) return;
        next[option.po_id] = option.po_number;
        didChange = true;
      });

      return didChange ? next : current;
    });
  }, []);

  useEffect(() => {
    setValue("stock_entry_type", STOCK_ENTRY_TYPES_BY_MODE[mode][0]);
    setValue("stock_flow", getStockFlow(mode));
    setValue("stock_transaction_id", "");
    setValue("po_number", "");
    setValue("department", "");
    setValue("reason", "");
    replace([createStockTransactionDetailFormRow("1")]);
    nextDetailIdRef.current = 2;
    priceRequestKeysRef.current = {};
  }, [mode, replace, setValue]);

  useEffect(() => {
    const nextError =
      stockOptionsError ?? conditionOptionsError ?? employeeOptionsError ?? departmentOptionsError;
    if (nextError) setFormError(nextError);
  }, [conditionOptionsError, departmentOptionsError, employeeOptionsError, stockOptionsError]);

  useEffect(() => {
    let isMounted = true;

    const fetchTransactionNumber = async () => {
      setIsLoadingTransactionNumber(true);

      try {
        const response = await StockAPI.getStockTransactionNumber({
          stock_entry_type: stockEntryType,
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

    if (stockEntryType) void fetchTransactionNumber();

    return () => {
      isMounted = false;
    };
  }, [setValue, stockEntryType]);

  useEffect(() => {
    let isMounted = true;

    if (!shouldShowPO) {
      setValue("po_number", "");
      setPOSearchQuery("");
      updatePOOptions([]);
      return () => {
        isMounted = false;
      };
    }

    const fetchPOList = async () => {
      setIsLoadingPO(true);

      try {
        const poFilter = poSearchQuery.trim();
        const response = await StockAPI.getPOList(poFilter ? { po_filter: poFilter } : {});
        if (!isMounted) return;

        updatePOOptions(response?.data ?? []);
      } catch (error) {
        console.error(error);
        if (isMounted) setFormError("โหลดรายการ PO ไม่สำเร็จ");
      } finally {
        if (isMounted) setIsLoadingPO(false);
      }
    };

    void fetchPOList();

    return () => {
      isMounted = false;
    };
  }, [poSearchQuery, setValue, shouldShowPO, updatePOOptions]);

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

      if (!detail.stock_id || !detail.condition_value) {
        priceRequestKeysRef.current[fieldId] = "";
        clearDetailPrice(index);
        return;
      }

      const requestKey = `${detail.stock_id}:${detail.condition_value}`;
      if (priceRequestKeysRef.current[fieldId] === requestKey) return;

      priceRequestKeysRef.current[fieldId] = requestKey;
      void fetchDetailPrice(index, fieldId, requestKey, {
        stock_id: detail.stock_id,
        stock_condition: conditionLabelsByValue[detail.condition_value] ?? detail.condition_value,
      });
    });
  }, [clearDetailPrice, conditionLabelsByValue, details, fetchDetailPrice, fields]);

  const addDetail = () => {
    append(createStockTransactionDetailFormRow(String(nextDetailIdRef.current++)));
  };

  const removeDetail = (index: number) => {
    if (fields.length === 1) {
      replace([createStockTransactionDetailFormRow(String(nextDetailIdRef.current++))]);
      priceRequestKeysRef.current = {};
      return;
    }

    const fieldId = fields[index]?.id;
    if (fieldId) delete priceRequestKeysRef.current[fieldId];
    remove(index);
  };

  const handleEntryTypeChange = (stockEntryType: string | null) => {
    if (!stockEntryType) return;

    setValue("stock_entry_type", stockEntryType, { shouldDirty: true, shouldValidate: true });
    setValue("stock_flow", getStockFlow(mode));
    if (stockEntryType !== STOCK_ENTRY_TYPE_GIR_BORROW) setValue("department", "");
    clearFormError();
  };

  const submitForm = async (formValues: StockTransactionFormValues) => {
    const details = formValues.details.filter((detail) => detail.stock_id);

    if (details.length === 0) {
      setFormError("กรุณาเพิ่มรายการสินค้า");
      return;
    }

    if (details.some((detail) => !detail.stock_id || !detail.condition_value)) {
      setFormError("กรุณาเลือกสินค้าและสภาพสินค้าให้ครบ");
      return;
    }

    if (details.some((detail) => !isValidAmount(detail.quantity))) {
      setFormError("กรุณากรอกจำนวนสินค้าให้ถูกต้อง");
      return;
    }

    if (details.some((detail) => isAmountHigherThanRemaining(detail))) {
      setFormError("จำนวนสินค้าต้องไม่มากกว่า stock คงเหลือ");
      return;
    }

    if (details.some((detail) => detail.condition_price === "")) {
      setFormError("กรุณารอโหลดราคาสินค้าให้ครบ");
      return;
    }

    if (formValues.stock_entry_type === STOCK_ENTRY_TYPE_KEY_IN && !formValues.po_number) {
      setFormError("กรุณาเลือก PO");
      return;
    }

    setIsSubmitting(true);
    setFormError(undefined);

    const params = {
      stock_id: details.map((detail) => detail.stock_id),
      stock_condition: details.map(
        (detail) => conditionLabelsByValue[detail.condition_value] ?? detail.condition_value,
      ),
      borrow_amount: details.map((detail) => Number(detail.quantity)),
      stock_entry_type: formValues.stock_entry_type,
      delivery_status: formValues.delivery_status as DeliveryStatus,
      issuer_name: formValues.issuer_name.trim(),
      employee_id: formValues.employee_id,
      department: shouldShowDepartment ? formValues.department : undefined,
      remark: formValues.remark,
    };

    try {
      if (mode === "borrow") {
        await StockAPI.borrowStock(params);
      } else {
        await StockAPI.returnStock({
          ...params,
          reason: formValues.reason,
          po_number:
            formValues.stock_entry_type === STOCK_ENTRY_TYPE_KEY_IN
              ? formValues.po_number
              : undefined,
        });
      }

      toast.success(`${modeLabel}สำเร็จ`);
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error(error);
      const errorMessage = `${modeLabel}ไม่สำเร็จ`;
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
    values,
    stockComboboxOptions,
    stockOptionLabelsById,
    orderedConditionOptions,
    isLoadingStockOptions,
    setStockSearchQuery,
    clearFormError,
    removeDetail,
    addDetail,
    employeeOptions,
    departmentOptions,
    poOptions,
    employeeComboboxOptions,
    departmentComboboxOptions,
    poComboboxOptions,
    employeeOptionLabelsById,
    departmentOptionLabelsById,
    poOptionLabelsById,
    isLoadingEmployeeOptions,
    isLoadingDepartmentOptions,
    isLoadingPO,
    isLoadingTransactionNumber,
    shouldShowEntryTypeSelect,
    shouldShowDepartment,
    shouldShowPO,
    setEmployeeSearchQuery,
    setDepartmentSearchQuery,
    setPOSearchQuery,
    handleEntryTypeChange,
    isLoadingPrerequisites,
    isSubmitting,
    modeLabel,
    firstFieldError: getFirstFieldError(errors),
    formError,
    handleSubmit: handleSubmit(submitForm),
  };
};
