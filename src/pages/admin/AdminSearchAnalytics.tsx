import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Package,
  ShoppingCart,
  Filter, 
  BarChart2, 
  PieChart,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatKWD } from '../../utils/currency';

// Search analytics types
interface SearchQuery {
  id: string;
  term: string;
  count: number;
  lastSearched: Date;
  conversionRate: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}

interface FailedSearch {
  id: string;
  term: string;
  count: number;
  lastSearched: Date;
}

interface SearchAnalytics {
  totalSearches: number;
  uniqueSearches: number;
  searchesWithResults: number;
  searchesWithoutResults: number;
  conversionRate: number;
  topQueries: SearchQuery[];
  failedSearches: FailedSearch[];
  searchesByDevice: Record<string, number>;
  searchesByTime: Record<string, number>;
}

const AdminSearchAnalytics: React.FC = () => {
  const { hasPermission } = useAuth();
  const [analytics, setAnalytics] = useState<SearchAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    // Mock data - in a real implementation, this would be an API call
    setTimeout(() => {
      const mockAnalytics: SearchAnalytics = {
        totalSearches: 2458,
        uniqueSearches: 1245,
        searchesWithResults: 2156,
        searchesWithoutResults: 302,
        conversionRate: 12.5,
        topQueries: [
          { id: '1', term: 'iPhone 15', count: 245, lastSearched: new Date(), conversionRate: 18.2, trend: 'up', changePercentage: 12 },
          { id: '2', term: 'Samsung S24', count: 189, lastSearched: new Date(), conversionRate: 15.7, trend: 'up', changePercentage: 28 },
          { id: '3', term: 'AirPods Pro', count: 156, lastSearched: new Date(), conversionRate: 22.4, trend: 'down', changePercentage: 5 },
          { id: '4', term: 'MacBook Pro', count: 132, lastSearched: new Date(), conversionRate: 9.8, trend: 'up', changePercentage: 8 },
          { id: '5', term: 'Xiaomi', count: 98, lastSearched: new Date(), conversionRate: 7.5, trend: 'up', changePercentage: 15 },
          { id: '6', term: 'Huawei', count: 87, lastSearched: new Date(), conversionRate: 6.2, trend: 'down', changePercentage: 3 },
          { id: '7', term: 'iPad', count: 76, lastSearched: new Date(), conversionRate: 14.3, trend: 'up', changePercentage: 10 },
          { id: '8', term: 'Apple Watch', count: 65, lastSearched: new Date(), conversionRate: 11.9, trend: 'stable', changePercentage: 0 },
          { id: '9', term: 'Wireless Charger', count: 54, lastSearched: new Date(), conversionRate: 8.7, trend: 'down', changePercentage: 7 },
          { id: '10', term: 'Phone Case', count: 43, lastSearched: new Date(), conversionRate: 5.4, trend: 'up', changePercentage: 4 }
        ],
        failedSearches: [
          { id: '1', term: 'iPhone 16', count: 45, lastSearched: new Date() },
          { id: '2', term: 'Samsung S25', count: 32, lastSearched: new Date() },
          { id: '3', term: 'Google Pixel 9', count: 28, lastSearched: new Date() },
          { id: '4', term: 'OnePlus 12', count: 24, lastSearched: new Date() },
          { id: '5', term: 'Xiaomi 14', count: 19, lastSearched: new Date() }
        ],
        searchesByDevice: {
          'Mobile': 1475,
          'Desktop': 834,
          'Tablet': 149
        },
        searchesByTime: {
          '00:00-04:00': 98,
          '04:00-08:00': 147,
          '08:00-12:00': 589,
          '12:00-16:00': 823,
          '16:00-20:00': 654,
          '20:00-24:00': 147
        }
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
    alert(`Exporting search analytics as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search Analytics</h1>
          <p className="text-gray-600">Track search patterns and optimize your product catalog</p>
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

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search analytics...</p>
        </div>
      )}

      {/* Search Overview */}
      {!loading && analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Searches</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalSearches.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium ml-1 text-green-600">+8.2%</span>
                <span className="text-sm text-gray-500 ml-1">from last period</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Searches</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.uniqueSearches.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Filter className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium ml-1 text-green-600">+2.3%</span>
                <span className="text-sm text-gray-500 ml-1">from last period</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed Searches</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.searchesWithoutResults.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium ml-1 text-red-600">+12.5%</span>
                <span className="text-sm text-gray-500 ml-1">from last period</span>
              </div>
            </div>
          </div>

          {/* Search Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Search Queries */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Top Search Queries</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleExport('csv')}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Export as CSV"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Query
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Searches
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.topQueries.map((query) => (
                      <tr key={query.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{query.term}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{query.count}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{query.conversionRate}%</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {query.trend === 'up' && (
                              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            )}
                            {query.trend === 'down' && (
                              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            {query.trend === 'stable' && (
                              <span className="h-4 w-4 bg-gray-300 rounded-full mr-1"></span>
                            )}
                            <span className={`text-sm ${
                              query.trend === 'up' ? 'text-green-600' : 
                              query.trend === 'down' ? 'text-red-600' : 
                              'text-gray-600'
                            }`}>
                              {query.trend === 'up' ? '+' : query.trend === 'down' ? '-' : ''}
                              {query.changePercentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Failed Searches */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Failed Searches</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleExport('csv')}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Export as CSV"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {analytics.failedSearches.map((search) => (
                  <div key={search.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{search.term}</p>
                      <p className="text-sm text-gray-600">
                        {search.count} searches • Last: {search.lastSearched.toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => alert(`This would add "${search.term}" to your product catalog or create a redirect`)}
                      className="px-3 py-1 bg-primary text-white rounded-lg text-sm"
                    >
                      Add Product
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search by Device */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Search by Device</h2>
                <PieChart className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Device distribution chart would appear here</p>
                  <p className="text-xs text-gray-400 mt-1">Using Recharts library in the actual implementation</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {Object.entries(analytics.searchesByDevice).map(([device, count]) => (
                  <div key={device} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{device}</p>
                    <p className="text-xl font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((count / analytics.totalSearches) * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Search by Time */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Search by Time</h2>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Time distribution chart would appear here</p>
                  <p className="text-xs text-gray-400 mt-1">Using Recharts library in the actual implementation</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {Object.entries(analytics.searchesByTime).map(([timeRange, count]) => (
                  <div key={timeRange} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{timeRange}</p>
                    <p className="text-xl font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((count / analytics.totalSearches) * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search Insights */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Search Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Top Opportunity</h3>
                <p className="text-gray-600 mb-3">
                  "iPhone 16" is frequently searched but not in your catalog.
                </p>
                <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                  Add to inventory
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Best Performer</h3>
                <p className="text-gray-600 mb-3">
                  "AirPods Pro" has the highest search-to-purchase conversion rate (22.4%).
                </p>
                <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                  View product
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Trending Up</h3>
                <p className="text-gray-600 mb-3">
                  "Samsung S24" searches increased by 28% in the last period.
                </p>
                <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                  Analyze trend
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Search Analytics</h2>
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

export default AdminSearchAnalytics;