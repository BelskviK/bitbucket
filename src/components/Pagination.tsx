// src/components/Pagination.tsx
import BackButton from "../assets/BackButton.svg";
import ForwardButton from "../assets/ForwardButton.svg";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showingFrom: number;
  showingTo: number;
  totalItems: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Show all pages if total pages is less than or equal to 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the beginning: show 2, 3, 4, ..., last
        pages.push(2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end: show first, ..., last-3, last-2, last-1, last
        pages.push(
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // In the middle: show first, ..., current-1, current, current+1, ..., last
        pages.push(
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="w-full flex justify-center items-center space-x-2">
      {/* Previous */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center bg-white text-gray-700 rounded-md"
      >
        <img src={BackButton} alt="Previous" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        const isActive = page === currentPage;

        if (page === "...") {
          return (
            <span
              key={index}
              className="flex font-poppins items-center justify-center rounded-[4px] bg-white border-[1px] w-[32px] h-[32px] border-gray-100 text-gray-500 font-medium"
            >
              …
            </span>
          );
        }

        return (
          <button
            key={index}
            onClick={() => onPageChange(page as number)}
            className={`flex font-poppins items-center justify-center rounded-[4px] bg-white border-[1px] w-[32px] h-[32px] ${
              isActive
                ? "border-customOrange text-customOrange font-medium"
                : "border-gray-100 text-gray-500 font-medium"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center bg-white text-gray-700 rounded-md"
      >
        <img src={ForwardButton} alt="Next" />
      </button>
    </div>
  );
}
