//src\components\common\Banner.tsx
import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-200">My Shop</h1>
      <nav className="space-x-6">
        <Link to="/products" className="hover:text-blue-500">
          Products
        </Link>
        <Link to="/checkout" className="hover:text-blue-500">
          Checkout
        </Link>
      </nav>
    </header>
  );
}
