"use client";

import { useEffect, useState } from "react";

import StockAPI from "@/apis/stock";
import type { StockEmployee } from "@/apis/stock";

export const useEmployees = (search: string) => {
  const [data, setData] = useState<StockEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;
    const query = search.trim();

    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await StockAPI.getAllEmployees(query || undefined);
        if (!isMounted) return;

        setData(response.data);
      } catch (error) {
        console.error(error);
        if (isMounted) setError("โหลดรายการพนักงานไม่สำเร็จ");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchEmployees();

    return () => {
      isMounted = false;
    };
  }, [search]);

  return { data, isLoading, error };
};
