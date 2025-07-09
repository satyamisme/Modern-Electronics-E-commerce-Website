import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppProvider, useApp } from '../context/AppContext';
import ProductDetailPage from './ProductDetailPage';
import { ProductService } from '../services/productService';
import { Product, ProductImage } from '../types'; // Ensure ProductImage is imported if used by mock

// Mock ProductService
vi.mock('../services/productService');

// Mock OptimizedImage as it might involve external calls or complex rendering not needed for this test
vi.mock('../components/ui/OptimizedImage', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string, alt: string}) => <img src={src} alt={alt} data-testid="optimized-image" />
}));


const mockProductImages: ProductImage[] = [{ url: '/test-image.jpg', isPrimary: true, altText: 'Test Image' }];

const mockProduct: Product = {
  id: 'prod-123',
  name: 'Test Product',
  brand: 'Test Brand',
  categoryId: 'cat-test',
  categoryName: 'Test Category',
  categorySlug: 'test-category',
  price: 100.000,
  originalPrice: 120.000,
  description: 'A great test product.',
  images: mockProductImages,
  specifications: { Ram: '8GB', Storage: '256GB' },
  stockCount: 10,
  isActive: true,
  rating: 4.5,
  reviewCount: 10,
  features: ['Feature 1', 'Feature 2'],
  tags: ['tag1', 'tag2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  get inStock() { return (this.stockCount > 0) && (this.isActive === undefined || this.isActive); }
};

// Test component to display cart count from context for verification
const CartDisplay = () => {
  const { state } = useApp();
  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  return <div data-testid="cart-count">Cart Items: {cartItemCount}</div>;
};

describe('ProductDetailPage Integration - Add to Cart', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock localStorage for cart persistence
    Storage.prototype.getItem = vi.fn((key: string) => {
        if (key === 'cart') return null; // Start with empty cart in localStorage for most tests
        if (key === 'wishlist') return null;
        return null;
    });
    Storage.prototype.setItem = vi.fn();

    // Ensure ProductService.getProduct is a Vitest mock function
    (ProductService.getProduct as vi.Mock).mockReset();
  });

  it('should add product to cart when "Add to Cart" is clicked', async () => {
    (ProductService.getProduct as vi.Mock).mockResolvedValue(mockProduct);

    render(
      <MemoryRouter initialEntries={['/product/prod-123']}>
        <AppProvider> {/* AppProvider provides cart state */}
          <Routes>
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
          <CartDisplay /> {/* To check cart state update */}
        </AppProvider>
      </MemoryRouter>
    );

    // Wait for product details to load
    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(ProductService.getProduct).toHaveBeenCalledWith('prod-123');

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).not.toBeDisabled();

    // Check initial cart count
    const cartCountDisplay = screen.getByTestId('cart-count');
    // Wait for AppContext to potentially load initial cart from (mocked empty) localStorage
    await waitFor(() => {
        expect(cartCountDisplay).toHaveTextContent('Cart Items: 0');
    });


    fireEvent.click(addToCartButton);

    // Wait for context update and re-render
    await waitFor(() => {
      expect(cartCountDisplay).toHaveTextContent('Cart Items: 1');
    });

    // Verify localStorage was updated (AppContext saves cart to localStorage)
    // The product in localStorage will have the getter defined, which might affect stringify.
    // For robust check, parse and compare relevant fields or use deep equality with custom matcher.
    // Simple check for now:
    expect(localStorage.setItem).toHaveBeenCalledWith('cart',
      expect.stringContaining('"id":"prod-123"')
    );
    expect(localStorage.setItem).toHaveBeenCalledWith('cart',
      expect.stringContaining('"quantity":1')
    );
  });

   it('should increment quantity if product is already in cart', async () => {
    (ProductService.getProduct as vi.Mock).mockResolvedValue(mockProduct);

    // Simulate product already in cart via localStorage before AppProvider mounts
    const initialCart = [{ product: mockProduct, quantity: 1 }];
    Storage.prototype.getItem = vi.fn(key => key === 'cart' ? JSON.stringify(initialCart) : null);

    render(
      <MemoryRouter initialEntries={['/product/prod-123']}>
        <AppProvider>
          <Routes>
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
          <CartDisplay />
        </AppProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('Test Product')).toBeInTheDocument();

    const cartCountDisplay = screen.getByTestId('cart-count');
    // Wait for AppContext to load from localStorage
    await waitFor(() => {
        expect(cartCountDisplay).toHaveTextContent('Cart Items: 1');
    });

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton); // Click "Add to Cart" again

    await waitFor(() => {
      expect(cartCountDisplay).toHaveTextContent('Cart Items: 2'); // Quantity should be 2
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('cart',
      expect.stringContaining('"quantity":2')
    );
  });
});
