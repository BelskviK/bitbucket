// src\types\components.ts
import type { FilterParams, Product } from "@/types/product";

// Product component props
export interface ProductProps {
  product?: Product;
}

// ProductsFilter component and its sub-components
export interface ProductsFilterProps {
  productsCount: number;
  showingFrom?: number;
  showingTo?: number;
  onFiltersChange: (filters: FilterParams) => void;
  onSortChange: (sort: string) => void;
  currentFilters: FilterParams;
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterParams) => void;
  currentFilters: FilterParams;
}

export interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySort: (sort: string) => void;
}

export interface FilterLabelProps {
  priceFrom: number;
  priceTo: number;
  onRemove: () => void;
}

// ProfileImg component props
export interface ProfileImgProps {
  avatar?: string;
  className?: string;
}

// Pagination component props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showingFrom: number;
  showingTo: number;
  totalItems: number;
}

// Pagination utility types
export interface PageNumbers {
  pages: (number | string)[];
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginationConfig {
  maxVisiblePages?: number;
  showEllipsis?: boolean;
  showFirstLast?: boolean;
}

// AvatarInput component props
export interface AvatarInputProps {
  onAvatarChange: (avatar: File | null) => void;
  currentAvatar?: string;
}

// Avatar input state types
export interface AvatarInputState {
  avatarPreview: string;
  isLoading: boolean;
  error?: string;
}

// File validation types
export interface FileValidationRules {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}
