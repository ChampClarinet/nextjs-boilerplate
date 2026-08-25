"use client";

import type { FC, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

/** Semantic variants for the ToggleBadge component. */
export type ToggleType = "success" | "warning" | "destructive" | "default";
/** Props for the ToggleBadge component. */
interface ToggleProps {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  badgeType?: ToggleType;
  className?: string;
}

const badgeColorClass: Record<ToggleType, string> = {
  default: "bg-primary hover:bg-primary/90 text-primary-foreground",
  success: "bg-success hover:bg-success/90 text-white",
  warning: "bg-warning hover:bg-warning/90 text-white",
  destructive: "bg-destructive hover:bg-destructive/90 text-white", // ใช้ variant destructive ของ shadcn
};

const badgeTextClass: Record<ToggleType, string> = {
  default: "text-primary ring-primary",
  success: "text-success ring-success",
  warning: "text-warning ring-warning",
  destructive: "text-destructive ring-destructive",
};

/** Renders a pill-shaped toggle button with semantic styling. */
export const ToggleBadge: FC<PropsWithChildren<ToggleProps>> = ({
  checked,
  onCheckedChange,
  badgeType = "default",
  className,
  children,
}) => {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "h-8 cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition",
        "shadow-sm select-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        checked
          ? cn(
              "text-primary-foreground",
              badgeType === "destructive"
                ? "bg-destructive hover:bg-destructive/90"
                : badgeColorClass[badgeType],
            )
          : cn(
              "text-muted-foreground ring-border hover:bg-muted bg-transparent ring-1",
              badgeTextClass[badgeType],
            ),
        className,
      )}
    >
      {children}
    </button>
  );
};
