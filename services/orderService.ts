import { supabase } from './supabaseClient';
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

interface SupabaseOrder {
  id: string;
  created_at: string;
  total: number;
  status: OrderStatus;
  user: { email: string } | null;
  items: SupabaseOrderItem[];
}

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        items:order_items (
          quantity,
          price_snapshot,
          product:products (id, name, images)
        ),
        user:profiles (email)
      `,
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as unknown as SupabaseOrder[]).map((order) => ({
      id: order.id,
      customerName: order.user?.email || 'Customer',
      items: order.items.map((item) => ({
        id: item.product?.id || '',
        name: item.product?.name || 'Unknown',
        price: item.price_snapshot,
        image: item.product?.images?.[0] || '',
        quantity: item.quantity,
      })),
      total: order.total,
      status: order.status,
      date: new Date(order.created_at).toLocaleDateString(),
    }));
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    // Get the current order before updating
    const currentOrder = await orderService.getById(id);
    if (!currentOrder) {
      throw new Error('Order not found');
    }

    // Update the status
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(
        `
        *,
        items:order_items (
          quantity,
          price_snapshot,
          product:products (id, name, images)
        ),
        user:profiles (email, full_name)
      `,
      )
      .single();

    if (error) throw error;

    // Send email notification if status changed
    if (currentOrder.status !== status) {
      try {
        await orderService.sendStatusUpdateEmail(data, status);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the status update if email fails
      }
    }

    return {
      id: data.id,
      customerName: data.user?.email || 'Customer',
      items: data.items.map((item: any) => ({
        id: item.product?.id || '',
        name: item.product?.name || 'Unknown',
        price: item.price_snapshot,
        image: item.product?.images?.[0] || '',
        quantity: item.quantity,
      })),
      total: data.total,
      status: data.status,
      date: new Date(data.created_at).toLocaleDateString(),
    };
  },

  getById: async (id: string): Promise<Order | undefined> => {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        items:order_items (
          quantity,
          price_snapshot,
          product:products (id, name, images)
        ),
        user:profiles (email)
      `,
      )
      .eq('id', id)
      .single();

    if (error) return undefined;

    const order = data as unknown as SupabaseOrder;

    return {
      id: order.id,
      customerName: order.user?.email || 'Customer',
      items: order.items.map((item) => ({
        id: item.product?.id || '',
        name: item.product?.name || 'Unknown',
        price: item.price_snapshot,
        image: item.product?.images?.[0] || '',
        quantity: item.quantity,
      })),
      total: order.total,
      status: order.status,
      date: new Date(order.created_at).toLocaleDateString(),
    };
  },

  createOrder: async (userId: string, items: CartItem[], total: number): Promise<Order> => {
    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total,
        status: 'Pending',
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

    const orderItems = orderData.items.map((item: any) => ({
      name: item.product?.name || 'Unknown Item',
      quantity: item.quantity,
      price: item.price_snapshot,
      image: item.product?.images?.[0] || '',
    }));

    try {
      await emailService.sendOrderStatusUpdate(orderData.id, customerEmail, newStatus, {
        customerName,
      });

      console.log(`📧 Status update email sent to ${customerEmail} for order ${orderData.id}`);
    } catch (error) {
      console.error('Failed to send status update email:', error);
      throw error;
    }
  },
=======
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
>>>>>>> 761b4aa0e334fc8c74177e361cd66e69829c60ff
};
