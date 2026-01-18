import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductsPage from '../ProductsPage';
import { MemoryRouter } from 'react-router-dom';
import { productService } from '../../services/productService';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Product } from '../../types';
import { WishlistProvider } from '../../context/WishlistContext';
import { ToastProvider } from '../../context/ToastContext';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the product service
vi.mock('../../services/productService');

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Gold Ring',
    price: 100,
    metal: 'Gold',
    category: 'Rings',
    images: ['img.jpg'],
    stock: 10,
    description: 'Beautiful gold ring',
  },
  {
    id: '2',
    name: 'Silver Necklace',
    price: 200,
    metal: 'Silver',
    category: 'Necklaces',
    images: ['img.jpg'],
    stock: 5,
    description: 'Shiny silver necklace',
  },
];

describe('ProductsPage Integration', () => {
  beforeEach(() => {
    vi.mocked(productService.getAll).mockResolvedValue({
      data: mockProducts,
      count: mockProducts.length,
    });
  });

  const renderWithProviders = (component: React.ReactElement) => {
    const testQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });
    return render(
      <MemoryRouter>
        <QueryClientProvider client={testQueryClient}>
          <AuthProvider>
            <ToastProvider>
              <WishlistProvider>
                <CartProvider>{component}</CartProvider>
              </WishlistProvider>
            </ToastProvider>
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
  };

  it('renders products after loading', async () => {
    vi.mocked(productService.getAll).mockResolvedValue({
      data: mockProducts,
      count: mockProducts.length,
    });

    renderWithProviders(<ProductsPage />);

    // Wait for products to load and render
    await waitFor(() => {
      expect(screen.getByText('Gold Ring')).toBeTruthy();
      expect(screen.getByText('Silver Necklace')).toBeTruthy();
    });
  });

  it('filters products when categories are clicked', async () => {
    renderWithProviders(<ProductsPage />);

    await waitFor(() => screen.getByText('Gold Ring'));

    vi.mocked(productService.getAll).mockResolvedValue({ data: [mockProducts[0]], count: 1 });

    const ringsCheckbox = screen.getByLabelText('Rings');
    fireEvent.click(ringsCheckbox);

    await waitFor(
      () => {
        expect(productService.getAll).toHaveBeenCalledWith(
          expect.objectContaining({
            categories: ['Rings'],
          }),
        );
      },
      { timeout: 2000 },
    );
  });
});
