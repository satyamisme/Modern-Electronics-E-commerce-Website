import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming usage of react-router for state/query params

// Placeholder for Payment Error Page
// - Comprehensive error handling
// - Troubleshooting tips
// - Alternative payment methods
// - Customer support integration

const PaymentErrorPage: React.FC = () => {
  const location = useLocation();
  // Example: const { errorCode, errorMessage } = location.state || {};
  // In a real app, you'd get error details from query params or state

  return (
    <div className="container mx-auto p-4 sm:p-8 text-center">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-lg mb-2">
          Unfortunately, we were unable to process your payment.
        </p>

        {/* TODO: Display specific error message if available */}
        <div className="my-6 p-4 bg-white rounded-md text-left">
          <h2 className="text-xl font-semibold mb-3">Error Details (Placeholder)</h2>
          <p><strong>Error Code:</strong> KNET_ERROR_005</p>
          <p><strong>Message:</strong> Insufficient funds or transaction declined by the bank.</p>
        </div>

        <div className="my-6 p-4 bg-white rounded-md text-left">
          <h2 className="text-xl font-semibold mb-3">Troubleshooting Tips</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Please check if your card details are correct.</li>
            <li>Ensure you have sufficient funds in your account.</li>
            <li>Try using a different payment card or method.</li>
            <li>Contact your bank for more information if the issue persists.</li>
          </ul>
        </div>

        {/* TODO: Link to actual alternative payment methods or cart */}
        <Link
          to="/cart" // Or checkout page to try again
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded my-4 inline-block mr-3"
        >
          Try Again
        </Link>
        <Link
          to="/contact"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded my-4 inline-block"
        >
          Contact Support
        </Link>

        <p className="text-md mt-6">
          We apologize for any inconvenience. Please <Link to="/contact" className="text-blue-600 hover:underline">contact customer support</Link> if you need further assistance.
        </p>
        <Link to="/" className="inline-block mt-8 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default PaymentErrorPage;
