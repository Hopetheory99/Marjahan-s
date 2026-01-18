import { describe, it, expect } from 'vitest';
import { cartReducer } from '../cartReducer';
import { CartItem, Product } from '../../types';

// Mock Product
const mockProduct: Product = {
  id: 'p1',
  name: 'Diamond Ring',
  description: 'Shiny',
  price: 1000,
  images: ['img.jpg'],
  metal: 'Gold',
  category: 'Rings',
  stock: 10,
};

describe('cartReducer', () => {
  it('should add a new item to the cart', () => {
    const initialState: { items: CartItem[]; coupon: any } = { items: [], coupon: null };
    const action = {
      type: 'ADD_ITEM' as const,
      payload: { product: mockProduct, quantity: 1, size: '7' },
    };

    const newState = cartReducer(initialState, action);

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].id).toBe('p1-7');
    expect(newState.items[0].quantity).toBe(1);
  });

  it('should increment quantity if item with same ID/Size exists', () => {
    const initialState = {
      items: [
        {
          id: 'p1-7',
          name: 'Diamond Ring',
          price: 1000,
          image: 'img.jpg',
          quantity: 1,
          size: '7',
        },
      ],
      coupon: null,
    };

    const action = {
      type: 'ADD_ITEM' as const,
      payload: { product: mockProduct, quantity: 2, size: '7' },
    };

    const newState = cartReducer(initialState, action);

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].quantity).toBe(3); // 1 + 2
  });

  it('should treat different sizes as different items', () => {
    const initialState = {
      items: [
        {
          id: 'p1-7',
          name: 'Diamond Ring',
          price: 1000,
          image: 'img.jpg',
          quantity: 1,
          size: '7',
        },
      ],
      coupon: null,
    };

    const action = {
      type: 'ADD_ITEM' as const,
      payload: { product: mockProduct, quantity: 1, size: '8' },
    };

    const newState = cartReducer(initialState, action);

    expect(newState.items).toHaveLength(2);
    expect(newState.items[1].id).toBe('p1-8');
  });

  it('should remove an item', () => {
    const initialState = {
      items: [
        {
          id: 'p1-7',
          name: 'Diamond Ring',
          price: 1000,
          image: 'img.jpg',
          quantity: 1,
          size: '7',
        },
      ],
      coupon: null,
    };

    const action = { type: 'REMOVE_ITEM' as const, payload: { id: 'p1-7' } };
    const newState = cartReducer(initialState, action);
    expect(newState.items).toHaveLength(0);
  });

  it('should update quantity', () => {
    const initialState = {
      items: [
        {
          id: 'p1-7',
          name: 'Diamond Ring',
          price: 1000,
          image: 'img.jpg',
          quantity: 1,
          size: '7',
        },
      ],
      coupon: null,
    };

    const action = { type: 'UPDATE_QUANTITY' as const, payload: { id: 'p1-7', quantity: 5 } };
    const newState = cartReducer(initialState, action);
    expect(newState.items[0].quantity).toBe(5);
  });

  it('should remove item if quantity updated to 0', () => {
    const initialState = {
      items: [
        {
          id: 'p1-7',
          name: 'Diamond Ring',
          price: 1000,
          image: 'img.jpg',
          quantity: 1,
          size: '7',
        },
      ],
      coupon: null,
    };

    const action = { type: 'UPDATE_QUANTITY' as const, payload: { id: 'p1-7', quantity: 0 } };
    const newState = cartReducer(initialState, action);
    expect(newState.items).toHaveLength(0);
  });
});
