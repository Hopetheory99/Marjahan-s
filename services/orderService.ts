import { supabase } from './supabaseClient';
import { Order, OrderStatus, CartItem } from '../types';
import { emailService } from './emailService';
import { logger } from './logger';

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          quantity,
          price_snapshot,
          product:products (
            id,
            name,
            images
          )
        )
      `,
      )
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch orders', error, { service: 'order' });
      throw error;
    }

    return (data || []) as unknown as Order[];
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update order status', error, {
        orderId: id,
        status,
        service: 'order',
      });
      throw error;
    }

    // Attempt to send email if status changed significantly (optional logic)
    // await orderService.sendStatusUpdateEmail(data, status);

    return data;
  },

  getById: async (id: string): Promise<Order | undefined> => {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          quantity,
          price_snapshot,
          product:products (
            id,
            name,
            images
          )
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Failed to fetch order by ID', error, { orderId: id, service: 'order' });
      return undefined;
    }

    return data as unknown as Order;
  },

  createOrder: async (userId: string, items: CartItem[], total: number): Promise<Order> => {
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

  sendStatusUpdateEmail: async (
    orderData: {
      id: string;
      user?: { email?: string; full_name?: string };
      customerEmail?: string;
      customerName?: string;
    },
    newStatus: OrderStatus,
  ): Promise<void> => {
    try {
      const customerEmail = orderData.user?.email || orderData.customerEmail;
      const customerName = orderData.user?.full_name || orderData.customerName || 'Valued Customer';

      if (!customerEmail) {
        logger.warn('No customer email found for order status update', {
          orderId: orderData.id,
          service: 'order',
        });
        return;
      }

      await emailService.sendOrderStatusUpdate(orderData.id, customerEmail, newStatus, {
        customerName,
      });

      logger.info('Status update email sent', {
        orderId: orderData.id,
        customerEmail,
        service: 'order',
      });
    } catch (error) {
      logger.error('Failed to send status update email', error as Error, {
        orderId: orderData.id,
        service: 'order',
      });
      throw error;
    }
  },
};
