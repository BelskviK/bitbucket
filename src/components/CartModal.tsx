// src/components/CartModal.tsx
import { useEffect } from "react";
import CloseIcon from "../assets/CloseIcon.svg";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
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
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="font-poppins font-semibold text-[24px] leading-[1]">
              Your Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <img src={CloseIcon} alt="Close" className="w-6 h-6" />
            </button>
          </div>

          {/* Empty Content */}
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center text-gray-500">
              <p className="font-poppins text-lg mb-2">Your cart is empty</p>
              <p className="text-sm">Add some products to get started</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
