import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Eye, GitCompare as Compare } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatKWD } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const { state, dispatch } = useApp();
  const isWishlisted = state.wishlist.includes(product.id);
  const isCompared = state.compareProducts.some(p => p.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1 } });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product.id });
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCompared) {
      dispatch({ type: 'REMOVE_FROM_COMPARE', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_COMPARE', payload: product });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (variant === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex">
          <div className="w-1/3 relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            {product.originalPrice && (
              <span className="absolute top-2 left-2 bg-secondary text-white px-2 py-1 rounded text-xs font-medium">
                Save {formatKWD(product.originalPrice - product.price)}
              </span>
            )}
          </div>
          <div className="w-2/3 p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleWishlist}
                  className={`p-1 rounded ${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button
                  onClick={handleToggleCompare}
                  className={`p-1 rounded ${isCompared ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-500 transition-colors`}
                >
                  <Compare className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
            <div className="flex items-center mb-3">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-500 ml-2">({product.reviewCount})</span>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">{formatKWD(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">{formatKWD(product.originalPrice)}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to={`/products/${product.id}`}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4 inline mr-1" />
                  View
                </Link>
                <button
                  onClick={handleAddToCart}
                  className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4 inline mr-1" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && (
            <span className="absolute top-2 left-2 bg-secondary text-white px-2 py-1 rounded text-xs font-medium">
              Save {formatKWD(product.originalPrice - product.price)}
            </span>
          )}
          <div className="absolute top-2 right-2 flex flex-col space-y-1">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full bg-white shadow-md ${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              onClick={handleToggleCompare}
              className={`p-2 rounded-full bg-white shadow-md ${isCompared ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-500 transition-colors`}
            >
              <Compare className="h-4 w-4" />
            </button>
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
          <div className="flex items-center mb-3">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-500 ml-2">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">{formatKWD(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">{formatKWD(product.originalPrice)}</span>
              )}
            </div>
            {product.inStock && (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                In Stock ({product.stockCount})
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="h-4 w-4 inline mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;