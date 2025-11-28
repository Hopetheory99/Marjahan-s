
import { CartItem, Product } from '../types';

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; size?: string } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

export const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, size } = action.payload;
      const cartItemId = size ? `${product.id}-${size}` : product.id;
      const existingItem = state.find(item => item.id === cartItemId);

      if (existingItem) {
        return state.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...state,
        {
          id: cartItemId,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity,
          size,
        },
      ];
    }

    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload.id);

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter(item => item.id !== id);
      }
      return state.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    }

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};
