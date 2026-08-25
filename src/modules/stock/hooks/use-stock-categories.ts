"use client";

import { useEffect, useState } from "react";

import StockAPI from "@/apis/stock";

export const useStockCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await StockAPI.getStockCategories();
        if (!isMounted) return;

        setCategories((response.data ?? []).map((category) => category.name));
      } catch (error) {
        console.error(error);
        if (isMounted) setError("โหลดหมวดหมู่สินค้าไม่สำเร็จ");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, isLoading, error };
};
