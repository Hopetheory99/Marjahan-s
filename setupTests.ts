import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';

// Mock react-helmet-async
vi.mock('react-helmet-async', () => ({
  Helmet: vi.fn().mockImplementation(() => null),
  HelmetProvider: vi.fn().mockImplementation(({ children }) => children),
}));

// Mock the SEO component
vi.mock('../components/SEO', () => ({
  default: vi.fn().mockImplementation(() => null),
}));
import { cleanup } from '@testing-library/react';

// Run cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
    })),
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  })),
}));
