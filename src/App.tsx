import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// layout
import Banner from "./components/Banner";

// page
import Products from "./pages/Products";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col text-gray-800">
        <Banner />
        <main className="flex-1">
          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<Product />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            {/* Add a default route */}
            <Route path="/" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
