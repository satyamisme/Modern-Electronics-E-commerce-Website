import { supabase } from '../lib/supabase';
import { products } from '../data/products';
import type { Database } from '../lib/supabase';
import { Product } from '../types';

type ProductDB = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
type ProductImage = Database['public']['Tables']['product_images']['Row'];

export class ProductService {
  // Get all products with images
  static async getProducts(filters?: any): Promise<Product[]> {
    try {
      console.log('Getting products with filters:', filters);
      // Always return mock data for consistent display
      return this.getMockProducts(filters);
    } catch (error) {
      console.error('Error fetching products:', error);
      return this.getMockProducts(filters);
    }
  }

  // Transform Supabase products to our Product type
  private static transformSupabaseProducts(data: any[]): Product[] {
    return data.map(item => {
      const images = item.product_images?.map((img: any) => img.image_url) || [];
      
      return {
        id: item.id,
        name: item.name,
        brand: item.brand,
        category: item.categories?.slug || 'uncategorized',
        price: item.price,
        originalPrice: item.original_price,
        description: item.description || '',
        images: images.length > 0 ? images : ['/placeholder-product.jpg'],
        specifications: item.specifications || {},
        inStock: item.stock_count > 0,
        stockCount: item.stock_count || 0,
        rating: item.rating || 0,
        reviewCount: item.review_count || 0,
        features: item.features || [],
        tags: item.tags || [],
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      };
    });
  }

  // Mock products fallback with filtering
  private static getMockProducts(filters?: {
    category?: string;
    brand?: string;
    priceRange?: [number, number];
    inStock?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Product[] {
    let filtered = [...products];

    if (filters?.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters?.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    if (filters?.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
    }

    if (filters?.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  // Get single product by ID
  static async getProduct(id: string): Promise<Product | null> {
    try {
      console.log('Getting product by ID:', id);
      // Fallback to mock data
      const mockProduct = products.find(p => p.id === id);
      return mockProduct || null;
    } catch (error) {
      console.log('Error fetching product, using mock data:', error);
      const mockProduct = products.find(p => p.id === id);
      return mockProduct || null;
    }
  }

  // Create new product (admin only)
  static async createProduct(productData: any, images: string[] = []): Promise<Product> {
    try {
      console.log('Creating product:', productData);
      return this.createMockProduct(productData, images);
    } catch (error) {
      console.log('Error creating product, using mock data:', error);
      return this.createMockProduct(productData, images);
    }
  }

  // Create mock product for fallback
  private static createMockProduct(productData: any, images: string[]): Product {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: productData.name,
      brand: productData.brand,
      category: productData.category,
      price: productData.price,
      originalPrice: productData.originalPrice,
      description: productData.description || '',
      images: images.length > 0 ? images : ['/placeholder-product.jpg'],
      specifications: productData.specifications || {},
      inStock: productData.inStock,
      stockCount: productData.stockCount || 0,
      rating: 0,
      reviewCount: 0,
      features: productData.features || [],
      tags: productData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to mock data
    products.unshift(newProduct);
    
    return newProduct;
  }

  // Update product (admin only)
  static async updateProduct(id: string, updates: any): Promise<Product> {
    try {
      console.log('Updating product:', id, updates);
      return this.updateMockProduct(id, updates);
    } catch (error) {
      console.log('Error updating product, using mock data:', error);
      return this.updateMockProduct(id, updates);
    }
  }

  // Update mock product for fallback
  private static updateMockProduct(id: string, updates: any): Product {
    // Find and update the product in mock data
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    const updatedProduct: Product = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    products[productIndex] = updatedProduct;
    
    return updatedProduct;
  }

  // Delete product (admin only)
  static async deleteProduct(id: string): Promise<boolean> {
    try {
      console.log('Deleting product:', id);
      return this.deleteMockProduct(id);
    } catch (error) {
      console.log('Error deleting product, using mock data:', error);
      return this.deleteMockProduct(id);
    }
  }

  // Delete mock product for fallback
  private static deleteMockProduct(id: string): boolean {
    const initialLength = products.length;
    const filteredProducts = products.filter(p => p.id !== id);
    
    // Update the products array
    products.length = 0;
    products.push(...filteredProducts);
    
    return products.length < initialLength;
  }

  // Add product images
  static async addProductImages(productId: string, imageUrls: string[]) {
    console.log('Adding product images:', productId, imageUrls);
    return imageUrls.map((url, index) => ({
      id: `image-${Date.now()}-${index}`,
      product_id: productId,
      image_url: url,
      sort_order: index,
      is_primary: index === 0
    }));
  }

  // Update product images
  static async updateProductImages(productId: string, imageUrls: string[]) {
    console.log('Updating product images:', productId, imageUrls);
    return this.addProductImages(productId, imageUrls);
  }

  // Get categories
  static async getCategories() {
    console.log('Getting categories');
    return [
      {
        id: 'smartphones',
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones with cutting-edge technology',
        image_url: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
        sort_order: 1,
        is_active: true
      },
      {
        id: 'laptops',
        name: 'Laptops',
        slug: 'laptops',
        description: 'High-performance laptops for work and gaming',
        image_url: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
        sort_order: 2,
        is_active: true
      }
    ];
  }

  // Search products
  static async searchProducts(query: string, limit = 10) {
    console.log('Searching products:', query, limit);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
    
    return filtered.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      product_images: [{ image_url: product.images[0], is_primary: true }]
    }));
  }

  // Get featured products
  static async getFeaturedProducts(limit = 8) {
    console.log('Getting featured products:', limit);
    return products.slice(0, limit).map(product => ({
      ...product,
      product_images: product.images.map((image, index) => ({
        image_url: image,
        is_primary: index === 0
      }))
    }));
  }

  // Get best sellers
  static async getBestSellers(limit = 8) {
    console.log('Getting best sellers:', limit);
    return products.slice(2, 2 + limit).map(product => ({
      ...product,
      product_images: product.images.map((image, index) => ({
        image_url: image,
        is_primary: index === 0
      }))
    }));
  }

  // Update product rating (called after review submission)
  static async updateProductRating(productId: string) {
    console.log('Updating product rating:', productId);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
      products[productIndex].rating = 4.5; // Mock rating
      products[productIndex].reviewCount = 10; // Mock review count
    }
  }
}