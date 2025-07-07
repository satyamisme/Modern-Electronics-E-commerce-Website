import React, { useState } from 'react';
import { X, CreditCard, MapPin, User, Phone, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import KuwaitAddressForm from './KuwaitAddressForm';
import KNETPaymentButton from './KNETPaymentButton';
import { formatKWDEnglish, formatKWDArabic } from '../../utils/currency';
import { KuwaitAddress } from '../../utils/kuwait';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState<'info' | 'address' | 'payment'>('info');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [address, setAddress] = useState<KuwaitAddress>({
    governorate: '',
    area: '',
    block: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    additionalInfo: ''
  });

  if (!isOpen) return null;

  const subtotal = state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  // Import delivery fee function
  const getDeliveryFee = (governorate: string): number => {
    const fees: Record<string, number> = {
      'kuwait-city': 2.000,
      'hawalli': 2.500,
      'ahmadi': 3.000,
      'jahra': 3.500,
      'mubarak-al-kabeer': 3.000,
      'farwaniya': 2.500
    };
    return fees[governorate] || 2.500;
  };

  const deliveryFee = address.governorate ? getDeliveryFee(address.governorate) : 2.500;
  const total = subtotal + deliveryFee;

  const handleNextStep = () => {
    if (step === 'info') setStep('address');
    else if (step === 'address') setStep('payment');
  };

  const handlePrevStep = () => {
    if (step === 'payment') setStep('address');
    else if (step === 'address') setStep('info');
  };

  const isStepValid = () => {
    if (step === 'info') {
      return customerInfo.name && customerInfo.email && customerInfo.phone;
    }
    if (step === 'address') {
      return address.governorate && address.area && address.block && address.street && address.building;
    }
    return true;
  };

  const handlePaymentSuccess = () => {
    dispatch({ type: 'CLEAR_CART' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'info' ? 'text-primary' : step === 'address' || step === 'payment' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'info' ? 'bg-primary text-white' : step === 'address' || step === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                <User className="h-4 w-4" />
              </div>
              <span className="font-medium">Customer Info</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'address' ? 'text-primary' : step === 'payment' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-primary text-white' : step === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-medium">Address</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'info' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+965 XXXX XXXX"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'address' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
                <KuwaitAddressForm
                  address={address}
                  onAddressChange={setAddress}
                />
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                <KNETPaymentButton
                  amount={total}
                  orderId={`ORD-${Date.now()}`}
                  customerEmail={customerInfo.email}
                  customerPhone={customerInfo.phone}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {state.cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <div>{item.product.name} x{item.quantity}</div>
                    <div className="flex flex-col items-end">
                      <span>{formatKWDEnglish(item.product.price * item.quantity)}</span>
                      <span className="text-xs text-gray-500">{formatKWDArabic(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <div className="flex flex-col items-end">
                    <span>{formatKWDEnglish(subtotal)}</span>
                    <span className="text-xs text-gray-500">{formatKWDArabic(subtotal)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <div className="flex flex-col items-end">
                    <span>{formatKWDEnglish(deliveryFee)}</span>
                    <span className="text-xs text-gray-500">{formatKWDArabic(deliveryFee)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <div className="flex flex-col items-end">
                    <span>{formatKWDEnglish(total)}</span>
                    <span className="text-sm text-gray-600">{formatKWDArabic(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between p-6 border-t">
          <button
            onClick={step === 'info' ? onClose : handlePrevStep}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {step === 'info' ? 'Cancel' : 'Previous'}
          </button>
          {step !== 'payment' && (
            <button
              onClick={handleNextStep}
              disabled={!isStepValid()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;