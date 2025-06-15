import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:3000";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data });
    } catch (error) {
      if (error.status == 429)
        set({ error: "Too many requests. Please try again later.", products: [] });
      else set({ error: "Failed to fetch products. Please try again later.", products: [] });
    } finally {
      set({ loading: false });
    }
  },

  addProduct: (product) => {
    set((state) => ({ products: [...state.products, product] }));
  },

  deleteProduct: async (productId) => {
    set({ loading: true, error: null });

    try {
      await axios.delete(`${BASE_URL}/api/products/${productId}`);
      set(prev => ({
        products: prev.products.filter((product) => product.id !== productId),
      }));

      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    } finally {
      set({ loading: false });
    }
  },
}));
