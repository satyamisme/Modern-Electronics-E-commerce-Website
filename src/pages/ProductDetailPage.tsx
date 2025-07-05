import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Minus, Plus, Share2, GitCompare as Compare, CheckCircle, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data/products';
import { useApp } from '../context/AppContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const { state, dispatch } = useApp();

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    setProduct(foundProduct || null);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isWishlisted = state.wishlist.includes(product.id);
  const isCompared = state.compareProducts.some(p => p.id === product.id);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product.id });
    }
  };

  const handleToggleCompare = () => {
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
            className={`h-5 w-5 ${
              i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={product.images?.[selectedImage]?.altText || product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              {product.originalPrice && product.price && (
                <span className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium shadow">
                  Save KWD {(product.originalPrice - product.price).toFixed(3)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {product.images?.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-lg overflow-hidden aspect-square group focus:outline-none focus:ring-2 focus:ring-primary ${
                    selectedImage === index ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200 hover:ring-primary'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.altText || `${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                   {selectedImage === index && <div className="absolute inset-0 border-2 border-primary rounded-lg"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.brand || 'N/A'}</p>
              <div className="flex items-center space-x-4 mb-4">
                {renderStars(product.rating || 0)}
                <span className="text-gray-600">({product.reviewCount || 0} reviews)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">KWD {product.price ? product.price.toFixed(3) : 'N/A'}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">KWD {product.originalPrice.toFixed(3)}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {(product.stock !== undefined && product.stock > 0) ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed">{product.description || 'No description available.'}</p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={(product.stock === undefined || product.stock <= 0)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >=1 && val <= (product.stock || Infinity)) setQuantity(val);
                        else if (val < 1) setQuantity(1);
                    }}
                    onBlur={(e) => { // Ensure quantity does not exceed stock on blur
                        const val = parseInt(e.target.value);
                        if (val > (product.stock || Infinity)) setQuantity(product.stock || 1);
                        else if (val < 1) setQuantity(1);
                    }}
                    className="w-16 text-center border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    disabled={(product.stock === undefined || product.stock <= 0)}
                  />
                  <button
                    onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock || Infinity))}
                    disabled={(product.stock === undefined || product.stock <= 0) || quantity >= (product.stock || Infinity) }
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={(product.stock === undefined || product.stock <= 0)}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button
                  onClick={handleToggleCompare}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    isCompared
                      ? 'border-blue-500 text-blue-500 bg-blue-50'
                      : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500'
                  }`}
                >
                  <Compare className="h-5 w-5" />
                </button>
                <button className="p-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-gray-900">Warranty</p>
                  <p className="text-sm text-gray-600">2 year warranty</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-gray-900">Returns</p>
                  <p className="text-sm text-gray-600">30 day returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'description', label: 'Description' },
                { key: 'specifications', label: 'Specifications' },
                { key: 'reviews', label: 'Reviews' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-600 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Write a Review
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {renderStars(product.rating)}
                    <span className="text-2xl font-bold text-gray-900">{product.rating}</span>
                  </div>
                  <span className="text-gray-600">Based on {product.reviewCount} reviews</span>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-2">
                          {renderStars(5)}
                        </div>
                        <span className="font-medium text-gray-900">John Doe</span>
                        <span className="text-gray-500 text-sm">2 days ago</span>
                      </div>
                      <p className="text-gray-600">
                        Excellent product! The quality is outstanding and it works perfectly. 
                        Highly recommended for anyone looking for a reliable device.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;