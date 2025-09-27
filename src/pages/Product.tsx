// src/pages/Product.tsx
import { useParams } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

import { useProduct } from "@/hooks/useProducts";
import { useProductSelections } from "@/hooks/useProductSelections";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useProductImages } from "@/hooks/useProductImages";
import CartModal from "@/components/cart/CartModal";
import { QUANTITY_OPTIONS, ERROR_MESSAGES } from "@/constants";
import { getColorValue, validateProductId } from "@/utils/helpers";
import DownButton from "@/assets/DownButton.svg";
import CartIcon from "@/assets/CartIcon.svg";

export default function ProductPage() {
  // ===== HOOKS & PARAMS =====
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const productId = validateProductId(id) || NaN;

  // ===== DATA HOOKS =====
  const { product, loading, error } = useProduct(productId);
  const selections = useProductSelections(product);
  const { images, mainImage } = useProductImages(
    product,
    selections.selectedImageIndex
  );

  // ===== CART HOOKS =====
  const cart = useAddToCart(productId, user);

  // ===== UI HOOKS =====
  const quantityRef = useRef<HTMLDivElement>(null);
  useClickOutside(quantityRef, selections.showQuantityDropdown, () =>
    selections.setShowQuantityDropdown(false)
  );

  // ===== DERIVED VALUES =====
  const availableColors = product?.available_colors || [];
  const availableSizes = product?.available_sizes || [];

  // ===== EVENT HANDLERS =====
  const handleImageClick = (index: number) => {
    selections.setSelectedImageIndex(index);
    if (availableColors[index]) {
      selections.setSelectedColor(availableColors[index]);
    }
  };

  const handleColorSelect = (color: string, colorIndex: number) => {
    selections.setSelectedColor(color);
    selections.setSelectedImageIndex(colorIndex);
  };

  const handleSizeSelect = (size: string) => {
    selections.setSelectedSize(size);
  };

  const handleQuantitySelect = (newQuantity: number) => {
    selections.setQuantity(newQuantity);
    selections.setShowQuantityDropdown(false);
  };

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await cart.handleAddToCart(
      selections.selectedColor,
      selections.selectedSize,
      selections.quantity
    );
  };

  // ===== LOADING & ERROR STATES =====
  if (isNaN(productId)) {
    return (
      <div className="px-[100px] py-[30px]">
        {ERROR_MESSAGES.INVALID_PRODUCT_ID}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-[100px] py-[30px]">
        Loading product #{productId}...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-[100px] py-[30px]">
        Error: {error || ERROR_MESSAGES.PRODUCT_NOT_FOUND}
      </div>
    );
  }

  // ===== MAIN RENDER =====
  return (
    <>
      {/* Breadcrumb */}
      <div className="px-[100px] bg-grey-200 pt-[30px] pb-[49px] w-full font-poppins font-light text-[14px] leading-[1] tracking-[0%]">
        Listing / Product / {product.name}
      </div>

      {/* Product Content */}
      <div className="px-[100px] w-full h-full flex flex-row justify-center items-start">
        {/* Image Sidebar */}
        <div className="flex flex-col w-[121px] mr-[24px] items-start justify-start h-auto space-y-[9px]">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                className={`w-full min-h-[161px] bg-gray-200 overflow-hidden cursor-pointer border-2 ${
                  selections.selectedImageIndex === index
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="w-full min-h-[161px] bg-gray-200 overflow-hidden">
              <img
                src={product.cover_image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Main Image */}
        <div className="w-[703px] h-[937px] mr-[168px] bg-gray-200 flex items-center justify-center rounded-[10px] overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="w-[704px] h-[907px] flex flex-col items-start gap-[56px]">
          {/* Name & Price */}
          <div className="w-full">
            <p className="font-poppins font-semibold text-[32px] leading-[1] tracking-[0%] mb-[38px]">
              {product.name}
            </p>
            <p className="font-poppins font-semibold text-[32px] leading-[1] tracking-[0%]">
              $ {product.price}
            </p>
          </div>

          {/* Selection Options */}
          <div className="w-full flex flex-col gap-[56px]">
            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <p className="font-poppins font-normal text-[16px] leading-[1] tracking-normal mb-[16px] py-1">
                  Color: <span>{selections.selectedColor}</span>
                </p>
                <div className="flex flex-row items-center justify-start flex-wrap gap-2">
                  {availableColors.map((color, index) => (
                    <div
                      key={index}
                      className={`w-[48px] h-[48px] rounded-full p-1 cursor-pointer ${
                        selections.selectedColor === color
                          ? "border-2 border-customGray"
                          : "border-2 border-transparent"
                      }`}
                      onClick={() => handleColorSelect(color, index)}
                    >
                      <div
                        className="w-full h-full rounded-full"
                        style={{
                          backgroundColor: getColorValue(color),
                          boxShadow: "0 0 10px 2px rgba(0,0,0,0.15)",
                        }}
                        title={color}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="flex flex-col gap-[6px]">
                <p className="font-poppins font-normal text-[16px] mb-[16px] leading-[1] tracking-normal">
                  Size: <span>{selections.selectedSize}</span>
                </p>
                <div className="flex flex-row gap-[10px] flex-wrap">
                  {availableSizes.map((size, index) => (
                    <button
                      key={index}
                      className={`w-[70px] h-[42px] flex items-center justify-center border rounded-[10px] px-[16px] py-[9px] transition-colors ${
                        selections.selectedSize === size
                          ? "border-customBlack text-customBlack"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      <span className="font-poppins font-normal text-[16px] leading-[1] tracking-normal">
                        {size}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div ref={quantityRef}>
              <div className="relative">
                <p className="font-poppins font-normal text-[16px] leading-[1] tracking-normal mb-[16px] py-1">
                  Quantity
                </p>
                <div
                  className="flex flex-row justify-between items-center gap-[12px] border border-gray-300 rounded-[10px] w-[100px] h-[42px] px-3 cursor-pointer"
                  onClick={() =>
                    selections.setShowQuantityDropdown(
                      !selections.showQuantityDropdown
                    )
                  }
                >
                  <p>{selections.quantity}</p>
                  <img
                    src={DownButton}
                    alt="Change quantity"
                    className="w-[20px] h-[20px]"
                  />
                </div>

                {selections.showQuantityDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-[100px] bg-white border border-gray-300 rounded-[10px] shadow-lg z-10">
                    {QUANTITY_OPTIONS.map((num) => (
                      <div
                        key={num}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => handleQuantitySelect(num)}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {cart.addToCartError && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-[10px]">
              <p className="font-poppins font-normal text-[14px] text-red-600 text-center">
                {cart.addToCartError}
              </p>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="flex justify-center items-center w-full">
            <button
              className={`w-full rounded-[10px] h-[59px] flex flex-row justify-center items-center gap-[12px] transition-colors ${
                cart.isAddingToCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
              onClick={handleAddToCartClick}
              disabled={cart.isAddingToCart}
            >
              <img src={CartIcon} alt="Cart" className="w-[24px] h-[24px]" />
              <p className="font-poppins font-medium text-[18px] leading-[1] tracking-normal text-white">
                {cart.isAddingToCart ? "Adding..." : "Add to cart"}
              </p>
            </button>
          </div>

          <div className="border-b border-gray-300 w-full"></div>

          {/* Product Details */}
          <div className="w-full">
            <div className="flex flex-row justify-between items-center mb-[12px]">
              <h3 className="font-poppins font-medium text-[20px] leading-[1] tracking-normal">
                Details
              </h3>
              {product.brand && (
                <img
                  src={product.brand.image}
                  alt={product.brand.name}
                  className="w-[109px] h-[60px] object-contain"
                />
              )}
            </div>
            <div>
              {product.brand && (
                <div className="mb-[24px]">
                  <p className="font-poppins font-normal text-[16px] leading-[1] tracking-normal">
                    Brand: <span>{product.brand.name}</span>
                  </p>
                </div>
              )}
              {product.description && (
                <div className="font-poppins font-normal text-[16px] leading-[24px] tracking-normal">
                  {product.description}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {user && (
        <CartModal
          isOpen={cart.isCartOpen}
          onClose={() => cart.setIsCartOpen(false)}
        />
      )}
    </>
  );
}
