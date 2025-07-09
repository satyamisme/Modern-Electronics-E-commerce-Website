import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import CategoryCard from '../components/ui/CategoryCard';
import { useApp } from '../context/AppContext';
import { Category } from '../types'; // Ensure Category type is imported

const CategoriesPage: React.FC = () => {
  const { state: appState } = useApp();

  // Calculate total products from categories if productCount is available
  const totalProducts = appState.categories.reduce((total, cat) => total + (cat.productCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Categories</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of premium electronics across all categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {appState.categories.map((category: Category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Featured Categories */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary text-white p-3 rounded-lg">
                <Package className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Latest Arrivals</h3>
                <p className="text-gray-600">Discover the newest products in our collection</p>
              </div>
              <Link to="/products?filter=newest" className="text-primary hover:text-primary/80">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary text-white p-3 rounded-lg">
                <Package className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Best Sellers</h3>
                <p className="text-gray-600">Most popular products loved by customers</p>
              </div>
              <Link to="/products?filter=bestsellers" className="text-primary hover:text-primary/80">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-bold text-primary mb-2">
              {totalProducts}
            </div>
            <div className="text-gray-600">Total Products</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-bold text-primary mb-2">{appState.categories.length}</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-gray-600">Brands</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;