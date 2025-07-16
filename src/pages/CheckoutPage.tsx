import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { OrderService } from '../services/orderService';
import { Address } from '../types';
import { formatKWDEnglish, formatKWDArabic } from '../utils/currency';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { governorates, areasByGovernorate } from '../utils/kuwait'; // Assuming this utility exists

const CheckoutPage: React.FC = () => {
  const { state: appState, dispatch: appDispatch } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    governorate: '',
    area: '',
    block: '',
    street: '',
    building: '',
    apartment: '',
    phone: user?.phone || '',
  });
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>({});
  const [paymentMethod, setPaymentMethod] = useState<'knet' | 'card'>('knet');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = appState.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shippingCost = subtotal > 15.000 ? 0 : 2.500; // This should ideally come from settings
  const totalAmount = subtotal + shippingCost;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBillingAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateAddress = (address: Partial<Address>): address is Address => {
    return !!address.governorate && !!address.area && !!address.block && !!address.street && !!address.building;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const finalShippingAddress = shippingAddress;
    if (!validateAddress(finalShippingAddress)) {
      setError("Please fill in all required shipping address fields.");
      setIsProcessing(false);
      return;
    }

    let finalBillingAddress: Address | undefined = undefined;
    if (useDifferentBilling) {
      if (!validateAddress(billingAddress)) {
        setError("Please fill in all required billing address fields.");
        setIsProcessing(false);
        return;
      }
      finalBillingAddress = billingAddress;
    }

    try {
      // Step 1: Create the order in our database with a 'pending_payment' status
      const order = await OrderService.createOrder({
        items: appState.cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          productSku: item.product.sku,
        })),
        shippingAddress: finalShippingAddress,
        billingAddress: finalBillingAddress,
        paymentMethod: paymentMethod,
        customerNotes: customerNotes,
        userId: user?.id,
        customerEmail: user?.email,
      });

      if (!order) {
        throw new Error("Failed to create order.");
      }

      // Step 2: Initiate the KNET payment for the created order
      if (paymentMethod === 'knet') {
        const { paymentUrl } = await OrderService.initiateKnetPayment(order.id, order.total_amount || 0);
        // Step 3: Redirect the user to the KNET payment gateway
        window.location.href = paymentUrl;
      } else {
        // Handle other payment methods like credit card here
        setError("Credit card payments are not yet supported.");
        setIsProcessing(false);
      }

      // Clear cart after successful order creation and payment initiation
      appDispatch({ type: 'CLEAR_CART' });

    } catch (err) {
      console.error("Checkout failed:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  if (appState.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty.</h2>
        <p className="text-gray-600 mb-6">There's nothing to check out. Start by adding some products to your cart.</p>
        <Link to="/products" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <Link to="/cart" className="flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft size={20} className="mr-2" />
          Back to Cart
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping and Payment Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="governorate" value={shippingAddress.governorate} onChange={handleShippingChange} required className="w-full p-2 border rounded">
                  <option value="">Select Governorate</option>
                  {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                </select>
                <select name="area" value={shippingAddress.area} onChange={handleShippingChange} required className="w-full p-2 border rounded" disabled={!shippingAddress.governorate}>
                  <option value="">Select Area</option>
                  {(areasByGovernorate[shippingAddress.governorate || ''] || []).map(area => <option key={area} value={area}>{area}</option>)}
                </select>
                <input type="text" name="block" placeholder="Block" value={shippingAddress.block} onChange={handleShippingChange} required className="w-full p-2 border rounded" />
                <input type="text" name="street" placeholder="Street" value={shippingAddress.street} onChange={handleShippingChange} required className="w-full p-2 border rounded" />
                <input type="text" name="building" placeholder="Building / House No." value={shippingAddress.building} onChange={handleShippingChange} required className="w-full p-2 border rounded" />
                <input type="text" name="apartment" placeholder="Apartment / Floor (Optional)" value={shippingAddress.apartment} onChange={handleShippingChange} className="w-full p-2 border rounded" />
                <input type="tel" name="phone" placeholder="Contact Phone" value={shippingAddress.phone} onChange={handleShippingChange} required className="w-full p-2 border rounded md:col-span-2" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'knet' ? 'border-primary ring-2 ring-primary' : ''}`}>
                  <input type="radio" name="paymentMethod" value="knet" checked={paymentMethod === 'knet'} onChange={() => setPaymentMethod('knet')} className="h-4 w-4 text-primary focus:ring-primary"/>
                  <span className="ml-3 font-medium">KNET</span>
                </label>
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'card' ? 'border-primary ring-2 ring-primary' : ''}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 text-primary focus:ring-primary"/>
                  <span className="ml-3 font-medium">Credit/Debit Card</span>
                  <span className="ml-auto text-sm text-gray-500">(Coming Soon)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 border-b pb-4">
                {appState.cart.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{item.product.name} x {item.quantity}</span>
                    <span className="font-medium">{formatKWDEnglish(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 py-4 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatKWDEnglish(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shippingCost > 0 ? formatKWDEnglish(shippingCost) : 'Free'}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 mb-6">
                <span className="text-lg font-bold">Total</span>
                <div className="text-right">
                  <span className="text-xl font-bold text-primary">{formatKWDEnglish(totalAmount)}</span>
                  <p className="text-sm text-gray-500">{formatKWDArabic(totalAmount)}</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <button type="submit" disabled={isProcessing} className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center disabled:opacity-50">
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={18} className="mr-2"/>
                    Place Order & Pay with KNET
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
