import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Clock, Star, Shield, Truck } from 'lucide-react';
import lakkiLogo from '/src/assets/logo.webp';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Trust Badges */}
      <div className="border-b border-white/10 py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-yellow-400 p-3 rounded-xl">
                <Star className="h-6 w-6 text-gray-900" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">4.9/5 Rating</p>
                <p className="text-gray-300 text-sm">1000+ Happy Customers</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-green-400 p-3 rounded-xl">
                <Shield className="h-6 w-6 text-gray-900" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Secure Payment</p>
                <p className="text-gray-300 text-sm">KNET & Credit Cards</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-blue-400 p-3 rounded-xl">
                <Truck className="h-6 w-6 text-gray-900" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Fast Delivery</p>
                <p className="text-gray-300 text-sm">2-4 Hours in Kuwait</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img src={lakkiLogo} alt="LAKKI PHONES Logo" className="h-14 w-auto rounded-xl shadow-lg" />
              <div>
                <span className="text-2xl font-black">LAKKI PHONES</span>
                <p className="text-sm text-gray-300">Premium Electronics</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for the latest mobile technology and electronics. 
              We deliver quality products with exceptional customer service across Kuwait.
            </p>
            
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: "#", color: "hover:bg-blue-600" },
                { icon: Twitter, href: "#", color: "hover:bg-sky-500" },
                { icon: Instagram, href: "#", color: "hover:bg-pink-600" },
                { icon: Youtube, href: "#", color: "hover:bg-red-600" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className={`p-3 bg-white/10 rounded-xl text-white transition-all transform hover:scale-110 ${social.color}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'All Products', path: '/products' },
                { name: 'Smartphones', path: '/categories/smartphones' },
                { name: 'Accessories', path: '/categories/accessories' },
                { name: 'Special Offers', path: '/deals' },
                { name: 'About Us', path: '/about' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-white transition-colors text-sm flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-yellow-400 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Customer Service</h3>
            <ul className="space-y-3">
              {[
                { name: 'Help Center', path: '/support' },
                { name: 'Track Your Order', path: '/track-order' },
                { name: 'Returns & Exchanges', path: '/returns' },
                { name: 'Warranty Information', path: '/warranty' },
                { name: 'Shipping Information', path: '/shipping' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-white transition-colors text-sm flex items-center group"
                  >
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-yellow-400 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="bg-blue-500 p-2 rounded-lg group-hover:bg-blue-400 transition-colors">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">50430606 / 55463597</p>
                  <p className="text-gray-400 text-xs">محل تلفون لكي,خيطان مجمع فهد الدبوس</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="bg-green-500 p-2 rounded-lg group-hover:bg-green-400 transition-colors">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 text-sm">support@lakkiphones.com</span>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="bg-purple-500 p-2 rounded-lg group-hover:bg-purple-400 transition-colors">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Muscat street, opp gulf bank</p>
                  <p className="text-gray-300 text-sm">Khaitan, Al 'Āşimah, Kuwait 83000</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="bg-orange-500 p-2 rounded-lg group-hover:bg-orange-400 transition-colors">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Store Hours</p>
                  <p className="text-gray-400 text-xs">Sunday - Thursday: 9 AM - 10 PM</p>
                  <p className="text-gray-400 text-xs">Friday: 2 PM - 10 PM</p>
                  <p className="text-gray-400 text-xs">Saturday: 9 AM - 10 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 LAKKI PHONES. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Premium Electronics Store in Kuwait | Powered by Innovation
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Cookie Policy', path: '/cookies' }
              ].map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;