"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/** Props for the LoadingDialog component. */
export interface LoadingDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** Renders a modal dialog with a spinner and loading message. */
export default function LoadingDialog({
  open,
  title = "Loading",
  message = "Please wait...",
  onOpenChange,
  className,
}: LoadingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-sm [&>button]:hidden", className)}>
        <DialogHeader className="items-center space-y-3 text-center">
          <Spinner className="size-6" />
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
