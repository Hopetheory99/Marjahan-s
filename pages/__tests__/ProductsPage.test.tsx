
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductsPage from '../ProductsPage';
import { MemoryRouter } from 'react-router-dom';
import { productService } from '../../services/productService';

// Ambient declarations for testing globals
declare var jest: any;
declare var describe: any;
declare var it: any;
declare var expect: any;
declare var beforeEach: any;

// Mock the product service
jest.mock('../../services/productService');

const mockProducts = [
  { id: '1', name: 'Gold Ring', price: 100, metal: 'Gold', category: 'Rings', images: ['img.jpg'] },
  { id: '2', name: 'Silver Necklace', price: 200, metal: 'Silver', category: 'Necklaces', images: ['img.jpg'] }
];

describe('ProductsPage Integration', () => {
  beforeEach(() => {
    (productService.getAll as any).mockResolvedValue(mockProducts);
  });

  it('renders products after loading', async () => {
    render(
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>
    );

    // Initial loading state
    expect(document.querySelector('.animate-pulse')).toBeTruthy();

    // Wait for products
    await waitFor(() => {
      expect(screen.getByText('Gold Ring')).toBeTruthy();
      expect(screen.getByText('Silver Necklace')).toBeTruthy();
    });
  });

  it('filters products when categories are clicked', async () => {
    render(
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>
    );

    // Wait for initial load
    await waitFor(() => screen.getByText('Gold Ring'));

    // Mock filtered response
    (productService.getAll as any).mockResolvedValue([mockProducts[0]]);

    // Click "Rings" filter
    const ringsCheckbox = screen.getByLabelText('Rings');
    fireEvent.click(ringsCheckbox);

    // Expect service to be called with filter
    await waitFor(() => {
        expect(productService.getAll).toHaveBeenCalledWith(expect.objectContaining({
            categories: ['Rings']
        }));
    });
  });
});
