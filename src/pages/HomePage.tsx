import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, CreditCard, Star, Smartphone, Phone, MapPin } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { featuredProducts, bestSellers } from '../data/products';

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
                <span className="text-xl font-bold">LAKKI PHONES</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Mobile Phone Shop in Kuwait
              </h1>
              <p className="text-xl text-gray-100 leading-relaxed">
                Discover the latest mobile phones and accessories at LAKKI PHONES. 
                Located in Khaitan, we offer special deals and exceptional service for all your mobile needs.
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
                  to="/offers"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                >
                  Special Offers
                </Link>
              </div>
              <div className="flex items-center space-x-6 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">220</p>
                  <p className="text-sm text-gray-200">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">66</p>
                  <p className="text-sm text-gray-200">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-sm text-gray-200">Following</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Latest Mobile Phones"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-blue-600 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-current text-yellow-500" />
                  <span className="font-semibold">Trusted Mobile Shop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Location */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Visit Our Store
              </h2>
              <p className="text-xl text-gray-600">
                Located in the heart of Khaitan, Kuwait
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">Fahad Al-Dabous Complex</p>
                      <p className="text-gray-600">Muscat Street, opposite Gulf Bank</p>
                      <p className="text-gray-600">Khaitan, Al 'Āşimah, Kuwait 83000</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Contact</h3>
                      <p className="text-gray-600">+965 5043 0606</p>
                      <p className="text-gray-600">+965 5546 3597</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <a 
                      href="https://www.lakkiphones.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Visit our website
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Mobile Phone Store"
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Latest Mobile Phones</h3>
              <p className="text-gray-600">Latest smartphones from top brands</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Phone Accessories</h3>
              <p className="text-gray-600">Complete range of mobile accessories</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Special Offers</h3>
              <p className="text-gray-600">Amazing deals and discounts available</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Headphones className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Expert Support</h3>
              <p className="text-gray-600">Professional customer service team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Products
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for your mobile phone
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Link to="/categories/smartphones" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Mobile Phones"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white p-2 rounded-lg">
                    <Smartphone className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Phones</h3>
                  <p className="text-gray-600 text-sm mb-3">Latest smartphones from all major brands</p>
                  <span className="text-blue-600 font-medium text-sm group-hover:underline">
                    Explore Mobile Phones →
                  </span>
                </div>
              </div>
            </Link>

            <Link to="/categories/accessories" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Phone Accessories"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white p-2 rounded-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Accessories</h3>
                  <p className="text-gray-600 text-sm mb-3">Cases, chargers, headphones, and more</p>
                  <span className="text-blue-600 font-medium text-sm group-hover:underline">
                    Explore Accessories →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked products with exceptional quality
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
                <svg className="h-12 w-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <h3 className="text-xl font-semibold mb-2">Instagram</h3>
                <p className="text-pink-100">Follow for daily updates and product showcases</p>
              </div>
            </a>
            <a href="https://www.facebook.com/lakkiphones" target="_blank" rel="noopener noreferrer" className="group">
              <div className="bg-blue-600 text-white p-8 rounded-lg text-center hover:shadow-lg transition-all duration-300">
                <svg className="h-12 w-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
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
              Subscribe to our newsletter for the latest deals, product launches, and special offers
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