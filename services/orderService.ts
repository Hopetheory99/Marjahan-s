
import { ORDERS } from '../constants';
import { Order, OrderStatus } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for session persistence
let inMemoryOrders: Order[] = [...ORDERS];

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    await delay(500);
    return inMemoryOrders;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    await delay(500);
    const index = inMemoryOrders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    
    inMemoryOrders[index] = { ...inMemoryOrders[index], status };
    return inMemoryOrders[index];
  },

  getById: async (id: string): Promise<Order | undefined> => {
    await delay(400);
    return inMemoryOrders.find(o => o.id === id);
  }
};
