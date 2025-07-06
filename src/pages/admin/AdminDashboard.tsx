import React, { useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { products } from '../../data/products';

const AdminDashboard: React.FC = () => {
  const { state, dispatch } = useAdmin();

  useEffect(() => {
    // Load initial data
    dispatch({ type: 'SET_PRODUCTS', payload: products });
    
    // Mock analytics data
    const mockAnalytics = {
      totalRevenue: 38430.500,
      totalOrders: 1247,
      averageOrderValue: 308.250,
      topSellingProducts: [
        { productId: '1', productName: 'iPhone 15 Pro', unitsSold: 156, revenue: 62322.000 },
        { productId: '2', productName: 'MacBook Pro M3', unitsSold: 89, revenue: 57841.100 },
        { productId: '3', productName: 'AirPods Pro', unitsSold: 234, revenue: 21037.600 },
      ],
      revenueByCategory: {
        smartphones: 13815.000,
        laptops: 11674.000,
        headphones: 6762.000,
        tablets: 4605.000,
        accessories: 1574.500
      },
      salesTrend: [
        { date: '2024-01-01', revenue: 3684.000, orders: 120 },
        { date: '2024-01-02', revenue: 4605.000, orders: 150 },
        { date: '2024-01-03', revenue: 5526.000, orders: 180 },
        { date: '2024-01-04', revenue: 4294.000, orders: 140 },
        { date: '2024-01-05', revenue: 4912.000, orders: 160 },
      ]
    };
    dispatch({ type: 'SET_ANALYTICS', payload: mockAnalytics });

    // Mock inventory alerts
    const mockAlerts = [
      {
        id: '1',
        productId: 'macbook-pro-m3',
        productName: 'MacBook Pro 14-inch M3',
        currentStock: 3,
        threshold: 5,
        severity: 'low' as const,
        createdAt: new Date()
      },
      {
        id: '2',
        productId: 'dell-xps-13',
        productName: 'Dell XPS 13',
        currentStock: 1,
        threshold: 5,
        severity: 'critical' as const,
        createdAt: new Date()
      }
    ];
    dispatch({ type: 'SET_INVENTORY_ALERTS', payload: mockAlerts });
  }, [dispatch]);

  const stats = [
    {
      name: 'Total Revenue',
      value: `KD ${state.analytics?.totalRevenue.toLocaleString() || '0'}`,
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
    },
    {
      name: 'Total Orders',
      value: state.analytics?.totalOrders.toLocaleString() || '0',
      change: '+8.2%',
      changeType: 'increase',
      icon: ShoppingCart,
    },
    {
      name: 'Total Products',
      value: state.products.length.toString(),
      change: '+3.1%',
      changeType: 'increase',
      icon: Package,
    },
    {
      name: 'Average Order Value',
      value: `KD ${state.analytics?.averageOrderValue.toFixed(3) || '0'}`,
      change: '-2.4%',
      changeType: 'decrease',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {state.currentUser?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.changeType === 'increase' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.changeType === 'increase' ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ml-1 ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Alerts</h2>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {state.inventoryAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.severity === 'critical' 
                  ? 'bg-red-50 border-red-500' 
                  : 'bg-orange-50 border-orange-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{alert.productName}</p>
                    <p className="text-sm text-gray-600">
                      Only {alert.currentStock} left in stock
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {state.analytics?.topSellingProducts.map((product, index) => (
              <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{product.productName}</p>
                    <p className="text-sm text-gray-600">{product.unitsSold} units sold</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  KD {product.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {state.analytics && Object.entries(state.analytics.revenueByCategory).map(([category, revenue]) => (
            <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 capitalize mb-1">
                {category.replace('-', ' ')}
              </p>
              <p className="text-xl font-bold text-gray-900">
                KD {revenue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'New order received', details: 'Order #1247 - KD 299.500', time: '2 minutes ago' },
            { action: 'Product updated', details: 'iPhone 15 Pro - Price changed', time: '15 minutes ago' },
            { action: 'Low stock alert', details: 'MacBook Pro M3 - 3 units left', time: '1 hour ago' },
            { action: 'New customer registered', details: 'john.doe@email.com', time: '2 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;