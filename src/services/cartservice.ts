// src/services/cartservice.ts
import api from "./api";
import type {
  CartResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
  CheckoutRequest,
  CheckoutResponse,
} from "../types";

export const CartService = {
  /**
   * Get user's cart - returns array directly
   */
  async getCart(): Promise<CartResponse> {
    try {
      const response = await api.get<CartResponse>("/cart");

      return response.data;
    } catch (error) {
      console.error("❌ CartService: Failed to fetch cart:", error);
      throw error;
    }
  },

  // ... keep other methods the same
  async addToCart(
    productId: number,
    data: AddToCartRequest
  ): Promise<CartResponse> {
    const response = await api.post(`/cart/products/${productId}`, data);
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(
    productId: number,
    data: UpdateCartItemRequest
  ): Promise<CartResponse> {
    const response = await api.patch(`/cart/products/${productId}`, data);
    return response.data;
  },

  /**
   * Remove product from cart
   */
  async removeFromCart(productId: number): Promise<CartResponse> {
    const response = await api.delete(`/cart/products/${productId}`);
    return response.data;
  },

  /**
   * Checkout cart
   */
  async checkout(data: CheckoutRequest): Promise<CheckoutResponse> {
    const response = await api.post("/cart/checkout", data);
    return response.data;
  },

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<CartResponse> {
    const response = await api.delete("/cart");
    return response.data;
  },
};
