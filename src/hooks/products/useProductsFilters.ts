import { useState, useCallback } from "react";
import type { ProductQueryParams, FilterParams } from "@/types";

interface UseProductsFiltersReturn {
  queryParams: ProductQueryParams;
  handleFiltersChange: (filters: FilterParams) => void;
  handleSortChange: (sort: string) => void;
  handlePageChange: (page: number) => void;
  resetToPageOne: () => void;
}

export const useProductsFilters = (
  initialParams: ProductQueryParams = {}
): UseProductsFiltersReturn => {
  const [queryParams, setQueryParams] =
    useState<ProductQueryParams>(initialParams);

  const handleFiltersChange = useCallback((filters: FilterParams) => {
    setQueryParams((prev) => ({
      ...prev,
      ...filters,
      page: 1, // Reset to page 1 on filter change
    }));
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sort: sort || undefined,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const resetToPageOne = useCallback(() => {
    setQueryParams((prev) => ({ ...prev, page: 1 }));
  }, []);

  return {
    queryParams,
    handleFiltersChange,
    handleSortChange,
    handlePageChange,
    resetToPageOne,
  };
};
