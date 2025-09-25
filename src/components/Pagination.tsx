import BackButton from "../assets/BackButton.svg";
import ForwardButton from "../assets/ForwardButton.svg";
import type { PaginationProps } from "../types";
import { usePagination } from "../hooks/usePagination";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showingFrom,
  showingTo,
  totalItems,
}: PaginationProps) {
  const { pages, hasPrevious, hasNext } = usePagination(
    currentPage,
    totalPages,
    {
      maxVisiblePages: 5,
      showEllipsis: true,
    }
  );

  const handlePrevious = () => hasPrevious && onPageChange(currentPage - 1);
  const handleNext = () => hasNext && onPageChange(currentPage + 1);
  const handlePageClick = (page: number | string) =>
    typeof page === "number" && onPageChange(page);

  if (totalPages <= 1) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Results summary */}
      <div className="text-sm text-gray-600 font-poppins">
        Showing {showingFrom} to {showingTo} of {totalItems} results
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center space-x-2">
        <PaginationButton
          onClick={handlePrevious}
          disabled={!hasPrevious}
          aria-label="Previous page"
        >
          <img src={BackButton} alt="Previous" className="w-4 h-4" />
        </PaginationButton>

        {pages.map((page, index) => (
          <PageNumber
            key={
              typeof page === "number" ? `page-${page}` : `ellipsis-${index}`
            }
            page={page}
            currentPage={currentPage}
            onClick={handlePageClick}
          />
        ))}

        <PaginationButton
          onClick={handleNext}
          disabled={!hasNext}
          aria-label="Next page"
        >
          <img src={ForwardButton} alt="Next" className="w-4 h-4" />
        </PaginationButton>
      </div>
    </div>
  );
}

// Sub-components for better organization
interface PaginationButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  "aria-label": string;
}

const PaginationButton = ({
  children,
  onClick,
  disabled,
  ...props
}: PaginationButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-white text-gray-700 hover:bg-gray-100"
    }`}
    {...props}
  >
    {children}
  </button>
);

interface PageNumberProps {
  page: number | string;
  currentPage: number;
  onClick: (page: number | string) => void;
}

const PageNumber = ({ page, currentPage, onClick }: PageNumberProps) => {
  const isActive = page === currentPage;
  const isEllipsis = page === "...";
  const isNumber = typeof page === "number";

  if (isEllipsis) {
    return (
      <span
        className="flex font-poppins items-center justify-center rounded-[4px] bg-white border-[1px] w-[32px] h-[32px] border-gray-100 text-gray-500 font-medium"
        aria-hidden="true"
      >
        …
      </span>
    );
  }

  if (isNumber) {
    return (
      <button
        onClick={() => onClick(page)}
        className={`flex font-poppins items-center justify-center rounded-[4px] border-[1px] w-[32px] h-[32px] transition-colors ${
          isActive
            ? "border-orange-500 text-orange-500 bg-orange-50 font-medium"
            : "border-gray-100 text-gray-500 hover:bg-gray-50 font-medium"
        }`}
        aria-label={`Go to page ${page}`}
        aria-current={isActive ? "page" : undefined}
      >
        {page}
      </button>
    );
  }

  return null;
};
