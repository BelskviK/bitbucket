import { useMemo } from "react";
import type { Product } from "@/types";

interface UseProductImagesReturn {
  images: string[];
  mainImage: string;
  getMainImage: () => string;
}

export const useProductImages = (
  product: Product | null,
  selectedImageIndex: number
): UseProductImagesReturn => {
  const images = useMemo(() => product?.images || [], [product?.images]);

  const getMainImage = () => {
    return images[selectedImageIndex] || product?.cover_image || "";
  };

  const mainImage = getMainImage();

  return {
    images,
    mainImage,
    getMainImage,
  };
};
