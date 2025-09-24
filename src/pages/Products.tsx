import { Link } from "react-router-dom";

export default function Products() {
  const mockProducts = [
    { id: 1, name: "Shirt" },
    { id: 2, name: "Jeans" },
    { id: 3, name: "Jacket" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ul className="space-y-2">
        {mockProducts.map((p) => (
          <li key={p.id}>
            <Link
              to={`/products/${p.id}`}
              className="text-blue-600 hover:underline"
            >
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
