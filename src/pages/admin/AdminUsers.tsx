import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  RefreshCw
} from 'lucide-react';
import { formatKWDEnglish, formatKWDArabic } from '../../utils/currency';

// User types
interface UserActivity {
  id: string;
  type: 'login' | 'order' | 'cart' | 'search' | 'profile_update';
  timestamp: Date;
  details?: string;
  ip?: string;
  device?: string;
}

interface UserMetrics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastActive: Date;
  registrationDate: Date;
  loginCount: number;
  cartAbandonment: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'super_admin' | 'manager' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  lastLogin?: Date;
  createdAt: Date;
  metrics?: UserMetrics;
  recentActivity?: UserActivity[];
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Mock data loading
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Ahmed Al-Sayed',
        email: 'ahmed@example.com',
        phone: '+965 1234 5678',
        role: 'customer',
        status: 'active',
        lastLogin: new Date('2025-01-05T14:30:00'),
        createdAt: new Date('2024-12-15'),
        metrics: {
          totalOrders: 5,
          totalSpent: 1250.500,
          averageOrderValue: 250.100,
          lastActive: new Date('2025-01-05T14:30:00'),
          registrationDate: new Date('2024-12-15'),
          loginCount: 12,
          cartAbandonment: 2
        }
      },
      {
        id: '2',
        name: 'Fatima Hassan',
        email: 'fatima@example.com',
        phone: '+965 2345 6789',
        role: 'customer',
        status: 'active',
        lastLogin: new Date('2025-01-04T10:15:00'),
        createdAt: new Date('2024-12-10'),
        metrics: {
          totalOrders: 3,
          totalSpent: 780.250,
          averageOrderValue: 260.083,
          lastActive: new Date('2025-01-04T10:15:00'),
          registrationDate: new Date('2024-12-10'),
          loginCount: 8,
          cartAbandonment: 1
        }
      },
      {
        id: '3',
        name: 'Mohammed Ali',
        email: 'mohammed@example.com',
        phone: '+965 3456 7890',
        role: 'customer',
        status: 'inactive',
        lastLogin: new Date('2024-12-28T09:45:00'),
        createdAt: new Date('2024-11-20'),
        metrics: {
          totalOrders: 1,
          totalSpent: 199.900,
          averageOrderValue: 199.900,
          lastActive: new Date('2024-12-28T09:45:00'),
          registrationDate: new Date('2024-11-20'),
          loginCount: 3,
          cartAbandonment: 4
        }
      },
      {
        id: '4',
        name: 'Sara Ahmed',
        email: 'sara@example.com',
        phone: '+965 4567 8901',
        role: 'customer',
        status: 'active',
        lastLogin: new Date('2025-01-06T08:20:00'),
        createdAt: new Date('2024-12-05'),
        metrics: {
          totalOrders: 7,
          totalSpent: 1890.750,
          averageOrderValue: 270.107,
          lastActive: new Date('2025-01-06T08:20:00'),
          registrationDate: new Date('2024-12-05'),
          loginCount: 15,
          cartAbandonment: 0
        }
      },
      {
        id: '5',
        name: 'Admin User',
        email: 'admin@lakkiphones.com',
        role: 'super_admin',
        status: 'active',
        lastLogin: new Date('2025-01-06T09:30:00'),
        createdAt: new Date('2024-01-01'),
        metrics: {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          lastActive: new Date('2025-01-06T09:30:00'),
          registrationDate: new Date('2024-01-01'),
          loginCount: 120,
          cartAbandonment: 0
        }
      },
      {
        id: '6',
        name: 'Manager User',
        email: 'manager@lakkiphones.com',
        role: 'manager',
        status: 'active',
        lastLogin: new Date('2025-01-05T16:45:00'),
        createdAt: new Date('2024-01-01'),
        metrics: {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          lastActive: new Date('2025-01-05T16:45:00'),
          registrationDate: new Date('2024-01-01'),
          loginCount: 85,
          cartAbandonment: 0
        }
      },
      {
        id: '7',
        name: 'Editor User',
        email: 'editor@lakkiphones.com',
        role: 'editor',
        status: 'active',
        lastLogin: new Date('2025-01-04T11:20:00'),
        createdAt: new Date('2024-01-01'),
        metrics: {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          lastActive: new Date('2025-01-04T11:20:00'),
          registrationDate: new Date('2024-01-01'),
          loginCount: 42,
          cartAbandonment: 0
        }
      },
      {
        id: '8',
        name: 'Khalid Mahmoud',
        email: 'khalid@example.com',
        phone: '+965 5678 9012',
        role: 'customer',
        status: 'pending',
        createdAt: new Date('2025-01-05'),
        metrics: {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          lastActive: new Date('2025-01-05T12:00:00'),
          registrationDate: new Date('2025-01-05'),
          loginCount: 1,
          cartAbandonment: 0
        }
      },
      {
        id: '9',
        name: 'Layla Ibrahim',
        email: 'layla@example.com',
        phone: '+965 6789 0123',
        role: 'customer',
        status: 'blocked',
        lastLogin: new Date('2024-12-15T14:30:00'),
        createdAt: new Date('2024-11-10'),
        metrics: {
          totalOrders: 2,
          totalSpent: 450.750,
          averageOrderValue: 225.375,
          lastActive: new Date('2024-12-15T14:30:00'),
          registrationDate: new Date('2024-11-10'),
          loginCount: 5,
          cartAbandonment: 3
        }
      },
      {
        id: '10',
        name: 'Hassan Ali',
        email: 'hassan@example.com',
        phone: '+965 7890 1234',
        role: 'customer',
        status: 'active',
        lastLogin: new Date('2025-01-03T17:45:00'),
        createdAt: new Date('2024-10-20'),
        metrics: {
          totalOrders: 9,
          totalSpent: 2340.900,
          averageOrderValue: 260.100,
          lastActive: new Date('2025-01-03T17:45:00'),
          registrationDate: new Date('2024-10-20'),
          loginCount: 22,
          cartAbandonment: 1
        }
      }
    ];

    setUsers(mockUsers);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
      );
    }

    if (filterRole) {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    if (filterStatus) {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole, filterStatus]);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) return;
    
    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      return;
    }
    
    // In a real implementation, this would call an API
    let updatedUsers = [...users];
    
    if (action === 'delete') {
      updatedUsers = updatedUsers.filter(user => !selectedUsers.includes(user.id));
    } else {
      updatedUsers = updatedUsers.map(user => {
        if (selectedUsers.includes(user.id)) {
          return {
            ...user,
            status: action === 'activate' ? 'active' : 'inactive'
          };
        }
        return user;
      });
    }
    
    setUsers(updatedUsers);
    setSelectedUsers([]);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleImportUsers = () => {
    // This would be implemented with a file upload and processing
    alert('In a real implementation, this would import users from a CSV/Excel file');
    setShowImportModal(false);
  };

  const handleExportUsers = (format: 'csv' | 'excel' | 'json') => {
    // This would be implemented with actual file generation and download
    alert(`In a real implementation, this would export users as ${format.toUpperCase()}`);
    setShowExportModal(false);
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Inactive</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
      case 'blocked':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Blocked</span>;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Super Admin</span>;
      case 'admin':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Admin</span>;
      case 'manager':
        return <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">Manager</span>;
      case 'editor':
        return <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">Editor</span>;
      case 'viewer':
        return <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-medium">Viewer</span>;
      case 'customer':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Customer</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, track activity, and analyze engagement</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Import</span>
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => alert('This would open a form to add a new user')}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">New This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return u.createdAt > oneWeekAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inactive/Blocked</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'inactive' || u.status === 'blocked').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
          <div className="text-blue-700">
            <span className="font-medium">{selectedUsers.length}</span> users selected
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Deactivate
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Users Table */}
      {!loading && (
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.phone && <div className="text-xs text-gray-500">{user.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.lastLogin ? user.lastLogin.toLocaleTimeString() : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.createdAt.toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{user.createdAt.toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alert(`Edit user: ${user.name}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => {
                              const updatedUsers = users.map(u => 
                                u.id === user.id ? {...u, status: 'inactive' as const} : u
                              );
                              setUsers(updatedUsers);
                            }}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Deactivate User"
                          >
                            <LockIcon className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const updatedUsers = users.map(u => 
                                u.id === user.id ? {...u, status: 'active' as const} : u
                              );
                              setUsers(updatedUsers);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Activate User"
                          >
                            <UnlockIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                              setUsers(users.filter(u => u.id !== user.id));
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredUsers.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterRole('');
              setFilterStatus('');
            }}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredUsers.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex space-x-2">
            <button
              disabled={true}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-primary text-white rounded-lg">
              Page 1
            </span>
            <button
              disabled={true}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <button onClick={() => setShowUserDetails(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Profile */}
                <div className="md:col-span-1">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex flex-col items-center mb-6">
                      <div className="h-24 w-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold mb-4">
                        {selectedUser.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                      <p className="text-gray-600">{getRoleBadge(selectedUser.role)}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900">{selectedUser.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">Joined {selectedUser.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">
                          Last login: {selectedUser.lastLogin ? selectedUser.lastLogin.toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-4">Account Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </button>
                        <button className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center justify-center">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset Password
                        </button>
                        {selectedUser.status === 'active' ? (
                          <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center">
                            <LockIcon className="h-4 w-4 mr-2" />
                            Deactivate Account
                          </button>
                        ) : (
                          <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center">
                            <UnlockIcon className="h-4 w-4 mr-2" />
                            Activate Account
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* User Metrics and Activity */}
                <div className="md:col-span-2 space-y-6">
                  {/* User Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-xl font-bold text-gray-900">{selectedUser.metrics?.totalOrders || 0}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <div>
                          <p className="text-xl font-bold text-gray-900">{formatKWDEnglish(selectedUser.metrics?.totalSpent || 0)}</p>
                          <p className="text-xs text-gray-500">{formatKWDArabic(selectedUser.metrics?.totalSpent || 0)}</p>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Avg. Order Value</p>
                        <div>
                          <p className="text-xl font-bold text-gray-900">{formatKWDEnglish(selectedUser.metrics?.averageOrderValue || 0)}</p>
                          <p className="text-xs text-gray-500">{formatKWDArabic(selectedUser.metrics?.averageOrderValue || 0)}</p>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Login Count</p>
                        <p className="text-xl font-bold text-gray-900">{selectedUser.metrics?.loginCount || 0}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Cart Abandonment</p>
                        <p className="text-xl font-bold text-gray-900">{selectedUser.metrics?.cartAbandonment || 0}</p>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Days as Member</p>
                        <p className="text-xl font-bold text-gray-900">
                          {Math.floor((new Date().getTime() - selectedUser.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {[
                        { type: 'login', timestamp: new Date('2025-01-06T09:30:00'), details: 'Logged in from Chrome on Windows' },
                        { type: 'order', timestamp: new Date('2025-01-05T14:20:00'), details: 'Placed order #1247 for KD 299.500' },
                        { type: 'cart', timestamp: new Date('2025-01-05T13:45:00'), details: 'Added iPhone 15 Pro to cart' },
                        { type: 'search', timestamp: new Date('2025-01-05T13:30:00'), details: 'Searched for "Samsung Galaxy S24"' },
                        { type: 'profile_update', timestamp: new Date('2025-01-04T10:15:00'), details: 'Updated phone number' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="mr-3">
                            {activity.type === 'login' && <Lock className="h-5 w-5 text-blue-500" />}
                            {activity.type === 'order' && <ShoppingCart className="h-5 w-5 text-green-500" />}
                            {activity.type === 'cart' && <ShoppingCart className="h-5 w-5 text-yellow-500" />}
                            {activity.type === 'search' && <Search className="h-5 w-5 text-purple-500" />}
                            {activity.type === 'profile_update' && <Edit className="h-5 w-5 text-indigo-500" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 capitalize">{activity.type.replace('_', ' ')}</p>
                            <p className="text-sm text-gray-600">{activity.details}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {activity.timestamp.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Orders */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                    {selectedUser.metrics?.totalOrders ? (
                      <div className="space-y-3">
                        {[...Array(Math.min(3, selectedUser.metrics.totalOrders))].map((_, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">Order #{1247 - index}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(Date.now() - (index * 86400000)).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatKWDEnglish(selectedUser.metrics?.averageOrderValue || 0)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {index === 0 ? 'Delivered' : index === 1 ? 'Shipped' : 'Processing'}
                              </p>
                            </div>
                          </div>
                        ))}
                        <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                          View all orders
                          <ArrowUpRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-lg">
                        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No orders yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Import Users</h2>
              <button onClick={() => setShowImportModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Upload a CSV or Excel file to import users. The file should have the following columns:
                </p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <code>name, email, phone, role, status</code>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop your file here, or{' '}
                  <button className="text-primary hover:underline">browse files</button>
                </p>
                <p className="text-sm text-gray-500">
                  Supports: CSV, XLSX • Max size: 10MB
                </p>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportUsers}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Export Users</h2>
              <button onClick={() => setShowExportModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Select the format and options for exporting user data:
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <Download className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium text-gray-900">Export as CSV</span>
                  </div>
                  <button
                    onClick={() => handleExportUsers('csv')}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm"
                  >
                    Download
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <Download className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Export as Excel</span>
                  </div>
                  <button
                    onClick={() => handleExportUsers('excel')}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                  >
                    Download
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <Download className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900">Export as JSON</span>
                  </div>
                  <button
                    onClick={() => handleExportUsers('json')}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm"
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

export default AdminUsers;