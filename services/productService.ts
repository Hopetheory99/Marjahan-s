
import { PRODUCTS } from '../constants';
import { Product, MetalType, CategoryType } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for session persistence
let inMemoryProducts: Product[] = [...PRODUCTS];

export interface ProductFilters {
  price?: number;
  metals?: MetalType[];
  categories?: CategoryType[];
}

export const productService = {
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    await delay(600); // Simulate network latency

    let results = [...inMemoryProducts];

    if (filters) {
      if (filters.price !== undefined) {
        results = results.filter(p => p.price <= filters.price!);
      }
      if (filters.metals && filters.metals.length > 0) {
        results = results.filter(p => filters.metals!.includes(p.metal));
      }
      if (filters.categories && filters.categories.length > 0) {
        results = results.filter(p => filters.categories!.includes(p.category));
      }
    }

    return results;
  },

  getById: async (id: string): Promise<Product | undefined> => {
    await delay(400);
    return inMemoryProducts.find(p => p.id === id);
  },

  getFeatured: async (): Promise<Product[]> => {
    await delay(500);
    return inMemoryProducts.slice(0, 4);
  },

  // Admin Methods
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    await delay(500);
    const newProduct = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
    };
    inMemoryProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    await delay(500);
    const index = inMemoryProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    inMemoryProducts[index] = { ...inMemoryProducts[index], ...updates };
    return inMemoryProducts[index];
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(500);
    inMemoryProducts = inMemoryProducts.filter(p => p.id !== id);
  }
};
