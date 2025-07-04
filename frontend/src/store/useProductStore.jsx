import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({formData: { name: "", price: "", image: "" }}),

  addProduct: async(e) => {
    e.preventDefault();

    set({ loading: true, error: null });
    try {
      const formData = get();
      await axios.post(`${BASE_URL}/api/products`, formData.formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully.");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
    } finally {
      set({ loading: false });
    }
  },

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

  fetchProduct: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${productId}`);
      set({ formData: response.data.data, currentProduct: response.data.data, error: null });
    } catch (error) {
      if (error.status == 429)
        set({ error: "Too many requests. Please try again later.", currentProduct: null });
      else set({ error: "Failed to fetch product.", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },
  updateProduct: async (productId) => {
    set({ loading: true, error: null });

    try {
      const {formData} = get();
      const response = await axios.put(`${BASE_URL}/api/products/${productId}`, formData);

      set({ currentProduct: response.data.data });

      toast.success("Product updated successfully.");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    } finally {
      set({ loading: false });
    }
  },
}));
