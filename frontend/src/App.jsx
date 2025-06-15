import Navbar from "./components/Navbar";

import Home from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div
      className="min-h-screen bg-base-200 transition-colors duration-300"
      data-theme="forest"
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
}

export default App;
