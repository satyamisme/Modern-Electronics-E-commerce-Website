import React, { useState, useEffect } from 'react';
import { Search, Filter, Smartphone, Star, Eye, Heart, ShoppingCart } from 'lucide-react';
import { gsmarenaAPI, PhoneModel } from '../../api/gsmarena';
import { useSEO } from '../../utils/seo';
import OptimizedImage from '../../components/ui/OptimizedImage';

const ModelsPage: React.FC = () => {
  const [phones, setPhones] = useState<PhoneModel[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // SEO Configuration
  useSEO({
    title: 'Phone Models - Latest Smartphones Catalog',
    description: 'Browse 1000+ phone models with detailed specifications. Find iPhone, Samsung, Huawei, Xiaomi and more at LAKKI PHONES Kuwait.',
    keywords: ['phone models', 'smartphone catalog', 'iPhone', 'Samsung', 'mobile phones Kuwait', 'phone specifications'],
    type: 'website',
    image: '/models-og.jpg'
  });

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
      const [brandsData, phonesData] = await Promise.all([
        gsmarenaAPI.getBrands(),
        gsmarenaAPI.getPhonesByBrand('apple', 1)
      ]);
      
      setBrands(brandsData);
      setPhones(phonesData.phones);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPhonesByBrand = async (brand: string) => {
    try {
      setLoading(true);
      const data = await gsmarenaAPI.getPhonesByBrand(brand, currentPage);
      setPhones(data.phones);
    } catch (error) {
      console.error('Error loading phones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const results = await gsmarenaAPI.searchPhones(searchQuery);
      setPhones(results);
      setSelectedBrand('');
    } catch (error) {
      console.error('Error searching phones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Phone Models Catalog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore 1000+ phone models with detailed specifications and real-time data
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search phone models..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Brand Filter */}
            <div>
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Smartphone className="h-12 w-12 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">{phones.length}</div>
            <div className="text-gray-600">Models Available</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Filter className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">{brands.length}</div>
            <div className="text-gray-600">Brands</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">4.9</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Eye className="h-12 w-12 text-purple-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading phone models...</p>
          </div>
        )}

        {/* Phone Models Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {phones.map((phone) => (
              <div key={phone.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <OptimizedImage
                    src={phone.image}
                    alt={phone.name}
                    width={300}
                    height={200}
                    className="w-full h-48"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                      {phone.brand}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{phone.name}</h3>
                  
                  {/* Specifications */}
                  <div className="space-y-2 mb-4">
                    {phone.specifications.display && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Display:</span> {phone.specifications.display}
                      </div>
                    )}
                    {phone.specifications.camera && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Camera:</span> {phone.specifications.camera}
                      </div>
                    )}
                    {phone.specifications.battery && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Battery:</span> {phone.specifications.battery}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {phone.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {phone.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && phones.length === 0 && (
          <div className="text-center py-12">
            <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No phones found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && phones.length > 0 && (
          <div className="flex justify-center mt-12">
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
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsPage;