import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, Filter as FilterIcon, Loader2, AlertTriangle } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import SearchFilters from '../components/ui/SearchFilters';
import { Filter, Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductService } from '../services/productService';

const PRODUCTS_PER_PAGE = 12;

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { state: appState, dispatch } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFiltersSidebar, setShowFiltersSidebar] = useState(false);

  // Local component loading and error states, separate from global appState.isLoading
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  // Initialize filters from URL params and appState
  const initializeFilters = useCallback(() => {
    const categoryParam = searchParams.get('category');
    const queryParam = searchParams.get('q');
    const sortByParam = searchParams.get('sortBy');
    const pageParam = parseInt(searchParams.get('page') || '1', 10);

    let initialFilters: Filter = {
      ...appState.searchState.filters, // Start with context filters
      limit: PRODUCTS_PER_PAGE,
      offset: (pageParam - 1) * PRODUCTS_PER_PAGE,
    };
    if (categoryParam) initialFilters.categorySlug = categoryParam;
    if (queryParam) initialFilters.search = queryParam;
    if (sortByParam) initialFilters.sortBy = sortByParam;
    
    dispatch({ type: 'SET_SEARCH_FILTERS', payload: initialFilters });
    if (queryParam) dispatch({ type: 'SET_SEARCH_QUERY', payload: queryParam });
    
    // If products are already in context for the current query/filters, don't immediately reload
    // This is a bit tricky because AppContext loads initial generic products.
    // We should always fetch if query/filters change significantly from initial state.
    // For simplicity, we will fetch in useEffect based on dependencies.

  }, [searchParams, dispatch, appState.searchState.filters]); // Removed appState.searchState.query as it's set via dispatch

  useEffect(() => {
    initializeFilters();
  }, [location.search]); // Re-initialize if URL search params change directly

  // Fetch products when filters or page change
  const fetchProducts = useCallback(async () => {
    setPageLoading(true);
    dispatch({ type: 'SET_SEARCH_LOADING', payload: true });
    setPageError(null);

    const currentFilters = { ...appState.searchState.filters };
    if (appState.searchState.query) {
      currentFilters.search = appState.searchState.query;
    }
    currentFilters.offset = (appState.searchState.currentPage - 1) * PRODUCTS_PER_PAGE;
    currentFilters.limit = PRODUCTS_PER_PAGE;

    try {
      const { products: fetchedProducts, total: totalCount } = await ProductService.getProducts(currentFilters);

      dispatch({
        type: 'SET_SEARCH_RESULTS',
        payload: { products: fetchedProducts, total: totalCount, page: appState.searchState.currentPage, limit: PRODUCTS_PER_PAGE },
      });
    } catch (error) {
      console.error('ProductsPage: Error fetching products:', error);
      setPageError('Failed to load products. Please try again.');
    } finally {
      setPageLoading(false);
      dispatch({ type: 'SET_SEARCH_LOADING', payload: false });
    }
  }, [appState.searchState.filters, appState.searchState.query, appState.searchState.currentPage, dispatch]);

  useEffect(() => {
    // Fetch products whenever relevant parts of searchState change
    // Avoid fetching if results are already present for the exact same query/filters/page,
    // unless explicitly triggered (e.g. by URL change handled by initializeFilters)
    fetchProducts();
  }, [fetchProducts]); // fetchProducts is memoized with its dependencies

  const handleFiltersChange = (newFilters: Partial<Filter>) => {
    // Update URL search params
    const currentParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).length > 0) {
        if (key === 'brand' && Array.isArray(value)) {
          currentParams.set(key, value.join(','));
        } else if (key === 'priceRange' && Array.isArray(value)) {
          currentParams.set(key, `${value[0]}-${value[1]}`);
        } else {
          currentParams.set(key, String(value));
        }
      } else {
        currentParams.delete(key);
      }
    });
    currentParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(currentParams);
    // Dispatching will trigger fetchProducts effect
    dispatch({ type: 'SET_SEARCH_FILTERS', payload: newFilters });
  };

  const handleClearFilters = () => {
    setSearchParams({}); // Clear URL params
    dispatch({ type: 'SET_SEARCH_FILTERS', payload: { limit: PRODUCTS_PER_PAGE, offset: 0 } }); // Reset to default
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    const currentParams = new URLSearchParams(searchParams);
    if (newSortBy) {
      currentParams.set('sortBy', newSortBy);
    } else {
      currentParams.delete('sortBy');
    }
    currentParams.set('page', '1');
    setSearchParams(currentParams);
    dispatch({ type: 'SET_SEARCH_FILTERS', payload: { sortBy: newSortBy, offset: 0 } });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > appState.searchState.totalPages) return;
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('page', String(newPage));
    setSearchParams(currentParams);
    dispatch({ type: 'SET_SEARCH_FILTERS', payload: { offset: (newPage - 1) * PRODUCTS_PER_PAGE } });
    // The fetchProducts effect will pick up the change in currentPage (implicitly via offset in filters)
  };


  const { results: productsToDisplay, totalResults, currentPage, totalPages, loading: searchLoading } = appState.searchState;
  const currentSortBy = appState.searchState.filters.sortBy || 'popularity';


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {searchParams.get('category') ?
                  `${searchParams.get('category')?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Products` :
                  'All Products'
                }
              </h1>
              <p className="text-gray-600">
                {totalResults} products found
                {appState.searchState.query && (
                  <span className="ml-2 text-blue-600">
                    for "{appState.searchState.query}"
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <button
                onClick={() => setShowFiltersSidebar(!showFiltersSidebar)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FilterIcon className="h-4 w-4" />
                <span>Filters</span>
              </button>
              
              <select
                value={currentSortBy}
                onChange={handleSortByChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
              
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-8">
              <SearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <FilterIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  No products match your current filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} variant={viewMode} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredProducts.length > 0 && filteredProducts.length >= 12 && (
              <div className="text-center mt-12">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;