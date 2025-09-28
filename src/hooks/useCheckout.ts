// src/hooks/useCheckout.ts
import { useState, useEffect, useCallback } from "react";
import { cartManager } from "@/services/CartManager";
import { CartService } from "@/services/CartService";
import { useNavigate } from "react-router-dom";
import type {
  CheckoutHookReturn,
  UseCheckoutProps,
  ValidationErrors,
  ApiErrorResponse,
  CartResponse,
} from "@/types";
import { CHECKOUT_CONSTANTS } from "@/constants";

export const useCheckout = ({ user }: UseCheckoutProps): CheckoutHookReturn => {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    zip_code: "",
    address: "",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const navigate = useNavigate();

  // Validation functions
  const validateName = useCallback((name: string): string | undefined => {
    if (!name.trim()) return CHECKOUT_CONSTANTS.FORM.VALIDATION.NAME.REQUIRED;
    if (name.trim().length < 2)
      return CHECKOUT_CONSTANTS.FORM.VALIDATION.NAME.MIN_LENGTH;
    if (!/^[a-zA-Z\s]+$/.test(name))
      return CHECKOUT_CONSTANTS.FORM.VALIDATION.NAME.ALPHA_ONLY;
    return undefined;
  }, []);

  const validateSurname = useCallback((surname: string): string | undefined => {
    if (!surname.trim())
      return CHECKOUT_CONSTANTS.FORM.VALIDATION.SURNAME.REQUIRED;
    if (surname.trim().length < 2)
      return CHECKOUT_CONSTANTS.FORM.VALIDATION.SURNAME.MIN_LENGTH;
    if (!/^[a-zA-Z\s]+$/.test(surname))
      return CHECKOUT_CONSTANTS.FORM.VALIDATION.SURNAME.ALPHA_ONLY;
    return undefined;
  }, []);

  const validateEmail = useCallback((email: string): string | undefined => {
    if (!email.trim()) return CHECKOUT_CONSTANTS.FORM.VALIDATION.EMAIL.REQUIRED;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return CHECKOUT_CONSTANTS.FORM.VALIDATION.EMAIL.INVALID;
    return undefined;
  }, []);

  const validateAddress = useCallback((address: string): string | undefined => {
    if (!address.trim())
      return CHECKOUT_CONSTANTS.FORM.VALIDATION.ADDRESS.REQUIRED;
    if (address.trim().length < 3)
      return CHECKOUT_CONSTANTS.FORM.VALIDATION.ADDRESS.MIN_LENGTH;
    return undefined;
  }, []);

  const validateZipCode = useCallback(
    (zip_code: string): string | undefined => {
      if (!zip_code.trim())
        return CHECKOUT_CONSTANTS.FORM.VALIDATION.ZIP_CODE.REQUIRED;
      if (!/^\d+$/.test(zip_code))
        return CHECKOUT_CONSTANTS.FORM.VALIDATION.ZIP_CODE.NUMERIC;
      if (zip_code.length < 3)
        return CHECKOUT_CONSTANTS.FORM.VALIDATION.ZIP_CODE.MIN_LENGTH;
      return undefined;
    },
    []
  );

  // Cart management
  useEffect(() => {
    const unsubscribe = cartManager.subscribe((cart: CartResponse | null) => {
      setCartData(cart);
    });

    const fetchCart = async () => {
      if (user) {
        setIsLoading(true);
        try {
          await cartManager.fetchCart();
        } catch (error) {
          console.error("Failed to load cart:", error);
          setCartData(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchCart();

    return unsubscribe;
  }, [user]);

  // Prefill email when user data is available
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [user?.email]);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {
      name: validateName(formData.name),
      surname: validateSurname(formData.surname),
      email: validateEmail(formData.email),
      address: validateAddress(formData.address),
      zip_code: validateZipCode(formData.zip_code),
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([, value]) => value !== undefined)
    ) as ValidationErrors;

    setValidationErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  }, [
    formData,
    validateName,
    validateSurname,
    validateEmail,
    validateAddress,
    validateZipCode,
  ]);

  // Event handlers
  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      let error: string | undefined;

      switch (name) {
        case "name":
          error = validateName(value);
          break;
        case "surname":
          error = validateSurname(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "address":
          error = validateAddress(value);
          break;
        case "zip_code":
          error = validateZipCode(value);
          break;
        default:
          break;
      }

      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [
      validateName,
      validateSurname,
      validateEmail,
      validateAddress,
      validateZipCode,
    ]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (validationErrors[name as keyof ValidationErrors]) {
        setValidationErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }

      if (checkoutError) {
        setCheckoutError(null);
      }
    },
    [validationErrors, checkoutError]
  );

  const handleCheckout = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    if (!cartData || (Array.isArray(cartData) && cartData.length === 0)) {
      setCheckoutError(CHECKOUT_CONSTANTS.ERRORS.EMPTY_CART);
      return false;
    }

    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      console.log("🛒 Submitting checkout:", formData);
      const response = await CartService.checkout(formData);
      console.log("✅ Checkout successful:", response);
      setIsModalOpen(true);
      return true;
    } catch (error: unknown) {
      console.error("❌ Checkout failed:", error);

      if (error instanceof Error) {
        setCheckoutError(error.message);
      } else {
        // Use type guard to check for axios error structure
        const axiosError = error as { response?: { data?: ApiErrorResponse } };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          if (errorData.errors) {
            const apiErrors: ValidationErrors = {};
            Object.keys(errorData.errors).forEach((key) => {
              if (errorData.errors?.[key]?.[0]) {
                apiErrors[key as keyof ValidationErrors] =
                  errorData.errors[key]![0];
              }
            });
            setValidationErrors(apiErrors);
            setCheckoutError(
              errorData.message || CHECKOUT_CONSTANTS.ERRORS.FORM_ERRORS
            );
          } else {
            setCheckoutError(
              errorData.message || CHECKOUT_CONSTANTS.ERRORS.CHECKOUT_FAILED
            );
          }
        } else {
          setCheckoutError(CHECKOUT_CONSTANTS.ERRORS.CHECKOUT_FAILED);
        }
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, cartData, formData]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    navigate("/products");
  }, [navigate]);

  const getFieldError = useCallback(
    (fieldName: keyof ValidationErrors): string | undefined => {
      return validationErrors[fieldName];
    },
    [validationErrors]
  );

  return {
    cartData,
    isLoading,
    isSubmitting,
    isModalOpen,
    checkoutError,
    formData,
    validationErrors,
    handleInputChange,
    handleInputBlur,
    handleCheckout,
    handleCloseModal,
    getFieldError,
  };
};
