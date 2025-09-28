// src/pages/Products.tsx
import { useEffect } from "react";
import ProductsFilter from "@/components/product/ProductsFilter";
import ProductCard from "@/components/product/Product";
import Pagination from "@/components/product/Pagination";
import { useProductsData } from "@/hooks/products/useProductsData";
import { useProductsFilters } from "@/hooks/products/useProductsFilters";
import { useStickyScroll } from "@/hooks/useStickyScroll";
import { PRODUCTS_CONSTANTS } from "@/constants";

export default function Products() {
  const {
    queryParams,
    handleFiltersChange,
    handleSortChange,
    handlePageChange,
  } = useProductsFilters();

  const { products, loading, pagination, refetchProducts } = useProductsData();

  const { elementRef, isSticky, shouldShow, elementHeight } = useStickyScroll({
    scrollOffset: 100,
  });

  useEffect(() => {
    if (Object.keys(queryParams).length > 0) {
      refetchProducts(queryParams);
    }
  }, [queryParams, refetchProducts]);

  return (
    <div className="px-[100px] py-[58px]">
      {/* Sticky Filter Container with higher z-index */}
      <div
        ref={elementRef}
        className={`transition-all duration-300 ease-in-out ${
          isSticky
            ? "fixed top-[80px] left-0 right-0 z-[100] bg-white shadow-md"
            : "relative z-10"
        } ${
          shouldShow
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        }`}
        style={{
          visibility: shouldShow ? "visible" : "hidden",
        }}
      >
        <div className="py-4">
          <ProductsFilter
            productsCount={pagination.total}
            showingFrom={pagination.from}
            showingTo={pagination.to}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
            currentFilters={queryParams}
            isSticky={isSticky}
          />
        </div>
      </div>

      {/* Spacer when filter is sticky */}
      {isSticky && <div style={{ height: elementHeight }} className="w-full" />}

      {/* Scrollable Content with lower z-index */}
      <div className="mt-8 relative z-0">
        <div
          className={`grid ${PRODUCTS_CONSTANTS.GRID_COLUMNS} ${PRODUCTS_CONSTANTS.GRID_GAP} justify-center mb-8`}
        >
          {loading
            ? Array.from({ length: PRODUCTS_CONSTANTS.PRODUCTS_PER_PAGE }).map(
                (_, i) => <ProductCard key={i} />
              )
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          onPageChange={handlePageChange}
          showingFrom={pagination.from}
          showingTo={pagination.to}
          totalItems={pagination.total}
        />
      </div>
    </div>
  );
}
