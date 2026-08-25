"use client";

import { type ComponentProps, type FC, useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Activity, PackageSearch } from "lucide-react";

import BorrowDialog from "./borrow.dialog";
import { type StockTab, stockTabs } from "./config";
import CreateStockDialog from "./create-stock.dialog";
import Header from "./header";
import { useStockStats } from "./hooks/use-stock-stats";
import PurchaseOrderDialog from "./purchase-order.dialog";
import StockReportTabContent from "./report.tab";
import StockTransactionReportTabContent from "./report.tab/stock-transaction-report";
import ReturnDialog from "./return.dialog";
import StockTabContent from "./stock.tab";
import type { StockTransactionMode } from "./stock.types";
import SummaryCards from "./summary-cards";
import StockTransactionTabContent from "./transaction.tab";

const StockModule: FC = () => {
  const [activeTab, setActiveTab] = useState<StockTab>("stock");
  const [activeReportTab, setActiveReportTab] = useState<StockReportTab>("stock");
  const [isCreateStockOpen, setIsCreateStockOpen] = useState(false);
  const [isStockActionOpen, setIsStockActionOpen] = useState(false);
  const [stockTransactionMode, setStockTransactionMode] = useState<
    StockTransactionMode | undefined
  >();
  const [refreshKey, setRefreshKey] = useState(0);
  const stockStats = useStockStats(refreshKey);

  const refetchStock = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  const handleStockActionSelect = (action: StockAction) => {
    setIsStockActionOpen(false);

    if (action === "create") {
      setIsCreateStockOpen(true);
      return;
    }

    setStockTransactionMode(action);
  };

  return (
    <div className="flex flex-col gap-6">
      <Header onActionButtonClick={() => setIsStockActionOpen(true)} />

      <SummaryCards stockStats={stockStats} />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as StockTab)}>
        <TabsList className="bg-card grid h-auto! w-full grid-cols-1 rounded-2xl border p-1 shadow-sm md:grid-cols-3">
          {stockTabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <TabsTrigger
                key={tab.label}
                value={tab.id}
                disabled={tab.disabled}
                className={cn(
                  "flex h-12 items-center justify-center gap-2 rounded-xl text-base font-semibold transition-colors",
                  "text-muted-foreground hover:bg-muted hover:text-foreground data-active:bg-background data-active:text-foreground data-active:shadow-sm",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {activeTab === "stock" ? (
        <StockTabContent refreshKey={refreshKey} onStockChanged={refetchStock} />
      ) : null}
      {activeTab === "stock_transaction" ? (
        <StockTransactionTabContent refreshKey={refreshKey} />
      ) : null}
      {activeTab === "stock_report" ? (
        <Tabs
          value={activeReportTab}
          onValueChange={(value) => setActiveReportTab(value as StockReportTab)}
          className="gap-6"
        >
          <TabsList className="bg-card/70 grid h-auto! w-full grid-cols-2 rounded-xl border p-0.75 shadow-sm">
            {stockReportTabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground data-active:bg-background data-active:text-foreground flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors data-active:shadow-sm"
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="stock" className="flex flex-col gap-6">
            <StockReportTabContent
              enabled={activeTab === "stock_report" && activeReportTab === "stock"}
              refreshKey={refreshKey}
            />
          </TabsContent>
          <TabsContent value="stock_transaction" className="flex flex-col gap-6">
            <StockTransactionReportTabContent
              enabled={activeTab === "stock_report" && activeReportTab === "stock_transaction"}
              refreshKey={refreshKey}
            />
          </TabsContent>
        </Tabs>
      ) : null}

      <CreateStockDialog
        open={isCreateStockOpen}
        onOpenChange={setIsCreateStockOpen}
        onSuccess={refetchStock}
      />

      <BorrowDialog
        open={stockTransactionMode === "borrow"}
        onOpenChange={(open) => !open && setStockTransactionMode(undefined)}
        onSuccess={refetchStock}
      />
      <ReturnDialog
        open={stockTransactionMode === "return" || stockTransactionMode === "keyin"}
        mode={
          stockTransactionMode === "return" || stockTransactionMode === "keyin"
            ? stockTransactionMode
            : undefined
        }
        onOpenChange={(open) => !open && setStockTransactionMode(undefined)}
        onSuccess={refetchStock}
      />
      <PurchaseOrderDialog
        open={stockTransactionMode === "po"}
        onOpenChange={(open) => !open && setStockTransactionMode(undefined)}
        onSuccess={refetchStock}
      />

      <Dialog open={isStockActionOpen} onOpenChange={setIsStockActionOpen}>
        <DialogContent className="gap-5 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>เลือกประเภทรายการ</DialogTitle>
            <DialogDescription>เลือกงานที่ต้องการทำกับสต็อกสินค้า</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            {stockActions.map((action) => (
              <Button
                key={action.id}
                type="button"
                variant={action.variant}
                size="lg"
                disabled={action.disabled}
                className="h-12 justify-start px-4 text-base"
                onClick={() => handleStockActionSelect(action.id)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockModule;

type StockAction = "create" | StockTransactionMode;
type StockReportTab = "stock" | "stock_transaction";

const stockActions = [
  { id: "create", label: "เพิ่มสินค้า", variant: "default", disabled: false },
  { id: "borrow", label: "ยืมสินค้า", variant: "destructive", disabled: false },
  { id: "return", label: "คืนสินค้า", variant: "success", disabled: false },
  { id: "keyin", label: "คีย์ของเข้าระบบ", variant: "warning", disabled: false },
  { id: "po", label: "สั่งซื้อสินค้า", variant: "outline", disabled: false },
] satisfies {
  id: StockAction;
  label: string;
  variant: NonNullable<ComponentProps<typeof Button>["variant"]>;
  disabled?: boolean;
}[];

const stockReportTabs = [
  { id: "stock", label: "สต็อก", icon: PackageSearch },
  { id: "stock_transaction", label: "การเคลื่อนไหว", icon: Activity },
] satisfies { id: StockReportTab; label: string; icon: typeof PackageSearch }[];
