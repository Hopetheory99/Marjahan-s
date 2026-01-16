import { supabase } from './supabaseClient';
import { Order, OrderStatus, CartItem } from '../types';
import { emailService } from './emailService';

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
      console.error('Failed to fetch orders:', error);
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
      console.error(`Failed to update order ${id}:`, error);
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
      console.error(`Failed to fetch order ${id}:`, error);
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

  sendStatusUpdateEmail: async (orderData: any, newStatus: OrderStatus): Promise<void> => {
    try {
      const customerEmail = orderData.user?.email || orderData.customerEmail;
      const customerName = orderData.user?.full_name || orderData.customerName || 'Valued Customer';

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
