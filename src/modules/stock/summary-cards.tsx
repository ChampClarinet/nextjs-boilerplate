import { type FC } from "react";

import { type StockStats } from "@/apis/stock";
import { cn } from "@/lib/utils";

import { summaryCards } from "./config";

export interface SummaryCardsProps {
  stockStats: StockStats;
}
const SummaryCards: FC<SummaryCardsProps> = (props) => {
  const { stockStats } = props;
  return (
    <section className="grid grid-cols-2 gap-3 lg:gap-4 xl:grid-cols-4">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        const value = getSummaryCardValue(card.id, stockStats);

        return (
          <div key={card.label} className="border-border bg-card rounded-xl border p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-muted-foreground text-sm font-medium">{card.label}</p>
                <p className="text-card-foreground mt-3 text-2xl font-bold">{value}</p>
              </div>

              <div
                className={cn(
                  "bg-primary-soft text-primary flex size-10 shrink-0 items-center justify-center rounded-xl",
                  card.iconClassName,
                )}
              >
                <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default SummaryCards;

const getSummaryCardValue = (cardId: (typeof summaryCards)[number]["id"], stats: StockStats) => {
  if (cardId === "product-types") return stats.product_types;
  if (cardId === "total-items") return stats.total_items;
  if (cardId === "borrowed") return stats.borrowed;
  return stats.below_minimum;
};
