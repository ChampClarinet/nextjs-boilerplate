"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { GetStockTransactionReportParams } from "@/apis/stock-report";
import StockReportAPI from "@/apis/stock-report";

export const useStockTransactionReport = (
  params: GetStockTransactionReportParams,
  { enabled = true, refreshKey = 0 }: { enabled?: boolean; refreshKey?: number } = {},
) => {
  const [data, setData] = useState<
    Awaited<ReturnType<typeof StockReportAPI.getStockTransactionReport>>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const requestIdRef = useRef(0);
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    if (!enabled) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const fetchStockTransactionReport = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await StockReportAPI.getStockTransactionReport(params);
        if (requestIdRef.current !== requestId) return;

        setData(response);
      } catch (error) {
        if (requestIdRef.current !== requestId) return;
        console.error(error);
        setData([]);
        setError("โหลดข้อมูลรายงานการเคลื่อนไหวไม่สำเร็จ");
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    };

    void fetchStockTransactionReport();
  }, [enabled, params, paramsKey, refreshKey]);

  return { data, isLoading, error };
};
