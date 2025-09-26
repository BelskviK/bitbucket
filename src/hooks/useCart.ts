// src/hooks/useCart.ts
import { useState, useCallback } from "react";
import { CartService } from "../services/cartservice";
import type {
  CartResponse,
  AddToCartRequest,
  CheckoutRequest,
  CheckoutResponse,
} from "../types";

// Add proper error type
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCart = useCallback(async (): Promise<CartResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const cart = await CartService.getCart();
      return cart;
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to fetch cart";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (
      productId: number,
      data: AddToCartRequest
    ): Promise<CartResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const cart = await CartService.addToCart(productId, data);
        return cart;
      } catch (err) {
        const apiError = err as ApiError;
        const message =
          apiError.response?.data?.message || "Failed to add item to cart";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (
      productId: number,
      quantity: number
    ): Promise<CartResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const cart = await CartService.updateCartItem(productId, { quantity });
        return cart;
      } catch (err) {
        const apiError = err as ApiError;
        const message =
          apiError.response?.data?.message || "Failed to update quantity";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeFromCart = useCallback(
    async (productId: number): Promise<CartResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const cart = await CartService.removeFromCart(productId);
        return cart;
      } catch (err) {
        const apiError = err as ApiError;
        const message =
          apiError.response?.data?.message || "Failed to remove item from cart";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const checkout = useCallback(
    async (data: CheckoutRequest): Promise<CheckoutResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await CartService.checkout(data);
        return result;
      } catch (err) {
        const apiError = err as ApiError;
        const message = apiError.response?.data?.message || "Checkout failed";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearCart = useCallback(async (): Promise<CartResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const cart = await CartService.clearCart();
      return cart;
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to clear cart";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    checkout,
    clearCart,
    clearError: () => setError(null),
  };
};
