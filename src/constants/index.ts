// src/constants/index.ts
import type { PaginationData } from "@/types";

// Color mapping constants
export const COLOR_MAP: { [key: string]: string } = {
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#10b981",
  black: "#000000",
  white: "#ffffff",
  grey: "#6b7280",
  gray: "#6b7280",
  pink: "#ec4899",
  orange: "#f97316",
  purple: "#8b5cf6",
  yellow: "#eab308",
  "navy blue": "#1e3a8a",
  "baby pink": "#fbcfe8",
  beige: "#f5f5dc",
  multi: "#8b5cf6",
} as const;

// Quantity options
export const QUANTITY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_PRODUCT_ID: "Invalid product ID",
  PRODUCT_NOT_FOUND: "Product not found",
  SELECT_COLOR_SIZE: "Please select color and size",
  INVALID_QUANTITY: "Please select a valid quantity",
  ADD_TO_CART_FAILED: "Failed to add product to cart. Please try again.",
} as const;
// Products constants
export const PAGINATION_DEFAULT: PaginationData = {
  current_page: 1,
  last_page: 1,
  from: 0,
  to: 0,
  total: 0,
};

export const PRODUCTS_CONSTANTS = {
  DEFAULT_PAGE: 1,
  PRODUCTS_PER_PAGE: 8,
  GRID_COLUMNS: "grid-cols-4",
  GRID_GAP: "gap-8",
} as const;
