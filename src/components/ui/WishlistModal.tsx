import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingCart, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductService } from '../../services/productService'; // Import ProductService
import { Product } from '../../types'; // Import Product type
import { formatKWDEnglish, formatKWDArabic } from '../../utils/currency';
import OptimizedImage from './OptimizedImage';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setWishlistProducts([]); // Clear products when modal is closed
      return;
    }

    const fetchWishlistProducts = async () => {
      if (state.wishlist.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Assuming ProductService.getProducts can take an array of IDs
        // If not, this would need adjustment (e.g., multiple calls or a dedicated method)
        // For now, we'll simulate this; a real implementation might need ProductService to support `ids` array.
        // const fetchedProducts = await ProductService.getProducts({ ids: state.wishlist });

        // SIMULATION / WORKAROUND if getProducts doesn't support array of IDs directly:
        // Fetch all products and filter, or fetch one by one (less efficient for many items)
        // For this example, let's assume we have to fetch them one by one or have a way to get multiple.
        // This is a placeholder for actual fetching logic based on ProductService capabilities.

        const productsDetailsPromises = state.wishlist.map(id => ProductService.getProduct(id));
        const results = await Promise.allSettled(productsDetailsPromises);
        const fetchedProducts: Product[] = results
          .filter(result => result.status === 'fulfilled' && result.value)
          .map(result => (result as PromiseFulfilledResult<Product>).value);

        setWishlistProducts(fetchedProducts);

      } catch (err) {
        console.error("Error fetching wishlist products:", err);
        setError(err instanceof Error ? err.message : "Failed to load wishlist items.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [isOpen, state.wishlist]);


  if (!isOpen) return null;

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const addToCart = (product: Product) => { // Typed product parameter
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1 } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
            {!loading && !error && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                {wishlistProducts.length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-lg text-gray-600">Loading Wishlist...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Wishlist</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          )}
          {!loading && !error && wishlistProducts.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Add products you love to your wishlist</p>
              <button
                onClick={onClose}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
          {!loading && !error && wishlistProducts.length > 0 && (
            <div className="p-6 space-y-4">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <OptimizedImage
                    src={product.images[0]} // Assuming product.images[0] exists
                    alt={product.name}
                    width={150}
                    height={150}
                    className="w-20 h-20 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600">{product.brand}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-primary">{formatKWDEnglish(product.price)}</span>
                        <span className="text-xs text-gray-500">{formatKWDArabic(product.price)}</span>
                      </div>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatKWDEnglish(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="flex items-center space-x-2 text-red-500 hover:text-red-700 px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;