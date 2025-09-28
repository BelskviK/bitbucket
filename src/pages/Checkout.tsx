// src/pages/Checkout.tsx
import EnvelopIcon from "@/assets/EnvelopeIcon.svg";
import CartCalculator from "@/components/cart/CartCalculator";
import CongratulationModal from "@/components/cart/CongratulationModal";
import { Input } from "@/components/common/Input";
import { useAuth } from "@/hooks/useAuth";
import { useCheckout } from "@/hooks/useCheckout";
import { CHECKOUT_CONSTANTS } from "@/constants";

export default function Checkout() {
  const { user } = useAuth();
  const {
    cartData,
    isLoading,
    isSubmitting,
    isModalOpen,
    checkoutError,
    formData,
    handleInputChange,
    handleInputBlur,
    handleCheckout,
    handleCloseModal,
    getFieldError,
  } = useCheckout({ user });

  if (isLoading) {
    return (
      <div className="px-[100px] flex flex-col justify-center items-center">
        <div className="font-poppins font-semibold text-[42px] leading-[100%] tracking-[0] text-[#10151F] self-start mt-[84px] mb-[51px]">
          {CHECKOUT_CONSTANTS.TITLE}
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="font-poppins font-normal text-[14px]">
            {CHECKOUT_CONSTANTS.LOADING_TEXT}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[100px] flex flex-col justify-center items-center">
      <div className="font-poppins font-semibold text-[42px] leading-[100%] tracking-[0] text-[#10151F] self-start mt-[84px] mb-[51px]">
        {CHECKOUT_CONSTANTS.TITLE}
      </div>

      <div className="flex flex-row justify-between items-start w-full h-[635px]">
        {/* Left Section - Form */}
        <div className="bg-[#F8F6F7] w-[1129px] h-full rounded-[16px] py-[78px] px-[47px]">
          <div className="font-poppins font-medium text-[22px] leading-[100%] tracking-[0] text-[#3E424A] mb-[52px]">
            {CHECKOUT_CONSTANTS.ORDER_DETAILS}
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
              <Input
                type="text"
                name="name"
                placeholder={CHECKOUT_CONSTANTS.FORM.PLACEHOLDERS.NAME}
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={getFieldError("name")}
                required
              />

              <Input
                type="text"
                name="surname"
                placeholder={CHECKOUT_CONSTANTS.FORM.PLACEHOLDERS.SURNAME}
                value={formData.surname}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={getFieldError("surname")}
                required
              />
            </div>

            {/* Email */}
            {/* Email */}
            <div>
              <div
                className={`flex items-center w-full h-[42px] rounded-[8px] border bg-white px-4 ${
                  getFieldError("email") ? "border-red-500" : "border-[#D9D9D9]"
                } focus-within:ring-2 focus-within:ring-[#10151F] ${
                  getFieldError("email") ? "focus-within:ring-red-500" : ""
                }`}
              >
                <span className="mr-2 w-[20px] h-[20px]">
                  <img src={EnvelopIcon} alt="Email" />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder={CHECKOUT_CONSTANTS.FORM.PLACEHOLDERS.EMAIL}
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
              <Input
                type="text"
                name="address"
                placeholder={CHECKOUT_CONSTANTS.FORM.PLACEHOLDERS.ADDRESS}
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={getFieldError("address")}
                required
              />

              <Input
                type="text"
                name="zip_code"
                placeholder={CHECKOUT_CONSTANTS.FORM.PLACEHOLDERS.ZIP_CODE}
                value={formData.zip_code}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={getFieldError("zip_code")}
                required
              />
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
