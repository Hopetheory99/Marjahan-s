import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '../ProductCard';
import { BrowserRouter } from 'react-router-dom';
import { Product } from '../../types';

const mockProduct: Product = {
  id: 'p1',
  name: 'Diamond Ring',
  description: 'Shiny',
  price: 1000,
  images: ['img.jpg'],
  metal: 'Gold',
  category: 'Rings',
  stock: 10
};

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Diamond Ring')).toBeInTheDocument();
    expect(screen.getByText(/\$1,000/)).toBeInTheDocument();
  });
});
