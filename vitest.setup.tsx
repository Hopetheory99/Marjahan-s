import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Test wrapper for components that use React Query
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
        staleTime: Infinity, // Prevent refetching during tests
      },
    },
  });

export const TestingProvider = ({ children }: { children: ReactNode }) => {
  const testQueryClient = createTestQueryClient();
  return (
    <MemoryRouter>
      <QueryClientProvider client={testQueryClient}>
        <AuthProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>{children}</CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

export const createWrapper = () => {
  const TestWrapper = ({ children }: { children: ReactElement }) => (
    <TestingProvider>{children}</TestingProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

// Run cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock react-helmet-async
vi.mock('react-helmet-async', () => ({
  Helmet: vi.fn().mockImplementation(() => null),
  HelmetProvider: vi.fn().mockImplementation(({ children }) => children),
}));

// Mock the SEO component
vi.mock('./components/SEO', () => ({
  default: vi.fn().mockImplementation(() => null),
}));

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
    })),
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signInWithPassword: vi.fn(() =>
        Promise.resolve({ data: { session: null, user: null }, error: null }),
      ),
      signOut: vi.fn(() => Promise.resolve({})),
      signInWithOtp: vi.fn(() =>
        Promise.resolve({ data: { session: null, user: null }, error: null }),
      ),
      signUp: vi.fn(() => Promise.resolve({ data: { session: null, user: null }, error: null })),
    },
  })),
}));
// Mock IntersectionObserver
class IntersectionObserverMock {
  root = null;
  rootMargin = '';
  thresholds = [];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn();
  unobserve = vi.fn();
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock window.scrollTo
vi.stubGlobal('scrollTo', vi.fn());
