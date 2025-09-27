import { useState, useEffect } from "react";
import { ProductService } from "@/services/ProductService";
import { ERROR_MESSAGES } from "@/constants";
import type { Product } from "@/types";

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id || id <= 0 || isNaN(id)) {
          setError(ERROR_MESSAGES.INVALID_PRODUCT_ID);
          setLoading(false);
          return;
        }

        const productData = await ProductService.getProductById(id);
        setProduct(productData || null);

        if (!productData) {
          setError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : ERROR_MESSAGES.ADD_TO_CART_FAILED
        );
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};
