
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const OrderConfirmationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20 text-center">
      <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 className="mt-6 text-4xl font-serif">Thank You For Your Order!</h1>
      <p className="mt-4 text-gray-600">Your order has been placed successfully. A confirmation email has been sent to you.</p>
      <div className="mt-10">
        <Link to="/products">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
