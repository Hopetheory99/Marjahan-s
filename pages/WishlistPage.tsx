import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { productService } from '../services/productService';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const WishlistPage: React.FC = () => {
  useDocumentTitle('My Wishlist');
  const { wishlistItems, wishlistCount } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistItems.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch all products and filter by wishlist IDs
        const response = await productService.getAll();
        const allProducts = response.data;
        const wishlistProducts = allProducts.filter((p) => wishlistItems.includes(p.id));
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistItems]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif text-center mb-12">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-80 w-full mb-4"></div>
              <div className="h-4 bg-gray-200 w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 w-1/4 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-serif">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlistCount === 0
              ? 'No items saved yet'
              : `${wishlistCount} item${wishlistCount > 1 ? 's' : ''} saved`}
          </p>
        </div>
        {wishlistCount > 0 && (
          <Link to="/products">
            <Button variant="secondary">Continue Shopping</Button>
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400"
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
          </div>
          <h2 className="text-2xl font-serif mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Browse our collection and save your favorite pieces!</p>
          <Link to="/products">
            <Button>Explore Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
