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
// src/constants/checkout.ts
export const CHECKOUT_CONSTANTS = {
  TITLE: "Checkout",
  LOADING_TEXT: "Loading cart...",
  ORDER_DETAILS: "Order details",
  FORM: {
    PLACEHOLDERS: {
      NAME: "Name",
      SURNAME: "Surname",
      EMAIL: "Email",
      ADDRESS: "Address",
      ZIP_CODE: "Zip code",
    },
    VALIDATION: {
      NAME: {
        REQUIRED: "Name is required",
        MIN_LENGTH: "Name must be at least 2 characters",
        ALPHA_ONLY: "Name can only contain letters and spaces",
      },
      SURNAME: {
        REQUIRED: "Surname is required",
        MIN_LENGTH: "Surname must be at least 2 characters",
        ALPHA_ONLY: "Surname can only contain letters and spaces",
      },
      EMAIL: {
        REQUIRED: "Email is required",
        INVALID: "Please enter a valid email address",
      },
      ADDRESS: {
        REQUIRED: "Address is required",
        MIN_LENGTH: "Address must be at least 3 characters",
      },
      ZIP_CODE: {
        NUMERIC: "Zip code must contain only numbers",
        MIN_LENGTH: "Zip code must be at least 3 digits",
      },
    },
  },
  ERRORS: {
    EMPTY_CART: "Your cart is empty",
    CHECKOUT_FAILED: "Checkout failed. Please try again.",
    FORM_ERRORS: "Please check the form for errors",
  },
} as const;
// src/constants/avatar.ts
export const AVATAR_CONSTANTS = {
  DIMENSIONS: {
    PREVIEW: {
      WIDTH: 100,
      HEIGHT: 100,
    },
    CONTAINER: {
      WIDTH: 578,
      HEIGHT: 140,
    },
  },
  STRINGS: {
    UPLOAD_NEW: "Upload new",
    REMOVE: "Remove",
    UPLOAD_IMAGE: "Upload Image",
    PROCESSING: "Processing image...",
    LOADING_SPINNER_SIZE: 6,
  },
  VALIDATION: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_TYPES: "image/*",
    ERRORS: {
      FILE_TOO_LARGE: "Image must be less than 5MB",
      INVALID_TYPE: "Please select a valid image file (JPEG, PNG, etc.)",
      PROCESSING_FAILED: "Failed to process image",
    },
  },
} as const;
