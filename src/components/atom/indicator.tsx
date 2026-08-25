import { type FC } from "react";

import { cn } from "@/lib/utils";

/** Props for the Indicator component. */
export interface IndicatorProps {
  size?: "sm" | "md" | "lg";
  color: "primary" | "secondary" | "success" | "warning" | "destructive" | "disabled" | "off";
}
/** Displays a small status dot with size and color variants. */
const Indicator: FC<IndicatorProps> = (props) => {
  const { size = "md", color = "primary" } = props;
  return (
    <div
      className={cn(
        "bg-primary size-4 shrink-0 rounded-full border border-solid border-transparent shadow-2xl",
        size === "sm" && "size-2",
        size === "lg" && "size-5",

        color === "secondary" && "bg-secondary border-border",
        color === "success" && "bg-success",
        color === "warning" && "bg-warning",
        color === "destructive" && "bg-destructive",
        color === "disabled" && "bg-muted border-border",
        color === "off" && "dark:border-border bg-black",
      )}
    />
  );
};

export default Indicator;
