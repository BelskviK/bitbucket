// src/services/CartManager.ts
import { CartService } from "@/services/CartService";
import type { CartResponse } from "@/types";

class CartManager {
  private static instance: CartManager;
  private cartData: CartResponse | null = null;
  private listeners: Array<(cart: CartResponse | null) => void> = [];

  private constructor() {}

  static getInstance(): CartManager {
    if (!CartManager.instance) {
      CartManager.instance = new CartManager();
    }
    return CartManager.instance;
  }

  async fetchCart(): Promise<CartResponse> {
    try {
      const cart = await CartService.getCart();
      this.cartData = cart;
      this.notifyListeners();
      return cart;
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      throw error;
    }
  }

  getCart(): CartResponse | null {
    return this.cartData;
  }

  subscribe(listener: (cart: CartResponse | null) => void): () => void {
    this.listeners.push(listener);
    listener(this.cartData);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.cartData));
  }

  clearCart(): void {
    this.cartData = null;
    this.notifyListeners();
  }
}

export const cartManager = CartManager.getInstance();
