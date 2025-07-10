import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Download,
  Upload,
  RefreshCw,
  FileText,
  Printer,
  Mail,
  BarChart2 as BarChart2Icon,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  AlertCircle, // For error display
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { OrderService } from '../../services/orderService';
import type { Database } from '../../lib/supabase';
import { formatKWD } from '../../utils/currency';

// Use the OrderRow type similar to AdminOrderDetailsPage for consistency
type OrderRow = Database['public']['Tables']['orders']['Row'] & {
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    products: Pick<Database['public']['Tables']['products']['Row'], 'id' | 'name'> | null;
  })[];
  profiles: Pick<Database['public']['Tables']['profiles']['Row'], 'full_name' | 'email'> | null;
};

const AdminOrders: React.FC = () => {
  const { state: adminState, dispatch: adminDispatch } = useAdmin(); // Renamed to avoid conflict
  const [allOrders, setAllOrders] = useState<OrderRow[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderRow['status'] | ''>('');

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass filters to OrderService.getAllOrders if implemented
      // For now, fetching all and then filtering client-side
      const orders = await OrderService.getAllOrders({
        // TODO: Implement dateRange filtering in service if possible
        // status: filterStatus || undefined,
        // search: searchTerm || undefined,
      });
      setAllOrders(orders as OrderRow[]); // Assuming service returns correctly typed data
      // adminDispatch({ type: 'SET_ORDERS', payload: orders }); // If AdminContext is used for orders
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setAllOrders([]); // Clear orders on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Initial fetch

  useEffect(() => {
    let currentFilteredOrders = [...allOrders];

    // Date Range Filtering (Conceptual - actual date filtering should ideally be backend)
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      if (dateRange === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (dateRange === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (dateRange === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      } else if (dateRange === 'year') {
        startDate.setFullYear(now.getFullYear() - 1);
      }
      currentFilteredOrders = currentFilteredOrders.filter(order => new Date(order.created_at) >= startDate);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      currentFilteredOrders = currentFilteredOrders.filter(order =>
        (order.id && order.id.toLowerCase().includes(lowerSearchTerm)) ||
        (order.order_number && order.order_number.toLowerCase().includes(lowerSearchTerm)) ||
        (order.profiles?.full_name && order.profiles.full_name.toLowerCase().includes(lowerSearchTerm)) ||
        (order.profiles?.email && order.profiles.email.toLowerCase().includes(lowerSearchTerm))
      );
    }

    if (filterStatus) {
      currentFilteredOrders = currentFilteredOrders.filter(order => order.status === filterStatus);
    }

    setFilteredOrders(currentFilteredOrders);
  }, [allOrders, searchTerm, filterStatus, dateRange]);

  const handleStatusChange = async (orderId: string, newStatus: OrderRow['status']) => {
    // adminDispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: newStatus } });
    // This should ideally call OrderService.updateOrderStatus and then refresh or update local state
    try {
      const updatedOrder = await OrderService.updateOrderStatus(orderId, newStatus);
      setAllOrders(prevOrders => prevOrders.map(o => o.id === orderId ? {...o, ...updatedOrder} : o));
      // adminDispatch({ type: 'UPDATE_ORDER_IN_LIST', payload: updatedOrder });
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status. See console for details.");
    }
  };

    setRefreshing(true);
    fetchOrders(); // This already sets refreshing to false in its finally block
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // TODO: Implement actual export logic
    alert(`Exporting ${filteredOrders.length} orders as ${format.toUpperCase()}`);
    setShowExportModal(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleBulkAction = async (action: 'process' | 'ship' | 'cancel') => {
    if (selectedOrders.length === 0) return;
    
    const newStatus = action === 'process' ? 'processing' : action === 'ship' ? 'shipped' : 'cancelled';
    
    // Show confirmation for bulk actions
    if (!window.confirm(`Are you sure you want to mark ${selectedOrders.length} orders as ${newStatus}?`)) {
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const orderId of selectedOrders) {
      try {
        await OrderService.updateOrderStatus(orderId, newStatus);
        successCount++;
      } catch (err) {
        console.error(`Failed to update order ${orderId}:`, err);
        errorCount++;
      }
    }
    
    alert(`${successCount} orders updated. ${errorCount > 0 ? `${errorCount} failures.` : ''}`);
    fetchOrders(); // Refresh list
    setSelectedOrders([]);
    setSelectAll(false);
  };

  const getStatusIcon = (status: OrderRow['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderRow['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);


  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders and fulfillment</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">This year</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Orders', value: filteredOrders.length, color: 'bg-blue-500' },
          { label: 'Total Revenue', value: formatKWD(totalRevenue), color: 'bg-green-500' },
          { label: 'Pending', value: filteredOrders.filter(o => o.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Processing', value: filteredOrders.filter(o => o.status === 'processing').length, color: 'bg-indigo-500' },
          { label: 'Shipped', value: filteredOrders.filter(o => o.status === 'shipped').length, color: 'bg-purple-500' },
          { label: 'Delivered', value: filteredOrders.filter(o => o.status === 'delivered').length, color: 'bg-teal-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`}></div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, Order #, Name, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as OrderRow['status'] | '')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="flex items-center text-sm text-gray-600 md:justify-end">
            <Package className="h-4 w-4 mr-2" />
            {loading ? 'Loading...' : `${filteredOrders.length} orders found`}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-blue-700">
            <span className="font-medium">{selectedOrders.length}</span> orders selected
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBulkAction('process')}
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Mark Processing
            </button>
            <button
              onClick={() => handleBulkAction('ship')}
              className="px-3 py-1.5 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Mark Shipped
            </button>
            <button
              onClick={() => handleBulkAction('cancel')}
              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel Selected
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <div className="flex">
            <div className="py-1"><AlertCircle className="h-6 w-6 text-red-500 mr-3" /></div>
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    disabled={filteredOrders.length === 0}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr><td colSpan={8} className="text-center py-10">Loading orders...</td></tr>
              )}
              {!loading && error && (
                 <tr><td colSpan={8} className="text-center py-10 text-red-500">Failed to load orders. Please try again.</td></tr>
              )}
              {!loading && !error && filteredOrders.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10">No orders found.</td></tr>
              )}
              {!loading && !error && filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/admin/orders/${order.id}`} className="text-sm font-medium text-primary hover:underline">
                      {order.order_number || order.id}
                    </Link>
                    {order.tracking_number && (
                      <div className="text-xs text-gray-500">Track: {order.tracking_number}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.profiles?.full_name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{order.profiles?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.order_items?.length || 0} item(s)
                      {order.order_items && order.order_items.length > 0 && (
                         <div className="text-xs text-gray-500 truncate max-w-xs">
                           {order.order_items.map(item => item.products?.name || 'Unknown Product').join(', ')}
                         </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatKWD(order.total_amount || 0)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status || ''}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderRow['status'])}
                      onClick={(e) => e.stopPropagation()} // Prevent row click if any
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border focus:ring-2 focus:ring-primary ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-900" title="View Order">
                      <Eye className="h-5 w-5" />
                    </Link>
                    {/* Add other actions like Print, Email here if needed, ensure they don't conflict with row click or use stopPropagation */}
                    <button className="text-green-600 hover:text-green-900 ml-2" title="Print Invoice" onClick={(e) => {e.stopPropagation(); alert('Print invoice for ' + order.id)}}>
                      <Printer className="h-5 w-5" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 ml-2" title="Email Customer" onClick={(e) => {e.stopPropagation(); alert('Email customer for ' + order.id)}}>
                      <Mail className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Order Analytics - Mocked data, should be replaced with real data aggregation if needed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Products (Sample)</h2>
            <BarChart2Icon className="h-5 w-5 text-gray-400" />
          </div>
          {/* This section would require aggregation from order_items across all orders */}
          <div className="text-center text-gray-500 py-8">Analytics chart coming soon...</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Order Value Trends (Sample)</h2>
            <DollarSign className="h-5 w-5 text-gray-400" /> 
          </div>
           <div className="text-center text-gray-500 py-8">Analytics chart coming soon...</div>
        </div>
      </div>
      
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Export Orders</h2>
              <button onClick={() => setShowExportModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Select format for exporting {filteredOrders.length} orders:</p>
              <div className="space-y-3">
                <button onClick={() => handleExport('csv')} className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <span><FileText className="h-5 w-5 text-green-600 mr-2 inline"/>Export as CSV</span>
                  <Download className="h-5 w-5 text-gray-400"/>
                </button>
                <button onClick={() => handleExport('excel')} className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <span><FileText className="h-5 w-5 text-blue-600 mr-2 inline"/>Export as Excel</span>
                  <Download className="h-5 w-5 text-gray-400"/>
                </button>
                <button onClick={() => handleExport('pdf')} className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <span><FileText className="h-5 w-5 text-red-600 mr-2 inline"/>Export as PDF</span>
                  <Download className="h-5 w-5 text-gray-400"/>
                </button>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setShowExportModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;