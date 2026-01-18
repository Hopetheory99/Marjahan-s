import { CartItem, Product, Coupon } from '../types';

export interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; size?: string } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON' };

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, size } = action.payload;
      const cartItemId = size ? `${product.id}-${size}` : product.id;
      const existingItem = state.items.find((item) => item.id === cartItemId);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item,
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: cartItemId,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity,
            size,
          },
        ],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        coupon: null,
      };

    case 'APPLY_COUPON':
      return {
        ...state,
        coupon: action.payload,
      };

    case 'REMOVE_COUPON':
      return {
        ...state,
        coupon: null,
      };

    default:
      return state;
  }
};
