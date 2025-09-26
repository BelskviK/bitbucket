export interface Brand {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  cover_image: string;
  description?: string | null;
  release_year?: string;
  images: string[];
  available_colors: string[];
  available_sizes: string[];
  brand?: Brand;
}
export interface FilterParams {
  price_from?: number;
  price_to?: number;
}

export interface ProductQueryParams extends FilterParams {
  sort?: string;
  page?: number;
}

export interface PaginationData {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T[];
  meta: PaginationData;
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Service related types
export interface ProductQueryParamsService {
  page?: number;
  price_from?: number;
  price_to?: number;
  sort?: string;
}

export interface ApiQueryParams {
  page?: number;
  filter?: {
    price_from?: number;
    price_to?: number;
  };
  sort?: string;
}

// src/types/product.ts
export interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  release_year: string;
  cover_image: string;
  images: string[];
  price: number;
  available_colors: string[];
  available_sizes: string[];
  brand?: Brand;
  total_price?: number;
  quantity?: number;
  color?: string;
  size?: string;
}
