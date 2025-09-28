// src/types/checkout.ts
import type { CartResponse, CheckoutRequest, User } from "@/types";

export interface ValidationErrors {
  name?: string;
  surname?: string;
  email?: string;
  address?: string;
  zip_code?: string;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}

// Remove empty interface - use CheckoutRequest directly instead
export type CheckoutFormData = CheckoutRequest;

export interface CheckoutHookReturn {
  cartData: CartResponse | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isModalOpen: boolean;
  checkoutError: string | null;
  formData: CheckoutFormData;
  validationErrors: ValidationErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleCheckout: () => Promise<boolean>;
  handleCloseModal: () => void;
  getFieldError: (fieldName: keyof ValidationErrors) => string | undefined;
}

export interface UseCheckoutProps {
  user: User | null;
}
