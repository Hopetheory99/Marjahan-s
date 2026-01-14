import { apiClient } from './apiClient';
import { ORDERS } from '../constants';
import { Order, OrderStatus, CartItem } from '../types';
import { emailService } from './emailService';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

let inMemoryOrders: Order[] = [...ORDERS];

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/api/orders');
        return res.data as Order[];
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        return inMemoryOrders;
      }
    }
    return inMemoryOrders;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    if (API_BASE) {
      try {
        const res = await apiClient.put(`/api/orders/${id}/status`, { status });
        return res.data as Order;
      } catch (error) {
        console.error(`Failed to update order ${id}:`, error);
        throw error;
      }
    }
    const index = inMemoryOrders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');
    inMemoryOrders[index] = { ...inMemoryOrders[index], status };
    return inMemoryOrders[index];
  },

  getById: async (id: string): Promise<Order | undefined> => {
    if (API_BASE) {
      try {
        const res = await apiClient.get(`/api/orders/${id}`);
        return res.data as Order;
      } catch (error) {
        console.error(`Failed to fetch order ${id}:`, error);
        return inMemoryOrders.find((o) => o.id === id);
      }
    }
    return inMemoryOrders.find((o) => o.id === id);
  },

  createOrder: async (userId: string, items: CartItem[], total: number): Promise<Order> => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/api/orders', { items, total });
        return res.data as Order;
      } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
      }
    }

    // Fallback to in-memory
    const newOrder: Order = {
      id: Math.random().toString(36).slice(2, 11),
      customerName: 'Customer',
      items,
      total,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
    };
    inMemoryOrders.push(newOrder);
    return newOrder;
  },

  sendStatusUpdateEmail: async (orderData: Order, newStatus: OrderStatus): Promise<void> => {
    try {
      const customerEmail = orderData.customerName;
      const customerName = customerEmail?.split('@')[0] || 'Valued Customer';

      if (!customerEmail) {
        console.warn('No customer email found for order status update');
        return;
      }

      await emailService.sendOrderStatusUpdate(orderData.id, customerEmail, newStatus, {
        customerName,
      });

      console.log(`📧 Status update email sent to ${customerEmail} for order ${orderData.id}`);
    } catch (error) {
      console.error('Failed to send status update email:', error);
      throw error;
    }
  },
};
