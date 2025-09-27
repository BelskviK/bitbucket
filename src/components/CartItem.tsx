// src/components/CartItem.tsx
import { useState } from "react";
import type { CartItem as CartItemType } from "../types";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increment = () => {
    setQuantity(quantity + 1);
  };

  const handleRemove = () => {
    // TODO: Remove item via CartService
  };

  return (
    <div className="flex flex-row items-center justify-between w-[460px] h-[135px]">
      <img
        src={item.cover_image}
        alt={item.name}
        className="w-[100px] h-[135px] mr-[17px] object-cover"
      />
      <div className="flex flex-col w-full justify-between items-start py-[8.5px] gap-[13px]">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-col items-start justify-between w-[285px] gap-[16px]">
            <h5 className="font-poppins font-semibold text-[14px] leading-[14px] tracking-normal text-[#10151F]">
              {item.name}
            </h5>
            <span className="font-poppins font-normal text-[12px] leading-[12px] tracking-normal text-[#3E424A]">
              {item.color}
            </span>
            <span className="font-poppins font-normal text-[12px] leading-[12px] tracking-normal text-[#3E424A]">
              {item.size}
            </span>
          </div>
          <p className="font-poppins font-semibold text-[18px] leading-[18px] tracking-[0%] text-[#10151F] text-right w-auto self-start">
            $ {item.total_price || item.price || 0}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex items-center justify-center gap-[2px] w-[70px] h-[26px] border border-gray-300 rounded-[22px] px-[8px] py-[4px]">
            <button
              onClick={decrement}
              disabled={quantity === 1}
              className={`font-poppins font-normal text-[18px] leading-[12px] tracking-normal text-gray-700 w-[16px] h-[16px] flex items-center justify-center ${
                quantity === 1 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              -
            </button>
            <span className="font-poppins font-normal text-[12px] leading-[12px] tracking-normal text-gray-700 w-[20px] h-[18px] flex items-center justify-center">
              {quantity}
            </span>
            <button
              onClick={increment}
              className="font-poppins font-normal text-[18px] leading-[12px] tracking-normal text-gray-700 w-[16px] h-[16px] flex items-center justify-center"
            >
              +
            </button>
          </div>
          <button
            onClick={handleRemove}
            className="font-poppins font-normal text-[12px] leading-[12px] tracking-[0%] text-[#3E424A] hover:text-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
