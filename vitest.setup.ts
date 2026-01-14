import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';

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

export const createWrapper = () => {
    const testQueryClient = createTestQueryClient();
    return ({ children }: { children: ReactElement }) => (
        <QueryClientProvider client= { testQueryClient } > { children } </QueryClientProvider>
  );
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
        },
    })),
}));
