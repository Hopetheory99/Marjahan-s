
import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout, AdminLayout } from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading components for performance optimization (Code Splitting)
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-gold rounded-full animate-spin"></div>
  </div>
);

function App() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 2 } } });
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Suspense fallback={<PageLoader />}>
              <ToastContainer />
              <Routes>
                {/* Public / Shopper Routes */}
                <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
                <Route path="/products/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
                <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
                <Route path="/confirmation" element={<MainLayout><OrderConfirmationPage /></MainLayout>} />
                
                {/* Auth Route */}
                <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
                
                {/* Protected Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <AdminPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  } 
                />

                {/* 404 Catch-all */}
                <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
              </Routes>
            </Suspense>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
