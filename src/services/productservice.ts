// src/services/ProductService.ts
import api from "./api";
import type {
  ProductQueryParamsService,
  ApiResponse,
  Product,
  ProductResponse,
} from "../types";

interface ApiQueryParams {
  page?: number;
  filter?: {
    price_from?: number;
    price_to?: number;
  };
  sort?: string;
  id?: number;
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
      const response = await api.get<ApiResponse<ProductResponse>>(
        "/products",
        {
          params: { id },
        }
      );

      // The API returns an array of products in data.data
      const products = response.data.data;
      const product = products.find((p: ProductResponse) => p.id === id);

      if (!product) return null;

      // Map the ProductResponse to Product interface with proper fallbacks
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        cover_image: product.cover_image,
        description: product.description || null,
        release_year: product.release_year,
        images: product.images || [],
        available_colors: product.available_colors || [],
        available_sizes: product.available_sizes || [],
      };
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },
};
