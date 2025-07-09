import React, { useEffect, useState, useCallback } from 'react'; // Added useState, useCallback
import { 
  Package, 
  ShoppingCart, 
  Users,
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Search as SearchIcon,
  Calendar,
  Download,
  BarChart2,
  PieChart,
  TrendingDown,
  Loader2,
  LineChart as LineChartIcon,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { formatKWDEnglish, formatKWD } from '../../utils/currency';
import { analyticsService, AnalyticsDashboard, AnalyticsFilter, SalesData, ProductPerformance, UserMetrics } from '../../services/analyticsService'; // Removed unused CategoryData import
import { Link } from 'react-router-dom';

// Dashboard widget components
interface StatCardProps {
  title: string;
  value: string | number;
  change?: { type: 'increase' | 'decrease'; value: string; period?: string };
  icon: React.ElementType;
  color: string;
  isCurrency?: boolean;
  isPercentage?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color, isCurrency, isPercentage }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {isCurrency ? formatKWDEnglish(Number(value)) : value}
          {isPercentage ? '%' : ''}
        </p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    {change && (
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
        {change.period && <span className="text-sm text-gray-500 ml-1">{change.period}</span>}
      </div>
    )}
  </div>
);


// Simplified Widgets - these could be further enhanced with ChartWidget from AdminAnalytics
const SearchAnalyticsWidget: React.FC<{topQueriesData: ProductPerformance[] | undefined}> = ({topQueriesData = []}) => { // Renamed prop
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Top Products (by Revenue/Units)</h2>
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {topQueriesData.slice(0,5).map((item, index) => (
          <div key={item.id || index} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                {index + 1}
              </span>
              <span className="text-gray-900 font-medium">{item.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-900 font-medium mr-3">{formatKWDEnglish(item.revenue)} ({item.units} units)</span>
              {item.changePercentage !== undefined && item.trend && (
                <span className={(item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-600')}>
                  {item.trend === 'up' ? '+' : item.trend === 'down' ? '-' : ''}{item.changePercentage}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link to="/admin/search-analytics" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
          View all search analytics
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

const RecentUsersWidget: React.FC<{userMetricsData: UserMetrics | undefined}> = ({userMetricsData}) => { // Renamed prop
  // This would ideally fetch a few recent user profiles from AuthService for a more dynamic list
  const mockRecentUsers = [
    { name: 'User Alpha (Mock)', email: 'alpha@example.com', status: 'active', joined: '1 hour ago' },
    { name: 'User Beta (Mock)', email: 'beta@example.com', status: 'pending', joined: '3 hours ago' },
  ];
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">User Activity Summary</h2>
        <Users className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-2 mb-4">
        <p>New Users: <span className="font-bold">{userMetricsData?.newUsers || 0}</span></p>
        <p>Active Users: <span className="font-bold">{userMetricsData?.activeUsers || 0}</span></p>
        <p>Returning Users: <span className="font-bold">{userMetricsData?.returningUsers || 0}</span></p>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Recent Signups (Mock):</h4>
        {mockRecentUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.status}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
         <Link to="/admin/users" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
          View all users
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

const SalesOverviewWidget: React.FC<{salesTrendData: SalesData[] | undefined, salesOverviewData: AnalyticsDashboard['salesOverview'] | undefined}> = ({salesTrendData, salesOverviewData}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
      </div>
      
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
        {salesTrendData && salesTrendData.length > 0 ? (
          <div className="text-sm text-gray-700 p-2">
            <LineChartIcon className="h-10 w-10 mx-auto text-blue-500 mb-2" />
            Sales Trend: {salesTrendData.length} data points.
            Max Revenue: {formatKWDEnglish(Math.max(...salesTrendData.map(s=>s.revenue), 0))}
            {/* Actual chart rendering with Recharts would go here */}
          </div>
        ) : (
          <p className="text-gray-500">Sales chart data not available.</p>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-xl font-bold text-gray-900">{formatKWDEnglish(salesOverviewData?.totalRevenue || 0)}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Conversion</p>
          <p className="text-xl font-bold text-gray-900">{salesOverviewData?.conversionRate?.toFixed(1) || 0}%</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Avg. Order</p>
          <p className="text-xl font-bold text-gray-900">{formatKWDEnglish(salesOverviewData?.averageOrderValue || 0)}</p>
        </div>
      </div>
    </div>
  );
};

const OrderStatusWidget: React.FC<{ salesOverviewData: AnalyticsDashboard['salesOverview'] | undefined }> = ({ salesOverviewData }) => {
  // This widget needs actual order counts by status.
  // This is a simplified placeholder based on total orders.
  const totalOrders = salesOverviewData?.totalOrders || 0;
  const statuses = [ // Example distribution, should come from actual data
    { name: 'Pending', count: Math.floor(totalOrders * 0.1), color: 'bg-yellow-500' },
    { name: 'Processing', count: Math.floor(totalOrders * 0.15), color: 'bg-blue-500' },
    { name: 'Shipped', count: Math.floor(totalOrders * 0.2), color: 'bg-purple-500' },
    { name: 'Delivered', count: Math.floor(totalOrders * 0.5), color: 'bg-green-500' },
    { name: 'Cancelled', count: Math.floor(totalOrders * 0.05), color: 'bg-red-500' }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Order Status Summary</h2>
        <PieChart className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
        <Link to="/admin/orders" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
          View all orders
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

const QuickActionsWidget: React.FC = () => {
  const actions = [
    { name: 'Add Product', icon: Package, color: 'bg-blue-500', link: '/admin/products' },
    { name: 'View Orders', icon: ShoppingCart, color: 'bg-green-500', link: '/admin/orders' },
    { name: 'Manage Users', icon: Users, color: 'bg-purple-500', link: '/admin/users' },
    { name: 'Full Analytics', icon: BarChart2, color: 'bg-amber-500', link: '/admin/analytics' }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.link}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className={`p-3 ${action.color} rounded-full text-white mb-3`}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-900 text-center">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { state: adminState, dispatch: adminDispatch } = useAdmin();
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<AnalyticsFilter>({ dateRange: 'week' }); // Default to 'week'
  const [refreshing, setRefreshing] = useState(false);

  // Callback to fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!refreshing) setLoading(true); // Show main loader only on initial load or filter change, not manual refresh
    try {
      const data = await analyticsService.getDashboardAnalytics(dateFilter);
      setDashboardData(data);
      // Update AdminContext's analytics part if still needed by some components, though ideally props are passed.
      if (data.salesOverview) {
        adminDispatch({ type: 'SET_ANALYTICS', payload: {
            totalRevenue: data.salesOverview.totalRevenue,
            totalOrders: data.salesOverview.totalOrders,
            averageOrderValue: data.salesOverview.averageOrderValue,
            // Ensure SalesAnalytics type in AdminContext matches or is compatible
        } });
      }
      // Note: adminState.products for "Total Products" card is populated by AdminContext's own useEffect.
      // Inventory alerts would need a separate fetching mechanism if they are to be dynamic.
    } catch (error) {
      console.error("AdminDashboard: Error fetching dashboard analytics:", error);
      // Optionally set an error state to display to the user
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateFilter, adminDispatch, refreshing]); // Added refreshing to dependencies

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); // fetchDashboardData is memoized by useCallback

  const handleRefresh = () => {
    setRefreshing(true); // This will trigger the fetchDashboardData effect if it's in its deps.
                         // Or call fetchDashboardData directly if preferred.
    fetchDashboardData();
  };

  const handleDateFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter({ dateRange: event.target.value as AnalyticsFilter['dateRange'] });
    // fetchDashboardData will be called by useEffect due to dateFilter change
  };


  // Construct dashboardStats once dashboardData is available
  const dashboardStats: StatCardProps[] = dashboardData ? [
    { 
      title: 'Total Revenue', 
      value: dashboardData.salesOverview.totalRevenue,
      change: {
        type: (dashboardData.salesOverview.revenueChange ?? 0) >= 0 ? 'increase' : 'decrease',
        value: `${dashboardData.salesOverview.revenueChange?.toFixed(1) || 0}%`
      },
      icon: DollarSign,
      color: 'bg-blue-600',
      isCurrency: true,
    },
    { 
      title: 'Total Orders', 
      value: dashboardData.salesOverview.totalOrders,
      change: {
        type: (dashboardData.salesOverview.ordersChange ?? 0) >= 0 ? 'increase' : 'decrease',
        value: `${dashboardData.salesOverview.ordersChange?.toFixed(1) || 0}%`
      },
      icon: ShoppingCart,
      color: 'bg-green-600'
    },
    { 
      title: 'Total Products', 
      value: adminState.products.length, // Sourced from AdminContext, which should load products
      icon: Package,
      color: 'bg-purple-600'
    },
    { 
      title: 'Avg. Order Value',
      value: dashboardData.salesOverview.averageOrderValue,
      icon: TrendingUp,
      color: 'bg-amber-600',
      isCurrency: true,
    }
  ] : [];

  if (loading && !dashboardData && !refreshing) { // Show full page loader only on initial load
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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