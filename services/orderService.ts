import { apiClient } from './apiClient';
import { ORDERS } from '../constants';
import { Order, OrderStatus, CartItem } from '../types';
import { emailService } from './emailService';

<<<<<<< HEAD
interface SupabaseOrderItem {
  quantity: number;
  price_snapshot: number;
  product: {
    id: string;
    name: string;
    images: string[];
  } | null;
}
=======
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a

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
<<<<<<< HEAD
    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create Order Items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_snapshot: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  },

  sendStatusUpdateEmail: async (orderData: any, newStatus: OrderStatus): Promise<void> => {
    const customerEmail = orderData.user?.email;
    const customerName =
      orderData.user?.full_name || customerEmail?.split('@')[0] || 'Valued Customer';

    if (!customerEmail) {
      console.warn('No customer email found for order status update');
      return;
    }

=======
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
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
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
