import type { StockConditionOption } from "@/apis/stock";

import type { StockTransactionDetailFormRow } from "../stock.types";

export const getConditionLabel = (
  conditionValue: string,
  conditionOptions: StockConditionOption[],
) => {
  return (
    conditionOptions.find((condition) => String(condition.condition_value) === conditionValue)
      ?.condition ?? conditionValue
  );
};

export const isValidAmount = (value: string) => {
  if (value === "") return false;

  const number = Number(value);
  return Number.isInteger(number) && number >= 0;
};

export const validateAmount = (value: string, remainingValue: string) => {
  if (!isValidAmount(value)) return false;
  return !isAmountHigherThanRemaining({
    stock_remaining: remainingValue,
    quantity: value,
  });
};

export const isAmountHigherThanRemaining = (
  detail: Pick<StockTransactionDetailFormRow, "quantity" | "stock_remaining">,
) => {
  if (detail.stock_remaining === "") return false;

  const quantity = Number(detail.quantity);
  const remaining = Number(detail.stock_remaining);

  return Number.isFinite(quantity) && Number.isFinite(remaining) && quantity > remaining;
};

export const getNetPrice = (quantity: string, conditionPrice: string) => {
  const amount = Number(quantity);
  const price = Number(conditionPrice);

  if (!Number.isFinite(amount) || !Number.isFinite(price)) return 0;
  return amount * price;
};

export const formatDisplayNumber = (value: string) => {
  if (value === "") return "-";
  return value;
};

export const formatMoneyValue = (value: string) => {
  if (value === "") return "-";
  return formatMoney(Number(value));
};

export const formatMoney = (value: number) => {
  return new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
};

export const getFirstFieldError = (errors: unknown): string | undefined => {
  if (!errors || typeof errors !== "object") return undefined;

  for (const error of Object.values(errors)) {
    if (!error || typeof error !== "object") continue;
    if ("message" in error && typeof error.message === "string") return error.message;

    const nestedError = getFirstFieldError(error);
    if (nestedError) return nestedError;
  }

  return undefined;
};
