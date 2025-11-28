
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Header: React.FC = () => {
    const { openCart, cartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu when route changes
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            className="text-brand-dark hover:text-brand-gold focus:outline-none p-2"
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-brand-dark tracking-wider hover:opacity-80 transition-opacity">
                            MARJAHAN'S
                        </Link>
                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center space-x-6 font-sans text-sm tracking-widest uppercase">
                            <Link to="/products?category=Rings" className="hover:text-brand-gold transition-colors duration-300 link-underline">Rings</Link>
                            <Link to="/products?category=Necklaces" className="hover:text-brand-gold transition-colors duration-300 link-underline">Necklaces</Link>
                            <Link to="/products?category=Bracelets" className="hover:text-brand-gold transition-colors duration-300 link-underline">Bracelets</Link>
                            <Link to="/products?category=Earrings" className="hover:text-brand-gold transition-colors duration-300 link-underline">Earrings</Link>
                        </nav>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                         <Link to="/admin" className="hidden sm:block text-sm font-medium hover:text-brand-gold transition-colors">
                            Admin
                         </Link>
                        <button 
                            onClick={openCart} 
                            className="relative group p-2 hover:text-brand-gold transition-colors duration-300"
                            aria-label="Open Shopping Cart"
                        >
                            <ShoppingBagIcon />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg animate-slide-in-down origin-top z-30">
                        <nav className="flex flex-col p-6 space-y-4 font-sans text-sm tracking-widest uppercase">
                            <Link to="/products?category=Rings" className="hover:text-brand-gold transition-colors">Rings</Link>
                            <Link to="/products?category=Necklaces" className="hover:text-brand-gold transition-colors">Necklaces</Link>
                            <Link to="/products?category=Bracelets" className="hover:text-brand-gold transition-colors">Bracelets</Link>
                            <Link to="/products?category=Earrings" className="hover:text-brand-gold transition-colors">Earrings</Link>
                            <div className="h-px bg-gray-100 my-2"></div>
                            <Link to="/admin" className="hover:text-brand-gold transition-colors normal-case tracking-normal">Admin Panel</Link>
                        </nav>
                    </div>
                )}
            </header>
            <Cart />
        </>
    );
};

export default Header;
