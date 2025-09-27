import { useState, useRef, useEffect } from "react";
import IconFilter from "@/assets/FilterIcon.svg";
import type {
  FilterParams,
  ProductsFilterProps,
  FilterModalProps,
  SortModalProps,
  FilterLabelProps,
} from "@/types";
// Filter Label Component
const FilterLabel = ({ priceFrom, priceTo, onRemove }: FilterLabelProps) => {
  return (
    <div className="flex items-center h-[37px] px-[16px] py-[8px] border border-gray-300 rounded-[50px] gap-[6px] w-fit">
      <span className="font-poppins font-normal text-[14px] leading-[100%] tracking-[0%]">
        Price: {priceFrom}-{priceTo}
      </span>
      <button
        onClick={onRemove}
        className="w-[12px] h-[12px] ml-[8px] flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Remove price filter"
      >
        ×
      </button>
    </div>
  );
};

// Custom hook for click outside detection
const useClickOutside = (
  ref: React.RefObject<HTMLDivElement | null>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

const FilterModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}: FilterModalProps) => {
  const [priceFrom, setPriceFrom] = useState(
    currentFilters.price_from?.toString() || ""
  );
  const [priceTo, setPriceTo] = useState(
    currentFilters.price_to?.toString() || ""
  );
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    setPriceFrom(currentFilters.price_from?.toString() || "");
    setPriceTo(currentFilters.price_to?.toString() || "");
  }, [currentFilters, isOpen]);

  const handleApply = () => {
    const filters: FilterParams = {};
    if (priceFrom) filters.price_from = Number(priceFrom);
    if (priceTo) filters.price_to = Number(priceTo);
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="absolute top-full right-0 mt-2 w-[392px] h-[169px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
    >
      <h3 className="font-poppins font-semibold text-[16px] leading-[100%] tracking-[0] mb-[20px] mt-2">
        Select price
      </h3>

      <div className="space-y-3">
        <div>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="number"
                placeholder="From"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                className="w-full h-[42px] p-2 border border-gray-300 rounded font-poppins font-normal text-[14px] leading-[100%] tracking-[0] placeholder-gray-900"
              />
              {!priceFrom && (
                <span className="absolute left-[50px] top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                  *
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="number"
                placeholder="To"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                className="w-full h-[42px] p-2 border border-gray-300 rounded font-poppins font-normal text-[14px] leading-[100%] tracking-[0] placeholder-gray-900"
              />
              {!priceTo && (
                <span className="absolute left-[30px] top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                  *
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleApply}
            className="w-[124px] h-[41px] flex items-center justify-center gap-[10px] px-[20px] py-[10px] font-poppins font-normal text-[14px] leading-[100%] tracking-[0] bg-orange-500 text-white rounded-[10px] hover:bg-orange-600"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const SortModal = ({ isOpen, onClose, onApplySort }: SortModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, onClose);

  const sortOptions = [
    { value: "-created_at", label: "New products first" },
    { value: "price", label: "Price, low to high" },
    { value: "-price", label: "Price, high to low" },
  ];

  const handleSortSelect = (sortValue: string) => {
    onApplySort(sortValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="absolute top-full right-0 mt-4 w-[223px] h-[184px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-4"
    >
      <div className="flex justify-between items-center py-[12px]">
        <h3 className="font-poppins font-semibold text-[16px] leading-[100%] tracking-[0] py-1">
          Sort by
        </h3>
      </div>

      <div className="space-y-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSortSelect(option.value)}
            className="w-full text-left py-2 font-poppins font-normal text-[16px] leading-[100%] tracking-[0] text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function ProductsFilter({
  productsCount,
  showingFrom,
  showingTo,
  onFiltersChange,
  onSortChange,
  currentFilters,
}: ProductsFilterProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);

  const handleApplyFilters = (filters: FilterParams) => {
    onFiltersChange(filters);
    setFilterModalOpen(false);
  };

  const handleApplySort = (sort: string) => {
    onSortChange(sort);
    setSortModalOpen(false);
  };

  const handleRemoveFilters = () => {
    onFiltersChange({
      price_from: undefined,
      price_to: undefined,
    });
  };

  const closeModals = () => {
    setFilterModalOpen(false);
    setSortModalOpen(false);
  };

  const hasPriceFilters =
    currentFilters.price_from !== undefined &&
    currentFilters.price_to !== undefined;

  return (
    <div className="z-50 w-[1720px] mx-auto">
      {/* First Row: Title and Filter Controls */}
      <div className="flex justify-between items-center relative">
        <h1 className="font-poppins font-semibold text-[42px] leading-[1] tracking-normal text-gray-900">
          Products
        </h1>

        {/* Filter and Sort Controls */}
        <div className="flex items-center gap-[32px] relative">
          <span className="text-gray-600 font-poppins font-normal text-[12px] leading-[100%] tracking-[0%]">
            Showing {showingFrom || 1}-{showingTo || productsCount} of{" "}
            {productsCount} results
          </span>

          <div className="w-px h-4 bg-gray-300"></div>

          {/* Filter Button */}
          <div className="relative">
            <span
              onClick={() => {
                setFilterModalOpen(true);
                setSortModalOpen(false);
              }}
              className="flex items-center gap-2 text-gray-700 font-poppins font-normal text-[16px] leading-[100%] tracking-[0%] cursor-pointer hover:text-orange-500 transition-colors"
            >
              <img src={IconFilter} alt="Filter icon" className="w-4 h-4" />
              Filter
            </span>
            <FilterModal
              isOpen={filterModalOpen}
              onClose={closeModals}
              onApplyFilters={handleApplyFilters}
              currentFilters={currentFilters}
            />
          </div>

          {/* Sort Button */}
          <div className="relative">
            <span
              onClick={() => {
                setSortModalOpen(true);
                setFilterModalOpen(false);
              }}
              className="flex items-center gap-2 text-gray-700 font-poppins font-normal text-[16px] leading-[100%] tracking-[0%] cursor-pointer hover:text-orange-500 transition-colors"
            >
              Sort by
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
            <SortModal
              isOpen={sortModalOpen}
              onClose={closeModals}
              onApplySort={handleApplySort}
            />
          </div>
        </div>
      </div>

      {/* Second Row: Filter Label */}
      {hasPriceFilters && (
        <div className=" ">
          <FilterLabel
            priceFrom={currentFilters.price_from!}
            priceTo={currentFilters.price_to!}
            onRemove={handleRemoveFilters}
          />
        </div>
      )}
    </div>
  );
}
