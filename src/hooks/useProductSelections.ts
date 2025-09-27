import { useState, useEffect } from "react";
import type { Product } from "@/types";

interface UseProductSelectionsReturn {
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  showQuantityDropdown: boolean;
  setShowQuantityDropdown: (show: boolean) => void;
}

export const useProductSelections = (
  product: Product | null
): UseProductSelectionsReturn => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showQuantityDropdown, setShowQuantityDropdown] = useState(false);

  useEffect(() => {
    if (product) {
      const colors = product.available_colors || [];
      const sizes = product.available_sizes || [];
      setSelectedColor(colors[0] || "");
      setSelectedSize(sizes[0] || "");
      setSelectedImageIndex(0);
    }
  }, [product]);

  return {
    selectedImageIndex,
    setSelectedImageIndex,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    showQuantityDropdown,
    setShowQuantityDropdown,
  };
};
