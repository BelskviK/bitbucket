// src/pages/Products.tsx
import { useEffect, useState } from "react";
import IconFilter from "../assets/FilterIcon.svg";
import ProductCard from "../components/Product";
import { ProductService } from "../services/ProductService";

interface Product {
  id: number;
  name: string;
  price: number;
  cover_image?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getProducts({
          // page: 1,
          // price_from: 100,
          // price_to: 500,
          // sort: "price",
        });
        // Map API response to our Product interface
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
  }, []);

  return (
    <div className="px-[100px] py-20">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-poppins font-semibold text-[42px] leading-[1] tracking-normal text-gray-900 -pb-2">
          Products
        </h1>

        {/* Filter and Sort Controls */}
        <div className="flex items-center gap-[32px]">
          <span className="text-gray-600 font-poppins font-normal text-[12px] leading-[100%] tracking-[0%]">
            Showing 1-{products.length} of {products.length} results
          </span>

          <div className="w-px h-4 bg-gray-300"></div>
          <span className="flex items-center gap-2 text-gray-700 font-poppins font-normal text-[16px] leading-[100%] tracking-[0%] cursor-pointer hover:text-orange-500 transition-colors">
            <img src={IconFilter} alt="Filter icon" className="w-4 h-4" />
            Filter
          </span>

          <span className="flex items-center gap-2 text-gray-700 font-poppins font-normal text-[16px] leading-[100%] tracking-[0%] cursor-pointer hover:text-orange-500 transition-colors">
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
        </div>
      </div>

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
