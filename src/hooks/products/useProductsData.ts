import { useState, useEffect, useCallback } from "react";
import { ProductService } from "@/services/ProductService";
import { PAGINATION_DEFAULT } from "@/constants";
import type {
  Product,
  ProductQueryParams,
  PaginationData,
  ApiResponse,
} from "@/types";

interface UseProductsDataReturn {
  products: Product[];
  loading: boolean;
  pagination: PaginationData;
  refetchProducts: (params?: ProductQueryParams) => Promise<void>;
}

export const useProductsData = (): UseProductsDataReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] =
    useState<PaginationData>(PAGINATION_DEFAULT);

  const refetchProducts = useCallback(
    async (params: ProductQueryParams = {}) => {
      try {
        setLoading(true);
        const response: ApiResponse<Product> = await ProductService.getProducts(
          params
        );
        setProducts(response.data);
        setPagination(response.meta);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial fetch with empty params
  useEffect(() => {
    refetchProducts({});
  }, [refetchProducts]);

  return { products, loading, pagination, refetchProducts };
};
