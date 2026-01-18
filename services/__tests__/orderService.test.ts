import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { orderService } from '../orderService';
import { supabase } from '../supabaseClient';
import { OrderStatus } from '../../types';

// Mock Supabase client
vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAll', () => {
    it('fetches all orders with order items successfully', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          user_id: 'user-1',
          total: 250.0,
          status: 'pending',
          created_at: '2026-01-18T00:00:00Z',
          order_items: [
            {
              quantity: 2,
              price_snapshot: 125.0,
              product: {
                id: 'prod-1',
                name: 'Gold Ring',
                images: ['ring.jpg'],
              },
            },
          ],
        },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockOrders, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await orderService.getAll();

      expect(supabase.from).toHaveBeenCalledWith('orders');
      expect(mockChain.select).toHaveBeenCalled();
      expect(mockChain.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockOrders);
    });

    it('throws error when database query fails', async () => {
      const mockError = new Error('Database connection failed');

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      await expect(orderService.getAll()).rejects.toThrow('Database connection failed');
    });

    it('returns empty array when no orders exist', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await orderService.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('fetches order by ID successfully', async () => {
      const mockOrder = {
        id: 'order-1',
        user_id: 'user-1',
        total: 150.0,
        status: 'paid',
        created_at: '2026-01-18T00:00:00Z',
        order_items: [
          {
            quantity: 1,
            price_snapshot: 150.0,
            product: {
              id: 'prod-2',
              name: 'Silver Necklace',
              images: ['necklace.jpg'],
            },
          },
        ],
      };

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await orderService.getById('order-1');

      expect(supabase.from).toHaveBeenCalledWith('orders');
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'order-1');
      expect(result).toEqual(mockOrder);
    });

    it('returns undefined when order not found', async () => {
      const mockError = { code: 'PGRST116', message: 'No rows found' };

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await orderService.getById('non-existent');

      expect(result).toBeUndefined();
    });
  });

  describe('updateStatus', () => {
    it('updates order status successfully', async () => {
      const mockUpdatedOrder = {
        id: 'order-1',
        user_id: 'user-1',
        total: 200.0,
        status: 'shipped' as OrderStatus,
        created_at: '2026-01-18T00:00:00Z',
      };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockUpdatedOrder, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await orderService.updateStatus('order-1', 'shipped');

      expect(supabase.from).toHaveBeenCalledWith('orders');
      expect(mockChain.update).toHaveBeenCalledWith({ status: 'shipped' });
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'order-1');
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('throws error when updating non-existent order', async () => {
      const mockError = new Error('Order not found');

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      await expect(orderService.updateStatus('non-existent', 'shipped')).rejects.toThrow(
        'Order not found',
      );
    });

    it('handles all valid order status transitions', async () => {
      const statuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

      for (const status of statuses) {
        const mockOrder = {
          id: 'order-1',
          status,
          total: 100,
          user_id: 'user-1',
          created_at: '2026-01-18T00:00:00Z',
        };

        const mockChain = {
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockChain as any);

        const result = await orderService.updateStatus('order-1', status);

        expect(result.status).toBe(status);
      }
    });
  });

  describe('createOrder', () => {
    it('creates order with items successfully', async () => {
      const mockOrder = {
        id: 'new-order-1',
        user_id: 'user-1',
        total: 300.0,
        status: 'pending',
        created_at: '2026-01-18T00:00:00Z',
      };

      const mockCartItems = [
        {
          id: 'prod-1',
          name: 'Gold Ring',
          price: 150.0,
          quantity: 2,
          images: ['ring.jpg'],
          metal: 'Gold' as const,
          category: 'Rings' as const,
          stock: 10,
          description: 'Beautiful ring',
        },
      ];

      // Mock order creation
      const orderChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
      };

      // Mock order items creation
      const itemsChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      };

      vi.mocked(supabase.from)
        .mockReturnValueOnce(orderChain as any)
        .mockReturnValueOnce(itemsChain as any);

      const result = await orderService.createOrder('user-1', mockCartItems, 300.0);

      expect(supabase.from).toHaveBeenCalledWith('orders');
      expect(orderChain.insert).toHaveBeenCalledWith({
        user_id: 'user-1',
        total: 300.0,
        status: 'pending',
      });

      expect(supabase.from).toHaveBeenCalledWith('order_items');
      expect(itemsChain.insert).toHaveBeenCalledWith([
        {
          order_id: 'new-order-1',
          product_id: 'prod-1',
          quantity: 2,
          price_snapshot: 150.0,
        },
      ]);

      expect(result).toEqual(mockOrder);
    });

    it('throws error when order creation fails', async () => {
      const mockError = new Error('Failed to create order');

      const orderChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      vi.mocked(supabase.from).mockReturnValue(orderChain as any);

      const mockCartItems = [
        {
          id: 'prod-1',
          name: 'Test Product',
          price: 100,
          quantity: 1,
          images: [],
          metal: 'Gold' as const,
          category: 'Rings' as const,
          stock: 5,
          description: 'Test',
        },
      ];

      await expect(orderService.createOrder('user-1', mockCartItems, 100)).rejects.toThrow(
        'Failed to create order',
      );
    });

    it('throws error when order items creation fails', async () => {
      const mockOrder = {
        id: 'new-order-1',
        user_id: 'user-1',
        total: 100.0,
        status: 'pending',
        created_at: '2026-01-18T00:00:00Z',
      };

      const orderChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
      };

      const itemsError = new Error('Failed to create order items');
      const itemsChain = {
        insert: vi.fn().mockResolvedValue({ error: itemsError }),
      };

      vi.mocked(supabase.from)
        .mockReturnValueOnce(orderChain as any)
        .mockReturnValueOnce(itemsChain as any);

      const mockCartItems = [
        {
          id: 'prod-1',
          name: 'Test Product',
          price: 100,
          quantity: 1,
          images: [],
          metal: 'Gold' as const,
          category: 'Rings' as const,
          stock: 5,
          description: 'Test',
        },
      ];

      await expect(orderService.createOrder('user-1', mockCartItems, 100)).rejects.toThrow(
        'Failed to create order items',
      );
    });
  });
});
