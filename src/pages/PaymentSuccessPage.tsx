import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming usage of react-router for state/query params

// Placeholder for Payment Success Page
// - Order confirmation with KWD pricing
// - Delivery information for Kuwait
// - Receipt download option
// - Customer support contact

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  // Example: const { orderId, amount, transactionId } = location.state || {};
  // In a real app, you'd fetch order details based on an ID from query params or state

  return (
    <div className="container mx-auto p-4 sm:p-8 text-center">
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg mb-2">Thank you for your order.</p>

        {/* TODO: Fetch and display actual order details */}
        <div className="my-6 p-4 bg-white rounded-md text-left">
          <h2 className="text-xl font-semibold mb-3">Order Summary (Placeholder)</h2>
          <p><strong>Order ID:</strong> #DUMMY_ORDER_123</p>
          <p><strong>Amount Paid:</strong> KWD 25.750</p>
          <p><strong>Transaction ID:</strong> knet_dummy_tx_12345</p>
        </div>

        <div className="my-6 p-4 bg-white rounded-md text-left">
          <h2 className="text-xl font-semibold mb-3">Delivery Information (Placeholder)</h2>
          <p><strong>Address:</strong> 123 Example St, Block 5, Salmiya, Hawalli, Kuwait</p>
          <p><strong>Estimated Delivery:</strong> Within 3-5 business days.</p>
        </div>

        {/* TODO: Implement receipt download functionality */}
        <button
          onClick={() => alert('Receipt download: To be implemented!')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded my-4"
        >
          Download Receipt (PDF)
        </button>

        <p className="text-md mt-6">
          If you have any questions, please contact our <Link to="/contact" className="text-blue-600 hover:underline">customer support</Link>.
        </p>
        <Link to="/" className="inline-block mt-8 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
