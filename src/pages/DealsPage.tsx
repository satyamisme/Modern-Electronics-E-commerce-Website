import React, { useState, useEffect } from 'react';
import { Clock, Percent, Star, Filter, Loader2, AlertTriangle } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import OptimizedImage from '../components/ui/OptimizedImage';
import { formatKWDEnglish, formatKWDArabic } from '../utils/currency';
import { ProductService } from '../services/productService';
import { Product } from '../types';

const DealsPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'flash' | 'clearance' | 'bundle'>('all');
  const [dealsProducts, setDealsProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch products that are considered "deals"
        // This might be products with an originalPrice > price, or a specific "onSale" flag
        // For now, we'll filter by originalPrice if ProductService doesn't have a direct "onSale" flag
        const { products: allProducts } = await ProductService.getProducts({ sortBy: 'created_at', sortOrder: 'desc', limit: 50 }); // Fetch a decent number to find deals
        const actualDeals = allProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
        setDealsProducts(actualDeals);
      } catch (err) {
        console.error("Error fetching deals:", err);
        setError(err instanceof Error ? err.message : "Failed to load deals.");
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const filteredDeals = dealsProducts.filter(product => {
    if (filterType === 'all') return true;
    // TODO: Add more specific filtering logic based on deal types if product data supports it
    // For example, if products have a 'dealType' property:
    // if (filterType === 'flash' && product.dealType === 'flash_sale') return true;
    // if (filterType === 'clearance' && product.dealType === 'clearance') return true;
    return true; // Placeholder for now
  });

  const calculateDiscount = (original: number | null | undefined, current: number) => {
    if (original && original > current) {
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Special Deals & Offers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these amazing deals! Limited time offers on premium electronics.
          </p>
        </div>

        {/* Deal Categories - These are static illustrative sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* ... (static deal category cards remain the same) ... */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="h-8 w-8" />
              <h3 className="text-xl font-bold">Flash Sales</h3>
            </div>
            <p className="text-red-100">Limited time offers</p>
            <div className="mt-4 text-2xl font-bold">Up to 50% OFF</div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Percent className="h-8 w-8" />
              <h3 className="text-xl font-bold">Clearance</h3>
            </div>
            <p className="text-blue-100">End of season deals</p>
            <div className="mt-4 text-2xl font-bold">Up to 70% OFF</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Star className="h-8 w-8" />
              <h3 className="text-xl font-bold">Bundle Deals</h3>
            </div>
            <p className="text-green-100">Buy more, save more</p>
            <div className="mt-4 text-2xl font-bold">Save KD 50+</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Filter className="h-8 w-8" />
              <h3 className="text-xl font-bold">Daily Deals</h3>
            </div>
            <p className="text-purple-100">New deals every day</p>
            <div className="mt-4 text-2xl font-bold">Check Daily</div>
          </div>
        </div>


        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium text-gray-900">Filter by:</span>
            {[
              { key: 'all', label: 'All Deals' },
              { key: 'flash', label: 'Flash Sales' }, // These filters are conceptual without backend support
              { key: 'clearance', label: 'Clearance' },
              { key: 'bundle', label: 'Bundle Deals' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === filter.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="ml-4 text-lg text-gray-600">Loading Deals...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md flex items-center">
            <AlertTriangle className="h-8 w-8 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Error Loading Deals</h3>
              <p>{error}</p>
            </div>
          </div>
        )}
        {!loading && !error && filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <Percent className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Active Deals</h2>
            <p className="text-gray-500">Please check back later for amazing offers!</p>
          </div>
        )}
        {!loading && !error && filteredDeals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {filteredDeals.map((product) => (
              <div key={product.id} className="relative group">
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
                    {calculateDiscount(product.originalPrice, product.price)}% OFF
                  </div>
                )}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Deal of the Day */}
        {!loading && !error && dealsProducts.length > 0 && (
          <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8 mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Deal of the Day</h2>
              <p className="text-xl mb-6">Special offer valid for today only!</p>

              {/* Display the first product from fetched deals as "Deal of the Day" */}
              <div className="bg-white text-gray-900 rounded-lg p-6 max-w-md mx-auto shadow-xl">
                <OptimizedImage
                  src={dealsProducts[0].images[0]} // Assuming images array is not empty
                  alt={dealsProducts[0].name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{dealsProducts[0].name}</h3>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {formatKWDEnglish(dealsProducts[0].price)}
                  </span>
                  {dealsProducts[0].originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatKWDEnglish(dealsProducts[0].originalPrice!)}
                    </span>
                  )}
                </div>
                {dealsProducts[0].originalPrice && (
                  <div className="text-red-600 font-bold text-lg mb-4">
                    Save {formatKWDEnglish(dealsProducts[0].originalPrice! - dealsProducts[0].price)}
                    <div className="text-sm">{formatKWDArabic(dealsProducts[0].originalPrice! - dealsProducts[0].price)}</div>
                  </div>
                )}
                
                {/* Countdown Timer (Static example) */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {/* ... (static countdown timer elements remain the same) ... */}
                  <div className="bg-gray-100 rounded p-2">
                    <div className="text-xl font-bold">12</div>
                    <div className="text-xs">Hours</div>
                  </div>
                  <div className="bg-gray-100 rounded p-2">
                    <div className="text-xl font-bold">34</div>
                    <div className="text-xs">Minutes</div>
                  </div>
                  <div className="bg-gray-100 rounded p-2">
                    <div className="text-xl font-bold">56</div>
                    <div className="text-xs">Seconds</div>
                  </div>
                  <div className="bg-gray-100 rounded p-2">
                    <div className="text-xl font-bold">78</div>
                    <div className="text-xs">MS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        {/* ... (Newsletter section remains the same) ... */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Never Miss a Deal!</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter and be the first to know about exclusive offers and flash sales.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;