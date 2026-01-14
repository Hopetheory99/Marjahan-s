<<<<<<< HEAD
import { supabase } from './supabaseClient';
import { Product, MetalType, CategoryType } from '../types';
import { PRODUCTS } from '../constants';
=======

import { apiClient } from './apiClient';
import { PRODUCTS } from '../constants';
import { Product, MetalType, CategoryType } from '../types';
>>>>>>> 761b4aa0e334fc8c74177e361cd66e69829c60ff

export interface ProductFilters {
  price?: number;
  metals?: MetalType[];
  categories?: CategoryType[];
  search?: string;
  sort?: string;
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
<<<<<<< HEAD
    try {
      let query = supabase.from('products').select('*');

      if (filters) {
        if (filters.price !== undefined) {
          query = query.lte('price', filters.price);
        }
        if (filters.metals && filters.metals.length > 0) {
          query = query.in('metal', filters.metals);
        }
        if (filters.categories && filters.categories.length > 0) {
          query = query.in('category', filters.categories);
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      // If no data from Supabase, fallback to local constants
      if (!data || data.length === 0) {
        console.warn('No products from Supabase, using local data');
        return PRODUCTS;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, using local products:', error);
      // Fallback to local constants
      let products = [...PRODUCTS];

      if (filters) {
        if (filters.price !== undefined) {
          products = products.filter((p) => p.price <= filters.price!);
        }
        if (filters.metals && filters.metals.length > 0) {
          products = products.filter((p) => filters.metals!.includes(p.metal as MetalType));
        }
        if (filters.categories && filters.categories.length > 0) {
          products = products.filter((p) =>
            filters.categories!.includes(p.category as CategoryType),
          );
        }
      }

      return products;
    }
  },

  getById: async (id: string): Promise<Product | undefined> => {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase unavailable, using local product:', error);
      return PRODUCTS.find((p) => p.id === id);
    }
  },

  getFeatured: async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase.from('products').select('*').limit(4);
      if (error) throw error;

      if (!data || data.length === 0) {
        console.warn('No featured products from Supabase, using local data');
        return PRODUCTS.slice(0, 4);
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, using local featured products:', error);
      return PRODUCTS.slice(0, 4);
    }
=======
    if (API_BASE) {
      try {
        const q = toQuery(filters);
        const res = await apiClient.get(`/api/products${q}`);
        return res.data as Product[];
      } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
      }
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
      try {
        const res = await apiClient.get(`/api/products/${id}`);
        return res.data as Product;
      } catch (error) {
        console.error(`Failed to fetch product ${id}:`, error);
        throw error;
      }
    }
    return inMemoryProducts.find(p => p.id === id);
  },

  getFeatured: async (): Promise<Product[]> => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/api/products/featured');
        return res.data as Product[];
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        throw error;
      }
    }
    return inMemoryProducts.slice(0, 4);
>>>>>>> 761b4aa0e334fc8c74177e361cd66e69829c60ff
  },

  // Admin Methods
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
<<<<<<< HEAD
    const { data, error } = await supabase.from('products').insert(product).select().single();

    if (error) throw error;
    return data;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw error;
  },

  // Seed Method
  seedProducts: async (): Promise<void> => {
    // Check if products exist
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (count && count > 0) return; // Already seeded

    // Remove IDs from constants to let Supabase generate UUIDs
    const productsToInsert = PRODUCTS.map((product) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = product;
      return rest;
    });

    const { error } = await supabase.from('products').insert(productsToInsert);
    if (error) throw error;
  },
=======
    if (API_BASE) {
      try {
        const res = await apiClient.post('/api/products', product);
        return res.data as Product;
      } catch (error) {
        console.error('Failed to create product:', error);
        throw error;
      }
    }
    const newProduct: Product = { ...product, id: Math.random().toString(36).slice(2, 11) } as Product;
    inMemoryProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    if (API_BASE) {
      try {
        const res = await apiClient.put(`/api/products/${id}`, updates);
        return res.data as Product;
      } catch (error) {
        console.error(`Failed to update product ${id}:`, error);
        throw error;
      }
    }
    const index = inMemoryProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    inMemoryProducts[index] = { ...inMemoryProducts[index], ...updates };
    return inMemoryProducts[index];
  },

  deleteProduct: async (id: string): Promise<void> => {
    if (API_BASE) {
      try {
        await apiClient.delete(`/api/products/${id}`);
      } catch (error) {
        console.error(`Failed to delete product ${id}:`, error);
        throw error;
      }
      return;
    }
    inMemoryProducts = inMemoryProducts.filter(p => p.id !== id);
  }
>>>>>>> 761b4aa0e334fc8c74177e361cd66e69829c60ff
};
