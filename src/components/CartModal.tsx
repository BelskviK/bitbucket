// src/components/CartModal.tsx
import { useEffect, useState } from "react";
import CloseIcon from "../assets/CloseIcon.svg";
import CartCalculator from "./CartCalculator";
import type { CartModalProps, CartResponse } from "../types";
import { cartManager } from "../services/CartManager";
import { useAuth } from "../hooks/useAuth";

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = cartManager.subscribe(setCartData);
    return unsubscribe;
  }, []);

  // Add useEffect to fetch cart data when modal opens
  useEffect(() => {
    const fetchCart = async () => {
      if (isOpen && user) {
        setIsLoading(true);
        try {
          await cartManager.fetchCart();
        } catch (error) {
          console.error("Failed to load cart:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCart();
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const productCount = cartData?.length || 0;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 h-full transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleOverlayClick}
      >
        <div
          className={`fixed right-0 top-0 h-full w-[540px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-6 mt-[20px] mb-[42px]">
            <h2 className="font-poppins font-semibold text-[20px] leading-[20px] tracking-normal pl-[15px]">
              Shopping cart ({productCount})
            </h2>
            <button
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full transition-colors mr-[18px]"
            >
              <img src={CloseIcon} alt="Close" className="w-[18px] h-[18px]" />
            </button>
          </div>

          <div className="px-[40px]">
            <CartCalculator
              cartData={cartData}
              onClose={onClose}
              isLoading={isLoading} // Pass loading state
            />
          </div>
        </div>
      </div>
    </>
  );
}
