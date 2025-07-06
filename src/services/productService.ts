import { supabase } from '../lib/supabase';
import { products } from '../data/products';
import type { Database } from '../lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
type ProductImage = Database['public']['Tables']['product_images']['Row'];

export class ProductService {
  // Get all products with images
  static async getProducts(filters?: {
    category?: string;
    brand?: string;
    priceRange?: [number, number];
    inStock?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
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
      console.error('Error fetching products:', error);
      throw error;
    }

    return data;
  }

  // Get single product by ID
  static async getProduct(id: string) {
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
      console.error('Error fetching product:', error);
      throw error;
    }

    return data;
  }

  // Create new product (admin only)
  static async createProduct(product: ProductInsert, images: string[] = []) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    // Add images if provided
    if (images.length > 0) {
      await this.addProductImages(data.id, images);
    }

    return data;
  }

  // Update product (admin only)
  static async updateProduct(id: string, updates: ProductUpdate) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    return data;
  }

  // Delete product (admin only)
  static async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }

    return true;
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