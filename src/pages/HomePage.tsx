import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, CreditCard, Star, Smartphone, Laptop, Gamepad2 } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import CategoryCard from '../components/ui/CategoryCard';
import { featuredProducts, bestSellers, categories } from '../data/products';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Smartphone className="h-8 w-8" />
                <span className="text-xl font-bold">Lakki Phones</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Premium Electronics in Kuwait
              </h1>
              <p className="text-xl text-gray-100 leading-relaxed">
                Discover the latest smartphones, laptops, gaming consoles, and accessories. 
                Your trusted partner for premium technology with exceptional service and competitive prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/categories"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                >
                  Browse Categories
                </Link>
              </div>
              <div className="flex items-center space-x-6 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">1000+</p>
                  <p className="text-sm text-gray-200">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-gray-200">Products</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm text-gray-200">Support</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Latest Electronics"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-blue-600 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-current text-yellow-500" />
                  <span className="font-semibold">4.9/5 Customer Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-gray-600">Same day delivery across Kuwait</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Authentic Products</h3>
              <p className="text-gray-600">100% genuine products with warranty</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Headphones className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Expert Support</h3>
              <p className="text-gray-600">Professional customer service team</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Flexible Payment</h3>
              <p className="text-gray-600">KNET, Credit Cards & Installments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Explore our wide range of premium electronics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Link to="/categories/smartphones" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Smartphones"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white p-2 rounded-lg">
                    <Smartphone className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Smartphones</h3>
                  <p className="text-gray-600 text-sm mb-3">Latest iPhone, Samsung, and more</p>
                  <span className="text-blue-600 font-medium text-sm group-hover:underline">
                    Explore Smartphones →
                  </span>
                </div>
              </div>
            </Link>

            <Link to="/categories/laptops" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Laptops"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white p-2 rounded-lg">
                    <Laptop className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Laptops</h3>
                  <p className="text-gray-600 text-sm mb-3">MacBook, Dell, HP, and gaming laptops</p>
                  <span className="text-blue-600 font-medium text-sm group-hover:underline">
                    Explore Laptops →
                  </span>
                </div>
              </div>
            </Link>

            <Link to="/categories/gaming" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Gaming"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white p-2 rounded-lg">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Gaming</h3>
                  <p className="text-gray-600 text-sm mb-3">PS5, Xbox, Nintendo, and accessories</p>
                  <span className="text-blue-600 font-medium text-sm group-hover:underline">
                    Explore Gaming →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked premium products with exceptional quality
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best Sellers
            </h2>
            <p className="text-xl text-gray-600">
              Most popular products loved by our customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Follow Us on Social Media
            </h2>
            <p className="text-xl text-gray-600">
              Stay updated with the latest products and offers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a href="https://www.instagram.com/lakkiphones" target="_blank" rel="noopener noreferrer" className="group">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-8 rounded-lg text-center hover:shadow-lg transition-all duration-300">
                <Instagram className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instagram</h3>
                <p className="text-pink-100">Follow for daily updates and product showcases</p>
              </div>
            </a>
            <a href="https://www.facebook.com/lakkiphones" target="_blank" rel="noopener noreferrer" className="group">
              <div className="bg-blue-600 text-white p-8 rounded-lg text-center hover:shadow-lg transition-all duration-300">
                <Facebook className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Facebook</h3>
                <p className="text-blue-100">Join our community for exclusive deals</p>
              </div>
            </a>
            <a href="https://www.tiktok.com/@lakkiphones" target="_blank" rel="noopener noreferrer" className="group">
              <div className="bg-black text-white p-8 rounded-lg text-center hover:shadow-lg transition-all duration-300">
                <svg className="h-12 w-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <h3 className="text-xl font-semibold mb-2">TikTok</h3>
                <p className="text-gray-300">Watch product reviews and unboxings</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Subscribe to our newsletter for the latest deals, product launches, and tech news
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;