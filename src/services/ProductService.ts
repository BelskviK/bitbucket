import api from "./Api";
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

  getProductById: async (id: number) => {
    const response = await api.get("/products", { params: { id } });
    return response.data;
  },
};
