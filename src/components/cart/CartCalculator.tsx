// src/components/CartCalculator.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import CartItem from "@/components/cart/CartItem";
import CongratulationModal from "@/components/cart/CongratulationModal";
import CartEmptyIcon from "@/assets/CartEmptyIcon.svg";
import type { CartCalculatorProps, CartResponse } from "@/types";

interface CartCalculatorEnhancedProps extends CartCalculatorProps {
  onCheckout?: () => Promise<boolean>;
  isSubmitting?: boolean;
}

export default function CartCalculator({
  cartData,
  onClose,
  isLoading = false,
  onCheckout,
  isSubmitting = false,
}: CartCalculatorEnhancedProps & {
  cartData: CartResponse | null;
  isLoading?: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCheckout = location.pathname === "/checkout";
  const CartItemHeight = isCheckout ? 360 : 641;
  const gap = isCheckout ? 81 : 100;
  const ButtonContent = isCheckout
    ? isSubmitting
      ? "Processing..."
      : "Pay"
    : "Go to checkout";

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-poppins font-normal text-[14px]">Loading cart...</p>
      </div>
    );
  }

  // Empty state
  if (!cartData || cartData.length === 0) {
    const handleStartShopping = () => {
      if (isCheckout) {
        navigate("/products");
      } else {
        if (onClose) {
          onClose();
        }
      }
    };

    return (
      <div className="h-full flex flex-col items-center justify-start p-6 mt-[110px]">
        <img
          src={CartEmptyIcon}
          alt=""
          className="w-[170px] h-[135px] mb-[30px]"
        />
        <h2 className="font-poppins font-semibold text-[24px] leading-[24px] tracking-normal mb-[20px]">
          Ooops!
        </h2>
        <p className="font-poppins font-normal text-[14px] leading-[14px] tracking-normal text-center text-[#3E424A] mb-[61px]">
          You've got nothing in your cart just yet...
        </p>
        <button
          onClick={handleStartShopping}
          className="w-[214px] h-[41px] flex items-center justify-center gap-[10px] px-[20px] py-[10px] rounded-[10px] bg-customOrange text-white font-poppins font-normal text-[14px] leading-[14px] tracking-normal"
        >
          Start shopping
        </button>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cartData.reduce(
    (sum, item) => sum + (item.total_price || 0),
    0
  );
  const deliveryCost = 5;
  const totalCost = subtotal + deliveryCost;

  const handleButtonClick = async () => {
    if (isCheckout) {
      if (onCheckout) {
        const success = await onCheckout();
        if (success) {
          if (onClose) onClose();
          setIsModalOpen(true);
        }
      } else {
        if (onClose) onClose();
        setIsModalOpen(true);
      }
    } else {
      if (onClose) onClose();
      navigate("/checkout");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="h-full">
        <div
          className="flex flex-col space-y-[36px] overflow-y-auto overflow-x-hidden"
          style={{ height: `${CartItemHeight}px` }}
        >
          {cartData.map((item, index) => {
            const uniqueKey = `${item.id}-${item.color}-${item.size}-${index}`;
            return <CartItem key={uniqueKey} item={item} />;
          })}
        </div>
        <div
          className="flex flex-col justify-end items-center h-[270px]"
          style={{ gap: `${gap}px` }}
        >
          <div className="flex flex-col h-[110px] w-full gap-[26px]">
            <div className="flex flex-row justify-between items-center font-poppins font-normal text-[16px] leading-[16px] tracking-[0%] text-[#3E424A]">
              <p>Items subtotal</p>
              <p>$ {subtotal.toFixed(2)}</p>
            </div>

            <div className="flex flex-row justify-between items-center font-poppins font-normal text-[16px] leading-[16px] tracking-[0%] text-[#3E424A]">
              <p>Delivery</p>
              <p>$ {deliveryCost.toFixed(2)}</p>
            </div>

            <div className="flex flex-row justify-between items-center font-poppins font-semibold text-[20px] leading-[20px] tracking-[0%] text-[#10151F]">
              <p>Total</p>
              <p>${totalCost.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={handleButtonClick}
            disabled={isSubmitting}
            className={`flex items-center justify-center w-[460px] h-[59px] rounded-[10px] px-[60px] py-[16px] gap-[10px] font-poppins font-medium text-[18px] leading-[18px] tracking-[0%] text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-customOrange hover:bg-orange-600"
            }`}
          >
            {ButtonContent}
          </button>
        </div>
      </div>

      <CongratulationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
