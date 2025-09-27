// src/types/cart.ts
export interface CartItem {
  id: number;
  name: string;
  description: string;
  release_year: string;
  cover_image: string;
  images: string[];
  price: number;
  available_colors: string[];
  available_sizes: string[];
  total_price: number;
  quantity: number;
  color: string;
  size: string;
}
export type CartResponse = CartItem[];

export interface AddToCartRequest {
  quantity: number;
  color: string;
  size: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CheckoutRequest {
  name: string;
  surname: string;
  email: string;
  zip_code: string;
  address: string;
}

export interface CheckoutResponse {
  order_id: number;
  message: string;
  total_amount: number;
}

export interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CartCalculatorProps {
  onClose: () => void;
  cartData: CartResponse | null;
}
