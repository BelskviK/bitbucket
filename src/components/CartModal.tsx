// src/components/CartModal.tsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import CloseIcon from "../assets/CloseIcon.svg";
import CartEmptyIcon from "../assets/CartEmptyIcon.svg";
import CartItem from "./CartItem";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  // Example cart count (make this dynamic later from state/context)
  const cartCount: number = 2;

  // Prevent body scroll when modal is open
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

  // Close modal when clicking on overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay with fade animation */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleOverlayClick}
      >
        {/* Modal with slide animation */}
        <div
          className={`fixed right-0 top-0 h-full w-[540px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 mt-[20px] mb-[42px]">
            <h2 className="font-poppins font-semibold text-[20px] leading-[20px] tracking-normal pl-[15px] ">
              Shopping cart ({cartCount})
            </h2>

            <button
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full transition-colors mr-[18px]"
            >
              <img src={CloseIcon} alt="Close" className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* Conditional Content */}
          {cartCount === 0 ? (
            <div className="h-full flex flex-col items-center justify-start p-6 mt-[110px]">
              <img
                src={CartEmptyIcon}
                alt=""
                className=" w-[170px] h-[135px] mb-[30px]"
              />
              <h2 className="font-poppins font-semibold text-[24px] leading-[24px] tracking-normal mb-[20px]">
                Ooops!
              </h2>
              <p className="font-poppins font-normal text-[14px] leading-[14px] tracking-normal text-center text-[#3E424A] mb-[61px]">
                You’ve got nothing in your cart just yet...
              </p>

              <button
                onClick={onClose}
                className="w-[214px] h-[41px] flex items-center justify-center gap-[10px] px-[20px] py-[10px] rounded-[10px] bg-customOrange text-white font-poppins font-normal text-[14px] leading-[14px] tracking-normal"
              >
                Start shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col px-[42px] space-y-[36px] h-[600px]">
                {Array.from({ length: cartCount }).map((_, idx) => (
                  <CartItem key={idx} id={idx + 1} />
                ))}
              </div>
              <div className="flex flex-col justify-end items-center h-[310px] gap-[100px]">
                <div className=" flex flex-col h-[110px] w-full px-[40px] gap-[24px]">
                  <div className="flex flex-row justify-between items-center font-poppins font-normal text-[16px] leading-[16px] tracking-[0%] text-[#3E424A] ">
                    <p>Items subtotal</p>
                    <p>$ 50</p>
                  </div>

                  <div className="flex flex-row justify-between items-center font-poppins font-normal text-[16px] leading-[16px] tracking-[0%] text-[#3E424A] ">
                    <p>Delivery</p>
                    <p>$ 5</p>
                  </div>

                  <div className="flex flex-row justify-between items-center font-poppins font-semibold text-[20px] leading-[20px] tracking-[0%] text-[#10151F]">
                    <p>Total</p>
                    <p>$55</p>
                  </div>
                </div>{" "}
                <Link to="/checkout">
                  <button className="flex items-center justify-center w-[460px] h-[59px] rounded-[10px] px-[60px] py-[16px] gap-[10px] bg-customOrange font-poppins font-medium text-[18px] leading-[18px] tracking-[0%] text-white">
                    Go to checkout
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
