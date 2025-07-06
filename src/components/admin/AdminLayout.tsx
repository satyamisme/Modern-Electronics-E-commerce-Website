import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  LogOut,
  GitCommit, 
  Smartphone,
  BarChart,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state, logout, hasPermission } = useAuth();
  const location = useLocation();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: LayoutDashboard,
      permission: 'analytics.read' as const
    },
    { 
      name: 'Products', 
      href: '/admin/products', 
      icon: Package,
      permission: 'products.read' as const
    },
    { 
      name: 'Users', 
      href: '/admin/users', 
      icon: Users,
      permission: 'users.read' as const
    },
    { 
      name: 'Orders', 
      href: '/admin/orders', 
      icon: ShoppingCart,
      permission: 'orders.read' as const
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: BarChart3,
      permission: 'analytics.read' as const
    },
    { 
      name: 'Search Analytics', 
      href: '/admin/search-analytics', 
      icon: BarChart,
      permission: 'analytics.read' as const
    },
    { 
      name: 'Changelog', 
      href: '/admin/changelog', 
      icon: GitCommit,
      permission: 'settings.read' as const
    },
    { 
      name: 'Phone Models', 
      href: '/admin/models', 
      icon: Smartphone,
      permission: 'settings.read' as const
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: Settings,
      permission: 'settings.read' as const
    },
  ];

  const visibleNavigation = navigation.filter(item => hasPermission(item.permission));

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-primary">Admin Panel</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {visibleNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-primary">Admin Panel</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {visibleNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{state.user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{state.user?.role.replace('_', ' ')}</p>
                </div>
                <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center">
                  {state.user?.name?.charAt(0)}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;