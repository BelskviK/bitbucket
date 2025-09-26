// src/hooks/useProduct.ts
import { useState, useEffect } from "react";
import { ProductService } from "../services/productservice";
import type { Product } from "../types";

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate ID
        if (!id || id <= 0 || isNaN(id)) {
          setError("Invalid product ID");
          setLoading(false);
          return;
        }

        const productData = await ProductService.getProductById(id);
        setProduct(productData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
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
