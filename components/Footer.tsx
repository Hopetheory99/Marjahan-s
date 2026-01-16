import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-charcoal text-white font-sans">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-luxury py-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-section-subtitle mb-3">Stay Connected</p>
            <h2 className="text-section-title mb-6">Join the Marjahan's Family</h2>
            <p className="text-body mb-8">
              Subscribe to receive exclusive offers, first access to new collections, and curated
              jewelry inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/5 text-white px-5 py-3 border border-white/20 rounded-sm placeholder-white/40 focus:outline-none focus:border-brand-gold transition-colors duration-300"
              />
              <button
                type="submit"
                className="bg-brand-gold text-brand-charcoal px-8 py-3 font-medium tracking-wider uppercase text-sm hover:bg-brand-gold-light transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-display text-brand-gold mb-4">MARJAHAN'S</h3>
            <p className="text-body text-gray-400">
              Where luxury meets elegance. Discover handcrafted jewelry that celebrates life's
              precious moments.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              {['instagram', 'facebook', 'pinterest'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-brand-gold hover:border-brand-gold transition-all duration-300"
                >
                  <span className="sr-only">{social}</span>
                  {social === 'instagram' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  )}
                  {social === 'facebook' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  {social === 'pinterest' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-body font-medium text-white mb-6">Collections</h4>
            <ul className="space-y-3">
              {['All Jewelry', 'Rings', 'Necklaces', 'Bracelets', 'Earrings'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'All Jewelry' ? '/products' : `/products?category=${item}`}
                    className="text-body text-gray-400 hover:text-brand-gold transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-body font-medium text-white mb-6">Information</h4>
            <ul className="space-y-3">
              {[
                'Our Story',
                'Contact Us',
                'Shipping & Returns',
                'Size Guide',
                'Care Instructions',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-body text-gray-400 hover:text-brand-gold transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-body font-medium text-white mb-6">Contact</h4>
            <div className="space-y-4 text-body text-gray-400">
              <p>
                <span className="block text-white mb-1 font-medium">Email</span>
                hello@marjahans.com
              </p>
              <p>
                <span className="block text-white mb-1 font-medium">Phone</span>
                +880 1700-000000
              </p>
              <p>
                <span className="block text-white mb-1 font-medium">Location</span>
                Dhaka, Bangladesh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-luxury py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Marjahan's. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-brand-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-brand-gold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
