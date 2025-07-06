import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  UserPlus,
  UserMinus,
  Crown,
  Star,
  ShoppingBag,
  User,
  TrendingDown,
  DollarSign, 
  Calendar, 
  Download, 
  Filter,
  RefreshCw,
  Package,
  Search,
  ArrowUpRight,
  Clock,
  Smartphone,
  Zap,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatKWD } from '../../utils/currency';

// Import visualization components
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Analytics types
interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface ProductPerformance {
  id: string;
  name: string;
  revenue: number;
  units: number;
  viewToCartRatio: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}

interface UserMetrics {
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
  churnRate: number;
  averageSessionTime: number;
}

interface AnalyticsDashboard {
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

const AdminAnalytics: React.FC = () => {
  const { hasPermission } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'products' | 'customers'>('overview');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    // Mock data - in a real implementation, this would be an API call
    setTimeout(() => {
      const mockAnalytics: AnalyticsDashboard = {
        salesOverview: {
          totalRevenue: 38430.500,
          totalOrders: 1247,
          averageOrderValue: 308.250,
          conversionRate: 3.8,
          revenueChange: 12.5,
          ordersChange: 8.2
        },
        salesTrend: [
          { date: '2025-01-01', revenue: 3684.000, orders: 120 },
          { date: '2025-01-02', revenue: 4605.000, orders: 150 },
          { date: '2025-01-03', revenue: 5526.000, orders: 180 },
          { date: '2025-01-04', revenue: 4294.000, orders: 140 },
          { date: '2025-01-05', revenue: 4912.000, orders: 160 },
          { date: '2025-01-06', revenue: 5843.000, orders: 190 },
          { date: '2025-01-07', revenue: 6774.000, orders: 220 }
        ],
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
        salesByHour: [
          {hour: 0, sales: 12},
          {hour: 1, sales: 8},
          {hour: 2, sales: 5},
          {hour: 3, sales: 3},
          {hour: 4, sales: 2},
          {hour: 5, sales: 7},
          {hour: 6, sales: 15},
          {hour: 7, sales: 25},
          {hour: 8, sales: 45},
          {hour: 9, sales: 65},
          {hour: 10, sales: 78},
          {hour: 11, sales: 89},
          {hour: 12, sales: 95},
          {hour: 13, sales: 85},
          {hour: 14, sales: 75},
          {hour: 15, sales: 68},
          {hour: 16, sales: 72},
          {hour: 17, sales: 85},
          {hour: 18, sales: 92},
          {hour: 19, sales: 87},
          {hour: 20, sales: 76},
          {hour: 21, sales: 65},
          {hour: 22, sales: 45},
          {hour: 23, sales: 25}
        ]
      };
      
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalytics().then(() => {
      setTimeout(() => setRefreshing(false), 1000);
    });
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // In a real implementation, this would generate and download a file
    alert(`Exporting analytics as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">This year</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart2 },
              { key: 'sales', label: 'Sales Analytics', icon: DollarSign },
              { key: 'products', label: 'Product Performance', icon: Package },
              { key: 'customers', label: 'Customer Insights', icon: Users }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && analytics && (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatKWD(analytics.salesOverview.totalRevenue)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+{analytics.salesOverview.revenueChange}%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.salesOverview.totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <ShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+{analytics.salesOverview.ordersChange}%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                      <p className="text-2xl font-bold text-gray-900">{formatKWD(analytics.salesOverview.averageOrderValue)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+3.2%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.salesOverview.conversionRate}%</p>
                    </div>
                    <div className="p-3 rounded-full bg-amber-100">
                      <Zap className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+1.5%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
              </div>

              {/* Sales Trend Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Sales Trend</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm text-gray-600">Revenue</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Orders</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.salesTrend}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      />
                      <YAxis yAxisId="left" orientation="left" stroke="#1E40AF" />
                      <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                      <Tooltip 
                        formatter={(value: number, name: string) => {
                          if (name === 'revenue') return formatKWD(value);
                          return value;
                        }}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        name="Revenue" 
                        stroke="#1E40AF" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="orders" 
                        name="Orders" 
                        stroke="#10B981" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Sales & Device Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Sales */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Sales by Category</h2>
                    <PieChart className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analytics.categorySales}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.categorySales.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatKWD(value)} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Device Distribution */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Device Distribution</h2>
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analytics.deviceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.deviceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Top Performing Products</h2>
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Units Sold
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          View-to-Cart
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.topProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatKWD(product.revenue)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.units}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.viewToCartRatio}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {product.trend === 'up' && (
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                              )}
                              {product.trend === 'down' && (
                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              {product.trend === 'stable' && (
                                <span className="h-4 w-4 bg-gray-300 rounded-full mr-1"></span>
                              )}
                              <span className={`text-sm ${
                                product.trend === 'up' ? 'text-green-600' : 
                                product.trend === 'down' ? 'text-red-600' : 
                                'text-gray-600'
                              }`}>
                                {product.trend === 'up' ? '+' : product.trend === 'down' ? '-' : ''}
                                {product.changePercentage}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sales by Hour */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Sales by Hour</h2>
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.salesByHour}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="hour" 
                        tickFormatter={(hour) => `${hour}:00`}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [value, 'Sales']}
                        labelFormatter={(hour) => `${hour}:00 - ${hour+1}:00`}
                      />
                      <Bar dataKey="sales" fill="#1E40AF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Metrics */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">User Metrics</h2>
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">New Users</p>
                    <p className="text-xl font-bold text-gray-900">{analytics.userMetrics.newUsers}</p>
                    <p className="text-xs text-green-600">+12.5%</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-xl font-bold text-gray-900">{analytics.userMetrics.activeUsers}</p>
                    <p className="text-xs text-green-600">+8.3%</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Returning Users</p>
                    <p className="text-xl font-bold text-gray-900">{analytics.userMetrics.returningUsers}</p>
                    <p className="text-xs text-green-600">+5.7%</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Churn Rate</p>
                    <p className="text-xl font-bold text-gray-900">{analytics.userMetrics.churnRate}%</p>
                    <p className="text-xs text-red-600">+0.8%</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Avg. Session</p>
                    <p className="text-xl font-bold text-gray-900">{analytics.userMetrics.averageSessionTime} min</p>
                    <p className="text-xs text-green-600">+1.2%</p>
                  </div>
                </div>
              </div>

              {/* Quick Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Revenue Insight</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Your revenue has increased by 12.5% compared to the previous period. The top-performing category is Smartphones.
                  </p>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                    View detailed report
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Customer Insight</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    You've gained 245 new customers this period. Mobile users account for 65% of your traffic.
                  </p>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                    View customer analytics
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Search className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Search Insight</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "iPhone 15" is your top search term with 245 searches and an 18.2% conversion rate.
                  </p>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                    View search analytics
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sales Tab */}
          {activeTab === 'sales' && (
            <div className="space-y-6">
              {/* Sales Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatKWD(analytics.salesOverview.totalRevenue)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+{analytics.salesOverview.revenueChange}%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.salesOverview.totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <ShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+{analytics.salesOverview.ordersChange}%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                      <p className="text-2xl font-bold text-gray-900">{formatKWD(analytics.salesOverview.averageOrderValue)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+3.2%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.salesOverview.conversionRate}%</p>
                    </div>
                    <div className="p-3 rounded-full bg-amber-100">
                      <Zap className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+1.5%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
              </div>

              {/* Detailed Sales Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-lg">Daily</button>
                      <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">Weekly</button>
                      <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">Monthly</button>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analytics.salesTrend}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => formatKWD(value)}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          name="Revenue" 
                          stroke="#1E40AF" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Order Trend */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Order Trend</h2>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-lg">Daily</button>
                      <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">Weekly</button>
                      <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">Monthly</button>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analytics.salesTrend}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => value}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="orders" 
                          name="Orders" 
                          stroke="#10B981" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Category Sales & Sales by Hour */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Sales */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Sales by Category</h2>
                    <PieChart className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analytics.categorySales}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.categorySales.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatKWD(value)} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sales by Hour */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Sales by Hour</h2>
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.salesByHour}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="hour" 
                          tickFormatter={(hour) => `${hour}:00`}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [value, 'Sales']}
                          labelFormatter={(hour) => `${hour}:00 - ${hour+1}:00`}
                        />
                        <Bar dataKey="sales" fill="#1E40AF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Sales Insights */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Peak Sales Time</h3>
                    <p className="text-gray-600 mb-3">
                      Your peak sales hours are between 12:00 - 14:00 and 18:00 - 20:00.
                    </p>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                      View hourly breakdown
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Best Selling Category</h3>
                    <p className="text-gray-600 mb-3">
                      Smartphones account for 36% of your total revenue.
                    </p>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                      View category details
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Growth Opportunity</h3>
                    <p className="text-gray-600 mb-3">
                      Accessories have the highest profit margin but lowest sales volume.
                    </p>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                      View opportunity analysis
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">1,245</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+5.2%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Product Views</p>
                      <p className="text-2xl font-bold text-gray-900">45,678</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <Eye className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+12.8%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">15.3%</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+2.1%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                      <p className="text-2xl font-bold text-gray-900">24</p>
                    </div>
                    <div className="p-3 rounded-full bg-amber-100">
                      <AlertTriangle className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">-3.5%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
              </div>

              {/* Top Products Table */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Top Performing Products</h2>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                        <option>By Revenue</option>
                        <option>By Units Sold</option>
                        <option>By Conversion Rate</option>
                      </select>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Units Sold
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          View-to-Cart
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.topProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatKWD(product.revenue)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.units}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.viewToCartRatio}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {product.trend === 'up' && (
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                              )}
                              {product.trend === 'down' && (
                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              {product.trend === 'stable' && (
                                <span className="h-4 w-4 bg-gray-300 rounded-full mr-1"></span>
                              )}
                              <span className={`text-sm ${
                                product.trend === 'up' ? 'text-green-600' : 
                                product.trend === 'down' ? 'text-red-600' : 
                                'text-gray-600'
                              }`}>
                                {product.trend === 'up' ? '+' : product.trend === 'down' ? '-' : ''}
                                {product.changePercentage}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Views vs. Purchases */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Views vs. Purchases</h2>
                    <Eye className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'iPhone 15 Pro', views: 8450, purchases: 156 },
                          { name: 'MacBook Pro M3', views: 5860, purchases: 89 },
                          { name: 'AirPods Pro', views: 10296, purchases: 234 },
                          { name: 'Samsung Galaxy S24', views: 5460, purchases: 78 },
                          { name: 'iPad Air', views: 5070, purchases: 65 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" name="Views" fill="#1E40AF" />
                        <Bar dataKey="purchases" name="Purchases" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Product Conversion Rates */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Conversion Rates</h2>
                    <Zap className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'iPhone 15 Pro', rate: 18.5 },
                          { name: 'MacBook Pro M3', rate: 15.2 },
                          { name: 'AirPods Pro', rate: 22.7 },
                          { name: 'Samsung Galaxy S24', rate: 14.3 },
                          { name: 'iPad Air', rate: 12.8 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Bar dataKey="rate" name="Conversion Rate" fill="#7C3AED" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Product Insights */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Top Performer</h3>
                    <p className="text-gray-600 mb-3">
                      iPhone 15 Pro has the highest revenue at {formatKWD(62322.000)}.
                    </p>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                      View product details
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Best Conversion</h3>
                    <p className="text-gray-600 mb-3">
                      AirPods Pro has the highest conversion rate at 22.7%.
                    </p>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                      View conversion details
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Needs Attention</h3>
                    <p className="text-gray-600 mb-3">
                      24 products are currently out of stock.
                    </p>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                      View inventory alerts
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              {/* Customer Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Customers</p>
                      <p className="text-2xl font-bold text-gray-900">2,768</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+9.7%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">New Customers</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.userMetrics.newUsers}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <UserPlus className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+12.5%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Returning Customers</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.userMetrics.returningUsers}</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <RefreshCw className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">+5.7%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.userMetrics.churnRate}%</p>
                    </div>
                    <div className="p-3 rounded-full bg-red-100">
                      <UserMinus className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium ml-1 text-red-600">+0.8%</span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
              </div>

              {/* Customer Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Growth */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Customer Growth</h2>
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { date: '2025-01-01', customers: 2523 },
                          { date: '2025-01-02', customers: 2545 },
                          { date: '2025-01-03', customers: 2578 },
                          { date: '2025-01-04', customers: 2612 },
                          { date: '2025-01-05', customers: 2645 },
                          { date: '2025-01-06', customers: 2689 },
                          { date: '2025-01-07', customers: 2768 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => value}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="customers" 
                          name="Customers" 
                          stroke="#1E40AF" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Device Distribution */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Device Distribution</h2>
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analytics.deviceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.deviceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Customer Segments */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Customer Segments</h2>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-lg">By Value</button>
                    <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">By Frequency</button>
                    <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">By Recency</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Crown className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">VIP</h3>
                    <p className="text-sm text-gray-600 mb-2">5% of customers</p>
                    <p className="text-xs text-gray-500">35% of revenue</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Loyal</h3>
                    <p className="text-sm text-gray-600 mb-2">15% of customers</p>
                    <p className="text-xs text-gray-500">30% of revenue</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Regular</h3>
                    <p className="text-sm text-gray-600 mb-2">30% of customers</p>
                    <p className="text-xs text-gray-500">25% of revenue</p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Occasional</h3>
                    <p className="text-sm text-gray-600 mb-2">50% of customers</p>
                    <p className="text-xs text-gray-500">10% of revenue</p>
                  </div>
                </div>
              </div>

              {/* Customer Insights */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Retention Opportunity</h3>
                    <p className="text-gray-600 mb-3">
                      125 customers haven't made a purchase in the last 30 days.
                    </p>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                      View retention campaign
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Loyalty Program</h3>
                    <p className="text-gray-600 mb-3">
                      VIP customers spend 5.2x more than occasional customers.
                    </p>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                      View loyalty analysis
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Customer Feedback</h3>
                    <p className="text-gray-600 mb-3">
                      95% of customers rate their experience as 4+ stars.
                    </p>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                      View feedback details
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Analytics Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Export as CSV</span>
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Export as Excel</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Export as PDF</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;