// src/utils/helpers.ts
import { COLOR_MAP } from "@/constants";
import type { ProductQueryParams, FilterParams } from "@/types";
import { PRODUCTS_CONSTANTS } from "@/constants";

// Color value helper
export const getColorValue = (colorName: string): string => {
  const lowerColor = colorName.toLowerCase();
  return COLOR_MAP[lowerColor] || "#d1d5db";
};

// Error extraction helper (reusable across components)
export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data
  ) {
    return (error.response.data as { message: string }).message;
  } else {
    return "An unexpected error occurred";
  }
};

// Product ID validation helper
export const validateProductId = (id: string | undefined): number | null => {
  if (!id) return null;
  const parsedId = parseInt(id, 10);
  return isNaN(parsedId) ? null : parsedId;
};
// Products helpers
export const buildQueryParams = (
  filters: FilterParams,
  currentParams: ProductQueryParams
): ProductQueryParams => ({
  ...currentParams,
  ...filters,
  page: PRODUCTS_CONSTANTS.DEFAULT_PAGE, // Reset to page 1 on filter change
});

export const shouldRefetchProducts = (
  prevParams: ProductQueryParams,
  newParams: ProductQueryParams
): boolean => {
  return JSON.stringify(prevParams) !== JSON.stringify(newParams);
};

// Error handling specific to products
export const handleProductsError = (error: unknown): void => {
  console.error("Failed to fetch products:", error);
  // You could add toast notifications here later
};
// src/utils/avatarHelpers.ts
import { AVATAR_CONSTANTS } from "@/constants";

export const validateAvatarFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (file.size > AVATAR_CONSTANTS.VALIDATION.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: AVATAR_CONSTANTS.VALIDATION.ERRORS.FILE_TOO_LARGE,
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      isValid: false,
      error: AVATAR_CONSTANTS.VALIDATION.ERRORS.INVALID_TYPE,
    };
  }

  return { isValid: true };
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error(AVATAR_CONSTANTS.VALIDATION.ERRORS.PROCESSING_FAILED));
      }
    };

    reader.onerror = () =>
      reject(new Error(AVATAR_CONSTANTS.VALIDATION.ERRORS.PROCESSING_FAILED));
    reader.readAsDataURL(file);
  });
};
