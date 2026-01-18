import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import { CartItem, Product, Coupon } from '../types';
import { cartReducer, CartState } from './cartReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabase } from '../services/supabaseClient';
import { toast } from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  coupon: Coupon | null;
  addToCart: (product: Product, quantity: number, size?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartCount: number;
  cartTotal: number;
  discountAmount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use local storage hook to manage the persistence of the cart
  // V2 key to handle new state shape
  const [savedCart, setSavedCart] = useLocalStorage<CartState>('marjahans_cart_v2', {
    items: [],
    coupon: null,
  });

  // Initialize reducer with saved cart
  const [state, dispatch] = useReducer(cartReducer, savedCart);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync reducer state back to local storage whenever it changes
  useEffect(() => {
    setSavedCart(state);
  }, [state, setSavedCart]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback((product: Product, quantity: number, size?: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, size } });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: itemId } });
  }, []);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const cartCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items],
  );

  const cartTotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items],
  );

  const applyCoupon = useCallback(
    async (code: string) => {
      try {
        const { data, error } = await supabase.rpc('verify_coupon', {
          code_input: code,
          cart_total: cartTotal,
        });

        if (error) throw error;

        // Valid response: { valid: true, code: '...', ... } or { valid: false, error: '...' }
        if (!data.valid) {
          toast.error(data.error || 'Invalid coupon');
          return false;
        }

        const coupon: Coupon = {
          id: data.id,
          code: data.code,
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          min_order_value: data.min_order_value,
          max_discount_amount: data.max_discount_amount,
          is_active: data.is_active,
          expires_at: data.expires_at,
          usage_limit: data.usage_limit,
          times_used: data.times_used,
          created_at: data.created_at,
        };

        dispatch({ type: 'APPLY_COUPON', payload: coupon });
        toast.success(`Coupon ${code} applied!`);
        return true;
      } catch (err: any) {
        console.error('Coupon error:', err);
        toast.error(err.message || 'Failed to apply coupon');
        return false;
      }
    },
    [cartTotal],
  );

  const removeCoupon = useCallback(() => {
    dispatch({ type: 'REMOVE_COUPON' });
    toast.success('Coupon removed');
  }, []);

  const discountAmount = useMemo(() => {
    if (!state.coupon) return 0;
    if (state.coupon.discount_type === 'fixed') {
      return Math.min(state.coupon.discount_value, cartTotal);
    }
    return (cartTotal * state.coupon.discount_value) / 100;
  }, [cartTotal, state.coupon]);

  const finalTotal = useMemo(() => {
    return Math.max(0, cartTotal - discountAmount);
  }, [cartTotal, discountAmount]);

  // Memoize the context value to prevent unnecessary re-renders in consumers
  const value = useMemo(
    () => ({
      cartItems: state.items,
      coupon: state.coupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      isCartOpen,
      openCart,
      closeCart,
      cartCount,
      cartTotal,
      discountAmount,
      finalTotal,
    }),
    [
      state.items,
      state.coupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      isCartOpen,
      openCart,
      closeCart,
      cartCount,
      cartTotal,
      discountAmount,
      finalTotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
