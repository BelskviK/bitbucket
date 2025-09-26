// src\pages\Products.tsx
import { useEffect, useState } from "react";
import ProductsFilter from "../components/ProductsFilter";
import ProductCard from "../components/Product";
import Pagination from "../components/Pagination";
import { ProductService } from "../services/productservice";
import type {
  Product,
  ProductQueryParams,
  PaginationData,
  ApiResponse,
  FilterParams,
} from "../types";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState<ProductQueryParams>({});
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Product> = await ProductService.getProducts(
          queryParams
        );

        const formattedProducts = response.data.map((p: Product) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          cover_image: p.cover_image,
        }));

        setProducts(formattedProducts);
        setPagination(response.meta);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [queryParams]);

  const handleFiltersChange = (filters: FilterParams) => {
    setQueryParams((prev) => ({
      ...prev,
      ...filters,
      page: 1,
    }));
  };

  const handleSortChange = (sort: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sort: sort || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <div className="px-[100px] py-20">
      {/* Fixed Header Section with Filters */}
      <div className="fixed top-0 left-0 right-0 bg-white z-40  ">
        <div className="px-[100px]  pt-[156px]">
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
        <div className="grid grid-cols-4 gap-8 justify-center mb-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCard key={i} />)
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
