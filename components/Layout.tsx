
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-brand-light text-brand-dark">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-brand-dark">
      {/* Simplified Admin Header */}
      <header className="bg-brand-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
            <span className="font-serif text-xl tracking-wider">MARJAHAN'S ADMIN</span>
            <a href="/" className="text-xs uppercase hover:text-brand-gold transition-colors">Back to Store</a>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-6 py-8">
        {children}
      </main>
      <footer className="bg-gray-200 text-center py-4 text-xs text-gray-500">
          Internal System - Authorized Personnel Only
      </footer>
    </div>
  );
};
