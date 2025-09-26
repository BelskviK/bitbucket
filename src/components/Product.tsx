import { Link } from "react-router-dom";
import type { ProductProps } from "../types";

export default function Product({ product }: ProductProps) {
  if (!product) {
    return (
      <div className="w-[412px] h-[614px] bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading product...</span>
      </div>
    );
  }

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="w-[412px] h-[614px] bg-white rounded-lg overflow-hidden group cursor-pointer">
        {/* Product Image Section */}
        <div className="relative bg-gray-100 h-[542px] flex items-center justify-center">
          {product.cover_image ? (
            <img
              src={product.cover_image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-lg">Product Image</span>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="mt-[12px] h-[53px]">
          <h3 className="font-poppins font-semibold text-[18px] leading-[100%] tracking-normal text-gray-900 mb-2  transition-colors">
            {product.name}
          </h3>

          <p className="font-poppins font-semibold text-[16px] leading-[100%] tracking-normal text-gray-900">
            $ {product.price}
          </p>
        </div>
      </div>
    </Link>
  );
}
