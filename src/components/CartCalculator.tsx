// src/components/CartCalculator.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import { useState } from "react";
import CongratulationModal from "./CongratulationModal";
import type { CartCalculatorProps, CartResponse } from "../types";

export default function CartCalculator({
  cartData,
  onClose,
}: CartCalculatorProps & { cartData: CartResponse | null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCheckout = location.pathname === "/checkout";
  const CartItemHeight = isCheckout ? 360 : 641;
  const gap = isCheckout ? 81 : 100;
  const ButtonContent = isCheckout ? "Pay" : "Go to checkout";

  if (!cartData || cartData.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="font-poppins font-normal text-[14px] text-[#3E424A]">
          Your cart is empty
        </p>
      </div>
    );
  }

  const subtotal = cartData.reduce(
    (sum, item) => sum + (item.total_price || 0),
    0
  );
  const deliveryCost = 5;
  const totalCost = subtotal + deliveryCost;

  const handleButtonClick = () => {
    if (isCheckout) {
      onClose();
      setIsModalOpen(true);
    } else {
      onClose();
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
          {cartData.map((item, index) => (
            <CartItem key={item.id || index} item={item} />
          ))}
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

          {isCheckout ? (
            <button
              onClick={handleButtonClick}
              className="flex items-center justify-center w-[460px] h-[59px] rounded-[10px] px-[60px] py-[16px] gap-[10px] bg-customOrange font-poppins font-medium text-[18px] leading-[18px] tracking-[0%] text-white"
            >
              {ButtonContent}
            </button>
          ) : (
            <Link to="/checkout">
              <button
                onClick={onClose}
                className="flex items-center justify-center w-[460px] h-[59px] rounded-[10px] px-[60px] py-[16px] gap-[10px] bg-customOrange font-poppins font-medium text-[18px] leading-[18px] tracking-[0%] text-white"
              >
                {ButtonContent}
              </button>
            </Link>
          )}
        </div>
      </div>

      <CongratulationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
