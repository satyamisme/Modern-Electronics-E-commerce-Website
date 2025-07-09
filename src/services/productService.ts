// import { products as mockProducts } from '../data/products'; // Keep for potential fallback or remove
import type { Database } from '../lib/supabase';
import { Product, Category, ProductImage as AppProductImage } from '../types'; // Using updated types
import { ProductFormData } from '../types/admin'; // For create/update methods

// Supabase specific types for cleaner inserts/updates
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
type ProductImageInsert = Database['public']['Tables']['product_images']['Insert'];
type CategoryDB = Database['public']['Tables']['categories']['Row'];


/**
 * Helper function to transform Supabase product data (joined with images and categories)
 * into the application's Product type.
 * @param dbProduct - The product data from Supabase, including related product_images and categories.
 * @returns A Product object formatted for application use.
 */
const transformSupabaseProduct = (
  // The type for dbProduct should ideally come from a more specific query type if Supabase client generates them,
  // or be manually constructed to reflect the JOINs.
  dbProduct: Database['public']['Tables']['products']['Row'] &
             { product_images: Array<Database['public']['Tables']['product_images']['Row']> } &
             { categories: Pick<CategoryDB, 'id' | 'name' | 'slug'> | null }
): Product => {
  // Ensure product_images is an array, even if null from DB (though JOIN should make it empty array if no images)
  const imagesFromDb = Array.isArray(dbProduct.product_images) ? dbProduct.product_images : [];

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug || undefined, // Ensure slug is handled if null
    brand: dbProduct.brand,
    categoryId: dbProduct.category_id,
    categoryName: dbProduct.categories?.name,
    categorySlug: dbProduct.categories?.slug,
    price: dbProduct.price,
    originalPrice: dbProduct.original_price,
    description: dbProduct.description,
    sku: dbProduct.sku,
    stockCount: dbProduct.stock_count || 0,
    isActive: dbProduct.is_active === null ? true : dbProduct.is_active,
    images: imagesFromDb.map(img => ({
        id: img.id, // Assuming product_images table has an id column
        url: img.url,
        altText: img.altText || undefined, // Handle null alt_text
        isPrimary: img.isPrimary || false, // Handle null is_primary
        sortOrder: img.sortOrder || 0,     // Handle null sort_order
    })),
    specifications: dbProduct.specifications as Record<string, string> || {},
    features: dbProduct.features || [],
    tags: dbProduct.tags || [],
    rating: dbProduct.rating,
    reviewCount: dbProduct.review_count,
    createdAt: new Date(dbProduct.created_at),
    updatedAt: new Date(dbProduct.updated_at),
    get inStock(): boolean {
      return (this.stockCount > 0) && (this.isActive === undefined ? true : this.isActive);
    }
  };
};


export class ProductService {
  /**
   * Fetches a list of products with optional filters, sorting, and pagination.
   * Includes related category information and product images.
   * @param filters - Optional filters for querying products.
   * @returns A promise that resolves to an array of Product objects.
   * @throws Will throw an error if fetching fails.
   */
  static async getProducts(filters?: {
    categorySlug?: string;
    brand?: string[];
    priceRange?: [number, number];
    inStock?: boolean;
    onSale?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories!inner (id, name, slug),
        product_images!left (id, url, alt_text, is_primary, sort_order)
      `)
      // Default to fetching active products for public views. Admin views might need different logic.
      .eq('is_active', true);

    if (filters?.categorySlug) {
      // Querying products by category slug requires a join or subquery if category_id is not directly available.
      // The current select `categories!inner` will filter by joined category if `category_id` is used.
      // If filtering directly on categories.slug, the join needs to be effective.
      query = query.eq('categories.slug', filters.categorySlug);
    }

    if (filters?.brand && filters.brand.length > 0) {
      query = query.in('brand', filters.brand);
    }

    if (filters?.priceRange) {
      query = query.gte('price', filters.priceRange[0]);
      query = query.lte('price', filters.priceRange[1]);
    }

    if (filters?.inStock) {
      query = query.gt('stock_count', 0);
    }

    if (filters?.onSale) {
      query = query.isnot('original_price', null);
      query = query.ltProperty('price', 'original_price');
    }

    if (filters?.search) {
      // For robust search, consider using Supabase full-text search (fts)
      // This example uses ILIKE for basic search on name, brand, and description.
      query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Default sort order or apply from filters
    query = query.order(filters?.sortBy || 'created_at', {
      ascending: filters?.sortOrder === 'asc',
      // foreignTable: filters?.sortBy === 'categoryName' ? 'categories' : undefined // Example for sorting by related table
    });
    if (filters?.sortBy !== 'created_at' && filters?.sortBy !== 'name' && filters?.sortBy !== 'price' && filters?.sortBy !== 'rating' && filters?.sortBy !== 'review_count' ) {
        // Add a secondary sort for consistency if primary sort is not unique enough or not a default like created_at
        query = query.order('id', { ascending: true });
    }

    // Pagination
    if (filters?.limit !== undefined && filters?.offset !== undefined) {
      query = query.range(filters.offset, filters.offset + filters.limit - 1);
    } else if (filters?.limit !== undefined) {
      query = query.limit(filters.limit);
    }


    const { data, error } = await query;

    if (error) {
      console.error('ProductService.getProducts - Error:', error);
      throw error;
    }
    // Ensure product_images is always an array for the transformer
    return (data || []).map(p => transformSupabaseProduct({ ...p, product_images: p.product_images || [] } as any));
  }

  /**
   * Fetches a single product by its ID or slug.
   * Includes related category information and product images.
   * @param idOrSlug - The ID (UUID) or slug of the product.
   * @returns A promise that resolves to a Product object or null if not found.
   * @throws Will throw an error if fetching fails.
   */
  static async getProduct(idOrSlug: string): Promise<Product | null> {
    // Determine if idOrSlug is likely a UUID (for ID) or a string with hyphens (for slug)
    const isLikelyUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idOrSlug);
    const column = isLikelyUuid ? 'id' : 'slug';

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner (id, name, slug),
        product_images!left (id, url, alt_text, is_primary, sort_order)
      `)
      .eq(column, idOrSlug)
      .eq('is_active', true) // Typically only fetch active products
      .maybeSingle();

    if (error) {
      console.error(`ProductService.getProduct - Error fetching product by ${column} '${idOrSlug}':`, error);
      if (error.code === 'PGRST116') return null; // Row not found
      throw error;
    }
    if (!data) return null;
    return transformSupabaseProduct({ ...data, product_images: data.product_images || [] } as any);
  }

  /**
   * Creates a new product along with its images. (Admin operation)
   * @param productData - Data for the new product from ProductFormData.
   * @returns The created Product object.
   * @throws Will throw an error if creation fails.
   */
  static async createProduct(productData: ProductFormData): Promise<Product> {
    const productInsert: ProductInsert = {
      name: productData.name,
      slug: productData.slug || productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      brand: productData.brand,
      category_id: productData.categoryId,
      price: productData.price,
      original_price: productData.originalPrice,
      description: productData.description,
      sku: productData.sku,
      stock_count: productData.stockCount,
      is_active: productData.isActive,
      specifications: productData.specifications as any, // Cast if specifications is JSONB
      features: productData.features,
      tags: productData.tags,
    };

    const { data: newProductDb, error: productError } = await supabase
      .from('products')
      .insert(productInsert)
      .select(`*, categories!inner (id, name, slug)`)
      .single();

    if (productError || !newProductDb) {
      console.error('ProductService.createProduct - Product Insert Error:', productError);
      throw productError || new Error("Product creation failed to return data.");
    }

    let createdImages: AppProductImage[] = [];
    if (productData.images && productData.images.length > 0) {
      // Assuming productData.images are URLs. For file uploads, handle upload first.
      const imageInserts: ProductImageInsert[] = productData.images.map((imgUrl, index) => ({
        product_id: newProductDb.id,
        url: imgUrl,
        is_primary: index === 0,
        sort_order: index,
        alt_text: productData.name, // Basic alt text
      }));
      const { data: insertedImages, error: imageError } = await supabase.from('product_images').insert(imageInserts).select();
      if (imageError) {
        console.error('ProductService.createProduct - Image Insert Error:', imageError);
        // Consider if product creation should be "rolled back" or if partial success is okay.
        // For now, we proceed but log the error.
      }
      createdImages = (insertedImages || []).map(img => ({ id: img.id, url: img.url, altText: img.alt_text || undefined, isPrimary: img.is_primary || false, sortOrder: img.sort_order || 0 }));
    }
    
    // Return the product formatted for the application, including any images created.
    return transformSupabaseProduct({ ...newProductDb, product_images: createdImages } as any);
  }

  /**
   * Updates an existing product and its images. (Admin operation)
   * @param id - The ID of the product to update.
   * @param updates - Partial data of ProductFormData to update.
   * @returns The updated Product object.
   * @throws Will throw an error if update fails.
   */
  static async updateProduct(id: string, updates: Partial<ProductFormData>): Promise<Product> {
    const { images: newImageUrls, ...productFieldsToUpdate } = updates;
    
    const productUpdate: ProductUpdate = { ...productFieldsToUpdate };
    if ('categoryId' in productFieldsToUpdate) {
      productUpdate.category_id = productFieldsToUpdate.categoryId;
      delete (productUpdate as any).categoryId; // Remove non-db field
    }
    if ('specifications' in productFieldsToUpdate && productFieldsToUpdate.specifications) {
        productUpdate.specifications = productFieldsToUpdate.specifications as any; // Cast if JSONB
    }


    const { data: updatedProductDb, error: productError } = await supabase
      .from('products')
      .update(productUpdate)
      .eq('id', id)
      .select(`*, categories!inner (id, name, slug)`)
      .single();

    if (productError || !updatedProductDb) {
      console.error('ProductService.updateProduct - Product Update Error:', productError);
      throw productError || new Error("Product update failed to return data.");
    }

    let finalImages: AppProductImage[] = [];
    if (newImageUrls) {
        // Simple strategy: delete all existing images and add new ones.
        // A more sophisticated strategy would involve diffing and updating/deleting/adding specific images.
        await supabase.from('product_images').delete().eq('product_id', id);
        if (newImageUrls.length > 0) {
            const imageInserts: ProductImageInsert[] = newImageUrls.map((imgUrl, index) => ({
                product_id: id,
                url: imgUrl,
                is_primary: index === 0,
                sort_order: index,
                alt_text: updatedProductDb.name, // Basic alt text
            }));
            const { data: insertedImages, error: imageError } = await supabase.from('product_images').insert(imageInserts).select();
            if (imageError) {
                console.error('ProductService.updateProduct - Image Update Error:', imageError);
            }
            finalImages = (insertedImages || []).map(img => ({id: img.id, url: img.url, altText: img.alt_text || undefined, isPrimary: img.is_primary || false, sortOrder: img.sort_order || 0 }));
        }
    } else {
        // If newImageUrls is not provided, fetch existing images.
        const {data: existingImages} = await supabase.from('product_images').select('*').eq('product_id', id);
        finalImages = (existingImages || []).map(img => ({id: img.id, url: img.url, altText: img.alt_text || undefined, isPrimary: img.is_primary || false, sortOrder: img.sort_order || 0 }));
    }
    
    return transformSupabaseProduct({ ...updatedProductDb, product_images: finalImages } as any);
  }

  /**
   * Deletes a product and its associated images. (Admin operation)
   * @param id - The ID of the product to delete.
   * @returns True if deletion was successful, false otherwise.
   * @throws Will throw an error if deletion fails at product level.
   */
  static async deleteProduct(id: string): Promise<boolean> {
    // First delete related product images (optional: could be handled by DB cascade)
    const { error: imageError } = await supabase.from('product_images').delete().eq('product_id', id);
    if (imageError) {
      console.error('ProductService.deleteProduct - Error deleting product images:', imageError);
      // Depending on policy, you might choose to stop or proceed if images can't be deleted.
    }

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('ProductService.deleteProduct - Error deleting product:', error);
      throw error;
    }
    return !error; // True if no error
  }

  /**
   * Adds new images to a product.
   * @param productId - The ID of the product.
   * @param imageUrls - An array of AppProductImage objects to add.
   * @returns A promise that resolves to an array of the added AppProductImage objects (with DB IDs).
   */
  static async addProductImages(productId: string, imagesToAdd: AppProductImage[]): Promise<AppProductImage[]> {
    const imageInserts: ProductImageInsert[] = imagesToAdd.map(img => ({
        product_id: productId,
        url: img.url,
        alt_text: img.altText,
        is_primary: img.isPrimary,
        sort_order: img.sortOrder
    }));

    const { data, error } = await supabase.from('product_images').insert(imageInserts).select();
    if (error) {
        console.error('ProductService.addProductImages - Error:', error);
        throw error;
    }
    return (data || []).map(dbImg => ({
        id: dbImg.id,
        url: dbImg.url,
        altText: dbImg.alt_text || undefined,
        isPrimary: dbImg.is_primary || false,
        sortOrder: dbImg.sort_order || 0,
    }));
  }

  /**
   * Updates all images for a product (deletes existing, adds new).
   * @param productId - The ID of the product.
   * @param newImages - An array of AppProductImage objects to set for the product.
   * @returns A promise that resolves to an array of the new AppProductImage objects.
   */
  static async updateProductImages(productId: string, newImages: AppProductImage[]): Promise<AppProductImage[]> {
    // Simple strategy: delete all existing images for the product, then add the new ones.
    const { error: deleteError } = await supabase.from('product_images').delete().eq('product_id', productId);
    if (deleteError) {
        console.error('ProductService.updateProductImages - Error deleting old images:', deleteError);
        throw deleteError;
    }
    return this.addProductImages(productId, newImages);
  }

  /**
   * Fetches all active categories, ordered by sort_order.
   * @returns A promise that resolves to an array of Category objects.
   * @throws Will throw an error if fetching fails.
   */
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('ProductService.getCategories - Error:', error);
      throw error;
    }
    return (data || []).map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        imageUrl: c.image_url,
        parentId: c.parent_id,
        isActive: c.is_active,
        createdAt: c.created_at, // Consider converting to Date object if needed by app
        updatedAt: c.updated_at, // Same as above
        // productCount and children are not directly fetched here; would require separate logic or different query.
    }));
  }

  /**
   * Searches for products based on a query string.
   * Performs a basic ILIKE search on name, description, brand and checks tags.
   * @param query - The search term.
   * @param limit - Maximum number of results to return.
   * @returns A promise that resolves to an array of partial Product objects (id, name, price, primary image).
   * @throws Will throw an error if search fails.
   */
  static async searchProducts(query: string, limit = 10): Promise<Partial<Product>[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, price, slug,
        product_images!left (url, is_primary)
      `)
      // Example: using `or` for multiple fields. For tags, `cs` (contains) operator on array.
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%,tags.cs.{${query}}`)
      .eq('is_active', true)
      .limit(limit);

    if (error) {
      console.error('ProductService.searchProducts - Error:', error);
      throw error;
    }
    return (data || []).map(p => {
        const pImages = Array.isArray(p.product_images) ? p.product_images : [];
        let primaryImage = pImages.find(img => img.is_primary);
        if (!primaryImage && pImages.length > 0) primaryImage = pImages[0];

        return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            images: primaryImage ? [{ url: primaryImage.url, isPrimary: true }] : [],
        };
    });
  }

  /**
   * Fetches featured products.
   * Placeholder logic: sorts by rating. A dedicated 'is_featured' flag or more complex logic is typical.
   * @param limit - Maximum number of featured products to return.
   * @returns A promise that resolves to an array of Product objects.
   * @throws Will throw an error if fetching fails.
   */
  static async getFeaturedProducts(limit = 4): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`*, categories!inner (id, name, slug), product_images!left (id, url, alt_text, is_primary, sort_order)`)
      .eq('is_active', true)
      // .eq('is_featured', true) // Uncomment if you add an is_featured column
      .order('rating', { ascending: false, nullsFirst: false }) // Example: featured by highest rating
      .limit(limit);

    if (error) {
      console.error('ProductService.getFeaturedProducts - Error:', error);
      throw error;
    }
    return (data || []).map(p => transformSupabaseProduct({ ...p, product_images: p.product_images || [] } as any));
  }

  /**
   * Fetches best-selling products.
   * Placeholder logic: sorts by review_count. True best-sellers require sales data integration.
   * @param limit - Maximum number of best-selling products to return.
   * @returns A promise that resolves to an array of Product objects.
   * @throws Will throw an error if fetching fails.
   */
  static async getBestSellers(limit = 4): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`*, categories!inner (id, name, slug), product_images!left (id, url, alt_text, is_primary, sort_order)`)
      .eq('is_active', true)
      .order('review_count', { ascending: false, nullsFirst: false }) // Example: using review_count as a proxy
      .limit(limit);

    if (error) {
      console.error('ProductService.getBestSellers - Error:', error);
      throw error;
    }
    return (data || []).map(p => transformSupabaseProduct({ ...p, product_images: p.product_images || [] } as any));
  }

  /**
   * Updates a product's average rating and review count based on its approved reviews.
   * This should typically be called after a review is created, approved, or deleted.
   * @param productId - The ID of the product to update.
   * @throws Will throw an error if review fetching or product update fails.
   */
  static async updateProductRating(productId: string): Promise<void> {
    const { data: reviews, error: reviewError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)
      .eq('is_approved', true); // Only consider approved reviews

    if (reviewError) {
      console.error(`ProductService.updateProductRating - Error fetching reviews for product ${productId}:`, reviewError);
      throw reviewError; // Re-throw to indicate failure
    }

    const totalReviews = reviews?.length || 0;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    const { error: updateError } = await supabase
      .from('products')
      .update({
        rating: parseFloat(averageRating.toFixed(2)),
        review_count: totalReviews
      })
      .eq('id', productId);

    if (updateError) {
      console.error(`ProductService.updateProductRating - Error updating rating for product ${productId}:`, updateError);
      throw updateError; // Re-throw to indicate failure
    }
  }
}