import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search,
  UploadCloud,
  Edit, 
  Trash2, 
  Package,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import ProductForm from '../../components/admin/ProductForm';
import OptimizedImage from '../../components/ui/OptimizedImage';
// import { products } from '../../data/products'; // Removed mock data import
import { SmartprixPhone } from '../../services/smartprixService';
import { ProductService } from '../../services/productService'; // Import ProductService
import { Product } from '../../types';
import { ProductFormData } from '../../types/admin';
import PhoneImportModal from '../../components/admin/PhoneImportModal';
import { formatKWD } from '../../utils/currency';

const AdminProducts: React.FC = () => {
  const { state, dispatch } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);

  // Removed useEffect that dispatched mock products.
  // AdminContext should provide products, or this component needs to fetch them.
  // For now, this component will rely on state.products from AdminContext.
  // A follow-up would be to ensure AdminContext loads products if not already present.

  useEffect(() => {
    let filtered = state.products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    if (filterStock) {
      if (filterStock === 'in-stock') {
        filtered = filtered.filter(product => product.inStock && product.stockCount > 0);
      } else if (filterStock === 'low-stock') {
        filtered = filtered.filter(product => product.inStock && product.stockCount <= 5);
      } else if (filterStock === 'out-of-stock') {
        filtered = filtered.filter(product => !product.inStock || product.stockCount === 0);
      }
    }

    setFilteredProducts(filtered);
  }, [state.products, searchTerm, filterCategory, filterStock]);

  const handleAddProduct = () => {
    dispatch({ type: 'SET_SELECTED_PRODUCT', payload: null });
    dispatch({ type: 'SET_EDIT_MODE', payload: false });
    setShowForm(true);
  };

  const handleImportPhones = () => {
    setShowImportModal(true);
  };

  const handleImportComplete = (importedPhones: SmartprixPhone[]) => {
    // Convert imported phones to products and add them
    const newProducts = importedPhones.map(phone => {
      const product: Product = {
        id: `product-${Date.now()}-${phone.id}`,
        name: phone.name,
        brand: phone.brand,
        category: 'smartphones',
        price: phone.price || 0,
        description: `${phone.name} - ${Object.values(phone.specifications).filter(Boolean).join(', ')}`,
        images: [phone.image],
        specifications: Object.entries(phone.specifications).reduce((acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, {} as Record<string, string>),
        inStock: phone.availability,
        stockCount: 10, // Default stock
        rating: 0,
        reviewCount: 0,
        features: phone.features,
        tags: phone.colors || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return product;
    });

    // Add products to state
    newProducts.forEach(product => {
      dispatch({ type: 'ADD_PRODUCT', payload: product });
    });

    alert(`Successfully imported ${newProducts.length} products`);
  };

  const handleEditProduct = (product: Product) => {
    dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product });
    dispatch({ type: 'SET_EDIT_MODE', payload: true });
    setShowForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      ProductService.deleteProduct(productId)
        .then(success => {
          if (success) {
            dispatch({ type: 'DELETE_PRODUCT', payload: productId });
            alert('Product deleted successfully!');
          } else {
            alert('Failed to delete product. Please try again.');
          }
        })
        .catch(error => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        });
    }
  };

  const handleSaveProduct = (productData: ProductFormData) => {
    if (state.editMode && state.selectedProduct) {
      // Update existing product
      ProductService.updateProduct(state.selectedProduct.id, productData)
        .then(updatedProduct => {
          dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
          alert('Product updated successfully!');
        })
        .catch(error => {
          console.error('Error updating product:', error);
          alert('Failed to update product. Please try again.');
        });
    } else {
      // Add new product
      ProductService.createProduct(productData, productData.images)
        .then(newProduct => {
          dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
          alert('Product created successfully!');
        })
        .catch(error => {
          console.error('Error creating product:', error);
          alert('Failed to create product. Please try again.');
        });
    }
    setShowForm(false);
  };

  const categories = ['smartphones', 'laptops', 'tablets', 'headphones', 'smart-home', 'accessories'];

  const getStockStatus = (product: Product) => {
    if (!product.inStock || product.stockCount === 0) {
      return { status: 'Out of Stock', color: 'text-red-600 bg-red-100', icon: AlertCircle };
    } else if (product.stockCount <= 5) {
      return { status: 'Low Stock', color: 'text-orange-600 bg-orange-100', icon: AlertCircle };
    } else {
      return { status: 'In Stock', color: 'text-green-600 bg-green-100', icon: CheckCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-4 sm:mt-0 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
        <button
          onClick={handleImportPhones}
          className="mt-4 sm:mt-0 ml-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
        >
          <UploadCloud className="h-5 w-5" />
          <span>Import Models</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Stock Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-4 w-4 mr-2" />
            {filteredProducts.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const StatusIcon = stockStatus.icon;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <OptimizedImage
                          src={product.images[0]}
                          alt={product.name}
                          width={100}
                          height={100}
                          className="h-12 w-12 rounded-lg"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                        {product.category.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatKWD(product.price)}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">{formatKWD(product.originalPrice)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stockCount} units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {stockStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={state.selectedProduct}
          onSave={handleSaveProduct}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      {/* Phone Import Modal */}
      <PhoneImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};

export default AdminProducts;