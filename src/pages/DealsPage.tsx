import React, { useState } from 'react';
import { Clock, Percent, Star, Filter } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../data/products';
import { formatKWD } from '../utils/currency';

const DealsPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'flash' | 'clearance' | 'bundle'>('all');

  // Filter products with discounts
  const dealsProducts = products.filter(product => product.originalPrice && product.originalPrice > product.price);

  const filteredDeals = dealsProducts.filter(product => {
    if (filterType === 'all') return true;
    // Add more specific filtering logic based on deal types
    return true;
  });

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
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

        {/* Deal Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
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
              { key: 'flash', label: 'Flash Sales' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {filteredDeals.map((product) => (
            <div key={product.id} className="relative">
              {/* Discount Badge */}
              <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {calculateDiscount(product.originalPrice!, product.price)}% OFF
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Deal of the Day */}
        <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Deal of the Day</h2>
            <p className="text-xl mb-6">Special offer valid for today only!</p>
            
            {dealsProducts.length > 0 && (
              <div className="bg-white text-gray-900 rounded-lg p-6 max-w-md mx-auto">
                <img
                  src={dealsProducts[0].images[0]}
                  alt={dealsProducts[0].name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{dealsProducts[0].name}</h3>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {formatKWD(dealsProducts[0].price)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatKWD(dealsProducts[0].originalPrice!)}
                  </span>
                </div>
                <div className="text-red-600 font-bold text-lg mb-4">
                  Save {formatKWD(dealsProducts[0].originalPrice! - dealsProducts[0].price)}
                </div>
                
                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-2 text-center">
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
            )}
          </div>
        </div>

        {/* Newsletter Signup */}
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