import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft, Phone, Mail } from 'lucide-react';

const PaymentErrorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('error');
  const orderId = searchParams.get('orderId');

  const getErrorMessage = (code: string | null) => {
    switch (code) {
      case 'INSUFFICIENT_FUNDS':
        return 'Insufficient funds in your account. Please check your balance and try again.';
      case 'CARD_DECLINED':
        return 'Your card was declined. Please contact your bank or try a different payment method.';
      case 'EXPIRED_CARD':
        return 'Your card has expired. Please use a valid card.';
      case 'INVALID_PIN':
        return 'Invalid PIN entered. Please try again with the correct PIN.';
      case 'TRANSACTION_TIMEOUT':
        return 'Transaction timed out. Please try again.';
      case 'NETWORK_ERROR':
        return 'Network connection error. Please check your internet connection and try again.';
      case 'CANCELLED':
        return 'Payment was cancelled. You can try again or choose a different payment method.';
      default:
        return 'An unexpected error occurred during payment processing. Please try again.';
    }
  };

  const getErrorTitle = (code: string | null) => {
    switch (code) {
      case 'CANCELLED':
        return 'Payment Cancelled';
      case 'NETWORK_ERROR':
        return 'Connection Error';
      case 'TRANSACTION_TIMEOUT':
        return 'Transaction Timeout';
      default:
        return 'Payment Failed';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Error Header */}
        <div className="text-center mb-8">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getErrorTitle(errorCode)}</h1>
          <p className="text-gray-600">{getErrorMessage(errorCode)}</p>
        </div>

        {/* Error Details */}
        {orderId && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Error Code:</span>
                <span className="font-medium text-red-600">{errorCode || 'UNKNOWN'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Troubleshooting Tips */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Troubleshooting Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Ensure your card has sufficient balance
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Check that your card is not expired
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Verify your internet connection is stable
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Contact your bank if the issue persists
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Try using a different browser or device
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/cart"
              className="flex items-center justify-center space-x-2 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Try Again</span>
            </Link>
            
            <Link
              to="/products"
              className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Alternative Payment Methods */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Alternative Payment Options</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">KNET</div>
                <span className="text-sm">Try with a different card</span>
              </div>
              <Link to="/cart" className="text-primary hover:underline text-sm">
                Use KNET
              </Link>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">COD</div>
                <span className="text-sm">Cash on Delivery</span>
              </div>
              <Link to="/cart" className="text-primary hover:underline text-sm">
                Select COD
              </Link>
            </div>
          </div>
        </div>

        {/* Customer Support */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">Our customer support team is here to assist you</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="tel:+96522345678"
              className="flex items-center justify-center space-x-2 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span>Call Support</span>
            </a>
            
            <a
              href="mailto:support@lakkiphones.com"
              className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>Email Support</span>
            </a>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>📞 +965 2XXX XXXX</p>
            <p>📧 support@lakkiphones.com</p>
            <p>🕒 Sunday - Thursday: 9 AM - 10 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentErrorPage;