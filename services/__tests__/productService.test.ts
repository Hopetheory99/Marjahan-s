import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productService } from '../productService';

// Mock Supabase client
vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

import { supabase } from '../supabaseClient';

const mockProducts = [
  {
    id: '1',
    name: 'Diamond Ring',
    description: 'Beautiful ring',
    price: 1000,
    images: ['ring.jpg'],
    metal: 'Gold',
    category: 'Rings',
    stock: 10,
  },
  {
    id: '2',
    name: 'Pearl Necklace',
    description: 'Elegant necklace',
    price: 500,
    images: ['necklace.jpg'],
    metal: 'Silver',
    category: 'Necklaces',
    stock: 5,
  },
];

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all products from Supabase with pagination defaulting', async () => {
      // Mock Supabase to return data and count
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          lte: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          // return range mock which resolves
          range: vi.fn().mockResolvedValue({
            data: mockProducts,
            error: null,
            count: 10,
          }),
        })),
      }));
      (supabase.from as any) = mockFrom;

      const response = await productService.getAll();

      expect(mockFrom).toHaveBeenCalledWith('products');
      expect(response.data).toEqual(mockProducts);
      expect(response.count).toBe(10);
    });

    it('should respect pagination parameters', async () => {
      const rangeMock = vi.fn().mockResolvedValue({
        data: [mockProducts[0]],
        error: null,
        count: 10,
      });

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          lte: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          range: rangeMock,
        })),
      }));
      (supabase.from as any) = mockFrom;

      await productService.getAll({ page: 2, limit: 5 });

      // Page 2, Limit 5 -> Range (5, 9)
      expect(rangeMock).toHaveBeenCalledWith(5, 9);
    });

    it('should throw error when Supabase fails', async () => {
      const mockError = { message: 'Database connection failed' };
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          lte: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          range: vi.fn().mockResolvedValue({ data: null, error: mockError }),
        })),
      }));
      (supabase.from as any) = mockFrom;

      await expect(productService.getAll()).rejects.toThrow('Failed to fetch products');
    });

    // Existing filter tests need update to mock chain properly
    it('should apply price filter when provided', async () => {
      const lteMock = vi.fn().mockReturnThis();
      const rangeMock = vi.fn().mockResolvedValue({ data: [], error: null, count: 0 });

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          lte: lteMock,
          in: vi.fn().mockReturnThis(),
          range: rangeMock,
        })),
      }));
      (supabase.from as any) = mockFrom;

      await productService.getAll({ price: 600 });

      expect(lteMock).toHaveBeenCalledWith('price', 600);
    });

    it('should search across multiple columns', async () => {
      const orMock = vi.fn().mockReturnThis();
      const rangeMock = vi.fn().mockResolvedValue({ data: [], error: null, count: 0 });

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          lte: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          or: orMock,
          range: rangeMock,
        })),
      }));
      (supabase.from as any) = mockFrom;

      await productService.getAll({ search: 'silver' });

      // Should use .or() with ilike on all fields
      const expectedQuery =
        'name.ilike.%silver%,description.ilike.%silver%,category.ilike.%silver%,metal.ilike.%silver%';
      expect(orMock).toHaveBeenCalledWith(expectedQuery);
    });
  });

  describe('getById', () => {
    it('should fetch a single product by ID', async () => {
      const singleMock = vi.fn(() => Promise.resolve({ data: mockProducts[0], error: null }));
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: singleMock,
          })),
        })),
      }));
      (supabase.from as any) = mockFrom;

      const product = await productService.getById('1');

      expect(product).toEqual(mockProducts[0]);
    });

    it('should throw error when product not found', async () => {
      const mockError = { message: 'Product not found' };
      const singleMock = vi.fn(() => Promise.resolve({ data: null, error: mockError }));
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: singleMock,
          })),
        })),
      }));
      (supabase.from as any) = mockFrom;

      await expect(productService.getById('999')).rejects.toThrow();
    });
  });

  describe('getFeatured', () => {
    it('should fetch limited featured products', async () => {
      const limitMock = vi.fn(() => Promise.resolve({ data: mockProducts, error: null }));
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          limit: limitMock,
        })),
      }));
      (supabase.from as any) = mockFrom;

      const products = await productService.getFeatured();

      expect(limitMock).toHaveBeenCalledWith(4);
      expect(products).toEqual(mockProducts);
    });
  });

  describe('addProduct', () => {
    it('should insert a new product', async () => {
      const newProduct = {
        name: 'New Ring',
        description: 'Shiny',
        price: 2000,
        images: ['new.jpg'],
        metal: 'Platinum' as const,
        category: 'Rings' as const,
        stock: 3,
      };

      const insertedProduct = { id: '3', ...newProduct };
      const singleMock = vi.fn(() => Promise.resolve({ data: insertedProduct, error: null }));
      const mockFrom = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: singleMock,
          })),
        })),
      }));
      (supabase.from as any) = mockFrom;

      const result = await productService.addProduct(newProduct);

      expect(result).toEqual(insertedProduct);
    });
  });
});
