// src/services/ProductService.ts
import api from "./api";
import type { ProductQueryParamsService, ApiResponse, Product } from "../types";

interface ApiQueryParams {
  page?: number;
  filter?: {
    price_from?: number;
    price_to?: number;
  };
  sort?: string;
}

export const ProductService = {
  getProducts: async (
    params?: ProductQueryParamsService
  ): Promise<ApiResponse<Product>> => {
    const queryParams: ApiQueryParams = {};

    if (params?.page) queryParams.page = params.page;

    if (params?.price_from !== undefined || params?.price_to !== undefined) {
      queryParams.filter = {};
      if (params.price_from !== undefined)
        queryParams.filter.price_from = params.price_from;
      if (params.price_to !== undefined)
        queryParams.filter.price_to = params.price_to;
    }

    if (params?.sort) queryParams.sort = params.sort;

    const response = await api.get("/products", { params: queryParams });
    return response.data;
  },

  getProductById: async (id: number): Promise<Product | null> => {
    try {
      // Correct endpoint: /products/{id} instead of /products with params
      const response = await api.get(`/products/${id}`);

      // The API returns the product object directly, not nested in data.data
      const productData = response.data;

      if (!productData) return null;

      // Map the API response to Product interface
      return {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        cover_image: productData.cover_image,
        description: productData.description || null,
        release_year: productData.release_year,
        images: productData.images || [],
        available_colors: productData.available_colors || [],
        available_sizes: productData.available_sizes || [],
        brand: productData.brand, // Include brand information
      };
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },
};
