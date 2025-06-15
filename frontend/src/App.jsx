import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
}

export default App;
