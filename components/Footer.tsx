
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-brand-light font-sans">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-semibold tracking-wider mb-4">MARJAHAN'S</h3>
            <p className="text-sm text-gray-400">Where luxury meets affordability.</p>
          </div>
          <div>
            <h4 className="font-semibold tracking-widest uppercase mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-brand-gold transition-colors">All Collections</Link></li>
              <li><Link to="/products?category=Rings" className="hover:text-brand-gold transition-colors">Rings</Link></li>
              <li><Link to="/products?category=Necklaces" className="hover:text-brand-gold transition-colors">Necklaces</Link></li>
              <li><Link to="/products?category=Bracelets" className="hover:text-brand-gold transition-colors">Bracelets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold tracking-widest uppercase mb-4">About Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-gold transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold tracking-widest uppercase mb-4">Join Our Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Receive exclusive offers and first look at new collections.</p>
            <form>
              <div className="flex">
                <input type="email" placeholder="Your Email" className="w-full bg-gray-800 text-white px-4 py-2 border border-gray-600 focus:outline-none focus:border-brand-gold transition-colors"/>
                <button type="submit" className="bg-brand-gold text-brand-dark px-4 py-2 font-semibold hover:bg-yellow-500 transition-colors">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Marjahan's. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
