export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'editor';
  avatar?: string;
  permissions: string[];
  lastLogin: Date;
  createdAt: Date;
}

import { ProductImage, ProductSpecification, ProductFeature, ProductTag } from "./index";

export interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: ProductImage[]; // Changed from string[]
  specifications: ProductSpecification[]; // Changed from Record<string, string>
  stock: number; // Renamed from stockCount, removed inStock
  features: ProductFeature[]; // Changed from string[]
  tags: ProductTag[]; // Changed from string[]
}

export interface OrderManagement {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  shippingAddress: string;
  trackingNumber?: string;
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'critical' | 'out-of-stock';
  createdAt: Date;
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