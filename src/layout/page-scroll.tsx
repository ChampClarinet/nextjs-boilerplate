import { type FC, type ReactNode } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type PageScrollMode = "y" | "x" | "xy" | "none";

export type PageScrollProps = {
  children: ReactNode;
  mode?: PageScrollMode;
  padding?: boolean;
  className?: string;
  contentClassName?: string;
};

export const PageScroll: FC<PageScrollProps> = ({
  children,
  mode = "y",
  padding = false,
  className,
  contentClassName,
}) => {
  const content = (
    <div
      className={cn(
        padding && "p-4",
        // สำหรับ horizontal scroll ให้ content กว้างเกินได้
        (mode === "x" || mode === "xy") && "min-w-max",
        contentClassName,
      )}
    >
      {children}
    </div>
  );

  if (mode === "none") {
    return (
      <div className={cn("h-full overflow-hidden", padding && "p-4", className)}>{children}</div>
    );
  }

  if (mode === "x") {
    return (
      <ScrollArea className={cn("h-full", className)}>
        {content}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  if (mode === "xy") {
    return (
      <ScrollArea className={cn("h-full", className)}>
        {content}
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  // default: y
  return (
    <ScrollArea className={cn("h-full", className)}>
      {content}
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};
