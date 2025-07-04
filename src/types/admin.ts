import { ProductImage, ProductSpecification, ProductFeature, ProductTag, CartItem, KuwaitAddress, UserRole, OrderStatus } from "./index";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole; // Using shared UserRole
  avatar?: string;
  permissions: string[]; // This could be more specific, e.g., an enum of permissions
  lastLogin: Date | string; // Allow string for ISO dates
  createdAt: Date | string; // Allow string for ISO dates
}

export interface ProductFormData { // Aligned with new Product structure
  name: string;
  brand: string;
  category: string; // Should be Category['id'] or Category['slug']
  price: number;
  originalPrice?: number;
  description: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
  stock: number; // Renamed from stockCount, removed inStock (derived)
  features: ProductFeature[];
  tags: ProductTag[];
  sku?: string; // Consider adding SKU
}

// Replacing original OrderManagement with more specific AdminOrder types
export interface AdminOrderSummary {
  orderId: string;
  customerName: string; // Could be User['name'] or a denormalized string
  customerEmail: string; // User['email']
  totalAmount: number;
  currency: 'KWD';
  status: OrderStatus; // Using shared OrderStatus
  orderDate: Date | string;
  itemCount: number;
}

export interface AdminOrderDetails {
  orderId: string;
  userId?: string;
  customerDetails: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: CartItem[]; // Using CartItem from payment.ts
  shippingAddress: KuwaitAddress; // Or generic Address if applicable
  billingAddress?: KuwaitAddress;
  paymentMethod: string;
  paymentTransactionId?: string;
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  grandTotal: number;
  currency: 'KWD';
  status: OrderStatus;
  orderDate: Date | string;
  lastUpdated: Date | string;
  trackingNumber?: string;
  notes?: Array<{ date: Date | string; note: string; by: string }>; // Admin notes for order
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'critical' | 'out-of-stock';
  createdAt: Date | string; // Allow string for ISO dates
}

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
  }>;
  revenueByCategory: Record<string, number>;
  salesTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}