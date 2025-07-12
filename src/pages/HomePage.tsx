import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, Star, Phone, Zap, Award, CheckCircle, Clock, MapPin } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import CategoryCard from '../components/ui/CategoryCard';
// import { categories as mockCategories } from '../data/products'; // Remove direct import
import OptimizedImage from '../components/ui/OptimizedImage';
import { useApp } from '../context/AppContext';
import { ProductService } from '../services/productService';
import { Product, Category } from '../types';

const HomePage: React.FC = () => {
  const { state: appState } = useApp(); // Use appState.categories
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  // Categories will now come from appState.categories, fetched in AppContext

  useEffect(() => {
    const loadHomePageProducts = async () => {
      try {
        // Featured Products and Best Sellers are still fetched here as they are specific to this page
        const featuredData = await ProductService.getFeaturedProducts(4);
        const bestSellersData = await ProductService.getBestSellers(4);
        
        setFeaturedProducts(featuredData);
        setBestSellers(bestSellersData);
      } catch (error) {
        console.error('Error loading homepage products:', error);
      }
    };
    
    loadHomePageProducts();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - A1Store + Mobile2000 Style */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm">
                <Star className="h-4 w-4" />
                <span>#1 Mobile Store in Kuwait</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black leading-tight">
                  Latest
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    Mobile
                  </span>
                  <span className="block">Technology</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                  Discover premium smartphones, accessories, and electronics with unbeatable prices and exceptional service in Kuwait.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center justify-center group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/categories"
                  className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-all inline-flex items-center justify-center backdrop-blur-sm"
                >
                  Browse Categories
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold">4.9</span>
                  </div>
                  <span className="text-sm text-blue-200">Customer Rating</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span className="text-2xl font-bold">100%</span>
                  </div>
                  <span className="text-sm text-blue-200">Secure Payment</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Truck className="h-5 w-5 text-blue-300" />
                    <span className="text-2xl font-bold">2-4h</span>
                  </div>
                  <span className="text-sm text-blue-200">Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Content - Product Showcase */}
            <div className="relative">
              {/* Main Product Image */}
              <div className="relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <OptimizedImage
                  src="https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg"
                  alt="Latest iPhone"
                  width={600}
                  height={500}
                  className="w-full h-96 rounded-3xl shadow-2xl border-4 border-white/20"
                />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white text-gray-900 p-4 rounded-2xl shadow-xl z-20 animate-float">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-xl">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Latest Models</p>
                    <p className="text-xs text-gray-600">iPhone 15 Pro Max</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 p-4 rounded-2xl shadow-xl z-20 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6" />
                  <div>
                    <p className="font-bold text-sm">Best Price</p>
                    <p className="text-xs">Guaranteed in Kuwait</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-8 bg-green-500 text-white p-3 rounded-2xl shadow-xl z-20 animate-float" style={{ animationDelay: '2s' }}>
                <div className="text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-1" />
                  <p className="text-xs font-bold">Warranty</p>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-3xl blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-gray-50">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section - A1Store Style */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LAKKI PHONES?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the best mobile shopping in Kuwait with our premium services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Free Delivery",
                description: "Free shipping on orders over KD 15.000",
                color: "blue",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: Shield,
                title: "Secure Payment",
                description: "KNET & Credit Card accepted",
                color: "green",
                gradient: "from-green-500 to-green-600"
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Round-the-clock customer service",
                color: "purple",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: Zap,
                title: "Fast Service",
                description: "Quick processing & delivery",
                color: "yellow",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group text-center hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className={`bg-gradient-to-br ${feature.gradient} text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of premium electronics and mobile accessories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appState.categories.slice(0, 6).map((category: Category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Handpicked products with exceptional quality and value</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg transform hover:scale-105 inline-flex items-center"
            >
              View All Products
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers - Dark Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Best Sellers</h2>
            <p className="text-xl text-gray-300">Most popular products loved by our customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-5xl font-black text-gray-900 mb-4">Special Offers</h2>
            <p className="text-xl text-gray-800 mb-8 font-medium">
              Don't miss out on our amazing deals and exclusive discounts
            </p>
            <Link
              to="/deals"
              className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-800 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center"
            >
              View All Deals
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Store Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Visit Our Store</h2>
              <p className="text-xl text-gray-600 mb-8">
                Experience our products in person at our premium showroom in Khaitan, Kuwait.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">Muscat street, opp gulf bank, Khaitan, Kuwait</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Store Hours</h3>
                    <p className="text-gray-600">Sunday - Thursday: 9 AM - 10 PM</p>
                    <p className="text-gray-600">Friday: 2 PM - 10 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Contact</h3>
                    <p className="text-gray-600">50430606 / 55463597</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <OptimizedImage
                src="https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg"
                alt="LAKKI PHONES Store"
                width={600}
                height={400}
                className="w-full h-96 rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">LAKKI PHONES</h3>
                <p className="text-lg">Premium Mobile Store</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-10">
              Subscribe to our newsletter for the latest deals, product launches, and tech news
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:from-yellow-300 hover:to-orange-300 transition-all shadow-lg"
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