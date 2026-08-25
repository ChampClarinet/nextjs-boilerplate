"use client";

import { useEffect, useState } from "react";

import StockAPI from "@/apis/stock";
import type { StockStats } from "@/apis/stock";

const DEFAULT_STOCK_STATS: StockStats = {
  product_types: 0,
  total_items: 0,
  borrowed: 0,
  below_minimum: 0,
};

export const useStockStats = (refreshKey = 0) => {
  const [data, setData] = useState<StockStats>(DEFAULT_STOCK_STATS);

  useEffect(() => {
    let isMounted = true;

    const fetchStockStats = async () => {
      try {
        const response = await StockAPI.getStockStats();
        if (!isMounted) return;

        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchStockStats();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  return data;
};
