import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  // Initialize analytics on mount
  useEffect(() => {
    // Initialize with placeholder GA4 ID - replace with actual ID in production
    analytics.initialize('GA_MEASUREMENT_ID');
  }, []);

  // Track page views
  useEffect(() => {
    const pageTitle = document.title;
    analytics.trackPageView(location.pathname, pageTitle);
  }, [location]);

  // Track user properties
  useEffect(() => {
    if (user) {
      const userType = isAdmin ? 'admin' : 'customer';
      analytics.setUserProperties(userType, user.id);
    } else {
      analytics.setUserProperties('guest');
    }
  }, [user, isAdmin]);

  return <>{children}</>;
};

export default AnalyticsProvider;
