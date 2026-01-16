import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductsPage from '../ProductsPage';
import { MemoryRouter } from 'react-router-dom';
import { productService } from '../../services/productService';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Product } from '../../types';
import { WishlistProvider } from '../../context/WishlistContext';
import { ToastProvider } from '../../context/ToastContext';
import { AuthProvider } from '../../context/AuthContext';

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
    return render(
      <MemoryRouter>
        <AuthProvider>
          <ToastProvider>
            <WishlistProvider>{component}</WishlistProvider>
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>,
    );
  };

  it('renders products after loading', async () => {
    renderWithProviders(<ProductsPage />);

    // Initial loading state
    expect(document.querySelector('.animate-pulse')).toBeTruthy();

    // Advance timers for the initial load if any, or just wait for mock resolve
    await waitFor(() => {
      expect(screen.getByText('Gold Ring')).toBeTruthy();
      expect(screen.getByText('Silver Necklace')).toBeTruthy();
    });
  });

  it('filters products when categories are clicked', async () => {
    renderWithProviders(<ProductsPage />);

    // Wait for initial load
    await waitFor(() => screen.getByText('Gold Ring'));

    // Mock filtered response for subsequent calls
    vi.mocked(productService.getAll).mockResolvedValue({ data: [mockProducts[0]], count: 1 });

    // Click "Rings" filter
    const ringsCheckbox = screen.getByLabelText('Rings');
    fireEvent.click(ringsCheckbox);

    // Expect service to be called with filter. waitFor will retry until 300ms debounce passes.
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
