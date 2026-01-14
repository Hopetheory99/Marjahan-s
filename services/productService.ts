<<<<<<< HEAD
import { supabase } from './supabaseClient';
import { Product, MetalType, CategoryType } from '../types';
import { PRODUCTS } from '../constants';
=======
import { apiClient } from './apiClient';
import { PRODUCTS } from '../constants';
import { Product, MetalType, CategoryType } from '../types';
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a

export interface ProductFilters {
  price?: number;
  metals?: MetalType[];
  categories?: CategoryType[];
  search?: string;
  sort?: string;
  page?: number;   // New
  limit?: number;  // New
}

<<<<<<< HEAD
export interface PaginatedResponse {
  data: Product[];
  count: number;
}

export const productService = {
  // Now returns PaginatedResponse instead of just Product[]
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse> => {
    let query = supabase.from('products').select('*', { count: 'exact' });

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
      if (filters.search) {
        // Safe server-side search across multiple columns
        const searchTerm = `%${filters.search}%`;
        query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm},metal.ilike.${searchTerm}`);
      }

      // Sorting
      if (filters.sort) {
        switch (filters.sort) {
          case 'price-low':
            query = query.order('price', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price', { ascending: false });
            break;
          case 'name':
          default:
            query = query.order('name', { ascending: true });
            break;
        }
      }
=======
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Fallback in-memory data for demo mode
let inMemoryProducts: Product[] = [...PRODUCTS];

const toQuery = (filters?: ProductFilters) => {
  if (!filters) return '';
  const params: Record<string, string> = {};
  if (filters.price !== undefined) params.price = String(filters.price);
  if (filters.metals && filters.metals.length) params.metals = filters.metals.join(',');
  if (filters.categories && filters.categories.length)
    params.categories = filters.categories.join(',');
  const q = new URLSearchParams(params).toString();
  return q ? `?${q}` : '';
};

export const productService = {
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    if (API_BASE) {
      try {
        const q = toQuery(filters);
        const res = await apiClient.get(`/api/products${q}`);
        return res.data as Product[];
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to local on error
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
    }

    // Fallback to in-memory
    let results = [...inMemoryProducts];
    if (filters) {
      if (filters.price !== undefined) results = results.filter((p) => p.price <= filters.price!);
      if (filters.metals && filters.metals.length)
        results = results.filter((p) => filters.metals!.includes(p.metal));
      if (filters.categories && filters.categories.length)
        results = results.filter((p) => filters.categories!.includes(p.category));
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Failed to fetch products from Supabase:', error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return {
      data: data || [],
      count: count || 0
    };
  },

  getById: async (id: string): Promise<Product | undefined> => {
<<<<<<< HEAD
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

    if (error) {
      console.error('Failed to fetch product:', error);
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return data;
  },

  getFeatured: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products').select('*').limit(4);

    if (error) {
      console.error('Failed to fetch featured products:', error);
      throw new Error(`Failed to fetch featured products: ${error.message}`);
    }

    return data || [];
=======
    if (API_BASE) {
      try {
        const res = await apiClient.get(`/api/products/${id}`);
        return res.data as Product;
      } catch (error) {
        console.error(`Failed to fetch product ${id}:`, error);
        // Fallback to local
        return PRODUCTS.find((p) => p.id === id);
      }
    }
    return inMemoryProducts.find((p) => p.id === id);
  },

  getFeatured: async (): Promise<Product[]> => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/api/products/featured');
        return res.data as Product[];
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        return PRODUCTS.slice(0, 4);
      }
    }
    return inMemoryProducts.slice(0, 4);
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
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
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).slice(2, 11),
    } as Product;
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
    const index = inMemoryProducts.findIndex((p) => p.id === id);
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
    inMemoryProducts = inMemoryProducts.filter((p) => p.id !== id);
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
  },
};
