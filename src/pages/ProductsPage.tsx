import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import SearchFilters from '../components/ui/SearchFilters';
import { products } from '../data/products';
import { Filter, Product } from '../types';

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [filters, setFilters] = useState<Filter>({});
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchQuery = searchParams.get('q');
    
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
    
    if (searchQuery) {
      // Handle search query here
      console.log('Search query:', searchQuery);
    }
  }, [searchParams]);

  // Filter products based on current filters
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Brand filter
    if (filters.brand && filters.brand.length > 0) {
      filtered = filtered.filter(product => filters.brand!.includes(product.brand));
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1]
      );
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter(product => product.rating >= filters.rating!);
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // popularity - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [filters, sortBy]);

  const handleFiltersChange = (newFilters: Filter) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
            <p className="text-gray-600">
              {filteredProducts.length} products found
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} variant={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;