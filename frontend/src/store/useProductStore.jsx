import { create } from "zustand";
import axios from "axios";

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

  removeProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
    }));
  },
}));
