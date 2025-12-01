import React from 'react';
import {
  Bell,
  Building2,
  CheckCheck,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Home,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
  LogOut,
  Signal,
  Ticket
} from 'lucide-react';
import { formatKWDEnglish } from '../../utils/currency';

const AdminDashboard: React.FC = () => {
  // Placeholder data for the widgets
  const revenueData = {
    today: 2450,
    monthlyTarget: 85000,
    progress: 65,
    vsPreviousMonth: 12.5,
  };

  const orderData = {
    newOrders: 15,
    processing: 8,
    shippedToday: 22,
  };

  const inventoryData = {
    lowStock: 8,
    outOfStock: 3,
    overstock: 2,
  };

  const customerData = {
    newCustomers: 12,
    supportTickets: 5,
    satisfaction: 94.5,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Action Bar */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="text-gray-600">
            <Menu className="h-6 w-6" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm">
            <Signal className="h-5 w-5 text-green-500" />
            <span className="text-gray-700">Live Status:</span>
            <span className="font-semibold text-green-500">Online</span>
          </div>
          <button className="relative text-gray-600">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <p className="font-semibold text-sm">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <button className="text-gray-600">
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue Performance Widget */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Performance</h3>
            <p className="text-3xl font-bold text-gray-900">{formatKWDEnglish(revenueData.today)}</p>
            <p className="text-sm text-gray-500">Today's Revenue (Live)</p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${revenueData.progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{revenueData.progress}% of {formatKWDEnglish(revenueData.monthlyTarget)} monthly target</p>
            </div>
            <p className="text-sm text-green-500 mt-2">+{revenueData.vsPreviousMonth}% vs Previous Month</p>
            <button className="mt-4 text-primary font-semibold text-sm">View Detailed Reports</button>
          </div>

          {/* Order Management Widget */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Management</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">New Orders</span>
                <span className="font-bold text-lg">{orderData.newOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Processing</span>
                <span className="font-bold text-lg">{orderData.processing}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Shipped Today</span>
                <span className="font-bold text-lg">{orderData.shippedToday}</span>
              </div>
            </div>
            <button className="mt-6 text-primary font-semibold text-sm">Process Bulk Orders</button>
          </div>

          {/* Inventory Alerts Widget */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Alerts</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-yellow-600">
                <span >Low Stock</span>
                <span className="font-bold text-lg">{inventoryData.lowStock}</span>
              </div>
              <div className="flex justify-between items-center text-red-600">
                <span>Out of Stock</span>
                <span className="font-bold text-lg">{inventoryData.outOfStock}</span>
              </div>
              <div className="flex justify-between items-center text-blue-600">
                <span>Overstock</span>
                <span className="font-bold text-lg">{inventoryData.overstock}</span>
              </div>
            </div>
            <button className="mt-6 text-primary font-semibold text-sm">Manage Inventory</button>
          </div>

          {/* Customer Insights Widget */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">New Customers Today</span>
                <span className="font-bold text-lg">{customerData.newCustomers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Unanswered Support Tickets</span>
                <span className="font-bold text-lg">{customerData.supportTickets}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Satisfaction</span>
                <span className="font-bold text-lg">{customerData.satisfaction}%</span>
              </div>
            </div>
            <button className="mt-6 text-primary font-semibold text-sm">View Customer Analytics</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
