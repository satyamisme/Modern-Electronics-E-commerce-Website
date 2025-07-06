import { supabase } from '../lib/supabase';
import { formatKWD } from '../utils/currency';

// Analytics types
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface ProductPerformance {
  id: string;
  name: string;
  revenue: number;
  units: number;
  viewToCartRatio: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}

export interface UserMetrics {
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
  churnRate: number;
  averageSessionTime: number;
}

export interface AnalyticsDashboard {
  salesOverview: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    revenueChange: number;
    ordersChange: number;
  };
  salesTrend: SalesData[];
  categorySales: CategoryData[];
  topProducts: ProductPerformance[];
  userMetrics: UserMetrics;
  deviceDistribution: CategoryData[];
  salesByHour: {hour: number; sales: number}[];
}

export interface AnalyticsFilter {
  dateRange: 'today' | 'week' | 'month' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  category?: string;
  brand?: string;
}

class AnalyticsService {
  // Get dashboard analytics
  async getDashboardAnalytics(filter: AnalyticsFilter): Promise<AnalyticsDashboard> {
    try {
      // In a real implementation, this would fetch data from Supabase
      // For now, we'll return mock data
      
      // Calculate date range
      const endDate = filter.endDate || new Date();
      let startDate: Date;
      
      switch (filter.dateRange) {
        case 'today':
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'year':
          startDate = new Date();
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        case 'custom':
          startDate = filter.startDate || new Date();
          break;
        default:
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
      }
      
      // Format dates for query
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      
      // Mock data for now
      return {
        salesOverview: {
          totalRevenue: 38430.500,
          totalOrders: 1247,
          averageOrderValue: 308.250,
          conversionRate: 3.8,
          revenueChange: 12.5,
          ordersChange: 8.2
        },
        salesTrend: this.generateSalesTrend(startDate, endDate),
        categorySales: [
          { name: 'Smartphones', value: 13815.000, color: '#1E40AF' },
          { name: 'Laptops', value: 11674.000, color: '#047857' },
          { name: 'Headphones', value: 6762.000, color: '#7C3AED' },
          { name: 'Tablets', value: 4605.000, color: '#DB2777' },
          { name: 'Accessories', value: 1574.500, color: '#F59E0B' }
        ],
        topProducts: [
          { id: '1', name: 'iPhone 15 Pro', revenue: 62322.000, units: 156, viewToCartRatio: 18.5, trend: 'up', changePercentage: 12 },
          { id: '2', name: 'MacBook Pro M3', revenue: 57841.100, units: 89, viewToCartRatio: 15.2, trend: 'up', changePercentage: 8 },
          { id: '3', name: 'AirPods Pro', revenue: 21037.600, units: 234, viewToCartRatio: 22.7, trend: 'down', changePercentage: 5 },
          { id: '4', name: 'Samsung Galaxy S24', revenue: 35880.200, units: 78, viewToCartRatio: 14.3, trend: 'up', changePercentage: 15 },
          { id: '5', name: 'iPad Air', revenue: 14943.500, units: 65, viewToCartRatio: 12.8, trend: 'stable', changePercentage: 0 }
        ],
        userMetrics: {
          newUsers: 245,
          activeUsers: 1892,
          returningUsers: 876,
          churnRate: 4.2,
          averageSessionTime: 8.5
        },
        deviceDistribution: [
          { name: 'Mobile', value: 65, color: '#1E40AF' },
          { name: 'Desktop', value: 28, color: '#047857' },
          { name: 'Tablet', value: 7, color: '#7C3AED' }
        ],
        salesByHour: this.generateSalesByHour()
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Get sales analytics
  async getSalesAnalytics(filter: AnalyticsFilter): Promise<any> {
    try {
      // In a real implementation, this would fetch data from Supabase
      // For now, we'll return mock data
      return {
        totalRevenue: 38430.500,
        totalOrders: 1247,
        averageOrderValue: 308.250,
        salesByCategory: [
          { name: 'Smartphones', value: 13815.000 },
          { name: 'Laptops', value: 11674.000 },
          { name: 'Headphones', value: 6762.000 },
          { name: 'Tablets', value: 4605.000 },
          { name: 'Accessories', value: 1574.500 }
        ],
        salesByPaymentMethod: [
          { name: 'KNET', value: 28822.875 },
          { name: 'Credit Card', value: 7686.100 },
          { name: 'Cash on Delivery', value: 1921.525 }
        ],
        salesByTime: [
          { time: '00:00-04:00', value: 1152.915 },
          { time: '04:00-08:00', value: 1921.525 },
          { time: '08:00-12:00', value: 7686.100 },
          { time: '12:00-16:00', value: 11529.150 },
          { time: '16:00-20:00', value: 9607.625 },
          { time: '20:00-24:00', value: 6533.185 }
        ]
      };
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      throw error;
    }
  }

  // Get product analytics
  async getProductAnalytics(filter: AnalyticsFilter): Promise<any> {
    try {
      // In a real implementation, this would fetch data from Supabase
      // For now, we'll return mock data
      return {
        totalProducts: 1245,
        activeProducts: 1156,
        outOfStockProducts: 89,
        topViewedProducts: [
          { id: '1', name: 'iPhone 15 Pro', views: 8450, purchases: 156, conversionRate: 1.85 },
          { id: '2', name: 'Samsung Galaxy S24', views: 5460, purchases: 78, conversionRate: 1.43 },
          { id: '3', name: 'MacBook Pro M3', views: 5860, purchases: 89, conversionRate: 1.52 },
          { id: '4', name: 'AirPods Pro', views: 10296, purchases: 234, conversionRate: 2.27 },
          { id: '5', name: 'iPad Air', views: 5070, purchases: 65, conversionRate: 1.28 }
        ],
        productPerformance: [
          { id: '1', name: 'iPhone 15 Pro', revenue: 62322.000, profit: 15580.500, margin: 25 },
          { id: '2', name: 'MacBook Pro M3', revenue: 57841.100, profit: 11568.220, margin: 20 },
          { id: '3', name: 'AirPods Pro', revenue: 21037.600, profit: 6311.280, margin: 30 },
          { id: '4', name: 'Samsung Galaxy S24', revenue: 35880.200, profit: 8970.050, margin: 25 },
          { id: '5', name: 'iPad Air', revenue: 14943.500, profit: 3735.875, margin: 25 }
        ]
      };
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      throw error;
    }
  }

  // Get customer analytics
  async getCustomerAnalytics(filter: AnalyticsFilter): Promise<any> {
    try {
      // In a real implementation, this would fetch data from Supabase
      // For now, we'll return mock data
      return {
        totalCustomers: 2768,
        newCustomers: 245,
        returningCustomers: 876,
        churnRate: 4.2,
        customerSegments: [
          { segment: 'VIP', count: 138, revenue: 13450.675, percentage: 5 },
          { segment: 'Loyal', count: 415, revenue: 11529.150, percentage: 15 },
          { segment: 'Regular', count: 830, revenue: 9607.625, percentage: 30 },
          { segment: 'Occasional', count: 1385, revenue: 3843.050, percentage: 50 }
        ],
        customerLifetimeValue: 1250.500,
        averageOrdersPerCustomer: 2.8
      };
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw error;
    }
  }

  // Get search analytics
  async getSearchAnalytics(filter: AnalyticsFilter): Promise<any> {
    try {
      // In a real implementation, this would fetch data from Supabase
      // For now, we'll return mock data
      return {
        totalSearches: 2458,
        uniqueSearches: 1245,
        searchesWithResults: 2156,
        searchesWithoutResults: 302,
        conversionRate: 12.5,
        topQueries: [
          { term: 'iPhone 15', count: 245, conversionRate: 18.2, trend: 'up', changePercentage: 12 },
          { term: 'Samsung S24', count: 189, conversionRate: 15.7, trend: 'up', changePercentage: 28 },
          { term: 'AirPods Pro', count: 156, conversionRate: 22.4, trend: 'down', changePercentage: 5 },
          { term: 'MacBook Pro', count: 132, conversionRate: 9.8, trend: 'up', changePercentage: 8 },
          { term: 'Xiaomi', count: 98, conversionRate: 7.5, trend: 'up', changePercentage: 15 }
        ],
        failedSearches: [
          { term: 'iPhone 16', count: 45, lastSearched: new Date() },
          { term: 'Samsung S25', count: 32, lastSearched: new Date() },
          { term: 'Google Pixel 9', count: 28, lastSearched: new Date() }
        ]
      };
    } catch (error) {
      console.error('Error fetching search analytics:', error);
      throw error;
    }
  }

  // Export analytics data
  async exportAnalytics(data: any, format: 'csv' | 'excel' | 'pdf'): Promise<Blob> {
    try {
      // In a real implementation, this would generate a file for download
      // For now, we'll just return a mock blob
      return new Blob(['Mock analytics data'], { type: 'text/plain' });
    } catch (error) {
      console.error('Error exporting analytics:', error);
      throw error;
    }
  }

  // Helper methods
  private generateSalesTrend(startDate: Date, endDate: Date): SalesData[] {
    const days = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const result: SalesData[] = [];
    
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Generate some random data
      const revenue = 3000 + Math.random() * 4000;
      const orders = 100 + Math.random() * 150;
      
      result.push({
        date: date.toISOString().split('T')[0],
        revenue,
        orders: Math.round(orders)
      });
    }
    
    return result;
  }

  private generateSalesByHour(): {hour: number; sales: number}[] {
    const result: {hour: number; sales: number}[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      // Generate a realistic distribution with peaks during business hours
      let sales = 0;
      
      if (hour >= 0 && hour < 6) {
        // Late night/early morning (low)
        sales = 2 + Math.random() * 10;
      } else if (hour >= 6 && hour < 9) {
        // Morning (medium)
        sales = 10 + Math.random() * 20;
      } else if (hour >= 9 && hour < 13) {
        // Late morning/noon (high)
        sales = 40 + Math.random() * 50;
      } else if (hour >= 13 && hour < 17) {
        // Afternoon (medium-high)
        sales = 30 + Math.random() * 60;
      } else if (hour >= 17 && hour < 21) {
        // Evening (high)
        sales = 50 + Math.random() * 50;
      } else {
        // Night (medium-low)
        sales = 15 + Math.random() * 30;
      }
      
      result.push({
        hour,
        sales: Math.round(sales)
      });
    }
    
    return result;
  }
}

export const analyticsService = new AnalyticsService();