// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
// layout
import Banner from "./components/Banner";

// page
import Products from "./pages/Products";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Outer wrapper ensures full screen background */}
        <div className="min-h-screen flex justify-center items-start bg-gray-100">
          {/* Fixed-width app container */}
          <div className="w-[1920px] h-[1080px] flex flex-col text-gray-800 bg-white">
            <Banner />
            <main className="flex-1">
              <Routes>
                <Route path="/products" element={<Products />} />
                <Route path="/products/:productId" element={<Product />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} />
                <Route path="/" element={<Login />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
