import React, { useState } from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { knetService, KNETPaymentRequest } from '../../utils/knet';
import { formatKWD } from '../../utils/currency';

interface KNETPaymentButtonProps {
  amount: number;
  orderId: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

const KNETPaymentButton: React.FC<KNETPaymentButtonProps> = ({
  amount,
  orderId,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
  disabled = false,
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleKNETPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const paymentRequest: KNETPaymentRequest = {
        amount,
        orderId,
        customerEmail,
        customerPhone,
        description: `LAKKI PHONES Order #${orderId}`
      };

      // Validate amount before processing
      if (amount <= 0) {
        throw new Error('Invalid payment amount');
      }
      
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      const paymentUrl = knetService.generatePaymentUrl(paymentRequest);
      
      // Redirect to KNET payment gateway
      window.location.href = paymentUrl;
      
    } catch (error) {
      setPaymentStatus('error');
      setIsProcessing(false);
      onError?.(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  const getButtonContent = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing Payment...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="h-5 w-5" />
            <span>Payment Successful</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-5 w-5" />
            <span>Payment Failed</span>
          </>
        );
      default:
        return (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Pay with KNET</span>
            <span className="font-bold">{formatKWD(amount)}</span>
          </>
        );
    }
  };

  const getButtonClass = () => {
    const baseClass = `w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${className}`;
    
    switch (paymentStatus) {
      case 'processing':
        return `${baseClass} bg-blue-500 text-white cursor-not-allowed`;
      case 'success':
        return `${baseClass} bg-green-500 text-white cursor-not-allowed`;
      case 'error':
        return `${baseClass} bg-red-500 text-white hover:bg-red-600`;
      default:
        return `${baseClass} bg-primary text-white hover:bg-primary/90 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleKNETPayment}
        disabled={disabled || isProcessing || paymentStatus === 'success'}
        className={getButtonClass()}
      >
        {getButtonContent()}
      </button>

      {/* KNET Security Information */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <Shield className="h-4 w-4 text-green-500" />
        <span>Secured by KNET - Kuwait's trusted payment gateway</span>
      </div>

      {/* Payment Methods Accepted */}
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-2">Accepted Payment Methods:</p>
        <div className="flex justify-center space-x-4">
          <div className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">KNET</div>
          <div className="bg-blue-800 text-white px-3 py-1 rounded text-xs font-bold">VISA</div>
          <div className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">MASTERCARD</div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="text-xs text-gray-500 text-center">
        By proceeding with payment, you agree to our{' '}
        <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a>
        {' '}and{' '}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
      </div>
    </div>
  );
};

export default KNETPaymentButton;