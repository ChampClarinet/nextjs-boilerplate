"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import StockAPI from "@/apis/stock";
import type { GetAllStockTransactionParams } from "@/apis/stock";

import type { DisplayStockTransaction } from "../stock.types";
import { mapStockTransaction } from "../utils";

export const useStockTransactions = (
  params: GetAllStockTransactionParams,
  { enabled = true, refreshKey = 0 }: { enabled?: boolean; refreshKey?: number } = {},
) => {
  const [data, setData] = useState<DisplayStockTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const requestIdRef = useRef(0);
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    if (!enabled) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const fetchStockTransactions = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await StockAPI.getAllStockTransaction(params);
        if (requestIdRef.current !== requestId) return;

        setData(response.map(mapStockTransaction));
      } catch (error) {
        if (requestIdRef.current !== requestId) return;
        console.error(error);
        setData([]);
        setError("โหลดข้อมูลรายการสินค้าเข้าออกไม่สำเร็จ");
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    };

    void fetchStockTransactions();
  }, [enabled, params, paramsKey, refreshKey]);

  return { data, isLoading, error };
};
