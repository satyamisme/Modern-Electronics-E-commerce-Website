import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Calendar,
  Download,
  BarChart2,
  Package,
  CheckCircle,
  AlertTriangle,
  Star,
  UserCheck,
  UserMinus,
  Activity,
  PieChart,
  LineChart as LineChartIcon,
  ArrowUpRight,
  RefreshCw,
  Smartphone,
  Laptop,
  Tablet,
  Clock,
  Map,
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Star,
  UserCheck,
  UserMinus,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService, AnalyticsFilter, AnalyticsDashboard } from '../../services/analyticsService';
import { formatKWD } from '../../utils/currency';
import AnalyticsWidget from '../../components/admin/AnalyticsWidget';
import ChartWidget from '../../components/admin/ChartWidget';
import DataTable from '../../components/admin/DataTable';
import ExportButton from '../../components/admin/ExportButton';
import DateRangePicker from '../../components/admin/DateRangePicker';

const AdminAnalytics: React.FC = () => {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'products' | 'customers'>('overview');
  const [filter, setFilter] = useState<AnalyticsFilter>({
    dateRange: 'week'
  });
  const [startDate, setStartDate] = useState<Date | null>((() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  })());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [filter]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getDashboardAnalytics(filter);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalytics().then(() => {
      setTimeout(() => setRefreshing(false), 1000);
    });
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    
    if (start && end) {
      // Check if it's a standard range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const monthAgo = new Date(today);
      monthAgo.setDate(monthAgo.getDate() - 30);
      
      const yearAgo = new Date(today);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      
      if (start.getTime() === today.getTime() && end.getTime() === today.getTime()) {
        setFilter({ ...filter, dateRange: 'today' });
      } else if (start.getTime() === weekAgo.getTime()) {
        setFilter({ ...filter, dateRange: 'week' });
      } else if (start.getTime() === monthAgo.getTime()) {
        setFilter({ ...filter, dateRange: 'month' });
      } else if (start.getTime() === yearAgo.getTime()) {
        setFilter({ ...filter, dateRange: 'year' });
      } else {
        setFilter({ ...filter, dateRange: 'custom', startDate: start, endDate: end });
      }
    }
  };

  const renderOverviewTab = () => {
    if (!analytics) return null;
    
    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsWidget
            title="Total Revenue"
            value={analytics.salesOverview.totalRevenue}
            change={{ 
              type: 'increase', 
              value: `+${analytics.salesOverview.revenueChange}%`, 
              period: 'from last period' 
            }}
            icon={DollarSign}
            color="bg-blue-600"
            isCurrency={true}
          />
          <AnalyticsWidget
            title="Total Orders"
            value={analytics.salesOverview.totalOrders}
            change={{ 
              type: 'increase', 
              value: `+${analytics.salesOverview.ordersChange}%`, 
              period: 'from last period' 
            }}
            icon={ShoppingCart}
            color="bg-green-600"
          />
          <AnalyticsWidget
            title="Average Order Value"
            value={analytics.salesOverview.averageOrderValue}
            change={{ 
              type: 'increase', 
              value: '+5.2%', 
              period: 'from last period' 
            }}
            icon={TrendingUp}
            color="bg-purple-600"
            isCurrency={true}
          />
          <AnalyticsWidget
            title="Conversion Rate"
            value={analytics.salesOverview.conversionRate}
            change={{ 
              type: 'decrease', 
              value: '-0.8%', 
              period: 'from last period' 
            }}
            icon={Users}
            color="bg-amber-600"
            isPercentage={true}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWidget
            title="Sales Trend"
            icon={LineChartIcon}
            type="line"
            data={analytics.salesTrend}
            dataKeys={['revenue']}
            colors={['#1E40AF']}
            xAxisKey="date"
            isCurrency={true}
            tooltipFormatter={(value) => formatKWD(value)}
          />
          <ChartWidget
            title="Sales by Category"
            icon={PieChart}
            type="pie"
            data={analytics.categorySales}
            dataKeys={['value']}
            colors={analytics.categorySales.map(cat => cat.color)}
            isCurrency={true}
            tooltipFormatter={(value) => formatKWD(value)}
          />
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
            <BarChart2 className="h-5 w-5 text-gray-400" />
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
                    Conversion
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
                      <div className="text-sm text-gray-900">{product.viewToCartRatio.toFixed(1)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.trend === 'up' && (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        )}
                        {product.trend === 'down' && (
                          <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
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

        {/* User Metrics and Device Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">User Metrics</h2>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">New Users</p>
                <p className="text-xl font-bold text-gray-900">{analytics.userMetrics.newUsers}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-xl font-bold text-gray-900">{analytics.userMetrics.activeUsers}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Returning Users</p>
                <p className="text-xl font-bold text-gray-900">{analytics.userMetrics.returningUsers}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Churn Rate</p>
                <p className="text-xl font-bold text-gray-900">{analytics.userMetrics.churnRate}%</p>
              </div>
            </div>
          </div>
          
          <ChartWidget
            title="Device Distribution"
            icon={Smartphone}
            type="pie"
            data={analytics.deviceDistribution}
            dataKeys={['value']}
            colors={analytics.deviceDistribution.map(device => device.color)}
            tooltipFormatter={(value) => `${value}%`}
          />
        </div>

        {/* Sales by Hour */}
        <ChartWidget
          title="Sales by Hour of Day"
          icon={Clock}
          type="bar"
          data={analytics.salesByHour}
          dataKeys={['sales']}
          colors={['#1E40AF']}
          xAxisKey="hour"
          xAxisFormatter={(hour) => `${hour}:00`}
        />
      </div>
    );
  };

  const renderSalesTab = () => {
    if (!analytics) return null;
    
    // Prepare data for sales by payment method
    const paymentMethodData = [
      { name: 'KNET', value: 75, color: '#1E40AF' },
      { name: 'Credit Card', value: 20, color: '#047857' },
      { name: 'Cash on Delivery', value: 5, color: '#7C3AED' }
    ];
    
    // Prepare data for sales by location
    const salesByLocation = [
      { name: 'Kuwait City', value: 35, color: '#1E40AF' },
      { name: 'Hawalli', value: 25, color: '#047857' },
      { name: 'Ahmadi', value: 15, color: '#7C3AED' },
      { name: 'Jahra', value: 10, color: '#DB2777' },
      { name: 'Farwaniya', value: 10, color: '#F59E0B' },
      { name: 'Mubarak Al-Kabeer', value: 5, color: '#2563EB' }
    ];
    
    return (
      <div className="space-y-6">
        {/* Sales Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsWidget
            title="Total Revenue"
            value={analytics.salesOverview.totalRevenue}
            change={{ 
              type: 'increase', 
              value: `+${analytics.salesOverview.revenueChange}%`, 
              period: 'from last period' 
            }}
            icon={DollarSign}
            color="bg-blue-600"
            isCurrency={true}
          />
          <AnalyticsWidget
            title="Total Orders"
            value={analytics.salesOverview.totalOrders}
            change={{ 
              type: 'increase', 
              value: `+${analytics.salesOverview.ordersChange}%`, 
              period: 'from last period' 
            }}
            icon={ShoppingCart}
            color="bg-green-600"
          />
          <AnalyticsWidget
            title="Average Order Value"
            value={analytics.salesOverview.averageOrderValue}
            change={{ 
              type: 'increase', 
              value: '+5.2%', 
              period: 'from last period' 
            }}
            icon={TrendingUp}
            color="bg-purple-600"
            isCurrency={true}
          />
          <AnalyticsWidget
            title="Conversion Rate"
            value={analytics.salesOverview.conversionRate}
            change={{ 
              type: 'decrease', 
              value: '-0.8%', 
              period: 'from last period' 
            }}
            icon={Users}
            color="bg-amber-600"
            isPercentage={true}
          />
        </div>

        {/* Sales Trend */}
        <ChartWidget
          title="Sales Trend"
          icon={LineChartIcon}
          type="line"
          data={analytics.salesTrend}
          dataKeys={['revenue', 'orders']}
          colors={['#1E40AF', '#047857']}
          xAxisKey="date"
          isCurrency={false}
          tooltipFormatter={(value, name) => {
            if (name === 'revenue') return formatKWD(value);
            return value;
          }}
        />

        {/* Sales Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWidget
            title="Sales by Payment Method"
            icon={CreditCard}
            type="pie"
            data={paymentMethodData}
            dataKeys={['value']}
            colors={paymentMethodData.map(method => method.color)}
            tooltipFormatter={(value) => `${value}%`}
          />
          
          <ChartWidget
            title="Sales by Location"
            icon={Map}
            type="pie"
            data={salesByLocation}
            dataKeys={['value']}
            colors={salesByLocation.map(location => location.color)}
            tooltipFormatter={(value) => `${value}%`}
          />
        </div>

        {/* Sales by Category */}
        <ChartWidget
          title="Sales by Category"
          icon={BarChart2}
          type="bar"
          data={analytics.categorySales}
          dataKeys={['value']}
          colors={['#1E40AF']}
          xAxisKey="name"
          isCurrency={true}
          tooltipFormatter={(value) => formatKWD(value)}
        />

        {/* Sales by Device */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Mobile Sales</h3>
              <Smartphone className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{formatKWD(analytics.salesOverview.totalRevenue * 0.65)}</p>
            <p className="text-sm text-gray-600">65% of total revenue</p>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12.5% from last period</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Desktop Sales</h3>
              <Laptop className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{formatKWD(analytics.salesOverview.totalRevenue * 0.28)}</p>
            <p className="text-sm text-gray-600">28% of total revenue</p>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+3.2% from last period</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Tablet Sales</h3>
              <Tablet className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{formatKWD(analytics.salesOverview.totalRevenue * 0.07)}</p>
            <p className="text-sm text-gray-600">7% of total revenue</p>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
              <span className="text-sm text-red-600">-1.8% from last period</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProductsTab = () => {
    if (!analytics) return null;
    
    // Prepare data for product performance table
    const productColumns = [
      {
        Header: 'Product',
        accessor: 'name',
      },
      {
        Header: 'Revenue',
        accessor: 'revenue',
        Cell: ({ value }: { value: number }) => formatKWD(value)
      },
      {
        Header: 'Units Sold',
        accessor: 'units',
      },
      {
        Header: 'Conversion',
        accessor: 'viewToCartRatio',
        Cell: ({ value }: { value: number }) => `${value.toFixed(1)}%`
      },
      {
        Header: 'Trend',
        accessor: 'trend',
        Cell: ({ value, row }: { value: string; row: any }) => (
          <div className="flex items-center">
            {value === 'up' && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
            {value === 'down' && <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />}
            <span className={`${
              value === 'up' ? 'text-green-600' : 
              value === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {value === 'up' ? '+' : value === 'down' ? '-' : ''}
              {row.original.changePercentage}%
            </span>
          </div>
        )
      }
    ];
    
    // Prepare data for product view-to-purchase ratio
    const viewToPurchaseData = [
      { name: 'iPhone 15 Pro', ratio: 18.5 },
      { name: 'Samsung Galaxy S24', ratio: 14.3 },
      { name: 'MacBook Pro M3', ratio: 15.2 },
      { name: 'AirPods Pro', ratio: 22.7 },
      { name: 'iPad Air', ratio: 12.8 }
    ];
    
    return (
      <div className="space-y-6">
        {/* Product Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsWidget
            title="Total Products"
            value={1245}
            icon={Package}
            color="bg-blue-600"
          />
          <AnalyticsWidget
            title="Active Products"
            value={1156}
            change={{ 
              type: 'increase', 
              value: '+12', 
              period: 'from last period' 
            }}
            icon={CheckCircle}
            color="bg-green-600"
          />
          <AnalyticsWidget
            title="Out of Stock"
            value={89}
            change={{ 
              type: 'decrease', 
              value: '-5', 
              period: 'from last period' 
            }}
            icon={AlertTriangle}
            color="bg-red-600"
          />
          <AnalyticsWidget
            title="Avg. Product Rating"
            value={4.7}
            change={{ 
              type: 'increase', 
              value: '+0.2', 
              period: 'from last period' 
            }}
            icon={Star}
            color="bg-amber-600"
          />
        </div>

        {/* Product Performance Table */}
        <DataTable
          title="Product Performance"
          columns={productColumns}
          data={analytics.topProducts}
          showSearch={true}
          showPagination={true}
        />

        {/* Product View-to-Purchase Ratio */}
        <ChartWidget
          title="Product View-to-Purchase Ratio"
          icon={BarChart2}
          type="bar"
          data={viewToPurchaseData}
          dataKeys={['ratio']}
          colors={['#1E40AF']}
          xAxisKey="name"
          tooltipFormatter={(value) => `${value}%`}
        />

        {/* Category Performance */}
        <ChartWidget
          title="Sales by Category"
          icon={PieChart}
          type="pie"
          data={analytics.categorySales}
          dataKeys={['value']}
          colors={analytics.categorySales.map(cat => cat.color)}
          isCurrency={true}
          tooltipFormatter={(value) => formatKWD(value)}
        />
      </div>
    );
  };

  const renderCustomersTab = () => {
    if (!analytics) return null;
    
    // Prepare data for customer segments
    const customerSegments = [
      { name: 'VIP', value: 5, color: '#1E40AF' },
      { name: 'Loyal', value: 15, color: '#047857' },
      { name: 'Regular', value: 30, color: '#7C3AED' },
      { name: 'Occasional', value: 50, color: '#DB2777' }
    ];
    
    // Prepare data for customer acquisition
    const customerAcquisition = [
      { date: '2024-01-01', customers: 25 },
      { date: '2024-01-02', customers: 32 },
      { date: '2024-01-03', customers: 28 },
      { date: '2024-01-04', customers: 35 },
      { date: '2024-01-05', customers: 42 },
      { date: '2024-01-06', customers: 38 },
      { date: '2024-01-07', customers: 45 }
    ];
    
    return (
      <div className="space-y-6">
        {/* Customer Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsWidget
            title="Total Customers"
            value={analytics.userMetrics.activeUsers}
            change={{ 
              type: 'increase', 
              value: `+${analytics.userMetrics.newUsers}`, 
              period: 'new customers' 
            }}
            icon={Users}
            color="bg-blue-600"
          />
          <AnalyticsWidget
            title="Active Users"
            value={analytics.userMetrics.activeUsers}
            icon={UserCheck}
            color="bg-green-600"
          />
          <AnalyticsWidget
            title="Returning Users"
            value={analytics.userMetrics.returningUsers}
            icon={RefreshCw}
            color="bg-purple-600"
          />
          <AnalyticsWidget
            title="Churn Rate"
            value={analytics.userMetrics.churnRate}
            change={{ 
              type: 'decrease', 
              value: '-0.5%', 
              period: 'from last period' 
            }}
            icon={UserMinus}
            color="bg-red-600"
            isPercentage={true}
          />
        </div>

        {/* Customer Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWidget
            title="Customer Segments"
            icon={PieChart}
            type="pie"
            data={customerSegments}
            dataKeys={['value']}
            colors={customerSegments.map(segment => segment.color)}
            tooltipFormatter={(value) => `${value}%`}
          />
          
          <ChartWidget
            title="Customer Acquisition"
            icon={LineChartIcon}
            type="line"
            data={customerAcquisition}
            dataKeys={['customers']}
            colors={['#1E40AF']}
            xAxisKey="date"
          />
        </div>

        {/* Customer Lifetime Value */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Customer Lifetime Value</h2>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Average CLV</p>
              <p className="text-3xl font-bold text-gray-900">{formatKWD(1250.500)}</p>
              <p className="text-xs text-gray-500 mt-2">Lifetime value per customer</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Avg. Orders</p>
              <p className="text-3xl font-bold text-gray-900">2.8</p>
              <p className="text-xs text-gray-500 mt-2">Orders per customer</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Retention Rate</p>
              <p className="text-3xl font-bold text-gray-900">68%</p>
              <p className="text-xs text-gray-500 mt-2">Customer retention</p>
            </div>
          </div>
        </div>

        {/* Customer Engagement */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Customer Engagement</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Avg. Session</p>
              <p className="text-xl font-bold text-gray-900">{analytics.userMetrics.averageSessionTime} min</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Pages/Session</p>
              <p className="text-xl font-bold text-gray-900">4.2</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Bounce Rate</p>
              <p className="text-xl font-bold text-gray-900">32%</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Cart Abandonment</p>
              <p className="text-xl font-bold text-gray-900">24%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track performance metrics and business insights</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeChange}
          />
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <ExportButton
            data={analytics ? [
              {
                totalRevenue: analytics.salesOverview.totalRevenue,
                totalOrders: analytics.salesOverview.totalOrders,
                averageOrderValue: analytics.salesOverview.averageOrderValue,
                conversionRate: analytics.salesOverview.conversionRate
              }
            ] : []}
            filename="analytics-dashboard"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sales'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'customers'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customers
            </button>
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

      {/* Tab Content */}
      {!loading && analytics && (
        <>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'sales' && renderSalesTab()}
          {activeTab === 'products' && renderProductsTab()}
          {activeTab === 'customers' && renderCustomersTab()}
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;