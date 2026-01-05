import { supabase } from './supabaseClient';
import { Product, MetalType, CategoryType } from '../types';
import { PRODUCTS } from '../constants';

export interface ProductFilters {
  price?: number;
  metals?: MetalType[];
  categories?: CategoryType[];
  search?: string;
  sort?: string;
}

export const productService = {
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
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
  },

  // Admin Methods
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
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
};
