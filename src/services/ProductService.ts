// src/services/ProductService.ts
import api from "./Api";

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

// Define the response interface
interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  release_year: string;
  cover_image: string;
  images: string[];
  price: number;
  available_colors: string[];
  available_sizes: string[] | null;
}

interface ApiResponse {
  data: ProductResponse[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export const ProductService = {
  // List products with optional filters, pagination, sorting
  getProducts: async (params?: ProductQueryParams): Promise<ApiResponse> => {
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

    // Add sort parameter if provided
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
