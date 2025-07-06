import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: 'customer' | 'admin' | 'super_admin' | 'manager' | 'editor' | 'viewer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'admin' | 'super_admin' | 'manager' | 'editor' | 'viewer';
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'admin' | 'super_admin' | 'manager' | 'editor' | 'viewer';
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          brand: string | null;
          category_id: string | null;
          price: number;
          original_price: number | null;
          sku: string | null;
          stock_count: number;
          is_active: boolean;
          specifications: Record<string, any>;
          features: string[];
          tags: string[];
          rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          brand?: string | null;
          category_id?: string | null;
          price: number;
          original_price?: number | null;
          sku?: string | null;
          stock_count?: number;
          is_active?: boolean;
          specifications?: Record<string, any>;
          features?: string[];
          tags?: string[];
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          brand?: string | null;
          category_id?: string | null;
          price?: number;
          original_price?: number | null;
          sku?: string | null;
          stock_count?: number;
          is_active?: boolean;
          specifications?: Record<string, any>;
          features?: string[];
          tags?: string[];
          rating?: number;
          review_count?: number;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
        };
        Update: {
          image_url?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          order_number: string;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          subtotal: number;
          shipping_cost: number;
          tax_amount: number;
          discount_amount: number;
          total_amount: number;
          currency: string;
          payment_method: string | null;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_transaction_id: string | null;
          shipping_address: Record<string, any> | null;
          billing_address: Record<string, any> | null;
          customer_notes: string | null;
          admin_notes: string | null;
          tracking_number: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string | null;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          subtotal: number;
          shipping_cost?: number;
          tax_amount?: number;
          discount_amount?: number;
          total_amount: number;
          currency?: string;
          payment_method?: string | null;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_transaction_id?: string | null;
          shipping_address?: Record<string, any> | null;
          billing_address?: Record<string, any> | null;
          customer_notes?: string | null;
          admin_notes?: string | null;
          tracking_number?: string | null;
        };
        Update: {
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_transaction_id?: string | null;
          admin_notes?: string | null;
          tracking_number?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_sku: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_sku?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Update: {
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
          quantity: number;
        };
        Update: {
          quantity?: number;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string | null;
          comment: string | null;
          images: string[];
          is_verified: boolean;
          is_approved: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          product_id: string;
          user_id: string;
          rating: number;
          title?: string | null;
          comment?: string | null;
          images?: string[];
          is_verified?: boolean;
          is_approved?: boolean;
        };
        Update: {
          rating?: number;
          title?: string | null;
          comment?: string | null;
          images?: string[];
          is_approved?: boolean;
          helpful_count?: number;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
        };
        Update: never;
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          type: 'home' | 'work' | 'other';
          governorate: string;
          area: string;
          block: string;
          street: string;
          building: string;
          floor: string | null;
          apartment: string | null;
          additional_info: string | null;
          phone: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          type?: 'home' | 'work' | 'other';
          governorate: string;
          area: string;
          block: string;
          street: string;
          building: string;
          floor?: string | null;
          apartment?: string | null;
          additional_info?: string | null;
          phone?: string | null;
          is_default?: boolean;
        };
        Update: {
          type?: 'home' | 'work' | 'other';
          governorate?: string;
          area?: string;
          block?: string;
          street?: string;
          building?: string;
          floor?: string | null;
          apartment?: string | null;
          additional_info?: string | null;
          phone?: string | null;
          is_default?: boolean;
        };
      };
    };
  };
}