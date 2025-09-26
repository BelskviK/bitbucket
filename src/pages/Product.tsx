// src/pages/ProductPage.tsx
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import DownButton from "../assets/DownButton.svg";
import CartIcon from "../assets/CartIcon.svg";
import DummyBrand from "../assets/image 6.svg";

export default function ProductPage() {
  // Get the product ID from the URL parameter
  const { id } = useParams<{ id: string }>();
  // Better ID parsing with debug logging
  console.log("URL id parameter:", id); // Debug log

  // Convert id to number, show error if invalid
  const productId = id ? parseInt(id, 10) : NaN;

  const { product, loading, error } = useProduct(productId);

  // Handle invalid ID
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

  // Use safe access with fallbacks based on your Product interface
  const images = product.images || [];
  const availableColors = product.available_colors || [];
  const availableSizes = product.available_sizes || [];

  const defaultColor = availableColors[0] || "Default Color";
  const defaultSize = availableSizes[0] || "M";

  return (
    <>
      <div className="px-[100px] bg-grey-200 pt-[30px] pb-[49px] w-full font-poppins font-light text-[14px] leading-[1] tracking-[0%]">
        Listing / Product / {product.name}
      </div>
      <div className="px-[100px] w-full h-full flex flex-row justify-center items-start">
        {/* Product Images Sidebar */}
        <div className="flex flex-col w-[121px] mr-[24px]   items-start justify-start h-auto space-y-[9px]">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                className="w-full min-h-[161px] bg-gray-200 overflow-hidden"
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/121x161";
                  }}
                />
              </div>
            ))
          ) : product.cover_image ? (
            // Fallback to cover image if no additional images
            <div className="w-full min-h-[161px] bg-gray-200 overflow-hidden">
              <img
                src={product.cover_image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/121x161";
                }}
              />
            </div>
          ) : (
            // Fallback if no images at all
            [...Array(3)].map((_, index) => (
              <div
                key={index}
                className="w-full min-h-[161px] bg-gray-200 overflow-hidden flex items-center justify-center"
              >
                <span className="text-gray-500">No image</span>
              </div>
            ))
          )}
        </div>

        {/* Main Product Image */}
        <div className="w-[703px] h-[937px] mr-[168px] bg-gray-200 flex items-center justify-center rounded-[10px] overflow-hidden">
          {product.cover_image ? (
            <img
              src={product.cover_image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/703x937";
                e.currentTarget.className = "w-full h-full object-contain";
              }}
            />
          ) : (
            <span className="text-gray-500 text-lg">No image available</span>
          )}
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
                  Color: <span>{defaultColor}</span>
                </p>
                <div className="flex flex-row items-center justify-start flex-wrap gap-2">
                  {availableColors.map((color, index) => (
                    <div
                      key={index}
                      className="w-[38px] h-[38px] rounded-full border-2 border-gray-300 p-1"
                    >
                      <div
                        className="w-full h-full rounded-full"
                        style={{
                          backgroundColor: getColorValue(color),
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
                  Size: <span>{defaultSize}</span>
                </p>
                <div className="flex flex-row gap-[10px] flex-wrap">
                  {availableSizes.map((size, index) => (
                    <button
                      key={index}
                      className="w-[70px] h-[42px] flex items-center justify-center border border-gray-300 rounded-[10px] px-[16px] py-[9px] hover:border-blue-500 transition-colors"
                    >
                      <span className="font-poppins font-normal text-[16px] leading-[1] tracking-normal">
                        {size}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="font-poppins font-normal text-[16px] leading-[1] tracking-normal mb-[16px] py-1">
                Quantity
              </p>
              <div className="flex flex-row justify-center items-center gap-[12px] border border-gray-300 rounded-[10px] w-[70px] h-[42px]">
                <p>1</p>
                <img
                  src={DownButton}
                  alt="Decrease quantity"
                  className="w-[20px] h-[20px]"
                />
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex justify-center items-center w-full">
            <button className="w-full rounded-[10px] bg-orange-500 hover:bg-orange-600 h-[59px] flex flex-row justify-center items-center gap-[12px] transition-colors">
              <img src={CartIcon} alt="Cart" className="w-[24px] h-[24px]" />
              <p className="font-poppins font-medium text-[18px] leading-[1] tracking-normal text-white">
                Add to cart
              </p>
            </button>
          </div>

          {/* Divider */}
          <div className="border-b border-gray-300 w-full"></div>

          {/* Description */}
          <div className="w-full">
            <div className="flex flex-row justify-between items-center mb-[12px]">
              <h3 className="font-poppins font-medium text-[20px] leading-[1] tracking-normal">
                Details
              </h3>
              <img
                src={DummyBrand}
                alt="Brand"
                className="w-[109px] h-[60px]"
              />
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
  return colorMap[lowerColor] || "#d1d5db"; // Default gray
}
