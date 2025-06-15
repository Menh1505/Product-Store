import Navbar from "./components/Navbar";

import Home from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

import { Routes, Route } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";

function App() {
  const { theme } = useThemeStore();
  return (
    <div
      className="min-h-screen bg-base-200 transition-colors duration-300"
      data-theme={`${theme}`}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "bg-base-100 text-base-content",
          style: {
            fontSize: "1rem",
            borderRadius: "0.5rem",
            padding: "1rem",
          },
        }}/>
    </div>
  );
}

export default App;
