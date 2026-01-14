import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import Cart from './Cart';
import DarkModeToggle from './DarkModeToggle';

const ShoppingBagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const Header: React.FC = () => {
  const { openCart, cartCount } = useCart();
  const { user, isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';

  // Handle keyboard navigation for mobile menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-gold text-white px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled || !isHome
            ? 'bg-black/80 backdrop-blur-md shadow-luxury py-3 border-b border-white/10'
            : 'bg-transparent py-5'
          }`}
        role="banner"
      >
        <div className="container-luxury flex justify-between items-center">
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onKeyDown={handleKeyDown}
              className={`p-2 transition-colors duration-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-gold ${isScrolled || !isHome
                  ? 'text-brand-charcoal hover:text-brand-burgundy'
                  : 'text-white hover:text-brand-gold'
                }`}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center space-x-12">
            <Link
              to="/"
              className={`font-display text-xl md:text-2xl tracking-luxury transition-all duration-300 ${isScrolled || !isHome ? 'text-brand-burgundy' : 'text-white'
                }`}
            >
              MARJAHAN'S
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Rings', 'Necklaces', 'Bracelets', 'Earrings'].map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${category}`}
                  className={`nav-link-luxury link-underline ${isScrolled || !isHome ? 'text-brand-charcoal' : 'text-white/90'
                    }`}
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`hidden sm:block text-xs tracking-wider uppercase transition-colors duration-300 ${isScrolled || !isHome
                        ? 'text-brand-charcoal hover:text-brand-burgundy'
                        : 'text-white/90 hover:text-brand-gold'
                      }`}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`hidden sm:block text-xs tracking-wider uppercase transition-colors duration-300 ${isScrolled || !isHome
                      ? 'text-brand-charcoal hover:text-brand-burgundy'
                      : 'text-white/90 hover:text-brand-gold'
                    }`}
                >
                  Account
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className={`hidden sm:block text-xs tracking-wider uppercase transition-colors duration-300 ${isScrolled || !isHome
                    ? 'text-brand-charcoal hover:text-brand-burgundy'
                    : 'text-white/90 hover:text-brand-gold'
                  }`}
              >
                Login
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <div className="hidden sm:block">
              <DarkModeToggle />
            </div>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className={`relative p-2 transition-colors duration-300 hidden sm:block ${isScrolled || !isHome
                  ? 'text-brand-charcoal hover:text-brand-burgundy'
                  : 'text-white hover:text-brand-gold'
                }`}
              aria-label="View Wishlist"
            >
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-burgundy text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <button
              data-cart-icon
              onClick={openCart}
              className={`relative p-2 transition-colors duration-300 ${isScrolled || !isHome
                  ? 'text-brand-charcoal hover:text-brand-burgundy'
                  : 'text-white hover:text-brand-gold'
                }`}
              aria-label="Open Shopping Cart"
            >
              <ShoppingBagIcon />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-gold text-brand-charcoal text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden absolute top-full left-0 w-full bg-brand-ivory border-t border-brand-cream shadow-luxury animate-slide-in-down origin-top z-30"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col p-8 space-y-5">
              {['Rings', 'Necklaces', 'Bracelets', 'Earrings'].map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${category}`}
                  className="text-brand-charcoal hover:text-brand-burgundy focus:text-brand-burgundy transition-colors text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-inset px-2 py-1 rounded"
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  {category}
                </Link>
              ))}
              <div className="divider-gold my-4" aria-hidden="true"></div>
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-brand-charcoal hover:text-brand-burgundy focus:text-brand-burgundy transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-inset px-2 py-1 rounded"
                      tabIndex={isMobileMenuOpen ? 0 : -1}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="text-brand-charcoal hover:text-brand-burgundy focus:text-brand-burgundy transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-inset px-2 py-1 rounded"
                    tabIndex={isMobileMenuOpen ? 0 : -1}
                  >
                    My Account
                  </Link>
                  <Link
                    to="/wishlist"
                    className="text-brand-charcoal hover:text-brand-burgundy focus:text-brand-burgundy transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-inset px-2 py-1 rounded"
                    tabIndex={isMobileMenuOpen ? 0 : -1}
                  >
                    Wishlist ({wishlistCount})
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-brand-charcoal hover:text-brand-burgundy focus:text-brand-burgundy transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-inset px-2 py-1 rounded"
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
      <Cart />
    </>
  );
};

export default Header;
