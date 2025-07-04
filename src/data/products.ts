import { Product, Category } from '../types';
import { convertUSDToKWD } from '../utils/currency';

export const categories: Category[] = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    slug: 'smartphones',
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Latest smartphones with cutting-edge technology',
    children: [],
    productCount: 25
  },
  {
    id: 'laptops',
    name: 'Laptops',
    slug: 'laptops',
    image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'High-performance laptops for work and gaming',
    children: [],
    productCount: 18
  },
  {
    id: 'tablets',
    name: 'Tablets',
    slug: 'tablets',
    image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Portable tablets for entertainment and productivity',
    children: [],
    productCount: 12
  },
  {
    id: 'headphones',
    name: 'Audio & Headphones',
    slug: 'headphones',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Premium audio devices for immersive sound',
    children: [],
    productCount: 30
  },
  {
    id: 'gaming',
    name: 'Gaming',
    slug: 'gaming',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Gaming consoles, accessories, and peripherals',
    children: [],
    productCount: 15
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Essential accessories for your devices',
    children: [],
    productCount: 45
  }
];

export const products: Product[] = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'smartphones',
    price: convertUSDToKWD(1199), // ~368 KWD
    originalPrice: convertUSDToKWD(1299), // ~399 KWD
    description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Display': '6.7-inch Super Retina XDR',
      'Processor': 'A17 Pro chip',
      'Storage': '256GB',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      'Battery': 'Up to 29 hours video playback',
      'Operating System': 'iOS 17'
    },
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 456,
    features: [
      'Titanium design',
      'A17 Pro chip',
      'Pro camera system',
      '5G connectivity',
      'Face ID',
      'Wireless charging'
    ],
    tags: ['premium', 'flagship', 'camera', '5g'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: convertUSDToKWD(1299), // ~399 KWD
    description: 'Ultimate productivity powerhouse with S Pen and AI features.',
    images: [
      'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Storage': '512GB',
      'Camera': '200MP Main + 50MP Periscope + 50MP Ultra Wide + 12MP Front',
      'Battery': '5000mAh with 45W fast charging',
      'Operating System': 'Android 14'
    },
    inStock: true,
    stockCount: 18,
    rating: 4.8,
    reviewCount: 289,
    features: [
      'S Pen included',
      'AI photography',
      '100x Space Zoom',
      'Titanium frame',
      'IP68 water resistance',
      'Wireless charging'
    ],
    tags: ['android', 'stylus', 'camera', 'productivity'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'macbook-pro-m3-max',
    name: 'MacBook Pro 16-inch M3 Max',
    brand: 'Apple',
    category: 'laptops',
    price: convertUSDToKWD(2499), // ~767 KWD
    originalPrice: convertUSDToKWD(2699), // ~828 KWD
    description: 'The most powerful MacBook Pro ever with M3 Max chip for extreme performance.',
    images: [
      'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Display': '16.2-inch Liquid Retina XDR',
      'Processor': 'Apple M3 Max chip',
      'Memory': '36GB unified memory',
      'Storage': '1TB SSD',
      'Graphics': '40-core GPU',
      'Battery': 'Up to 22 hours',
      'Operating System': 'macOS Sonoma'
    },
    inStock: true,
    stockCount: 5,
    rating: 4.9,
    reviewCount: 178,
    features: [
      'M3 Max chip performance',
      'Liquid Retina XDR display',
      'Studio-quality mics',
      '1080p FaceTime HD camera',
      'MagSafe 3 charging',
      'Thunderbolt 4 ports'
    ],
    tags: ['professional', 'creative', 'performance', 'video-editing'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'ps5-console',
    name: 'PlayStation 5 Console',
    brand: 'Sony',
    category: 'gaming',
    price: convertUSDToKWD(499), // ~153 KWD
    description: 'Next-generation gaming console with ultra-high speed SSD and ray tracing.',
    images: [
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'CPU': 'AMD Zen 2, 8 Cores',
      'GPU': 'AMD RDNA 2',
      'Memory': '16GB GDDR6',
      'Storage': '825GB SSD',
      'Optical Drive': '4K UHD Blu-ray',
      'Audio': 'Tempest 3D AudioTech'
    },
    inStock: true,
    stockCount: 8,
    rating: 4.7,
    reviewCount: 892,
    features: [
      'Ultra-high speed SSD',
      'Ray tracing',
      '4K gaming',
      'DualSense controller',
      '3D audio',
      'Backward compatibility'
    ],
    tags: ['gaming', 'console', '4k', 'next-gen'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro (2nd generation)',
    brand: 'Apple',
    category: 'headphones',
    price: convertUSDToKWD(249), // ~76 KWD
    originalPrice: convertUSDToKWD(279), // ~86 KWD
    description: 'Next-level sound with Adaptive Transparency and Personalized Spatial Audio.',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Driver': 'Custom high-excursion Apple driver',
      'Microphone': 'Dual beamforming microphones',
      'Chip': 'Apple H2 chip',
      'Battery': 'Up to 6 hours listening time',
      'Case Battery': 'Up to 30 hours total',
      'Connectivity': 'Bluetooth 5.3'
    },
    inStock: true,
    stockCount: 35,
    rating: 4.8,
    reviewCount: 1247,
    features: [
      'Active Noise Cancellation',
      'Adaptive Transparency',
      'Personalized Spatial Audio',
      'MagSafe charging case',
      'Sweat and water resistant',
      'Touch control'
    ],
    tags: ['wireless', 'noise-cancelling', 'premium', 'apple'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'ipad-pro-m4',
    name: 'iPad Pro 12.9-inch M4',
    brand: 'Apple',
    category: 'tablets',
    price: convertUSDToKWD(1099), // ~337 KWD
    description: 'The most advanced iPad Pro with M4 chip and stunning Liquid Retina XDR display.',
    images: [
      'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Display': '12.9-inch Liquid Retina XDR',
      'Processor': 'Apple M4 chip',
      'Storage': '256GB',
      'Camera': '12MP Wide + 10MP Ultra Wide + LiDAR',
      'Battery': 'Up to 10 hours',
      'Operating System': 'iPadOS 17'
    },
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewCount: 334,
    features: [
      'M4 chip power',
      'Liquid Retina XDR display',
      'Apple Pencil Pro support',
      'Magic Keyboard compatible',
      'Face ID',
      'Thunderbolt connectivity'
    ],
    tags: ['professional', 'creative', 'tablet', 'apple'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19')
  }
];

export const featuredProducts = products.slice(0, 4);
export const bestSellers = products.slice(1, 5);
export const newArrivals = products.slice(0, 3);