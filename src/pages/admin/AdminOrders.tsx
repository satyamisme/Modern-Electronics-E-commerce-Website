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
  Calendar
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { OrderManagement } from '../../types/admin';
import { formatKWD } from '../../utils/currency';

const AdminOrders: React.FC = () => {
  const { state, dispatch } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<OrderManagement[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Mock orders data
    const mockOrders: OrderManagement[] = [
      {
        id: 'ORD-20250106-001',
        customerName: 'John Doe',
        customerEmail: 'john.doe@email.com',
        items: [
          { productId: 'iphone-15-pro', productName: 'iPhone 15 Pro', quantity: 1, price: 399.500 }
        ],
        total: 399.500,
        status: 'pending',
        orderDate: new Date('2024-01-20'),
        shippingAddress: 'Block 5, Street 15, Salmiya, Hawalli, Kuwait',
        trackingNumber: undefined
      },
      {
        id: 'ORD-20250106-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@email.com',
        items: [
          { productId: 'macbook-pro-m3', productName: 'MacBook Pro M3', quantity: 1, price: 649.900 },
          { productId: 'airpods-pro-2', productName: 'AirPods Pro', quantity: 1, price: 89.900 }
        ],
        total: 739.800,
        status: 'processing',
        orderDate: new Date('2024-01-19'),
        shippingAddress: 'Block 12, Street 8, Jabriya, Hawalli, Kuwait',
        trackingNumber: undefined
      },
      {
        id: 'ORD-20250106-003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike.johnson@email.com',
        items: [
          { productId: 'sony-wh1000xm5', productName: 'Sony WH-1000XM5', quantity: 2, price: 149.900 }
        ],
        total: 299.800,
        status: 'shipped',
        orderDate: new Date('2024-01-18'),
        shippingAddress: 'Block 3, Street 22, Ahmadi, Kuwait',
        trackingNumber: 'TRK123456789'
      },
      {
        id: 'ORD-004',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah.wilson@email.com',
        items: [
          { productId: 'ipad-air-m2', productName: 'iPad Air M2', quantity: 1, price: 599 }
        ],
        total: 599,
        status: 'delivered',
        orderDate: new Date('2024-01-17'),
        shippingAddress: '321 Elm St, Miami, FL 33101',
        trackingNumber: 'TRK987654321'
      },
      {
        id: 'ORD-005',
        customerName: 'David Brown',
        customerEmail: 'david.brown@email.com',
        items: [
          { productId: 'dell-xps-13', productName: 'Dell XPS 13', quantity: 1, price: 899 }
        ],
        total: 899,
        status: 'cancelled',
        orderDate: new Date('2024-01-16'),
        shippingAddress: '654 Maple Dr, Seattle, WA 98101',
        trackingNumber: undefined
      }
    ];
    
    dispatch({ type: 'SET_ORDERS', payload: mockOrders });
  }, [dispatch]);

  useEffect(() => {
    let filtered = state.orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    setFilteredOrders(filtered);
  }, [state.orders, searchTerm, filterStatus]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: newStatus } });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // In a real implementation, this would refresh data from the API
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // In a real implementation, this would generate and download a file
    alert(`Exporting orders as ${format.toUpperCase()}`);
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

  const handleBulkAction = (action: 'process' | 'ship' | 'cancel') => {
    if (selectedOrders.length === 0) return;
    
    // In a real implementation, this would call an API
    const newStatus = action === 'process' ? 'processing' : action === 'ship' ? 'shipped' : 'cancelled';
    
    selectedOrders.forEach(orderId => {
      handleStatusChange(orderId, newStatus);
    });
    
    setSelectedOrders([]);
    setSelectAll(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
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
            onClick={() => setShowExportModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Orders', value: state.orders.length, color: 'bg-blue-500' },
          { label: 'Pending', value: state.orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Processing', value: state.orders.filter(o => o.status === 'processing').length, color: 'bg-blue-500' },
          { label: 'Shipped', value: state.orders.filter(o => o.status === 'shipped').length, color: 'bg-purple-500' },
          { label: 'Delivered', value: state.orders.filter(o => o.status === 'delivered').length, color: 'bg-green-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`}></div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-4 w-4 mr-2" />
            {filteredOrders.length} orders
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
          <div className="text-blue-700">
            <span className="font-medium">{selectedOrders.length}</span> orders selected
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleBulkAction('process')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Process
            </button>
            <button
              onClick={() => handleBulkAction('ship')}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Mark Shipped
            </button>
            <button
              onClick={() => handleBulkAction('cancel')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
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
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    {order.trackingNumber && (
                      <div className="text-xs text-gray-500">Track: {order.trackingNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.map((item, index) => (
                        <div key={index} className="mb-1">
                          {item.productName} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">KD {order.total.toFixed(3)}</div>
                    <div className="text-xs text-gray-500">د.ك {order.total.toFixed(3)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-primary ${getStatusColor(order.status)}`}
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
                      <Calendar className="h-4 w-4 mr-1" />
                      {order.orderDate.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" title="View Order" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 ml-2">
                      <Printer className="h-4 w-4" title="Print Invoice" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 ml-2">
                      <Mail className="h-4 w-4" title="Email Customer" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Order Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
            <BarChart2Icon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[
              { name: 'iPhone 15 Pro', quantity: 156, revenue: 62322.000 },
              { name: 'MacBook Pro M3', quantity: 89, revenue: 57841.100 },
              { name: 'AirPods Pro', quantity: 234, revenue: 21037.600 },
              { name: 'Samsung Galaxy S24', quantity: 78, revenue: 35880.200 },
              { name: 'iPad Air', quantity: 65, revenue: 14943.500 }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-gray-900">{formatKWDEnglish(product.revenue)}</span>
                    <span className="text-xs text-gray-500">{formatKWDArabic(product.revenue)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatKWD(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Value Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Order Value Trends</h2>
            <DollarSign className="h-5 w-5 text-gray-400" /> 
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart2Icon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Order value trend chart would appear here</p>
              <p className="text-xs text-gray-400 mt-1">Using Recharts library in the actual implementation</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg. Order</p>
              <p className="text-xl font-bold text-gray-900">{formatKWD(308.250)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Highest</p>
              <p className="text-xl font-bold text-gray-900">{formatKWD(1250.750)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Lowest</p>
              <p className="text-xl font-bold text-gray-900">{formatKWD(89.900)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Export Orders</h2>
              <button onClick={() => setShowExportModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Select the format for exporting order data:
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium text-gray-900">Export as CSV</span>
                  </div>
                  <button
                    onClick={() => handleExport('csv')}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm"
                  >
                    Download
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Export as Excel</span>
                  </div>
                  <button
                    onClick={() => handleExport('excel')}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                  >
                    Download
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-red-600 mr-3" />
                    <span className="font-medium text-gray-900">Export as PDF</span>
                  </div>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;