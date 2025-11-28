
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-9xl font-serif text-brand-gold opacity-20 select-none">404</h1>
      <h2 className="text-4xl font-serif -mt-12 mb-6 text-brand-dark relative z-10">Page Not Found</h2>
      <p className="text-gray-600 mb-10 max-w-md mx-auto">
        The piece you are looking for seems to be missing from our collection. It might have been moved or no longer exists.
      </p>
      <Link to="/">
        <Button>Return to Homepage</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
