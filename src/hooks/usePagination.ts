import { useMemo } from "react";
import type { PageNumbers, PaginationConfig } from "../types";

export const usePagination = (
  currentPage: number,
  totalPages: number,
  config?: PaginationConfig
): PageNumbers => {
  const {
    maxVisiblePages = 5,
    showEllipsis = true,
    showFirstLast = false,
  } = config || {};

  return useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= 1) {
      return { pages: [], hasPrevious: false, hasNext: false };
    }

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic with ellipsis
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (showFirstLast && startPage > 1) {
        pages.push(1);
        if (showEllipsis && startPage > 2) {
          pages.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (showFirstLast && endPage < totalPages) {
        if (showEllipsis && endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return {
      pages,
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages,
    };
  }, [currentPage, totalPages, maxVisiblePages, showEllipsis, showFirstLast]);
};
