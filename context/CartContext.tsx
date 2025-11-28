import React, { createContext, useContext, useState, ReactNode, useEffect, useReducer, useMemo, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { cartReducer } from './cartReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use local storage hook to manage the persistence of the cartItems
  const [savedCart, setSavedCart] = useLocalStorage<CartItem[]>('marjahans_cart', []);
  
  // Initialize reducer with saved cart
  const [cartItems, dispatch] = useReducer(cartReducer, savedCart);
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync reducer state back to local storage whenever it changes
  useEffect(() => {
    setSavedCart(cartItems);
  }, [cartItems, setSavedCart]);

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
  
  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  // Memoize the context value to prevent unnecessary re-renders in consumers
  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    cartCount,
    cartTotal
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, openCart, closeCart, cartCount, cartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};