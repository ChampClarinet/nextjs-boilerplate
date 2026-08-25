"use client";

import { useEffect, useRef, useState } from "react";

import StockAPI from "@/apis/stock";
import type { StockTransaction } from "@/apis/stock";

export const useStockTransactionDetail = (transactionId?: string) => {
  const [data, setData] = useState<StockTransaction | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!transactionId) {
      setData(undefined);
      setError(undefined);
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const fetchDetail = async () => {
      setIsLoading(true);
      setData(undefined);
      setError(undefined);

      try {
        const response = await StockAPI.getStockTransaction(transactionId);
        if (requestIdRef.current !== requestId) return;

        setData(response);
      } catch (error) {
        if (requestIdRef.current !== requestId) return;
        console.error(error);
        setError("โหลดรายละเอียดรายการสินค้าเข้าออกไม่สำเร็จ");
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    };

    void fetchDetail();
  }, [transactionId]);

  return { data, isLoading, error };
};
