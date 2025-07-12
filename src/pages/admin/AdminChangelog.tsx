import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  User, 
  Tag, 
  Search,
  GitCommit,
  AlertTriangle,
  CheckCircle,
  Zap,
  Bug,
  Shield,
  Trash2
} from 'lucide-react';
import { ChangelogEntry } from '../../types/changelog';
import { useAuth } from '../../context/AuthContext';

const AdminChangelog: React.FC = () => {
  const { hasPermission } = useAuth();
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    // Mock changelog data
    const mockEntries: ChangelogEntry[] = [
      {
        id: 'v1.2.0',
        version: '1.2.0',
        date: new Date('2024-01-20'),
        author: 'Admin User',
        type: 'feature',
        title: 'Enhanced Admin Panel with Role Management',
        description: 'Major update introducing role-based access control and improved security features.',
        changes: [
          {
            id: '1',
            type: 'added',
            description: 'Role-based access control system',
            component: 'Authentication',
            impact: 'high'
          },
          {
            id: '2',
            type: 'added',
            description: 'Image upload functionality with drag & drop',
            component: 'Product Management',
            impact: 'medium'
          },
          {
            id: '3',
            type: 'added',
            description: 'Secure admin login with session management',
            component: 'Security',
            impact: 'high'
          },
          {
            id: '4',
            type: 'improved',
            description: 'Enhanced product form with better validation',
            component: 'Product Management',
            impact: 'medium'
          }
        ],
        tags: ['security', 'ui-improvement', 'major-release']
      },
      {
        id: 'v1.1.0',
        version: '1.1.0',
        date: new Date('2024-01-15'),
        author: 'Store Manager',
        type: 'improvement',
        title: 'Inventory Management Improvements',
        description: 'Enhanced inventory tracking and low stock alerts.',
        changes: [
          {
            id: '1',
            type: 'added',
            description: 'Real-time inventory alerts',
            component: 'Inventory',
            impact: 'medium'
          },
          {
            id: '2',
            type: 'fixed',
            description: 'Stock count calculation errors',
            component: 'Inventory',
            impact: 'high'
          }
        ],
        tags: ['inventory', 'alerts']
      }
    ];
    setEntries(mockEntries);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Zap className="h-4 w-4" />;
      case 'improvement': return <CheckCircle className="h-4 w-4" />;
      case 'bugfix': return <Bug className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'breaking': return <AlertTriangle className="h-4 w-4" />;
      default: return <GitCommit className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'text-blue-600 bg-blue-100';
      case 'improvement': return 'text-green-600 bg-green-100';
      case 'bugfix': return 'text-orange-600 bg-orange-100';
      case 'security': return 'text-red-600 bg-red-100';
      case 'breaking': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'added': return 'text-green-700 bg-green-50 border-green-200';
      case 'changed': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'deprecated': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'removed': return 'text-red-700 bg-red-50 border-red-200';
      case 'fixed': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'security': return 'text-purple-700 bg-purple-50 border-purple-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || entry.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Changelog</h1>
          <p className="text-gray-600">Track all system updates and changes</p>
        </div>
        {hasPermission('settings.update') && (
          <button
            // onClick={() => setShowForm(true)} // Form not yet implemented
            className="mt-4 sm:mt-0 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Entry</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search changelog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Types</option>
            <option value="feature">Features</option>
            <option value="improvement">Improvements</option>
            <option value="bugfix">Bug Fixes</option>
            <option value="security">Security</option>
            <option value="breaking">Breaking Changes</option>
          </select>
          <div className="flex items-center text-sm text-gray-600">
            <GitCommit className="h-4 w-4 mr-2" />
            {filteredEntries.length} entries
          </div>
        </div>
      </div>

      {/* Changelog Entries */}
      <div className="space-y-6">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(entry.type)}`}>
                    {getTypeIcon(entry.type)}
                    <span className="ml-1 capitalize">{entry.type}</span>
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900">{entry.title}</h2>
                  <span className="text-lg font-mono text-gray-600">v{entry.version}</span>
                </div>
                {hasPermission('settings.update') && (
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{entry.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{entry.date.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{entry.author}</span>
                </div>
                {entry.tags && (
                  <div className="flex items-center space-x-1">
                    <Tag className="h-4 w-4" />
                    <div className="flex space-x-1">
                      {entry.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Changes</h3>
              <div className="space-y-3">
                {entry.changes.map((change) => (
                  <div key={change.id} className={`p-3 rounded-lg border ${getChangeTypeColor(change.type)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium uppercase tracking-wide">
                            {change.type}
                          </span>
                          {change.component && (
                            <span className="text-xs text-gray-500">
                              in {change.component}
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{change.description}</p>
                      </div>
                      {change.impact && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          change.impact === 'high' ? 'bg-red-100 text-red-800' :
                          change.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {change.impact} impact
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <GitCommit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No changelog entries found</p>
        </div>
      )}
    </div>
  );
};

export default AdminChangelog;