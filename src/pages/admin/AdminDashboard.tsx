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
  ArrowDownRight,
  Search,
  Calendar,
  Download,
  BarChart2,
  PieChart,
  TrendingDown
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { products } from '../../data/products';
import { formatKWDEnglish } from '../../utils/currency';

// Dashboard widget components
const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {change.type === 'increase' ? (
        <ArrowUpRight className="h-4 w-4 text-green-500" />
      ) : (
        <ArrowDownRight className="h-4 w-4 text-red-500" />
      )}
      <span className={`text-sm font-medium ml-1 ${
        change.type === 'increase' ? 'text-green-600' : 'text-red-600'
      }`}>
        {change.value}
      </span>
      <span className="text-sm text-gray-500 ml-1">{change.period}</span>
    </div>
  </div>
);

const SearchAnalyticsWidget = () => {
  const searchData = [
    { term: 'iPhone 15', count: 245, change: '+12%' },
    { term: 'Samsung S24', count: 189, change: '+28%' },
    { term: 'AirPods Pro', count: 156, change: '-5%' },
    { term: 'MacBook Pro', count: 132, change: '+8%' },
    { term: 'Xiaomi', count: 98, change: '+15%' }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Top Search Queries</h2>
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {searchData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                {index + 1}
              </span>
              <span className="text-gray-900 font-medium">{item.term}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-900 font-medium mr-3">{item.count}</span>
              <span className={item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
          View all search analytics
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

const RecentUsersWidget = () => {
  const users = [
    { name: 'Ahmed Al-Sayed', email: 'ahmed@example.com', status: 'active', joined: '2 hours ago' },
    { name: 'Fatima Hassan', email: 'fatima@example.com', status: 'active', joined: '5 hours ago' },
    { name: 'Mohammed Ali', email: 'mohammed@example.com', status: 'pending', joined: '1 day ago' },
    { name: 'Sara Ahmed', email: 'sara@example.com', status: 'active', joined: '2 days ago' }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
        <Users className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.status}
              </span>
              <span className="text-xs text-gray-500 ml-3">{user.joined}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
          View all users
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

const SalesOverviewWidget = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-lg">Weekly</button>
          <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">Monthly</button>
          <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">Yearly</button>
        </div>
      </div>
      
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Sales chart visualization would appear here</p>
          <p className="text-xs text-gray-400 mt-1">Using Recharts library in the actual implementation</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-xl font-bold text-gray-900">{formatKWDEnglish(38430.500)}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Conversion</p>
          <p className="text-xl font-bold text-gray-900">3.6%</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Avg. Order</p>
          <p className="text-xl font-bold text-gray-900">{formatKWDEnglish(308.250)}</p>
        </div>
      </div>
    </div>
  );
};

const OrderStatusWidget = () => {
  const statuses = [
    { name: 'Pending', count: 24, color: 'bg-yellow-500' },
    { name: 'Processing', count: 13, color: 'bg-blue-500' },
    { name: 'Shipped', count: 8, color: 'bg-purple-500' },
    { name: 'Delivered', count: 42, color: 'bg-green-500' },
    { name: 'Cancelled', count: 3, color: 'bg-red-500' }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
        <PieChart className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {statuses.map((status) => (
          <div key={status.name} className="text-center">
            <div className={`w-12 h-12 ${status.color} rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2`}>
              {status.count}
            </div>
            <p className="text-sm text-gray-600">{status.name}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
          View all orders
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

const QuickActionsWidget = () => {
  const actions = [
    { name: 'Add Product', icon: Package, color: 'bg-blue-500', link: '/admin/products' },
    { name: 'Process Orders', icon: ShoppingCart, color: 'bg-green-500', link: '/admin/orders' },
    { name: 'Manage Users', icon: Users, color: 'bg-purple-500', link: '/admin/users' },
    { name: 'Export Reports', icon: Download, color: 'bg-amber-500', link: '#' }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <a 
            key={action.name}
            href={action.link}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className={`p-3 ${action.color} rounded-full text-white mb-3`}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-900">{action.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

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

  // Dashboard stats with enhanced data
  const dashboardStats = [
    { 
      title: 'Total Revenue', 
      value: formatKWD(state.analytics?.totalRevenue || 0), 
      change: { type: 'increase', value: '+12.5%', period: 'from last month' },
      icon: DollarSign,
      color: 'bg-blue-600'
    },
    { 
      title: 'Total Orders', 
      value: state.analytics?.totalOrders.toLocaleString() || '0', 
      change: { type: 'increase', value: '+8.2%', period: 'from last month' },
      icon: ShoppingCart,
      color: 'bg-green-600'
    },
    { 
      title: 'Total Products', 
      value: state.products.length.toString(), 
      change: { type: 'increase', value: '+3.1%', period: 'from last month' },
      icon: Package,
      color: 'bg-purple-600'
    },
    { 
      title: 'Average Order Value', 
      value: formatKWD(state.analytics?.averageOrderValue || 0), 
      change: { type: 'decrease', value: '-2.4%', period: 'from last month' },
      icon: TrendingDown,
      color: 'bg-amber-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {state.currentUser?.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <StatCard 
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesOverviewWidget />
        <SearchAnalyticsWidget />
        <RecentUsersWidget />
      </div>

      {/* Secondary Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusWidget />
        <QuickActionsWidget />
      </div>

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
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'New order received', details: 'Order #1247 - KD 299.500', time: '2 minutes ago' },
            { action: 'Product updated', details: 'iPhone 15 Pro - Price changed', time: '15 minutes ago' },
            { action: 'Low stock alert', details: 'MacBook Pro M3 - 3 units left', time: '1 hour ago' },
            { action: 'New customer registered', details: 'john.doe@email.com', time: '2 hours ago' },
            { action: 'Search analytics updated', details: 'Top query: iPhone 15', time: '3 hours ago' },
            { action: 'User data exported', details: 'CSV export by admin', time: '5 hours ago' }
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
      
      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Dashboard Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Export as CSV</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Export as Excel</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Export as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;