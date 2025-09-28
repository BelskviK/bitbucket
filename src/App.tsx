// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "@/contexts/authprovider";
// layout
import Banner from "@/components/common/Banner";

// pages
import Products from "@/pages/Products";
import ProductPage from "@/pages/Product";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Full screen gray background */}
        <div className="w-full h-screen flex justify-center items-center bg-gray-100">
          {/* Fixed white layout (1920x1080) always on top */}
          <div className="w-[1920px] h-[1080px] flex flex-col text-gray-800 bg-white shadow-lg fixed top-0 left-1/2 -translate-x-1/2">
            <Banner />
            {/* Main content (banner 80px + rest 1000px) */}
            <main className="pt-[80px] w-full h-full overflow-hidden">
              <Routes>
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductPage />} />
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
