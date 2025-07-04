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
      { id: 'iphone15pro_img1', url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'iPhone 15 Pro front view', isMain: true },
      { id: 'iphone15pro_img2', url: 'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'iPhone 15 Pro side view' },
      { id: 'iphone15pro_img3', url: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'iPhone 15 Pro back view' }
    ],
    specifications: [
      { id: 'spec_disp_iphone15', name: 'Display', value: '6.1-inch Super Retina XDR' },
      { id: 'spec_proc_iphone15', name: 'Processor', value: 'A17 Pro chip' },
      { id: 'spec_stor_iphone15', name: 'Storage', value: '128GB' },
      { id: 'spec_cam_iphone15', name: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto' },
      { id: 'spec_batt_iphone15', name: 'Battery', value: 'Up to 23 hours video playback' },
      { id: 'spec_os_iphone15', name: 'Operating System', value: 'iOS 17' }
    ],
    stock: 15,
    rating: 4.8,
    reviewCount: 342,
    features: [
      { id: 'feat_design_iphone15', text: 'Titanium design' },
      { id: 'feat_chip_iphone15', text: 'A17 Pro chip' },
      { id: 'feat_cam_iphone15', text: 'Pro camera system' },
      { id: 'feat_5g_iphone15', text: '5G connectivity' },
      { id: 'feat_faceid_iphone15', text: 'Face ID' },
      { id: 'feat_charge_iphone15', text: 'Wireless charging' }
    ],
    tags: [
      { id: 'tag_premium_iphone15', name: 'premium' },
      { id: 'tag_flagship_iphone15', name: 'flagship' },
      { id: 'tag_camera_iphone15', name: 'camera' },
      { id: 'tag_5g_iphone15', name: '5g' }
    ],
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
      { id: 's24_img1', url: 'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Samsung Galaxy S24 Ultra front', isMain: true },
      { id: 's24_img2', url: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Samsung Galaxy S24 Ultra with S Pen' },
      { id: 's24_img3', url: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Samsung Galaxy S24 Ultra camera detail' }
    ],
    specifications: [
      { id: 'spec_disp_s24', name: 'Display', value: '6.8-inch Dynamic AMOLED 2X' },
      { id: 'spec_proc_s24', name: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { id: 'spec_stor_s24', name: 'Storage', value: '256GB' },
      { id: 'spec_cam_s24', name: 'Camera', value: '200MP Main + 50MP Periscope + 50MP Ultra Wide + 12MP Front' },
      { id: 'spec_batt_s24', name: 'Battery', value: '5000mAh with 45W fast charging' },
      { id: 'spec_os_s24', name: 'Operating System', value: 'Android 14' }
    ],
    stock: 22,
    rating: 4.7,
    reviewCount: 189,
    features: [
      { id: 'feat_spen_s24', text: 'S Pen included' },
      { id: 'feat_ai_s24', text: 'AI photography' },
      { id: 'feat_zoom_s24', text: '100x Space Zoom' },
      { id: 'feat_frame_s24', text: 'Titanium frame' },
      { id: 'feat_ip68_s24', text: 'IP68 water resistance' },
      { id: 'feat_charge_s24', text: 'Wireless charging' }
    ],
    tags: [
      { id: 'tag_android_s24', name: 'android' },
      { id: 'tag_stylus_s24', name: 'stylus' },
      { id: 'tag_camera_s24', name: 'camera' },
      { id: 'tag_prod_s24', name: 'productivity' }
    ],
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
      { id: 'mbpm3_img1', url: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'MacBook Pro 14-inch M3 front', isMain: true },
      { id: 'mbpm3_img2', url: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'MacBook Pro 14-inch M3 keyboard' },
      { id: 'mbpm3_img3', url: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'MacBook Pro 14-inch M3 side' }
    ],
    specifications: [
      { id: 'spec_disp_mbpm3', name: 'Display', value: '14.2-inch Liquid Retina XDR' },
      { id: 'spec_proc_mbpm3', name: 'Processor', value: 'Apple M3 chip' },
      { id: 'spec_mem_mbpm3', name: 'Memory', value: '8GB unified memory' },
      { id: 'spec_stor_mbpm3', name: 'Storage', value: '512GB SSD' },
      { id: 'spec_gpu_mbpm3', name: 'Graphics', value: '10-core GPU' },
      { id: 'spec_batt_mbpm3', name: 'Battery', value: 'Up to 22 hours' },
      { id: 'spec_os_mbpm3', name: 'Operating System', value: 'macOS Sonoma' }
    ],
    stock: 8,
    rating: 4.9,
    reviewCount: 156,
    features: [
      { id: 'feat_m3_mbpm3', text: 'M3 chip performance' },
      { id: 'feat_display_mbpm3', text: 'Liquid Retina XDR display' },
      { id: 'feat_mics_mbpm3', text: 'Studio-quality mics' },
      { id: 'feat_cam_mbpm3', text: '1080p FaceTime HD camera' },
      { id: 'feat_magsafe_mbpm3', text: 'MagSafe 3 charging' },
      { id: 'feat_ports_mbpm3', text: 'Thunderbolt 4 ports' }
    ],
    tags: [
      { id: 'tag_prof_mbpm3', name: 'professional' },
      { id: 'tag_creative_mbpm3', name: 'creative' },
      { id: 'tag_portable_mbpm3', name: 'portable' },
      { id: 'tag_perf_mbpm3', name: 'performance' }
    ],
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
      { id: 'xps13_img1', url: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Dell XPS 13 front', isMain: true },
      { id: 'xps13_img2', url: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Dell XPS 13 open' },
      { id: 'xps13_img3', url: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Dell XPS 13 side' }
    ],
    specifications: [
      { id: 'spec_disp_xps13', name: 'Display', value: '13.4-inch FHD+ InfinityEdge' },
      { id: 'spec_proc_xps13', name: 'Processor', value: 'Intel Core i7-1355U' },
      { id: 'spec_mem_xps13', name: 'Memory', value: '16GB LPDDR5' },
      { id: 'spec_stor_xps13', name: 'Storage', value: '512GB SSD' },
      { id: 'spec_gpu_xps13', name: 'Graphics', value: 'Intel Iris Xe' },
      { id: 'spec_batt_xps13', name: 'Battery', value: 'Up to 12 hours' },
      { id: 'spec_os_xps13', name: 'Operating System', value: 'Windows 11' }
    ],
    stock: 12,
    rating: 4.6,
    reviewCount: 89,
    features: [
      { id: 'feat_disp_xps13', text: 'InfinityEdge display' },
      { id: 'feat_build_xps13', text: 'Premium build quality' },
      { id: 'feat_ports_xps13', text: 'Thunderbolt 4' },
      { id: 'feat_key_xps13', text: 'Backlit keyboard' },
      { id: 'feat_sec_xps13', text: 'Fingerprint reader' },
      { id: 'feat_wifi_xps13', text: 'WiFi 6E' }
    ],
    tags: [
      { id: 'tag_ultra_xps13', name: 'ultrabook' },
      { id: 'tag_biz_xps13', name: 'business' },
      { id: 'tag_port_xps13', name: 'portable' },
      { id: 'tag_win_xps13', name: 'windows' }
    ],
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
      { id: 'ipadm2_img1', url: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'iPad Air M2 front', isMain: true },
      { id: 'ipadm2_img2', url: 'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'iPad Air M2 with Apple Pencil' },
      { id: 'ipadm2_img3', url: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'iPad Air M2 display' }
    ],
    specifications: [
      { id: 'spec_disp_ipadm2', name: 'Display', value: '10.9-inch Liquid Retina' },
      { id: 'spec_proc_ipadm2', name: 'Processor', value: 'Apple M2 chip' },
      { id: 'spec_stor_ipadm2', name: 'Storage', value: '64GB' },
      { id: 'spec_cam_ipadm2', name: 'Camera', value: '12MP Wide + 12MP Ultra Wide Front' },
      { id: 'spec_batt_ipadm2', name: 'Battery', value: 'Up to 10 hours' },
      { id: 'spec_os_ipadm2', name: 'Operating System', value: 'iPadOS 17' }
    ],
    stock: 25,
    rating: 4.7,
    reviewCount: 234,
    features: [
      { id: 'feat_m2_ipadm2', text: 'M2 chip power' },
      { id: 'feat_pencil_ipadm2', text: 'Apple Pencil support' },
      { id: 'feat_key_ipadm2', text: 'Magic Keyboard compatible' },
      { id: 'feat_touchid_ipadm2', text: 'Touch ID' },
      { id: 'feat_usbc_ipadm2', text: 'USB-C connectivity' },
      { id: 'feat_wifi_ipadm2', text: 'Wi-Fi 6' }
    ],
    tags: [
      { id: 'tag_creative_ipadm2', name: 'creative' },
      { id: 'tag_prod_ipadm2', name: 'productivity' },
      { id: 'tag_port_ipadm2', name: 'portable' },
      { id: 'tag_apple_ipadm2', name: 'apple' }
    ],
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
      { id: 'app2_img1', url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'AirPods Pro 2nd gen case', isMain: true },
      { id: 'app2_img2', url: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'AirPods Pro 2nd gen earbuds' },
      { id: 'app2_img3', url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'AirPods Pro 2nd gen lifestyle' }
    ],
    specifications: [
      { id: 'spec_driver_app2', name: 'Driver', value: 'Custom high-excursion Apple driver' },
      { id: 'spec_mic_app2', name: 'Microphone', value: 'Dual beamforming microphones' },
      { id: 'spec_chip_app2', name: 'Chip', value: 'Apple H2 chip' },
      { id: 'spec_batt_app2', name: 'Battery', value: 'Up to 6 hours listening time' },
      { id: 'spec_casebatt_app2', name: 'Case Battery', value: 'Up to 30 hours total' },
      { id: 'spec_conn_app2', name: 'Connectivity', value: 'Bluetooth 5.3' }
    ],
    stock: 45,
    rating: 4.8,
    reviewCount: 567,
    features: [
      { id: 'feat_anc_app2', text: 'Active Noise Cancellation' },
      { id: 'feat_trans_app2', text: 'Adaptive Transparency' },
      { id: 'feat_spatial_app2', text: 'Personalized Spatial Audio' },
      { id: 'feat_magsafe_app2', text: 'MagSafe charging case' },
      { id: 'feat_resist_app2', text: 'Sweat and water resistant' },
      { id: 'feat_touch_app2', text: 'Touch control' }
    ],
    tags: [
      { id: 'tag_wireless_app2', name: 'wireless' },
      { id: 'tag_anc_app2', name: 'noise-cancelling' },
      { id: 'tag_premium_app2', name: 'premium' },
      { id: 'tag_apple_app2', name: 'apple' }
    ],
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
      { id: 'whxm5_img1', url: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Sony WH-1000XM5 side view', isMain: true },
      { id: 'whxm5_img2', url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Sony WH-1000XM5 front view' },
      { id: 'whxm5_img3', url: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Sony WH-1000XM5 earcup detail' }
    ],
    specifications: [
      { id: 'spec_driver_whxm5', name: 'Driver', value: '30mm drivers' },
      { id: 'spec_freq_whxm5', name: 'Frequency Response', value: '4Hz-40kHz' },
      { id: 'spec_imp_whxm5', name: 'Impedance', value: '48 ohms' },
      { id: 'spec_batt_whxm5', name: 'Battery', value: 'Up to 30 hours' },
      { id: 'spec_charge_whxm5', name: 'Charging', value: 'USB-C quick charge' },
      { id: 'spec_weight_whxm5', name: 'Weight', value: '250g' }
    ],
    stock: 18,
    rating: 4.7,
    reviewCount: 423,
    features: [
      { id: 'feat_anc_whxm5', text: 'Industry-leading noise canceling' },
      { id: 'feat_batt_whxm5', text: '30-hour battery life' },
      { id: 'feat_charge_whxm5', text: 'Quick charge (3min = 3hrs)' },
      { id: 'feat_speak_whxm5', text: 'Speak-to-chat technology' },
      { id: 'feat_multi_whxm5', text: 'Multipoint connection' },
      { id: 'feat_touch_whxm5', text: 'Touch sensor controls' }
    ],
    tags: [
      { id: 'tag_overear_whxm5', name: 'over-ear' },
      { id: 'tag_anc_whxm5', name: 'noise-cancelling' },
      { id: 'tag_premium_whxm5', name: 'premium' },
      { id: 'tag_sony_whxm5', name: 'sony' }
    ],
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
      { id: 'echo5_img1', url: 'https://images.pexels.com/photos/4498307/pexels-photo-4498307.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Amazon Echo Dot 5th Gen front', isMain: true },
      { id: 'echo5_img2', url: 'https://images.pexels.com/photos/4498307/pexels-photo-4498307.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Amazon Echo Dot 5th Gen top' },
      { id: 'echo5_img3', url: 'https://images.pexels.com/photos/4498307/pexels-photo-4498307.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Amazon Echo Dot 5th Gen in a room' }
    ],
    specifications: [
      { id: 'spec_speak_echo5', name: 'Speaker', value: '1.73" front-firing speaker' },
      { id: 'spec_mic_echo5', name: 'Microphone', value: 'Far-field voice recognition' },
      { id: 'spec_conn_echo5', name: 'Connectivity', value: 'Wi-Fi, Bluetooth' },
      { id: 'spec_dim_echo5', name: 'Dimensions', value: '3.9" x 3.9" x 3.5"' },
      { id: 'spec_weight_echo5', name: 'Weight', value: '10.7 oz' },
      { id: 'spec_va_echo5', name: 'Voice Assistant', value: 'Alexa built-in' }
    ],
    stock: 67,
    rating: 4.5,
    reviewCount: 1234,
    features: [
      { id: 'feat_alexa_echo5', text: 'Alexa built-in' },
      { id: 'feat_sound_echo5', text: 'Improved sound quality' },
      { id: 'feat_smarthome_echo5', text: 'Smart home control' },
      { id: 'feat_voice_echo5', text: 'Voice control' },
      { id: 'feat_design_echo5', text: 'Compact design' },
      { id: 'feat_color_echo5', text: 'Multiple colors' }
    ],
    tags: [
      { id: 'tag_smartspk_echo5', name: 'smart-speaker' },
      { id: 'tag_voice_echo5', name: 'voice-control' },
      { id: 'tag_alexa_echo5', name: 'alexa' },
      { id: 'tag_afford_echo5', name: 'affordable' }
    ],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16')
  }
];

export const featuredProducts = products.slice(0, 4);
export const bestSellers = products.slice(2, 6);
export const newArrivals = products.slice(0, 3);