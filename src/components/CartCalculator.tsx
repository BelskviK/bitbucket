// src/components/CartCalculator.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import { useState } from "react";
import CongratulationModal from "./CongratulationModal";
import type { CartCalculatorProps } from "../types";
export default function CartCalculator({
  ProductCount,
  onClose,
}: CartCalculatorProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // decide heights based on path
  const isCheckout = location.pathname === "/checkout";
  const CartItemHeight = isCheckout ? 360 : 641;
  const gap = isCheckout ? 81 : 100;
  const ButtonContent = isCheckout ? "Pay" : "Go to checkout";

  const handleButtonClick = () => {
    if (isCheckout) {
      // If on checkout page, close the cart modal and open the congratulation modal
      onClose(); // Close the cart modal
      setIsModalOpen(true); // Open the congratulation modal
    } else {
      // Otherwise, navigate to checkout and close the cart modal
      onClose(); // Close the cart modal
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
          {Array.from({ length: ProductCount }).map((_, idx) => (
            <CartItem key={idx} id={idx + 1} />
          ))}
        </div>
        <div
          className="flex flex-col justify-end items-center h-[270px]"
          style={{ gap: `${gap}px` }}
        >
          <div className="flex flex-col h-[110px] w-full gap-[26px]">
            <div className="flex flex-row justify-between items-center font-poppins font-normal text-[16px] leading-[16px] tracking-[0%] text-[#3E424A]">
              <p>Items subtotal</p>
              <p>$ 50</p>
            </div>

            <div className="flex flex-row justify-between items-center font-poppins font-normal text-[16px] leading-[16px] tracking-[0%] text-[#3E424A]">
              <p>Delivery</p>
              <p>$ 5</p>
            </div>

            <div className="flex flex-row justify-between items-center font-poppins font-semibold text-[20px] leading-[20px] tracking-[0%] text-[#10151F]">
              <p>Total</p>
              <p>$55</p>
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

      {/* Congratulation Modal */}
      <CongratulationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
