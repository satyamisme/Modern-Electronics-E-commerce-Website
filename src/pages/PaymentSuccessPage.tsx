import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Calendar, Download, ArrowRight } from 'lucide-react';
import { knetService } from '../utils/knet';
import { formatKWD } from '../utils/currency';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Verify payment with KNET
    const verifyPayment = async () => {
      const paymentResponse = {
        status: searchParams.get('status'),
        transactionId: searchParams.get('transactionId'),
        orderId: searchParams.get('orderId'),
        amount: searchParams.get('amount'),
        merchantId: searchParams.get('merchantId')
      };

      const isValid = knetService.verifyPaymentResponse(paymentResponse);
      setPaymentVerified(isValid);

      if (isValid) {
        // Mock order details - in production, fetch from API
        setOrderDetails({
          orderId: paymentResponse.orderId,
          transactionId: paymentResponse.transactionId,
          amount: parseFloat(paymentResponse.amount || '0'),
          date: new Date(),
          items: [
            { name: 'iPhone 15 Pro', quantity: 1, price: 399.500 },
            { name: 'AirPods Pro', quantity: 1, price: 89.900 }
          ],
          shippingAddress: 'Block 5, Street 15, Salmiya, Hawalli',
          estimatedDelivery: '2-3 business days'
        });
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (!paymentVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderDetails?.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{orderDetails?.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Date:</span>
              <span className="font-medium">{orderDetails?.date.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-lg">{formatKWD(orderDetails?.amount || 0)}</span>
            </div>
          </div>

          {/* Items */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-3">Items Ordered:</h3>
            <div className="space-y-2">
              {orderDetails?.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatKWD(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Package className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Shipping Address</p>
                <p className="text-gray-600 text-sm">{orderDetails?.shippingAddress}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Truck className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Estimated Delivery</p>
                <p className="text-gray-600 text-sm">{orderDetails?.estimatedDelivery}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Order Status</p>
                <p className="text-green-600 text-sm">Confirmed & Processing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Order confirmation email sent
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Payment processed successfully
            </li>
            <li className="flex items-center">
              <Package className="h-4 w-4 text-blue-500 mr-2" />
              Order being prepared for shipment
            </li>
            <li className="flex items-center">
              <Truck className="h-4 w-4 text-gray-400 mr-2" />
              Tracking information will be sent via SMS
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
              <Download className="h-5 w-5" />
              <span>Download Receipt</span>
            </button>
            
            <Link
              to="/orders"
              className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-5 w-5" />
              <span>Track Order</span>
            </Link>
          </div>
          
          <Link
            to="/products"
            className="w-full flex items-center justify-center space-x-2 bg-secondary text-white py-3 px-6 rounded-lg hover:bg-secondary/90 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Support Information */}
        <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
          <div className="space-y-1 text-sm">
            <p>📞 Customer Service: +965 2XXX XXXX</p>
            <p>📧 Email: support@techstore.com.kw</p>
            <p>🕒 Available: Sunday - Thursday, 9 AM - 10 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;