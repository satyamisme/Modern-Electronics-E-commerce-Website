import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Create a mock client for development without Supabase
const createMockClient = () => {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ error: null })
    },
    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          limit: (limit: number) => Promise.resolve({ data: [], error: null }),
          range: (start: number, end: number) => Promise.resolve({ data: [], error: null }),
          order: (column: string, options: any) => Promise.resolve({ data: [], error: null }),
          or: (query: string) => Promise.resolve({ data: [], error: null })
        }),
        order: (column: string, options: any) => ({
          eq: (column: string, value: any) => Promise.resolve({ data: [], error: null })
        }),
        limit: (limit: number) => ({
          eq: (column: string, value: any) => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: (data: any) => ({
        select: (columns: string = '*') => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: (columns: string = '*') => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ error: null })
      })
    }),
    rpc: (fn: string, params: any) => Promise.resolve({ data: null, error: null }),
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: any) => Promise.resolve({ data: { path: path }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `https://example.com/${path}` } })
      })
    }
  };
};

// Determine if we should use a real or mock client
const isProduction = import.meta.env.PROD;
const forceMock = import.meta.env.VITE_FORCE_MOCK_CLIENT === 'true';
const debugMode = import.meta.env.VITE_DEBUG === 'true';

// Consider demo credentials as unavailable for real client
const demoUrl = 'https://demo.supabase.co';
const demoKey = 'demo-key';
const supabaseCredentialsAvailable = supabaseUrl && supabaseAnonKey && supabaseUrl !== demoUrl && supabaseAnonKey !== demoKey;

let useMockClient;

if (isProduction) {
  // In production, only use mock if explicitly forced (e.g., for specific E2E tests against a mock server)
  // and credentials are not available (which should ideally not happen for a production build aiming for real Supabase)
  useMockClient = forceMock || !supabaseCredentialsAvailable;
  if (!supabaseCredentialsAvailable && !forceMock) {
    console.error("CRITICAL: Production build is missing valid Supabase credentials and not forced to use mock client. Application might not work as expected.");
  }
} else {
  // In development, use mock if VITE_DEBUG is true or if valid Supabase credentials are not available.
  useMockClient = debugMode || !supabaseCredentialsAvailable;
}

if (useMockClient) {
  console.warn("Using MOCK Supabase client. VITE_DEBUG:", debugMode, "Credentials Available:", supabaseCredentialsAvailable, "Forced Mock:", forceMock);
} else {
  console.log("Using REAL Supabase client.");
}

// Export the appropriate client
export const supabase = useMockClient
  ? createMockClient() as any
  : createClient(supabaseUrl, supabaseAnonKey, {
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