// src/pages/ProductPage.tsx (or keep as Product.tsx but rename import in App.tsx)
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { productId } = useParams();

  // You would typically fetch product data based on productId here
  // For now, just display the product ID

  return (
    <div className="p-8">
      <h1>Product Details Page</h1>
      <p>Product ID: {productId}</p>
      {/* Add product details content here */}
    </div>
  );
}
