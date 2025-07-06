import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter,
  FileText,
  Smartphone, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  UploadCloud,
  RefreshCw,
  Link,
  AlertCircle
} from 'lucide-react';
import { phoneModelService, PhoneModel } from '../../services/phoneModelService';
import { smartprixService, SmartprixPhone } from '../../services/smartprixService';
import { useAuth } from '../../context/AuthContext';
import OptimizedImage from '../../components/ui/OptimizedImage';
import { formatKWD } from '../../utils/currency';
import PhoneImportModal from '../../components/admin/PhoneImportModal';

const AdminModels: React.FC = () => {
  const { hasPermission } = useAuth();
  const [phones, setPhones] = useState<PhoneModel[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<PhoneModel | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      loadPhonesByBrand(selectedBrand);
    }
  }, [selectedBrand, currentPage]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const brandsData = await phoneModelService.getBrands();
      setBrands(brandsData);
      
      if (brandsData.length > 0) {
        const defaultBrand = 'Apple';
        setSelectedBrand(defaultBrand);
        const phonesData = await phoneModelService.getPhonesByBrand(defaultBrand, 1);
        setPhones(phonesData.phones);
        setHasMore(phonesData.hasMore);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPhonesByBrand = async (brand: string) => {
    try {
      setLoading(true);
      const data = await phoneModelService.getPhonesByBrand(brand, currentPage);
      setPhones(data.phones);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error loading phones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const results = await phoneModelService.searchPhones(searchTerm);
      setPhones(results);
      setSelectedBrand('');
      setHasMore(false);
    } catch (error) {
      console.error('Error searching phones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPhonesByBrand(selectedBrand || 'Apple');
    setRefreshing(false);
  };

  const handleViewDetails = (phone: PhoneModel) => {
    setSelectedPhone(phone);
    setShowDetails(true);
  };

  const handleAddToInventory = (phone: PhoneModel) => {
    // This would connect to your product service to add the phone to your inventory
    alert(`Added ${phone.name} to inventory. In a real implementation, this would create a product record.`);
  };

  const handleImportComplete = (importedPhones: SmartprixPhone[]) => {
    // In a real implementation, this would add the phones to your database
    alert(`Successfully imported ${importedPhones.length} phone models. In a real implementation, these would be added to your database.`);
    
    // Refresh the phone list
    handleRefresh();
  };

  const handleQuickImport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!importUrl.trim() || !importUrl.includes('smartprix.com')) {
      setImportError('Please enter a valid Smartprix URL');
      return;
    }
    
    setImportLoading(true);
    setImportError(null);
    
    try {
      const result = await smartprixService.scrapePhoneFromUrl(importUrl);
      
      if (result.success && result.phones.length > 0) {
        handleImportComplete(result.phones);
        setImportUrl('');
      } else {
        setImportError(result.errors?.[0] || 'Failed to import phone data');
      }
    } catch (error) {
      setImportError((error as Error).message);
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phone Models</h1>
          <p className="text-gray-600">Manage phone models catalog from GSMArena</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2"
          >
            <UploadCloud className="h-5 w-5" />
            <span>Bulk Import</span>
          </button>
        </div>
      </div>

      {/* Quick Import and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Import */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Import from Smartprix</h3>
            <form onSubmit={handleQuickImport} className="flex space-x-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://www.smartprix.com/mobiles/apple-iphone-15-pro-ppd1f9iuxeqn"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={importLoading}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
              >
                {importLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                <span>Import</span>
              </button>
            </form>
            {importError && (
              <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {importError}
              </div>
            )}
          </div>
          
          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form onSubmit={handleSearch} className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search phone models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Import Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Phone Model Import Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Link className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">Direct URL Import</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Import a single phone model by pasting its Smartprix URL in the quick import field above.
            </p>
            <p className="text-xs text-gray-500">
              Best for: Adding individual models quickly
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="relative">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900">Bulk URL Import</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Import multiple phone models at once by providing a list of Smartprix URLs.
              </p>
              <p className="text-xs text-gray-500">
                Best for: Adding multiple specific models
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Upload className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">CSV/Excel Import</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Import phone models from a CSV or Excel file with predefined columns.
            </p>
            <p className="text-xs text-gray-500">
              Best for: Bulk imports and data migration
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowImportModal(true)}
          className="mt-6 w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center space-x-2"
        >
          <UploadCloud className="h-5 w-5" />
          <span>Open Bulk Import Tool</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading phone models...</p>
        </div>
      )}

      {/* Phone Models Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specifications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {phones.map((phone) => (
                  <tr key={phone.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <OptimizedImage
                          src={phone.image}
                          alt={phone.name}
                          width={100}
                          height={100}
                          className="h-12 w-12 rounded-lg"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{phone.name}</div>
                          <div className="text-sm text-gray-500">{phone.releaseDate || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {phone.brand}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {phone.specifications.display && (
                          <div className="mb-1">Display: {phone.specifications.display}</div>
                        )}
                        {phone.specifications.processor && (
                          <div className="mb-1">Processor: {phone.specifications.processor}</div>
                        )}
                        {phone.specifications.ram && (
                          <div className="mb-1">RAM: {phone.specifications.ram}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {phone.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(phone)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAddToInventory(phone)}
                          className="text-green-600 hover:text-green-900"
                          title="Add to Inventory"
                        >
                          <Plus className="h-4 w-4" />
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
      {!loading && phones.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No phone models found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedBrand('Apple');
              setCurrentPage(1);
            }}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && phones.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {phones.length} models
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-primary text-white rounded-lg">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!hasMore}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Phone Details Modal */}
      {showDetails && selectedPhone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">{selectedPhone.name}</h2>
              <button onClick={() => setShowDetails(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <OptimizedImage
                    src={selectedPhone.image}
                    alt={selectedPhone.name}
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-medium">{selectedPhone.brand}</span>
                    </div>
                    {selectedPhone.releaseDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Release Date:</span>
                        <span className="font-medium">{selectedPhone.releaseDate}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Availability:</span>
                      <span className={`font-medium ${selectedPhone.availability ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedPhone.availability ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    {selectedPhone.price && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">{formatKWD(selectedPhone.price)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedPhone.specifications).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-900 capitalize">{key}:</span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  
                  {selectedPhone.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPhone.features.map((feature, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleAddToInventory(selectedPhone)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add to Inventory</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Import Modal */}
      <PhoneImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};

export default AdminModels;