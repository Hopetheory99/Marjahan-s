
import axios from 'axios';
import { ORDERS } from '../constants';
import { Order, OrderStatus } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

let inMemoryOrders: Order[] = [...ORDERS];

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    if (API_BASE) {
      const res = await axios.get(`${API_BASE.replace(/\/$/, '')}/api/orders`);
      return res.data as Order[];
    }
    return inMemoryOrders;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    if (API_BASE) {
      const res = await axios.put(`${API_BASE.replace(/\/$/, '')}/api/orders/${id}/status`, { status });
      return res.data as Order;
    }
    const index = inMemoryOrders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    inMemoryOrders[index] = { ...inMemoryOrders[index], status };
    return inMemoryOrders[index];
  },

  getById: async (id: string): Promise<Order | undefined> => {
    if (API_BASE) {
      const res = await axios.get(`${API_BASE.replace(/\/$/, '')}/api/orders/${id}`);
      return res.data as Order;
    }
    return inMemoryOrders.find(o => o.id === id);
  }
};
