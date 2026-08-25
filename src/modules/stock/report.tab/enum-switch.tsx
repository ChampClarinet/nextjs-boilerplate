"use client";

import type { FC } from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface EnumSwitchProps {
  label: string;
  checked: boolean;
  uncheckedLabel: string;
  checkedLabel: string;
  onCheckedChange: (checked: boolean) => void;
}

const EnumSwitch: FC<EnumSwitchProps> = ({
  label,
  checked,
  uncheckedLabel,
  checkedLabel,
  onCheckedChange,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-muted-foreground text-sm font-semibold">{label}</span>
    <span className="border-input flex h-9 items-center gap-3 rounded-lg border px-3">
      <span
        className={cn(
          "text-sm",
          !checked ? "text-foreground font-semibold" : "text-muted-foreground",
        )}
      >
        {uncheckedLabel}
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} size="sm" />
      <span
        className={cn(
          "text-sm",
          checked ? "text-foreground font-semibold" : "text-muted-foreground",
        )}
      >
        {checkedLabel}
      </span>
    </span>
  </label>
);

export default EnumSwitch;
