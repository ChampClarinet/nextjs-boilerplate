"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { GetStockReportParams } from "@/apis/stock-report";
import StockReportAPI from "@/apis/stock-report";

export const useStockReport = (
  params: GetStockReportParams,
  { enabled = true, refreshKey = 0 }: { enabled?: boolean; refreshKey?: number } = {},
) => {
  const [data, setData] = useState<Awaited<ReturnType<typeof StockReportAPI.getStockReport>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const requestIdRef = useRef(0);
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    if (!enabled) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const fetchStockReport = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await StockReportAPI.getStockReport(params);
        if (requestIdRef.current !== requestId) return;

        setData(response);
      } catch (error) {
        if (requestIdRef.current !== requestId) return;
        console.error(error);
        setData([]);
        setError("โหลดข้อมูลรายงานสต็อกไม่สำเร็จ");
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    };

    void fetchStockReport();
  }, [enabled, params, paramsKey, refreshKey]);

  return { data, isLoading, error };
};
