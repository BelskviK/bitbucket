// src/components/CongratulationModal.tsx
import { useNavigate } from "react-router-dom";
import TickIcon from "../assets/TickIcon.svg";
import CloseIcon from "../assets/CloseIcon.svg";
import { useEffect, useState } from "react";

interface CongratulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CongratulationModal({
  isOpen,
  onClose,
}: CongratulationModalProps) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleContinueShopping = () => {
    onClose();
    navigate("/products");
  };

  // Trigger animation when isOpen changes
  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal container with pop-in animation */}
      <div
        className={`bg-white relative transform transition-all duration-300 ${
          show ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        style={{ width: "876px", height: "590px" }}
      >
        {/* Close button on top right */}
        <button
          onClick={handleContinueShopping}
          className="absolute top-[30px] right-[30px] z-10 w-[40px] h-[40px] text-white rounded-full flex items-center justify-center"
        >
          <img src={CloseIcon} alt="Close" className="w-6 h-6" />
        </button>

        {/* Main content */}
        <div className="flex flex-col items-center justify-start h-full text-center pt-[116px]">
          <div className="mb-[48px]">
            <img src={TickIcon} alt="Success" className="w-20 h-20 mx-auto" />
          </div>

          <h2 className="font-poppins font-semibold text-[42px] leading-[100%] tracking-[0%] text-[#10151F] text-center mb-[30px]">
            Congrats!
          </h2>

          <p className="font-poppins font-normal text-[14px] leading-[100%] tracking-[0%] text-[#3E424A] text-center mb-[76px]">
            Your order is placed successfully!
          </p>

          <button
            onClick={handleContinueShopping}
            className="bg-customOrange hover:bg-gray-100 text-white font-poppins font-normal text-[14px] leading-[100%] tracking-[0%] py-3 px-8 rounded-lg transition-colors min-w-[214px] min-h-[44px]"
          >
            <p className="font-poppins font-normal text-[14px] leading-[100%] tracking-[0%] text-white">
              Continue Shopping
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
