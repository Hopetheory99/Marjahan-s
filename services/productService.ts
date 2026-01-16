import { supabase } from './supabaseClient';
import { Product, MetalType, CategoryType } from '../types';
import { PRODUCTS } from '../constants';

export interface ProductFilters {
  price?: number;
  metals?: MetalType[];
  categories?: CategoryType[];
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse {
  data: Product[];
  count: number;
}

export const productService = {
  // Returns PaginatedResponse
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
        query = query.or(
          `name.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm},metal.ilike.${searchTerm}`,
        );
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

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Failed to fetch products from Supabase:', error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return {
      data: data || [],
      count: count || 0,
    };
  },

  getById: async (id: string): Promise<Product | undefined> => {
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
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (count && count > 0) return;

    const productsToInsert = PRODUCTS.map((product) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = product;
      return rest;
    });

    const { error } = await supabase.from('products').insert(productsToInsert);
    if (error) throw error;
  },
};
