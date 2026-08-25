import { type FC } from "react";
import type { Control, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { PO, StockEmployee } from "@/apis/stock";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { DepartmentOption as IDepartmentOption } from "../hooks/use-departments";
import type { StockTransactionFormValues, StockTransactionMode } from "../stock.types";
import { DELIVERY_STATUS_OPTIONS, STOCK_ENTRY_TYPES_BY_MODE } from "./constants";
import StockAutocomplete from "./stock-autocomplete";
import type { AutocompleteOption } from "./types";

export interface InfoFieldsProps {
  control: Control<StockTransactionFormValues>;
  register: UseFormRegister<StockTransactionFormValues>;
  values: Pick<Partial<StockTransactionFormValues>, "stock_transaction_id">;
  mode: StockTransactionMode;
  employeeOptions: StockEmployee[];
  departmentOptions: IDepartmentOption[];
  poOptions: PO[];
  employeeComboboxOptions: AutocompleteOption[];
  departmentComboboxOptions: AutocompleteOption[];
  poComboboxOptions: AutocompleteOption[];
  employeeOptionLabelsById: Record<string, string>;
  departmentOptionLabelsById: Record<string, string>;
  poOptionLabelsById: Record<string, string>;
  isLoadingEmployeeOptions: boolean;
  isLoadingDepartmentOptions: boolean;
  isLoadingPO: boolean;
  isLoadingTransactionNumber: boolean;
  shouldShowEntryTypeSelect: boolean;
  shouldShowDepartment: boolean;
  shouldShowPO: boolean;
  setEmployeeSearchQuery: (value: string) => void;
  setDepartmentSearchQuery: (value: string) => void;
  setPOSearchQuery: (value: string) => void;
  handleEntryTypeChange: (stockEntryType: string | null) => void;
  clearFormError: () => void;
}
const InfoFields: FC<InfoFieldsProps> = ({
  control,
  register,
  values,
  mode,
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
  clearFormError,
}) => (
  <div className="grid gap-4 md:grid-cols-2">
    <label className="grid gap-2">
      <span className="text-muted-foreground text-sm font-semibold">พนักงาน</span>
      <Controller
        control={control}
        name="employee_id"
        rules={{ required: "กรุณาเลือกพนักงาน" }}
        render={({ field }) => (
          <StockAutocomplete
            value={field.value}
            options={employeeComboboxOptions}
            placeholder="เลือกพนักงาน"
            noDataPlaceholder="ไม่พบพนักงาน"
            selectedLabel={employeeOptionLabelsById[field.value]}
            isLoading={isLoadingEmployeeOptions}
            className="w-full"
            onSearchChange={setEmployeeSearchQuery}
            onChange={(value) => {
              field.onChange(value);
              clearFormError();
            }}
            onRenderOption={(option) => {
              const employee = employeeOptions.find(
                (employee) => employee.employee_id === option.value,
              );

              if (!employee) {
                return <span className="min-w-0 truncate">{option.label}</span>;
              }

              return (
                <span className="grid min-w-0 gap-1 text-left">
                  <span className="truncate font-semibold">{employee.employee_name}</span>
                  <span className="text-muted-foreground truncate">{employee.employee_id}</span>
                </span>
              );
            }}
          />
        )}
      />
    </label>

    {shouldShowEntryTypeSelect && (
      <label className="grid gap-2">
        <span className="text-muted-foreground text-sm font-semibold">ประเภทรายการ</span>
        <Controller
          control={control}
          name="stock_entry_type"
          rules={{ required: "กรุณาเลือกประเภทรายการ" }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={handleEntryTypeChange}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue>{(value) => (value ? String(value) : "")}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {STOCK_ENTRY_TYPES_BY_MODE[mode].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </label>
    )}

    <label className="grid gap-2">
      <span className="text-muted-foreground text-sm font-semibold">เลขที่รายการ</span>
      <Input
        value={isLoadingTransactionNumber ? "กำลังโหลด..." : values.stock_transaction_id}
        disabled
      />
    </label>

    {shouldShowPO && (
      <label className="grid gap-2">
        <span className="text-muted-foreground text-sm font-semibold">PO</span>
        <Controller
          control={control}
          name="po_number"
          rules={{ required: "กรุณาเลือก PO" }}
          render={({ field }) => (
            <StockAutocomplete
              value={field.value}
              options={poComboboxOptions}
              placeholder={isLoadingPO ? "กำลังโหลด PO..." : "เลือก PO"}
              noDataPlaceholder="ไม่พบ PO"
              selectedLabel={poOptionLabelsById[field.value]}
              isLoading={isLoadingPO}
              className="w-full"
              onSearchChange={setPOSearchQuery}
              onChange={(value) => {
                field.onChange(value);
                clearFormError();
              }}
              onRenderOption={(option) => {
                const po = poOptions.find((po) => po.po_id === option.value);

                if (!po) {
                  return <span className="min-w-0 truncate">{option.label}</span>;
                }

                return (
                  <span className="grid min-w-0 gap-1 text-left">
                    <span className="truncate font-semibold">{po.po_number}</span>
                    <span className="text-muted-foreground truncate">{po.po_id}</span>
                  </span>
                );
              }}
            />
          )}
        />
      </label>
    )}

    {shouldShowDepartment && (
      <label className="grid gap-2">
        <span className="text-muted-foreground text-sm font-semibold">สังกัดของพนักงาน</span>
        <Controller
          control={control}
          name="department"
          rules={{ required: "กรุณาเลือกสังกัด" }}
          render={({ field }) => (
            <StockAutocomplete
              value={field.value}
              options={departmentComboboxOptions}
              placeholder="เลือกสังกัด"
              noDataPlaceholder="ไม่พบสังกัด"
              selectedLabel={departmentOptionLabelsById[field.value]}
              isLoading={isLoadingDepartmentOptions}
              className="w-full"
              onSearchChange={setDepartmentSearchQuery}
              onChange={(value) => {
                field.onChange(value);
                clearFormError();
              }}
              onRenderOption={(option) => {
                const department = departmentOptions.find(
                  (department) => department.department_id === option.value,
                );

                return (
                  <span className="min-w-0 truncate">
                    {department?.department_id ?? option.label}
                  </span>
                );
              }}
            />
          )}
        />
      </label>
    )}

    <label className="grid gap-2">
      <span className="text-muted-foreground text-sm font-semibold">
        ผู้รับคืน/เจ้าหน้าที่ธุรการ/ผู้จ่ายอุปกรณ์
      </span>
      <Input
        {...register("issuer_name", {
          onChange: clearFormError,
          validate: (value) => Boolean(value.trim()) || "กรุณากรอกผู้รับ",
        })}
        placeholder="กรอกชื่อผู้รับ"
      />
    </label>

    <label className="grid gap-2">
      <span className="text-muted-foreground text-sm font-semibold">สถานะการส่ง</span>
      <Controller
        control={control}
        name="delivery_status"
        rules={{ required: "กรุณาเลือกสถานะการส่ง" }}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value ?? "");
              clearFormError();
            }}
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue>{(value) => (value ? String(value) : "")}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {DELIVERY_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </label>
  </div>
);

export default InfoFields;
