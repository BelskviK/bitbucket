// src/pages/Checkout.tsx
import { useEffect, useState } from "react";
import EnvelopIcon from "@/assets/EnvelopeIcon.svg";
import CartCalculator from "@/components/cart/CartCalculator";
import type { CartResponse, CheckoutRequest } from "@/types";
import { cartManager } from "@/services/CartManager";
import { CartService } from "@/services/CartService";
import { useAuth } from "@/hooks/useAuth";
import CongratulationModal from "@/components/cart/CongratulationModal";
import { useNavigate } from "react-router-dom";

// Validation interface
interface ValidationErrors {
  name?: string;
  surname?: string;
  email?: string;
  address?: string;
  zip_code?: string;
}

// API error response interface
interface ApiErrorResponse {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}

export default function Checkout() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<CheckoutRequest>({
    name: "",
    surname: "",
    email: "",
    zip_code: "",
    address: "",
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  useEffect(() => {
    const unsubscribe = cartManager.subscribe(setCartData);

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

  // Individual field validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name))
      return "Name can only contain letters and spaces";
    return undefined;
  };

  const validateSurname = (surname: string): string | undefined => {
    if (!surname.trim()) return "Surname is required";
    if (surname.trim().length < 2)
      return "Surname must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(surname))
      return "Surname can only contain letters and spaces";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validateAddress = (address: string): string | undefined => {
    if (!address.trim()) return "Address is required";
    if (address.trim().length < 3)
      return "Address must be at least 3 characters";
    return undefined;
  };

  const validateZipCode = (zip_code: string): string | undefined => {
    if (!zip_code.trim()) return "Zip code is required";
    if (!/^\d+$/.test(zip_code)) return "Zip code must contain only numbers";
    if (zip_code.length < 3) return "Zip code must be at least 3 digits";
    return undefined;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {
      name: validateName(formData.name),
      surname: validateSurname(formData.surname),
      email: validateEmail(formData.email),
      address: validateAddress(formData.address),
      zip_code: validateZipCode(formData.zip_code),
    };

    // Filter out undefined errors
    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([, value]) => value !== undefined)
    ) as ValidationErrors;

    setValidationErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  // Validate single field on blur
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (checkoutError) {
      setCheckoutError(null);
    }
  };

  // Checkout function to be called from CartCalculator
  const handleCheckout = async (): Promise<boolean> => {
    // Validate all fields
    if (!validateForm()) {
      // Removed the generic error message - individual field errors will show instead
      return false;
    }

    if (!cartData || cartData.length === 0) {
      setCheckoutError("Your cart is empty");
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
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null
      ) {
        // Handle API validation errors
        const errorData = error.response.data as ApiErrorResponse;
        if (errorData.errors) {
          // Map API errors to our validation errors
          const apiErrors: ValidationErrors = {};
          Object.keys(errorData.errors).forEach((key) => {
            if (
              errorData.errors &&
              errorData.errors[key] &&
              errorData.errors[key]![0]
            ) {
              apiErrors[key as keyof ValidationErrors] =
                errorData.errors[key]![0];
            }
          });
          setValidationErrors(apiErrors);
          setCheckoutError(
            errorData.message || "Please check the form for errors"
          );
        } else {
          setCheckoutError(
            errorData.message || "Checkout failed. Please try again."
          );
        }
      } else {
        setCheckoutError("Checkout failed. Please try again.");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/products");
  };

  // Helper function to get error message for a field
  const getFieldError = (
    fieldName: keyof ValidationErrors
  ): string | undefined => {
    return validationErrors[fieldName];
  };

  if (isLoading) {
    return (
      <div className="px-[100px] flex flex-col justify-center items-center">
        <div className="font-poppins font-semibold text-[42px] leading-[100%] tracking-[0] text-[#10151F] self-start mt-[84px] mb-[51px]">
          Checkout
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="font-poppins font-normal text-[14px]">
            Loading cart...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[100px] flex flex-col justify-center items-center">
      <div className="font-poppins font-semibold text-[42px] leading-[100%] tracking-[0] text-[#10151F] self-start mt-[84px] mb-[51px]">
        Checkout
      </div>

      <div className="flex flex-row justify-between items-start w-full h-[635px]">
        {/* Left Section - Form */}
        <div className="bg-[#F8F6F7] w-[1129px] h-full rounded-[16px] py-[78px] px-[47px]">
          <div className="font-poppins font-medium text-[22px] leading-[100%] tracking-[0] text-[#3E424A] mb-[52px]">
            Order details
          </div>

          {checkoutError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[8px]">
              <p className="font-poppins font-normal text-[14px] text-red-600 text-center">
                {checkoutError}
              </p>
            </div>
          )}

          <div className="space-y-[33px] w-[580px]">
            {/* Name + Surname */}
            <div className="flex gap-[20px]">
              <div className="w-full">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`w-full h-[42px] rounded-[8px] border bg-white px-4
                  font-poppins text-[16px] text-[#10151F] 
                  placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] 
                  placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A]
                  focus:outline-none focus:ring-2 ${
                    getFieldError("name")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[#D9D9D9] focus:ring-[#10151F]"
                  }`}
                  required
                />
                {getFieldError("name") && (
                  <p className="mt-1 text-red-500 text-xs font-poppins">
                    {getFieldError("name")}
                  </p>
                )}
              </div>

              <div className="w-full">
                <input
                  type="text"
                  name="surname"
                  placeholder="Surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`w-full h-[42px] rounded-[8px] border bg-white px-4
                  font-poppins text-[16px] text-[#10151F]
                  placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] 
                  placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A]
                  focus:outline-none focus:ring-2 ${
                    getFieldError("surname")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[#D9D9D9] focus:ring-[#10151F]"
                  }`}
                  required
                />
                {getFieldError("surname") && (
                  <p className="mt-1 text-red-500 text-xs font-poppins">
                    {getFieldError("surname")}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <div
                className={`flex items-center w-full h-[42px] rounded-[8px] border bg-white px-4 ${
                  getFieldError("email") ? "border-red-500" : "border-[#D9D9D9]"
                }`}
              >
                <span className="mr-2 w-[20px] h-[20px]">
                  <img src={EnvelopIcon} alt="Email" />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="flex-1 bg-transparent outline-none 
                  font-poppins text-[16px] text-[#10151F]
                  placeholder:font-poppins placeholder:font-normal 
                  placeholder:text-[14px] placeholder:leading-[100%]
                  placeholder:tracking-[0] placeholder:text-[#3E424A]"
                  required
                />
              </div>
              {getFieldError("email") && (
                <p className="mt-1 text-red-500 text-xs font-poppins">
                  {getFieldError("email")}
                </p>
              )}
            </div>

            {/* Address + Zip */}
            <div className="flex gap-[20px]">
              <div className="w-full">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`w-full h-[42px] rounded-[8px] border bg-white px-4
                  font-poppins text-[16px] text-[#10151F]
                  placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] 
                  placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A]
                  focus:outline-none focus:ring-2 ${
                    getFieldError("address")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[#D9D9D9] focus:ring-[#10151F]"
                  }`}
                  required
                />
                {getFieldError("address") && (
                  <p className="mt-1 text-red-500 text-xs font-poppins">
                    {getFieldError("address")}
                  </p>
                )}
              </div>

              <div className="w-full">
                <input
                  type="text"
                  name="zip_code"
                  placeholder="Zip code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`w-full h-[42px] rounded-[8px] border bg-white px-4 
                  font-poppins text-[16px] text-[#10151F] 
                  placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] 
                  placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A] 
                  focus:outline-none focus:ring-2 ${
                    getFieldError("zip_code")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[#D9D9D9] focus:ring-[#10151F]"
                  }`}
                  required
                />
                {getFieldError("zip_code") && (
                  <p className="mt-1 text-red-500 text-xs font-poppins">
                    {getFieldError("zip_code")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Summary */}
        <div className="w-[460px] h-full rounded-[16px]">
          <CartCalculator
            cartData={cartData}
            onClose={undefined}
            isLoading={isLoading}
            onCheckout={handleCheckout}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      <CongratulationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
