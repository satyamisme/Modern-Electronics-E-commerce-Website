import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, Phone, MapPin } from 'lucide-react';
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
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>50430606 / 55463597</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Khaitan, Kuwait</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/track-order" className="hover:text-gray-300">Track Order</Link>
              <Link to="/support" className="hover:text-gray-300">Support</Link>
              <Link to="/admin" className="hover:text-gray-300">Admin</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img src={lakkiLogo} alt="LAKKI PHONES" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LAKKI PHONES</h1>
                <p className="text-xs text-gray-600">Premium Electronics Store</p>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for phones, accessories..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary transition-colors"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowWishlist(true)}
                className="relative p-3 text-gray-700 hover:text-primary transition-colors"
              >
                <Heart className="h-6 w-6" />
                {state.wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.wishlist.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setShowCheckout(true)}
                className="relative p-3 text-gray-700 hover:text-primary transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button className="p-3 text-gray-700 hover:text-primary transition-colors">
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between py-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <img src={lakkiLogo} alt="LAKKI PHONES" className="h-8 w-auto" />
              <span className="text-lg font-bold text-gray-900">LAKKI</span>
            </Link>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowCheckout(true)}
                className="relative p-2 text-gray-700"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-primary">
          <div className="container mx-auto px-4">
            <nav className="hidden md:flex items-center space-x-8 py-3">
              <Link to="/products" className="text-white hover:text-gray-200 transition-colors font-medium">
                All Products
              </Link>
              <Link to="/categories/smartphones" className="text-white hover:text-gray-200 transition-colors">
                Smartphones
              </Link>
              <Link to="/categories/accessories" className="text-white hover:text-gray-200 transition-colors">
                Accessories
              </Link>
              <Link to="/categories/tablets" className="text-white hover:text-gray-200 transition-colors">
                Tablets
              </Link>
              <Link to="/categories/laptops" className="text-white hover:text-gray-200 transition-colors">
                Laptops
              </Link>
              <Link to="/deals" className="text-white hover:text-gray-200 transition-colors">
                Special Offers
              </Link>
              <Link to="/support" className="text-white hover:text-gray-200 transition-colors">
                Support
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="py-4 space-y-2">
              <Link
                to="/products"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                to="/categories/smartphones"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Smartphones
              </Link>
              <Link
                to="/categories/accessories"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Accessories
              </Link>
              <Link
                to="/deals"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Special Offers
              </Link>
              <Link
                to="/support"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
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