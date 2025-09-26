// src/types/cart.ts
export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  color: string;
  size: string;
  product: {
    id: number;
    name: string;
    price: number;
    cover_image: string;
    images: string[];
  };
}

export interface CartResponse {
  items: CartItem[];
  total_price: number;
  total_items: number;
}

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
