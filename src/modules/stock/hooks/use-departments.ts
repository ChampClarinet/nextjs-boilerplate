"use client";

import { useEffect, useState } from "react";

import StockAPI from "@/apis/stock";

export interface DepartmentOption {
  department_id: string;
}

export const useDepartments = (search: string) => {
  const [data, setData] = useState<DepartmentOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;
    const query = search.trim();

    const fetchDepartments = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await StockAPI.getAllDepartments(query || undefined);
        if (!isMounted) return;

        setData(response.data.filter((option) => option.department_id !== "All Departments"));
      } catch (error) {
        console.error(error);
        if (isMounted) setError("โหลดรายการสังกัดไม่สำเร็จ");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchDepartments();

    return () => {
      isMounted = false;
    };
  }, [search]);

  return { data, isLoading, error };
};
