// src/pages/Products.tsx
import { useEffect, useState } from "react";
import type { FilterParams } from "../components/ProductsFilter";
import ProductsFilter from "../components/ProductsFilter";
import ProductCard from "../components/Product";
import { ProductService } from "../services/ProductService";

interface Product {
  id: number;
  name: string;
  price: number;
  cover_image?: string;
}

interface QueryParams extends FilterParams {
  sort?: string;
  page?: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState<QueryParams>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await ProductService.getProducts(queryParams);

        const formattedProducts = response.data.map((p: Product) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          cover_image: p.cover_image,
        }));

        setProducts(formattedProducts);
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

  return (
    <div className="px-[100px] py-20">
      {/* Header Section with Filters */}
      <ProductsFilter
        productsCount={products.length}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        currentFilters={queryParams} // Pass current filters to the component
      />

      {/* Products Grid - 4 columns */}
      <div className="grid grid-cols-4 gap-8 justify-center">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCard key={i} />)
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </div>
  );
}
