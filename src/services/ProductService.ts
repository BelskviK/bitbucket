// src/services/ProductService.ts
import api from "./api";

// Define interfaces for the query parameters
interface ProductQueryParams {
  page?: number;
  price_from?: number;
  price_to?: number;
  sort?: string;
}

interface ApiQueryParams {
  page?: number;
  filter?: {
    price_from?: number;
    price_to?: number;
  };
  sort?: string;
}

export const ProductService = {
  // List products with optional filters, pagination, sorting
  getProducts: async (params?: ProductQueryParams) => {
    const queryParams: ApiQueryParams = {};

    if (params?.page) queryParams.page = params.page;

    // Build filter object if price filters exist
    if (params?.price_from !== undefined || params?.price_to !== undefined) {
      queryParams.filter = {};
      if (params.price_from !== undefined)
        queryParams.filter.price_from = params.price_from;
      if (params.price_to !== undefined)
        queryParams.filter.price_to = params.price_to;
    }

    // Add sort parameter if provided (empty string will be ignored)
    if (params?.sort) queryParams.sort = params.sort;

    const response = await api.get("/products", { params: queryParams });
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id: number) => {
    const response = await api.get("/products", { params: { id } });
    return response.data;
  },
};
