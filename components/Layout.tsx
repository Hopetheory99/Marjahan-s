import React from 'react';
import Header from './Header';
import Footer from './Footer';
import StarryBackground from './StarryBackground';

interface LayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-transparent text-white">
      <Header />
      <div className="relative z-10">
        <main id="main-content" className="flex-grow min-h-screen" role="main" tabIndex={-1}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-black/40 text-white backdrop-blur-sm">
      {/* Simplified Admin Header */}
      <header className="bg-black/80 text-white p-4 shadow-md border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <span className="font-serif text-xl tracking-wider">MARJAHAN'S ADMIN</span>
          <a href="/" className="text-xs uppercase hover:text-brand-gold transition-colors">
            Back to Store
          </a>
        </div>
      </header>
      <div className="relative z-10 flex-grow">
        <main className="container mx-auto px-6 py-8">{children}</main>
      </div>
      <footer className="bg-black/80 text-center py-4 text-xs text-gray-500 border-t border-white/10 relative z-10">
        Internal System - Authorized Personnel Only
      </footer>
    </div>
  );
};
