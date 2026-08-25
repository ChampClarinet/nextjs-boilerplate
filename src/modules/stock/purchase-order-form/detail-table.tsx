import { type FC } from "react";
import type { Control, FieldArrayWithId, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { StockConditionOption } from "@/apis/stock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

import { CONDITION_NONE_VALUE } from "../stock-transaction-form/constants";
import {
  formatDisplayNumber,
  formatMoney,
  formatMoneyValue,
  getConditionLabel,
  getNetPrice,
} from "../stock-transaction-form/format";
import StockAutocomplete from "../stock-transaction-form/stock-autocomplete";
import type { AutocompleteOption } from "../stock-transaction-form/types";
import type { PurchaseOrderDetailFormRow, PurchaseOrderFormValues } from "./types";

interface PurchaseOrderDetailTableProps {
  control: Control<PurchaseOrderFormValues>;
  fields: FieldArrayWithId<PurchaseOrderFormValues, "details", "id">[];
  details?: PurchaseOrderDetailFormRow[];
  stockComboboxOptions: AutocompleteOption[];
  stockOptionLabelsById: Record<string, string>;
  orderedConditionOptions: StockConditionOption[];
  isLoadingStockOptions: boolean;
  setStockSearchQuery: (value: string) => void;
  clearFormError: () => void;
  removeDetail: (index: number) => void;
  addDetail: () => void;
  register: UseFormRegister<PurchaseOrderFormValues>;
}

const PurchaseOrderDetailTable: FC<PurchaseOrderDetailTableProps> = ({
  control,
  fields,
  details,
  stockComboboxOptions,
  stockOptionLabelsById,
  orderedConditionOptions,
  isLoadingStockOptions,
  setStockSearchQuery,
  clearFormError,
  removeDetail,
  addDetail,
  register,
}) => (
  <div className="grid gap-2">
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground text-sm font-semibold">รายละเอียดสินค้า</span>
      <Button type="button" variant="outline" size="sm" onClick={addDetail}>
        <Plus aria-hidden="true" className="size-4" />
        เพิ่มรายการ
      </Button>
    </div>

    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-250 border-collapse text-left text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-3 py-3 font-semibold">ชื่อสินค้า</th>
            <th className="px-3 py-3 font-semibold">สภาพสินค้า</th>
            <th className="px-3 py-3 font-semibold">stock คงเหลือ</th>
            <th className="px-3 py-3 font-semibold">จำนวนสินค้า</th>
            <th className="px-3 py-3 font-semibold">ราคาสินค้า</th>
            <th className="px-3 py-3 font-semibold">ราคาสินค้าตามสภาพ</th>
            <th className="px-3 py-3 font-semibold">ราคาสุทธิ</th>
            <th className="w-12 px-3 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {fields.map((field, index) => {
            const detail = details?.[index];
            const netPrice = getNetPrice(detail?.stock_qty ?? "", detail?.condition_price ?? "");

            return (
              <tr key={field.id}>
                <td className="px-3 py-3">
                  <Controller
                    control={control}
                    name={`details.${index}.stock_id`}
                    rules={{ required: "กรุณาเลือกสินค้า" }}
                    render={({ field }) => (
                      <StockAutocomplete
                        value={field.value}
                        options={stockComboboxOptions}
                        placeholder="เลือกสินค้า"
                        noDataPlaceholder={isLoadingStockOptions ? "กำลังโหลด..." : "ไม่พบสินค้า"}
                        selectedLabel={stockOptionLabelsById[field.value]}
                        isLoading={isLoadingStockOptions}
                        className="w-55"
                        onSearchChange={setStockSearchQuery}
                        onChange={(value) => {
                          field.onChange(value);
                          clearFormError();
                        }}
                      />
                    )}
                  />
                </td>
                <td className="px-3 py-3">
                  <Controller
                    control={control}
                    name={`details.${index}.stock_condition`}
                    rules={{ required: "กรุณาเลือกสภาพสินค้า" }}
                    render={({ field }) => (
                      <Select
                        value={field.value || CONDITION_NONE_VALUE}
                        onValueChange={(value) => {
                          field.onChange(!value || value === CONDITION_NONE_VALUE ? "" : value);
                          clearFormError();
                        }}
                      >
                        <SelectTrigger className="h-9 w-56">
                          <SelectValue placeholder="เลือกสภาพสินค้า">
                            {(value) =>
                              value && value !== CONDITION_NONE_VALUE
                                ? getConditionLabel(String(value), orderedConditionOptions)
                                : "ไม่เลือก"
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CONDITION_NONE_VALUE}>ไม่เลือก</SelectItem>
                          {orderedConditionOptions.map((condition) => (
                            <SelectItem
                              key={condition.condition_value}
                              value={String(condition.condition_value)}
                            >
                              {condition.condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </td>
                <td className="text-muted-foreground px-3 py-3">
                  {formatDisplayNumber(detail?.stock_remaining ?? "")}
                </td>
                <td className="px-3 py-3">
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    className="w-28"
                    {...register(`details.${index}.stock_qty`, {
                      onChange: clearFormError,
                      validate: (value) => {
                        const number = Number(value);
                        return (Number.isInteger(number) && number > 0) || "กรุณากรอกจำนวนสินค้า";
                      },
                    })}
                  />
                </td>
                <td className="text-muted-foreground px-3 py-3">
                  {formatMoneyValue(detail?.selling_price ?? "")}
                </td>
                <td className="text-muted-foreground px-3 py-3">
                  {formatMoneyValue(detail?.condition_price ?? "")}
                </td>
                <td className="text-muted-foreground px-3 py-3">{formatMoney(netPrice)}</td>
                <td className="px-3 py-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeDetail(index)}
                  >
                    <Trash2 aria-hidden="true" className="text-destructive size-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default PurchaseOrderDetailTable;
