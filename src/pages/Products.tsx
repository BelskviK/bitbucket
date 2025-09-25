// src/pages/Products.tsx
import IconFilter from "../assets/FilterIcon.svg";
import Product from "../components/Product"; // Import the display component

export default function Products() {
  const mockProducts = [
    {
      id: 1,
      name: "Kids' Curved Hilfiger Graphic T-Shirt",
      price: 65,
    },
    {
      id: 2,
      name: "Men's Classic Fit T-Shirt",
      price: 45,
    },
    {
      id: 3,
      name: "Women's Premium Cotton Shirt",
      price: 75,
    },
    {
      id: 4,
      name: "Kids' Graphic Print Hoodie",
      price: 85,
    },
    {
      id: 5,
      name: "Men's Athletic Shorts",
      price: 55,
    },
    {
      id: 6,
      name: "Women's Yoga Pants",
      price: 95,
    },
    {
      id: 7,
      name: "Men's Running Shoes",
      price: 120,
    },
    {
      id: 8,
      name: "Women's Casual Dress",
      price: 89,
    },
  ];

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
            Showing 1-{mockProducts.length} of {mockProducts.length} results
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
        {mockProducts.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
