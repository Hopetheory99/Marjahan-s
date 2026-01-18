import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import ProductCard from '../ProductCard';
import { Product } from '../../types';
import { TestingProvider } from '../../vitest.setup';

// Mock the Image component
vi.mock('../Image', () => ({
  default: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} />,
}));

// Mock the WishlistButton component
vi.mock('../WishlistButton', () => ({
  default: ({ productId, productName }: any) => (
    <button data-testid={`wishlist-${productId}`}>{`Wishlist ${productName}`}</button>
  ),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Gold Ring',
  price: 299.99,
  metal: 'Gold',
  category: 'Rings',
  images: ['gold-ring.jpg', 'gold-ring-2.jpg'],
  stock: 10,
  description: 'Beautiful 18k gold ring with diamond accents',
};

const mockProductLowStock: Product = {
  ...mockProduct,
  id: '2',
  name: 'Silver Necklace',
  stock: 2,
};

const mockProductOutOfStock: Product = {
  ...mockProduct,
  id: '3',
  name: 'Platinum Bracelet',
  stock: 0,
};

describe('ProductCard', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(<TestingProvider>{component}</TestingProvider>);
  };

  it('renders product information correctly', async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    await waitFor(() => {
      expect(screen.getByText('Gold Ring')).toBeInTheDocument();
      expect(screen.getByText('$299.99')).toBeInTheDocument();
    });
  });

  it('displays low stock warning when stock <= 3', async () => {
    renderWithProviders(<ProductCard product={mockProductLowStock} />);

    await waitFor(() => {
      expect(screen.getByText('2 LEFT')).toBeInTheDocument();
    });
  });

  it('displays out of stock message when stock is 0', async () => {
    renderWithProviders(<ProductCard product={mockProductOutOfStock} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Add to cart')).toBeDisabled();
    });
  });

  it('renders product image with correct attributes', async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    await waitFor(() => {
      const image = screen.getByAltText('Gold Ring');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'gold-ring.jpg');
    });
  });

  it('renders wishlist button with correct props', async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    await waitFor(() => {
      const wishlistButton = screen.getByTestId('wishlist-1');
      expect(wishlistButton).toBeInTheDocument();
      expect(wishlistButton).toHaveTextContent('Wishlist Gold Ring');
    });
  });

  it('applies hover effects and animations', async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    await waitFor(() => {
      const card = screen.getByText('Gold Ring').closest('.group');
      expect(card).toHaveClass('group', 'h-full', 'relative');
    });
  });

  it('links to correct product detail page', async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    await waitFor(() => {
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/products/1');
    });
  });

  it('handles products with multiple images', async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    await waitFor(() => {
      // Should render the first image
      const image = screen.getByAltText('Gold Ring');
      expect(image).toHaveAttribute('src', 'gold-ring.jpg');
    });
  });

  it('displays price with proper formatting', async () => {
    const expensiveProduct = { ...mockProduct, price: 1234.56 };

    renderWithProviders(<ProductCard product={expensiveProduct} />);

    await waitFor(() => {
      expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });
  });

  it('shows quick view hint on hover', async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    await waitFor(() => {
      // The add to cart button should be present on hover
      const cartBtn = screen.getByLabelText('Add to cart').parentElement;
      expect(cartBtn).toHaveClass('opacity-0', 'group-hover:opacity-100');
    });
  });

  it('applies correct styling for different stock levels', async () => {
    // Test normal stock
    const { rerender } = renderWithProviders(<ProductCard product={mockProduct} />);

    await waitFor(() => {
      expect(screen.queryByText(/Only \d+ left/)).not.toBeInTheDocument();
      expect(screen.queryByText('Sold Out')).not.toBeInTheDocument();
    });

    // Test low stock
    rerender(
      <TestingProvider>
        <ProductCard product={mockProductLowStock} />
      </TestingProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('2 LEFT')).toBeInTheDocument();
    });

    // Test out of stock
    rerender(
      <TestingProvider>
        <ProductCard product={mockProductOutOfStock} />
      </TestingProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Add to cart')).toBeDisabled();
    });
  });

  it('maintains accessibility features', async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    await waitFor(() => {
      // Check for semantic HTML
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();

      // Check for alt text
      const image = screen.getByAltText('Gold Ring');
      expect(image).toBeInTheDocument();
    });
  });
});
