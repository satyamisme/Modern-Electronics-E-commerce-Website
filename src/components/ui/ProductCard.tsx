import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Eye, GitCompare as Compare, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatKWD, formatKWDArabic } from '../../utils/currency';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
  showDualCurrency?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid', showDualCurrency = true }) => {
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

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (variant === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
        <div className="flex">
          <div className="w-1/3 relative overflow-hidden">
            <OptimizedImage
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 space-y-2">
              {discountPercentage > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  -{discountPercentage}%
                </span>
              )}
              {!product.inStock && (
                <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
          
          <div className="w-2/3 p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 font-medium">{product.brand}</p>
                <div className="flex items-center mb-3">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-500 ml-2">({product.reviewCount})</span>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={handleToggleWishlist}
                  className={`p-2 rounded-xl transition-all ${
                    isWishlisted 
                      ? 'text-red-500 bg-red-50 shadow-md' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                </button>
                <button
                  onClick={handleToggleCompare}
                  className={`p-2 rounded-xl transition-all ${
                    isCompared 
                      ? 'text-blue-500 bg-blue-50 shadow-md' 
                      : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <Compare className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-blue-600">{formatKWD(product.price)}</span>
                {showDualCurrency && (
                  <span className="text-sm text-gray-500">{formatKWDArabic(product.price)}</span>
                )}
              </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">{formatKWD(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">{formatKWD(product.originalPrice)}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Link
                  to={`/products/${product.id}`}
                  className="px-4 py-2 text-sm border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all flex items-center space-x-1 font-medium"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Link>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 transition-all flex items-center space-x-1 font-medium shadow-lg"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
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
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
        <div className="relative overflow-hidden">
          <OptimizedImage
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-56 group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {discountPercentage > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>-{discountPercentage}%</span>
              </div>
            )}
            {!product.inStock && (
              <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                Out of Stock
              </span>
            )}
            {product.rating >= 4.5 && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                ⭐ Top Rated
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-xl shadow-lg transition-all transform hover:scale-110 ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              onClick={handleToggleCompare}
              className={`p-2 rounded-xl shadow-lg transition-all transform hover:scale-110 ${
                isCompared 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-600 hover:text-blue-500'
              }`}
            >
              <Compare className="h-4 w-4" />
            </button>
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-xl font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
              Quick View
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
            <p className="text-sm text-gray-600 font-medium">{product.brand}</p>
          </div>
          
          <div className="flex items-center mb-3">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-500 ml-2">({product.reviewCount})</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-600">{formatKWD(product.price)}</span>
                {showDualCurrency && (
                  <span className="text-xs text-gray-500">{formatKWDArabic(product.price)}</span>
                )}
              </div>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">{formatKWD(product.originalPrice)}</span>
              )}
            </div>
            {product.inStock && (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                In Stock ({product.stockCount})
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;