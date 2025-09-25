// Common types used across the application
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
}
