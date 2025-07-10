import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderService } from '../services/orderService';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react'; // Icons

const KnetCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState<string>('Processing your KNET payment...');
  const [orderId, setOrderId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const processCallback = async () => {
      const queryParams = new URLSearchParams(location.search);
      const knetParams: { [key: string]: string } = {};
      queryParams.forEach((value, key) => {
        knetParams[key.toLowerCase()] = value; // KNET params are often case-insensitive or specific case
      });

      // Essential KNET parameters (these might vary based on actual KNET integration)
      // 'paymentid', 'result', 'tranid', 'auth', 'ref', 'trackid', 'udf1'-'udf5'
      // For this client-side step, we capture them all. The backend will know which ones are critical.

      if (!knetParams.paymentid && !knetParams.trackid) {
        setMessage('Invalid KNET callback: Missing payment identifiers.');
        setStatus('error');
        return;
      }

      // Store the orderId from UDF1 if available, for navigation purposes
      // The definitive orderId will come from the backend verification response
      if (knetParams.udf1) {
        setOrderId(knetParams.udf1);
      }

      try {
        // Send all params to backend for server-side verification
        const verificationResult = await OrderService.verifyKnetPayment(knetParams);

        setOrderId(verificationResult.orderId); // Update orderId from verified response

        if (verificationResult.success) {
          setStatus('success');
          setMessage(verificationResult.message || 'Payment successfully verified!');
          // Navigate to a generic success page, or a specific order success page if orderId is present
          setTimeout(() => navigate(verificationResult.orderId ? `/payment/success?orderId=${verificationResult.orderId}` : '/payment/success'), 3000);
        } else {
          setStatus('error');
          setMessage(verificationResult.message || 'Payment verification failed. Please contact support.');
          // Navigate to a generic error page, or a specific order error page
          setTimeout(() => navigate(verificationResult.orderId ? `/payment/error?orderId=${verificationResult.orderId}` : '/payment/error'), 5000);
        }
      } catch (err) {
        console.error("Error verifying KNET payment:", err);
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'An unexpected error occurred during payment verification.');
        setTimeout(() => navigate('/payment/error'), 5000);
      }
    };

    processCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        {status === 'processing' && (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Processing Payment</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-semibold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">{message}</p>
            {orderId && <p className="text-sm text-gray-500 mt-1">Order ID: {orderId}</p>}
            <p className="text-sm text-gray-500 mt-4">You will be redirected shortly...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-semibold text-red-600 mb-2">Payment Failed</h1>
            <p className="text-gray-700 bg-red-50 p-3 rounded-md">{message}</p>
            {orderId && <p className="text-sm text-gray-500 mt-1">Order ID: {orderId}</p>}
            <p className="text-sm text-gray-500 mt-4">You will be redirected shortly. Please contact support if the issue persists.</p>
          </>
        )}
      </div>
      <p className="mt-8 text-sm text-gray-500">
        LAKKI PHONES E-COMMERCE &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default KnetCallbackPage;
