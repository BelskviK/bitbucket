import { useEffect } from "react";
import ProductsFilter from "@/components/product/ProductsFilter";
import ProductCard from "@/components/product/Product";
import Pagination from "@/components/product/Pagination";
import { useProductsData } from "@/hooks/products/useProductsData";
import { useProductsFilters } from "@/hooks/products/useProductsFilters";
import { PRODUCTS_CONSTANTS } from "@/constants";

export default function Products() {
  const {
    queryParams,
    handleFiltersChange,
    handleSortChange,
    handlePageChange,
  } = useProductsFilters();

  const { products, loading, pagination, refetchProducts } = useProductsData();

  // Refetch products when queryParams change
  useEffect(() => {
    // Skip initial empty params to avoid double fetch
    if (Object.keys(queryParams).length > 0) {
      refetchProducts(queryParams);
    }
  }, [queryParams, refetchProducts]);

  return (
    <div className="px-[100px] py-20">
      {/* Fixed Header Section with Filters */}
      <div className="fixed top-0 left-0 right-0 bg-white z-40">
        <div className="px-[100px] pt-[156px]">
          <ProductsFilter
            productsCount={pagination.total}
            showingFrom={pagination.from}
            showingTo={pagination.to}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
            currentFilters={queryParams}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-20">
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
