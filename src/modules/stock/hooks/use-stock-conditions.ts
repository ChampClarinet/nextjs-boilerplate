"use client";

import { useEffect, useState } from "react";

import StockAPI from "@/apis/stock";
import type { StockConditionOption } from "@/apis/stock";

export const useStockConditions = () => {
  const [data, setData] = useState<StockConditionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;

    const fetchConditions = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await StockAPI.getAllStockConditions();
        if (!isMounted) return;

        setData(response.data);
      } catch (error) {
        console.error(error);
        if (isMounted) setError("โหลดสภาพสินค้าไม่สำเร็จ");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchConditions();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
};
