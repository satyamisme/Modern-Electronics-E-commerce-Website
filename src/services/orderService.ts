import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

export class OrderService {
  // Create new order
  static async createOrder(orderData: {
    items: Array<{
      productId: string;
      productName: string;
      productSku?: string;
      quantity: number;
      unitPrice: number;
    }>;
    shippingAddress: any;
    billingAddress?: any;
    paymentMethod: string;
    customerNotes?: string;
    userId?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const shippingCost = 2.500; // Default shipping cost in KWD
    const taxAmount = 0; // No tax in Kuwait for most items
    const totalAmount = subtotal + shippingCost + taxAmount;

    // Create order
    const orderInsert: OrderInsert = {
      user_id: orderData.userId || user?.id,
      subtotal,
      shipping_cost: shippingCost,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      currency: 'KWD',
      payment_method: orderData.paymentMethod,
      shipping_address: orderData.shippingAddress,
      billing_address: orderData.billingAddress || orderData.shippingAddress,
      customer_notes: orderData.customerNotes
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderInsert)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      product_sku: item.productSku,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }

    // Update product stock
    for (const item of orderData.items) {
      await supabase.rpc('decrement_stock', {
        product_id: item.productId,
        quantity: item.quantity
      });
    }

    return order;
  }

  // Get orders for user
  static async getUserOrders(userId?: string, filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) throw new Error('No user ID provided');

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }

    return data;
  }

  // Get all orders (admin only)
  static async getAllOrders(filters?: {
    status?: string;
    search?: string;
    dateRange?: [string, string];
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price
        ),
        profiles (
          full_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`order_number.ilike.%${filters.search}%,profiles.full_name.ilike.%${filters.search}%,profiles.email.ilike.%${filters.search}%`);
    }

    if (filters?.dateRange) {
      query = query
        .gte('created_at', filters.dateRange[0])
        .lte('created_at', filters.dateRange[1]);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }

    return data;
  }

  // Get single order
  static async getOrder(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price,
          products (
            id,
            name,
            product_images (
              image_url,
              is_primary
            )
          )
        ),
        profiles (
          full_name,
          email,
          phone
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      throw error;
    }

    return data;
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: Order['status'], adminNotes?: string) {
    const updates: OrderUpdate = { status };
    
    if (adminNotes) {
      updates.admin_notes = adminNotes;
    }

    // Set timestamps based on status
    if (status === 'shipped') {
      updates.shipped_at = new Date().toISOString();
    } else if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return data;
  }

  // Update payment status
  static async updatePaymentStatus(orderId: string, paymentStatus: Order['payment_status'], transactionId?: string) {
    const updates: OrderUpdate = { payment_status: paymentStatus };
    
    if (transactionId) {
      updates.payment_transaction_id = transactionId;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }

    return data;
  }

  // Add tracking number
  static async addTrackingNumber(orderId: string, trackingNumber: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error adding tracking number:', error);
      throw error;
    }

    return data;
  }

  // Get order statistics
  static async getOrderStats(dateRange?: [string, string]) {
    let query = supabase
      .from('orders')
      .select('status, total_amount, created_at');

    if (dateRange) {
      query = query
        .gte('created_at', dateRange[0])
        .lte('created_at', dateRange[1]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }

    // Calculate statistics
    const stats = {
      totalOrders: data.length,
      totalRevenue: data.reduce((sum, order) => sum + order.total_amount, 0),
      averageOrderValue: data.length > 0 ? data.reduce((sum, order) => sum + order.total_amount, 0) / data.length : 0,
      statusBreakdown: data.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return stats;
  }

  // Cancel order
  static async cancelOrder(orderId: string, reason?: string) {
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error('Error fetching order for cancellation:', fetchError);
      throw fetchError;
    }

    // Check if order can be cancelled
    if (!['pending', 'processing'].includes(order.status)) {
      throw new Error('Order cannot be cancelled in current status');
    }

    // Update order status
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        admin_notes: reason ? `Cancelled: ${reason}` : 'Order cancelled'
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }

    // Restore product stock
    for (const item of order.order_items) {
      await supabase.rpc('increment_stock', {
        product_id: item.product_id,
        quantity: item.quantity
      });
    }

    return data;
  }
}