import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle,
  Clock,
  XCircle,
  Calendar
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { OrderManagement } from '../../types/admin';

const AdminOrders: React.FC = () => {
  const { state, dispatch } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<OrderManagement[]>([]);

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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders and fulfillment</p>
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

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;