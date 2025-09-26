// src/pages/ProductPage.tsx
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { useState, useMemo, useEffect, useRef } from "react";

import DownButton from "../assets/DownButton.svg";
import CartIcon from "../assets/CartIcon.svg";

import CartModal from "../components/CartModal";

export default function ProductPage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const quantityRef = useRef<HTMLDivElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { user } = useAuth();

  const productId = useMemo(() => {
    if (!id) return NaN;
    const parsedId = parseInt(id, 10);
    return isNaN(parsedId) ? NaN : parsedId;
  }, [id]);

  const { product, loading, error } = useProduct(productId);

  // State for image management
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showQuantityDropdown, setShowQuantityDropdown] = useState(false);
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      // Redirect to login page if not authenticated
      navigate("/login");
      return;
    }

    setIsCartOpen(true);
  };
  // Set default values when product loads
  useEffect(() => {
    if (product) {
      const availableColors = product.available_colors || [];
      const availableSizes = product.available_sizes || [];

      setSelectedColor(availableColors[0] || "");
      setSelectedSize(availableSizes[0] || "");
      setSelectedImageIndex(0);
    }
  }, [product]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        quantityRef.current &&
        !quantityRef.current.contains(event.target as Node)
      ) {
        setShowQuantityDropdown(false);
      }
    }

    if (showQuantityDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showQuantityDropdown]);

  // Get current main image
  const getMainImage = () => {
    const images = product?.images || [];
    return images[selectedImageIndex] || product?.cover_image || "";
  };

  // Handle image click from sidebar
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    const availableColors = product?.available_colors || [];
    if (availableColors[index]) {
      setSelectedColor(availableColors[index]);
    }
  };

  // Handle color selection
  const handleColorSelect = (color: string, colorIndex: number) => {
    setSelectedColor(color);
    setSelectedImageIndex(colorIndex);
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  // Handle quantity change
  const handleQuantitySelect = (newQuantity: number) => {
    setQuantity(newQuantity);
    setShowQuantityDropdown(false);
  };

  // Loading and error states
  if (isNaN(productId)) {
    return (
      <div className="px-[100px] py-[30px]">Error: Invalid product ID</div>
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
        Error: {error || `Product #${productId} not found`}
      </div>
    );
  }

  const images = product.images || [];
  const availableColors = product.available_colors || [];
  const availableSizes = product.available_sizes || [];

  const mainImage = getMainImage();

  return (
    <>
      <div className="px-[100px] bg-grey-200 pt-[30px] pb-[49px] w-full font-poppins font-light text-[14px] leading-[1] tracking-[0%]">
        Listing / Product / {product.name}
      </div>
      <div className="px-[100px] w-full h-full flex flex-row justify-center items-start">
        {/* Product Images Sidebar */}
        <div className="flex flex-col w-[121px] mr-[24px] items-start justify-start h-auto space-y-[9px]">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                className={`w-full min-h-[161px] bg-gray-200 overflow-hidden cursor-pointer border-2 ${
                  selectedImageIndex === index
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

        {/* Main Product Image */}
        <div className="w-[703px] h-[937px] mr-[168px] bg-gray-200 flex items-center justify-center rounded-[10px] overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="w-[704px] h-[907px] flex flex-col items-start gap-[56px]">
          {/* Product Name and Price */}
          <div className="w-full">
            <p className="font-poppins font-semibold text-[32px] leading-[1] tracking-[0%] mb-[38px]">
              {product.name}
            </p>
            <p className="font-poppins font-semibold text-[32px] leading-[1] tracking-[0%]">
              $ {product.price.toFixed(2)}
            </p>
          </div>

          {/* Size and Color Filters */}
          <div className="w-full flex flex-col gap-[56px]">
            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <p className="font-poppins font-normal text-[16px] leading-[1] tracking-normal mb-[16px] py-1">
                  Color: <span>{selectedColor}</span>
                </p>
                <div className="flex flex-row items-center justify-start flex-wrap gap-2">
                  {availableColors.map((color, index) => (
                    <div
                      key={index}
                      className={`w-[48px] h-[48px] rounded-full p-1 cursor-pointer ${
                        selectedColor === color
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
                  Size: <span>{selectedSize}</span>
                </p>
                <div className="flex flex-row gap-[10px] flex-wrap">
                  {availableSizes.map((size, index) => (
                    <button
                      key={index}
                      className={`w-[70px] h-[42px] flex items-center justify-center border rounded-[10px] px-[16px] py-[9px] transition-colors ${
                        selectedSize === size
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
                  onClick={() => setShowQuantityDropdown(!showQuantityDropdown)}
                >
                  <p>{quantity}</p>
                  <img
                    src={DownButton}
                    alt="Change quantity"
                    className="w-[20px] h-[20px]"
                  />
                </div>

                {/* Quantity Dropdown */}
                {showQuantityDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-[100px] bg-white border border-gray-300 rounded-[10px] shadow-lg z-10">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
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

          {/* Add to Cart Button */}
          <div className="flex justify-center items-center w-full">
            <button
              className="w-full rounded-[10px] bg-orange-500 hover:bg-orange-600 h-[59px] flex flex-row justify-center items-center gap-[12px] transition-colors"
              onClick={handleAddToCart} // Just pass the function reference
            >
              <img src={CartIcon} alt="Cart" className="w-[24px] h-[24px]" />
              <p className="font-poppins font-medium text-[18px] leading-[1] tracking-normal text-white">
                Add to cart
              </p>
            </button>
          </div>

          <div className="border-b border-gray-300 w-full"></div>

          {/* Description */}
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
              {product.release_year && (
                <div className="mb-[24px]">
                  <p className="font-poppins font-normal text-[16px] leading-[1] tracking-normal">
                    Release Year: <span>{product.release_year}</span>
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
      {user && (
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
}

// Helper function to map color names to actual colors
function getColorValue(colorName: string): string {
  const colorMap: { [key: string]: string } = {
    blue: "#3b82f6",
    red: "#ef4444",
    green: "#10b981",
    black: "#000000",
    white: "#ffffff",
    grey: "#6b7280",
    gray: "#6b7280",
    pink: "#ec4899",
    orange: "#f97316",
    purple: "#8b5cf6",
    yellow: "#eab308",
    "navy blue": "#1e3a8a",
    "baby pink": "#fbcfe8",
    beige: "#f5f5dc",
    multi: "#8b5cf6",
  };

  const lowerColor = colorName.toLowerCase();
  return colorMap[lowerColor] || "#d1d5db";
}
