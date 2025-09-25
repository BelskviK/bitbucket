import { Link } from "react-router-dom";
import IconFilter from "../assets/FilterIcon.svg";
export default function Products() {
  const mockProducts = [
    { id: 1, name: "Shirt" },
    { id: 2, name: "Jeans" },
    { id: 3, name: "Jacket" },
  ];

  return (
    <div className="px-[100px] py-20">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-poppins font-semibold text-[42px] leading-[1] tracking-normal text-gray-900">
          Products
        </h1>

        {/* Filter and Sort Controls */}
        <div className="flex items-center gap-[32px]">
          <span className="text-gray-600 font-poppins font-normal text-[12px] leading-[100%] tracking-[0%]">
            Showing 1-10 of 100 results
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

      {/* Products List */}
      <ul className="space-y-4">
        {mockProducts.map((p) => (
          <li
            key={p.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <Link
              to={`/products/${p.id}`}
              className="text-blue-600 hover:text-blue-800 hover:underline font-poppins text-lg font-medium"
            >
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
