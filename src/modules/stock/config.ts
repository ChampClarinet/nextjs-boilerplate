import {
  AlertTriangle,
  ArrowLeftRight,
  Boxes,
  ChartColumn,
  PackagePlus,
  ShieldCheck,
} from "lucide-react";

export type StockTab = "stock" | "stock_transaction" | "stock_report";

export const summaryCards = [
  {
    id: "product-types",
    label: "ประเภทสินค้า",
    icon: PackagePlus,
    iconClassName: "bg-primary-soft text-primary",
  },
  {
    id: "total-items",
    label: "จำนวนสินค้าทั้งหมด",
    icon: Boxes,
    iconClassName: "bg-muted text-foreground",
  },
  {
    id: "borrowed",
    label: "ถูกยืมไป",
    icon: ShieldCheck,
    iconClassName: "bg-warning-soft text-warning",
  },
  {
    id: "below-minimum",
    label: "คงเหลือต่ำกว่าขั้นต่ำ",
    icon: AlertTriangle,
    iconClassName: "bg-destructive-soft text-destructive",
  },
] as const;

export const stockTabs = [
  { id: "stock", label: "สต็อก", icon: Boxes, disabled: false },
  { id: "stock_transaction", label: "สินค้าเข้าออก", icon: ArrowLeftRight, disabled: false },
  { id: "stock_report", label: "รายงานสต็อก", icon: ChartColumn, disabled: false },
] as const;
