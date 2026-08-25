"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import StockAPI from "@/apis/stock";
import type { GetAllStockParams, StockItem } from "@/apis/stock";

export interface UseStockQueryOptions {
  enabled?: boolean;
  refreshKey?: number;
}

export const useStockQuery = (
  params: GetAllStockParams = {},
  { enabled = true, refreshKey = 0 }: UseStockQueryOptions = {},
) => {
  const [data, setData] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [localRefreshKey, setLocalRefreshKey] = useState(0);
  const requestIdRef = useRef(0);
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  const refetch = useCallback(() => {
    setLocalRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const fetchStock = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await StockAPI.getAllStock(params);
        if (requestIdRef.current !== requestId) return;

        setData(response.data);
      } catch (error) {
        if (requestIdRef.current !== requestId) return;
        console.error(error);
        setData([]);
        setError("โหลดข้อมูลสินค้าไม่สำเร็จ");
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    };

    void fetchStock();
  }, [enabled, localRefreshKey, params, paramsKey, refreshKey]);

  return { data, isLoading, error, refetch };
};
