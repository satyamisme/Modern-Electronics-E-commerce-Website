import React from 'react';
import { X, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatKWDEnglish, formatKWDArabic } from '../../utils/currency';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();

  if (!isOpen || state.compareProducts.length === 0) return null;

  const removeFromCompare = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_COMPARE', payload: productId });
  };

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1 } });
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Compare Products</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Product Images and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b">
              {state.compareProducts.map((product) => (
                <div key={product.id} className="text-center">
                  <div className="relative mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.brand}</p>
                  <div className="flex items-center justify-center mb-2">
                    {renderStars(product.rating)}
                  </div>
                  <div className="mb-4">
                    <p className="text-xl font-bold text-primary">{formatKWDEnglish(product.price)}</p>
                    <p className="text-sm text-gray-600">{formatKWDArabic(product.price)}</p>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Price Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="font-semibold text-gray-900">Price</div>
                  {state.compareProducts.map((product) => (
                    <div key={product.id} className="text-center">
                      <div>
                        <span className="text-xl font-bold text-primary">{formatKWDEnglish(product.price)}</span>
                        <div className="text-sm text-gray-600">{formatKWDArabic(product.price)}</div>
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatKWDEnglish(product.originalPrice)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Stock Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t">
                  <div className="font-semibold text-gray-900">Stock Status</div>
                  {state.compareProducts.map((product) => (
                    <div key={product.id} className="text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? `In Stock (${product.stockCount})` : 'Out of Stock'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Specifications Comparison */}
                {Object.keys(state.compareProducts[0]?.specifications || {}).map((spec) => (
                  <div key={spec} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t">
                    <div className="font-semibold text-gray-900">{spec}</div>
                    {state.compareProducts.map((product) => (
                      <div key={product.id} className="text-center text-gray-600">
                        {product.specifications[spec] || '-'}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Features Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t">
                  <div className="font-semibold text-gray-900">Features</div>
                  {state.compareProducts.map((product) => (
                    <div key={product.id} className="space-y-1">
                      {product.features.slice(0, 5).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Check className="h-3 w-3 text-green-500 mr-1" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;