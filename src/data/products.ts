import { Product, Category } from '../types';

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
    name: 'Headphones',
    slug: 'headphones',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Premium audio devices for immersive sound',
    children: [],
    productCount: 30
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    slug: 'smart-home',
    image: 'https://images.pexels.com/photos/4498307/pexels-photo-4498307.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Smart devices to automate your home',
    children: [],
    productCount: 22
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
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'smartphones',
    price: 999,
    originalPrice: 1099,
    description: 'The most advanced iPhone ever with titanium design and A17 Pro chip.',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Display': '6.1-inch Super Retina XDR',
      'Processor': 'A17 Pro chip',
      'Storage': '128GB',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      'Battery': 'Up to 23 hours video playback',
      'Operating System': 'iOS 17'
    },
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviewCount: 342,
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
    id: 'samsung-galaxy-s24',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 1199,
    description: 'Ultimate productivity powerhouse with S Pen and AI features.',
    images: [
      'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Storage': '256GB',
      'Camera': '200MP Main + 50MP Periscope + 50MP Ultra Wide + 12MP Front',
      'Battery': '5000mAh with 45W fast charging',
      'Operating System': 'Android 14'
    },
    inStock: true,
    stockCount: 22,
    rating: 4.7,
    reviewCount: 189,
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
    id: 'macbook-pro-m3',
    name: 'MacBook Pro 14-inch M3',
    brand: 'Apple',
    category: 'laptops',
    price: 1599,
    originalPrice: 1699,
    description: 'Supercharged for pros with M3 chip and Liquid Retina XDR display.',
    images: [
      'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Display': '14.2-inch Liquid Retina XDR',
      'Processor': 'Apple M3 chip',
      'Memory': '8GB unified memory',
      'Storage': '512GB SSD',
      'Graphics': '10-core GPU',
      'Battery': 'Up to 22 hours',
      'Operating System': 'macOS Sonoma'
    },
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewCount: 156,
    features: [
      'M3 chip performance',
      'Liquid Retina XDR display',
      'Studio-quality mics',
      '1080p FaceTime HD camera',
      'MagSafe 3 charging',
      'Thunderbolt 4 ports'
    ],
    tags: ['professional', 'creative', 'portable', 'performance'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'dell-xps-13',
    name: 'Dell XPS 13',
    brand: 'Dell',
    category: 'laptops',
    price: 899,
    description: 'Premium ultrabook with stunning InfinityEdge display.',
    images: [
      'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Display': '13.4-inch FHD+ InfinityEdge',
      'Processor': 'Intel Core i7-1355U',
      'Memory': '16GB LPDDR5',
      'Storage': '512GB SSD',
      'Graphics': 'Intel Iris Xe',
      'Battery': 'Up to 12 hours',
      'Operating System': 'Windows 11'
    },
    inStock: true,
    stockCount: 12,
    rating: 4.6,
    reviewCount: 89,
    features: [
      'InfinityEdge display',
      'Premium build quality',
      'Thunderbolt 4',
      'Backlit keyboard',
      'Fingerprint reader',
      'WiFi 6E'
    ],
    tags: ['ultrabook', 'business', 'portable', 'windows'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'ipad-air-m2',
    name: 'iPad Air M2',
    brand: 'Apple',
    category: 'tablets',
    price: 599,
    description: 'Serious performance in a gorgeous, ultra-portable design.',
    images: [
      'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Display': '10.9-inch Liquid Retina',
      'Processor': 'Apple M2 chip',
      'Storage': '64GB',
      'Camera': '12MP Wide + 12MP Ultra Wide Front',
      'Battery': 'Up to 10 hours',
      'Operating System': 'iPadOS 17'
    },
    inStock: true,
    stockCount: 25,
    rating: 4.7,
    reviewCount: 234,
    features: [
      'M2 chip power',
      'Apple Pencil support',
      'Magic Keyboard compatible',
      'Touch ID',
      'USB-C connectivity',
      'Wi-Fi 6'
    ],
    tags: ['creative', 'productivity', 'portable', 'apple'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro (2nd generation)',
    brand: 'Apple',
    category: 'headphones',
    price: 249,
    originalPrice: 279,
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
    stockCount: 45,
    rating: 4.8,
    reviewCount: 567,
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
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'headphones',
    price: 399,
    description: 'Industry-leading noise canceling with premium sound quality.',
    images: [
      'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Driver': '30mm drivers',
      'Frequency Response': '4Hz-40kHz',
      'Impedance': '48 ohms',
      'Battery': 'Up to 30 hours',
      'Charging': 'USB-C quick charge',
      'Weight': '250g'
    },
    inStock: true,
    stockCount: 18,
    rating: 4.7,
    reviewCount: 423,
    features: [
      'Industry-leading noise canceling',
      '30-hour battery life',
      'Quick charge (3min = 3hrs)',
      'Speak-to-chat technology',
      'Multipoint connection',
      'Touch sensor controls'
    ],
    tags: ['over-ear', 'noise-cancelling', 'premium', 'sony'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 'echo-dot-5',
    name: 'Amazon Echo Dot (5th Gen)',
    brand: 'Amazon',
    category: 'smart-home',
    price: 49,
    originalPrice: 59,
    description: 'Smart speaker with Alexa - better sound and performance.',
    images: [
      'https://images.pexels.com/photos/4498307/pexels-photo-4498307.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4498307/pexels-photo-4498307.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4498307/pexels-photo-4498307.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      'Speaker': '1.73" front-firing speaker',
      'Microphone': 'Far-field voice recognition',
      'Connectivity': 'Wi-Fi, Bluetooth',
      'Dimensions': '3.9" x 3.9" x 3.5"',
      'Weight': '10.7 oz',
      'Voice Assistant': 'Alexa built-in'
    },
    inStock: true,
    stockCount: 67,
    rating: 4.5,
    reviewCount: 1234,
    features: [
      'Alexa built-in',
      'Improved sound quality',
      'Smart home control',
      'Voice control',
      'Compact design',
      'Multiple colors'
    ],
    tags: ['smart-speaker', 'voice-control', 'alexa', 'affordable'],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16')
  }
];

export const featuredProducts = products.slice(0, 4);
export const bestSellers = products.slice(2, 6);
export const newArrivals = products.slice(0, 3);