import { supabase } from '../lib/supabase';
import { products } from '../data/products';
import type { Database } from '../lib/supabase';
import { Product } from '../types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
type ProductImage = Database['public']['Tables']['product_images']['Row'];

export class ProductService {
  // Get all products with images
  static async getProducts(filters?: any): Promise<Product[]> {
    try {
      // Try to fetch from Supabase
      let query = supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            alt_text,
            sort_order,
            is_primary
          ),
          categories (
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters?.brand) {
        query = query.eq('brand', filters.brand);
      }

      if (filters?.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
      }

      if (filters?.inStock) {
        query = query.gt('stock_count', 0);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products from Supabase:', error);
        // Fallback to mock data
        return this.getMockProducts(filters);
      }

      // Transform Supabase data to match our Product type
      return this.transformSupabaseProducts(data);
    } catch (error) {
      console.log('Supabase not configured or error, using mock data:', error);
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
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            alt_text,
            sort_order,
            is_primary
          ),
          categories (
            name,
            slug
          ),
          reviews (
            id,
            rating,
            title,
            comment,
            created_at,
            profiles (
              full_name
            )
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching product from Supabase:', error);
        // Fallback to mock data
        const mockProduct = products.find(p => p.id === id);
        return mockProduct || null;
      }

      // Transform to our Product type
      const transformedProduct = this.transformSupabaseProducts([data])[0];
      return transformedProduct;
    } catch (error) {
      console.log('Supabase not configured or error, using mock data:', error);
      const mockProduct = products.find(p => p.id === id);
      return mockProduct || null;
    }
  }

  // Create new product (admin only)
  static async createProduct(productData: any, images: string[] = []): Promise<Product> {
    try {
      // Try to create in Supabase
      const productInsert: ProductInsert = {
        name: productData.name,
        slug: productData.name.toLowerCase().replace(/\s+/g, '-'),
        brand: productData.brand,
        category_id: productData.category,
        price: productData.price,
        original_price: productData.originalPrice,
        description: productData.description,
        stock_count: productData.stockCount,
        is_active: productData.inStock,
        specifications: productData.specifications,
        features: productData.features,
        tags: productData.tags
      };

      const { data, error } = await supabase
        .from('products')
        .insert(productInsert)
        .select()
        .single();

      if (error) {
        console.error('Error creating product in Supabase:', error);
        // Fallback to mock data
        return this.createMockProduct(productData, images);
      }

      // Add images if provided
      if (images.length > 0) {
        await this.addProductImages(data.id, images);
      }

      // Return transformed product
      return {
        id: data.id,
        name: data.name,
        brand: data.brand,
        category: productData.category,
        price: data.price,
        originalPrice: data.original_price,
        description: data.description || '',
        images: images.length > 0 ? images : ['/placeholder-product.jpg'],
        specifications: data.specifications || {},
        inStock: data.stock_count > 0,
        stockCount: data.stock_count || 0,
        rating: 0,
        reviewCount: 0,
        features: data.features || [],
        tags: data.tags || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.log('Supabase not configured or error, using mock data:', error);
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
      // Try to update in Supabase
      const productUpdate: ProductUpdate = {
        name: updates.name,
        slug: updates.name.toLowerCase().replace(/\s+/g, '-'),
        brand: updates.brand,
        category_id: updates.category,
        price: updates.price,
        original_price: updates.originalPrice,
        description: updates.description,
        stock_count: updates.stockCount,
        is_active: updates.inStock,
        specifications: updates.specifications,
        features: updates.features,
        tags: updates.tags
      };

      const { data, error } = await supabase
        .from('products')
        .update(productUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product in Supabase:', error);
        // Fallback to mock data
        return this.updateMockProduct(id, updates);
      }

      // Update images if provided
      if (updates.images && updates.images.length > 0) {
        await this.updateProductImages(id, updates.images);
      }

      // Return transformed product
      return {
        id: data.id,
        name: data.name,
        brand: data.brand,
        category: updates.category,
        price: data.price,
        originalPrice: data.original_price,
        description: data.description || '',
        images: updates.images || ['/placeholder-product.jpg'],
        specifications: data.specifications || {},
        inStock: data.stock_count > 0,
        stockCount: data.stock_count || 0,
        rating: data.rating || 0,
        reviewCount: data.review_count || 0,
        features: data.features || [],
        tags: data.tags || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.log('Supabase not configured or error, using mock data:', error);
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
      // Try to delete from Supabase
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product from Supabase:', error);
        // Fallback to mock data
        return this.deleteMockProduct(id);
      }

      return true;
    } catch (error) {
      console.log('Supabase not configured or error, using mock data:', error);
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
    const imageInserts = imageUrls.map((url, index) => ({
      product_id: productId,
      image_url: url,
      sort_order: index,
      is_primary: index === 0
    }));

    const { data, error } = await supabase
      .from('product_images')
      .insert(imageInserts)
      .select();

    if (error) {
      console.error('Error adding product images:', error);
      throw error;
    }

    return data;
  }

  // Update product images
  static async updateProductImages(productId: string, imageUrls: string[]) {
    // Delete existing images
    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId);

    // Add new images
    return this.addProductImages(productId, imageUrls);
  }

  // Get categories
  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data;
  }

  // Search products
  static async searchProducts(query: string, limit = 10) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        product_images!inner (
          image_url,
          is_primary
        )
      `)
      .eq('is_active', true)
      .eq('product_images.is_primary', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }

    return data;
  }

  // Get featured products
  static async getFeaturedProducts(limit = 8) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          image_url,
          is_primary
        )
      `)
      .eq('is_active', true)
      .gt('stock_count', 0)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }

    return data;
  }

  // Get best sellers
  static async getBestSellers(limit = 8) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          image_url,
          is_primary
        )
      `)
      .eq('is_active', true)
      .gt('stock_count', 0)
      .order('review_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching best sellers:', error);
      throw error;
    }

    return data;
  }

  // Update product rating (called after review submission)
  static async updateProductRating(productId: string) {
    const { data: reviews, error: reviewError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)
      .eq('is_approved', true);

    if (reviewError) {
      console.error('Error fetching reviews for rating update:', reviewError);
      return;
    }

    if (reviews.length === 0) return;

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    const { error: updateError } = await supabase
      .from('products')
      .update({
        rating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
        review_count: reviews.length
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Error updating product rating:', updateError);
    }
  }
}