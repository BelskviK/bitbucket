import { useParams, Link } from "react-router-dom";

export default function Product() {
  const { productId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Product {productId}</h1>
      <p className="mt-2">Details about product {productId} go here.</p>
      <Link
        to="/checkout"
        className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded"
      >
        Go to Checkout
      </Link>
    </div>
  );
}
