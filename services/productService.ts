
import axios from 'axios';
import { PRODUCTS } from '../constants';
import { Product, MetalType, CategoryType } from '../types';

export interface ProductFilters {
  price?: number;
  metals?: MetalType[];
  categories?: CategoryType[];
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Fallback in-memory data for demo mode
let inMemoryProducts: Product[] = [...PRODUCTS];

const toQuery = (filters?: ProductFilters) => {
  if (!filters) return '';
  const params: Record<string, string> = {};
  if (filters.price !== undefined) params.price = String(filters.price);
  if (filters.metals && filters.metals.length) params.metals = filters.metals.join(',');
  if (filters.categories && filters.categories.length) params.categories = filters.categories.join(',');
  const q = new URLSearchParams(params).toString();
  return q ? `?${q}` : '';
};

export const productService = {
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    if (API_BASE) {
      const q = toQuery(filters);
      const res = await axios.get(`${API_BASE.replace(/\/$/, '')}/api/products${q}`);
      return res.data as Product[];
    }

    // Fallback to in-memory
    let results = [...inMemoryProducts];
    if (filters) {
      if (filters.price !== undefined) results = results.filter(p => p.price <= filters.price!);
      if (filters.metals && filters.metals.length) results = results.filter(p => filters.metals!.includes(p.metal));
      if (filters.categories && filters.categories.length) results = results.filter(p => filters.categories!.includes(p.category));
    }
    return results;
  },

  getById: async (id: string): Promise<Product | undefined> => {
    if (API_BASE) {
      const res = await axios.get(`${API_BASE.replace(/\/$/, '')}/api/products/${id}`);
      return res.data as Product;
    }
    return inMemoryProducts.find(p => p.id === id);
  },

  getFeatured: async (): Promise<Product[]> => {
    if (API_BASE) {
      const res = await axios.get(`${API_BASE.replace(/\/$/, '')}/api/products/featured`);
      return res.data as Product[];
    }
    return inMemoryProducts.slice(0, 4);
  },

  // Admin Methods
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    if (API_BASE) {
      const res = await axios.post(`${API_BASE.replace(/\/$/, '')}/api/products`, product);
      return res.data as Product;
    }
    const newProduct: Product = { ...product, id: Math.random().toString(36).slice(2, 11) } as Product;
    inMemoryProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    if (API_BASE) {
      const res = await axios.put(`${API_BASE.replace(/\/$/, '')}/api/products/${id}`, updates);
      return res.data as Product;
    }
    const index = inMemoryProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    inMemoryProducts[index] = { ...inMemoryProducts[index], ...updates };
    return inMemoryProducts[index];
  },

  deleteProduct: async (id: string): Promise<void> => {
    if (API_BASE) {
      await axios.delete(`${API_BASE.replace(/\/$/, '')}/api/products/${id}`);
      return;
    }
    inMemoryProducts = inMemoryProducts.filter(p => p.id !== id);
  }
};
