import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, Phone, MapPin, Clock, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import lakkiLogo from '/src/assets/logo.webp';
import CompareModal from '../ui/CompareModal';
import WishlistModal from '../ui/WishlistModal';
import CheckoutModal from '../ui/CheckoutModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Top Info Bar - A1Store Style */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-2 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>50430606 / 55463597</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>support@lakkiphones.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Sun-Thu: 9AM-10PM</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <Link to="/track-order" className="hover:text-yellow-300 transition-colors">Track Order</Link>
              <Link to="/support" className="hover:text-yellow-300 transition-colors">Help</Link>
              <Link to="/admin" className="hover:text-yellow-300 transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Mobile2000 Style */}
      <header className="bg-white shadow-xl sticky top-0 z-50 border-b-4 border-blue-600">
        <div className="container mx-auto px-4">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between py-4">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <img src={lakkiLogo} alt="LAKKI PHONES" className="h-14 w-auto transition-transform group-hover:scale-105" />
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">NEW</div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">LAKKI PHONES</h1>
                <p className="text-xs text-blue-600 font-medium">Premium Mobile Store Kuwait</p>
              </div>
            </Link>

            {/* Search Bar - A1Store Style */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for iPhone, Samsung, accessories..."
                  className="w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all group-hover:border-blue-300"
                />
                <Search className="absolute left-5 top-4.5 h-6 w-6 text-gray-400 group-focus-within:text-blue-500" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowWishlist(true)}
                className="relative p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
              >
                <Heart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {state.wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {state.wishlist.length}
                  </span>
                )}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Wishlist
                </span>
              </button>

              <button 
                onClick={() => setShowCheckout(true)}
                className="relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
              >
                <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {cartItemCount}
                  </span>
                )}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Cart
                </span>
              </button>

              <button className="relative p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all group">
                <User className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Account
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between py-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <img src={lakkiLogo} alt="LAKKI PHONES" className="h-10 w-auto" />
              <div>
                <span className="text-lg font-bold text-gray-900">LAKKI</span>
                <span className="block text-xs text-blue-600">PHONES</span>
              </div>
            </Link>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowCheckout(true)}
                className="relative p-2 text-gray-700"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>
        </div>

        {/* Navigation Menu - Mobile2000 Style */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg">
          <div className="container mx-auto px-4">
            <nav className="hidden lg:flex items-center justify-center space-x-8 py-4">
              {[
                { name: 'All Products', path: '/products', icon: '📱' },
                { name: 'iPhone', path: '/categories/smartphones', icon: '🍎' },
                { name: 'Samsung', path: '/categories/smartphones', icon: '📲' },
                { name: 'Accessories', path: '/categories/accessories', icon: '🎧' },
                { name: 'Tablets', path: '/categories/tablets', icon: '📱' },
                { name: 'Laptops', path: '/categories/laptops', icon: '💻' },
                { name: 'Phone Models', path: '/models', icon: '📱' },
                { name: 'Special Offers', path: '/deals', icon: '🔥' },
                { name: 'Support', path: '/support', icon: '💬' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-all font-medium px-4 py-2 rounded-lg hover:bg-white/10 group"
                >
                  <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t-2 border-blue-100 shadow-xl">
            <nav className="py-4 space-y-1">
              {[
                { name: 'All Products', path: '/products' },
                { name: 'Smartphones', path: '/categories/smartphones' },
                { name: 'Accessories', path: '/categories/accessories' },
                { name: 'Tablets', path: '/categories/tablets' },
                { name: 'Laptops', path: '/categories/laptops' },
                { name: 'Phone Models', path: '/models' },
                { name: 'Special Offers', path: '/deals' },
                { name: 'Support', path: '/support' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium border-l-4 border-transparent hover:border-blue-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Modals */}
      <CompareModal isOpen={showCompare} onClose={() => setShowCompare(false)} />
      <WishlistModal isOpen={showWishlist} onClose={() => setShowWishlist(false)} />
      <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
    </>
  );
};

export default Header;