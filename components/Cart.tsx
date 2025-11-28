
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from './Button';

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Cart: React.FC = () => {
    const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const cartRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (isCartOpen && e.key === 'Escape') {
                closeCart();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isCartOpen, closeCart]);

    if (!isCartOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
        >
            {/* Backdrop with Fade In */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in transition-opacity" 
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Cart Drawer with Slide In */}
            <div
                ref={cartRef}
                className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right transform transition-transform"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 id="cart-title" className="text-2xl font-serif font-semibold text-brand-dark">Shopping Bag</h2>
                    <button 
                        onClick={closeCart} 
                        className="text-gray-400 hover:text-brand-dark transition-colors p-2 rounded-full hover:bg-gray-100"
                        aria-label="Close cart"
                    >
                        <XIcon />
                    </button>
                </div>
                
                {cartItems.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-sans text-lg">Your cart is empty.</p>
                        <p className="text-gray-400 text-sm mt-2 mb-8">Looks like you haven't added anything yet.</p>
                        <Button variant="secondary" onClick={closeCart}>Start Shopping</Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-start space-x-4 animate-fade-in">
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-serif text-lg leading-tight">{item.name}</h3>
                                            <button 
                                                onClick={() => removeFromCart(item.id)} 
                                                className="text-gray-400 hover:text-red-500 transition-colors -mt-1 -mr-2 p-2"
                                                aria-label={`Remove ${item.name} from cart`}
                                            >
                                                <XIcon />
                                            </button>
                                        </div>
                                        {item.size && <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Size: {item.size}</p>}
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center border border-gray-300 rounded">
                                                <button 
                                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    aria-label="Decrease quantity"
                                                >-</button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button 
                                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                >+</button>
                                            </div>
                                            <p className="font-medium text-brand-dark">${(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <div className="flex justify-between font-serif text-xl mb-6 text-brand-dark">
                                <span>Subtotal</span>
                                <span>${cartTotal.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-6 text-center">Shipping and taxes calculated at checkout.</p>
                            <Link to="/checkout" onClick={closeCart}>
                                <Button fullWidth className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
