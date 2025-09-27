import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartService } from "@/services/CartService";
import { cartManager } from "@/services/CartManager";
import { ERROR_MESSAGES } from "@/constants";
import { extractErrorMessage } from "@/utils/helpers";
import type { User, AddToCartRequest } from "@/types";

interface UseAddToCartReturn {
  isAddingToCart: boolean;
  addToCartError: string | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  setAddToCartError: (error: string | null) => void;
  handleAddToCart: (
    selectedColor: string,
    selectedSize: string,
    quantity: number
  ) => Promise<void>;
}

export const useAddToCart = (
  productId: number,
  user: User | null
): UseAddToCartReturn => {
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = async (
    selectedColor: string,
    selectedSize: string,
    quantity: number
  ) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedColor || !selectedSize) {
      setAddToCartError(ERROR_MESSAGES.SELECT_COLOR_SIZE);
      return;
    }

    if (quantity < 1) {
      setAddToCartError(ERROR_MESSAGES.INVALID_QUANTITY);
      return;
    }

    setIsAddingToCart(true);
    setAddToCartError(null);

    try {
      const addToCartData: AddToCartRequest = {
        quantity,
        color: selectedColor,
        size: selectedSize,
      };

      await CartService.addToCart(productId, addToCartData);
      await cartManager.fetchCart();
      setIsCartOpen(true);
    } catch (error: unknown) {
      setAddToCartError(
        extractErrorMessage(error) || ERROR_MESSAGES.ADD_TO_CART_FAILED
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  return {
    isAddingToCart,
    addToCartError,
    isCartOpen,
    setIsCartOpen,
    setAddToCartError,
    handleAddToCart,
  };
};
