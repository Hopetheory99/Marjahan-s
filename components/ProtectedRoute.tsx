import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // TEMPORARY BYPASS: Allow admin access in local development for product syncing
  const isBypassEnabled = import.meta.env.DEV;

  if (loading && !isBypassEnabled) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user && !isBypassEnabled) {
    // Redirect them to the /login page, but save the current location if not in bypass mode
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
