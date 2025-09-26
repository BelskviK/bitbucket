// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/authprovider";
// layout
import Banner from "./components/Banner";

// page - CORRECTED: Import from pages, not components
import Products from "./pages/Products";
import ProductPage from "./pages/Product"; // Renamed to avoid conflict
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Outer wrapper ensures full screen background */}
        <div className="min-h-screen flex justify-center items-start">
          {/* Fixed-width app container */}
          <div className="w-[1920px] h-[1080px] flex flex-col text-gray-800 bg-white">
            <Banner />
            <main className="flex-1 pt-[80px]">
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
