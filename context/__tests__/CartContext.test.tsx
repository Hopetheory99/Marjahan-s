import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CartProvider, useCart } from '../CartContext';
import { Product } from '../../types';

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

const TestComponent = () => {
    const { cartItems, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart } = useCart();

    return (
        <div>
            <div data-testid="cart-count">{cartCount}</div>
            <div data-testid="cart-total">{cartTotal}</div>
            <ul>
                {cartItems.map(item => (
                    <li key={item.id} data-testid={`cart-item-${item.id}`}>
                        {item.name} - {item.quantity} - {item.size}
                        <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>Inc</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => addToCart(mockProduct, 1, '7')}>Add Ring Size 7</button>
            <button onClick={() => addToCart(mockProduct, 2, '8')}>Add Ring Size 8</button>
            <button onClick={() => clearCart()}>Clear Cart</button>
        </div>
    );
};

describe('CartContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('provides initial empty state', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );
        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
        expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
    });

    it('adds items correctly', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Add Ring Size 7'));

        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
        expect(screen.getByTestId('cart-total')).toHaveTextContent('1000');
        expect(screen.getByTestId('cart-item-p1-7')).toHaveTextContent('Diamond Ring - 1 - 7');
    });

    it('handles distinct sizes as separate items', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Add Ring Size 7'));
        fireEvent.click(screen.getByText('Add Ring Size 8'));

        // Count is total items: 1 + 2 = 3
        expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
        // Total is 1000*1 + 1000*2 = 3000
        expect(screen.getByTestId('cart-total')).toHaveTextContent('3000');
    });

    it('updates quantity', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Add Ring Size 7'));
        const incBtn = screen.getByText('Inc');
        fireEvent.click(incBtn);

        expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
        expect(screen.getByTestId('cart-total')).toHaveTextContent('2000');
    });

    it('removes items', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Add Ring Size 7'));
        const removeBtn = screen.getByText('Remove');
        fireEvent.click(removeBtn);

        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });

    it('clears cart', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Add Ring Size 7'));
        fireEvent.click(screen.getByText('Clear Cart'));

        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });

    it('persists to localStorage', () => {
        const { unmount } = render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Add Ring Size 7'));

        // Verify it's in localStorage
        // The key is 'marjahans_cart' from CartContext.tsx
        const stored = JSON.parse(localStorage.getItem('marjahans_cart') || '[]');
        expect(stored).toHaveLength(1);
        expect(stored[0].id).toBe('p1-7');

        unmount();

        // Re-render to check rehydration
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
        expect(screen.getByTestId('cart-item-p1-7')).toBeInTheDocument();
    });
});
