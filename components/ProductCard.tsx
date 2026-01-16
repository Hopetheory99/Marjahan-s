import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import Image from './Image';
import WishlistButton from './WishlistButton';
import FlyingCartAnimation from './FlyingCartAnimation';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface ProductCardProps {
  product: Product;
}

/* eslint-disable react/prop-types */
const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStartPos, setAnimationStartPos] = useState({ x: 0, y: 0 });
  const [animationEndPos, setAnimationEndPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      addToast('This item is currently out of stock', 'error');
      return;
    }

    // Get cart icon position for animation end point
    const cartIcon = document.querySelector('[data-cart-icon]');
    if (cartIcon && cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      setAnimationStartPos({
        x: cardRect.left + cardRect.width / 2,
        y: cardRect.top + cardRect.height / 2,
      });

      setAnimationEndPos({
        x: cartRect.left + cartRect.width / 2,
        y: cartRect.top + cartRect.height / 2,
      });

      setIsAnimating(true);
    }

    // Add to cart
    addToCart(product, 1);

    addToast(`${product.name} added to cart`, 'success');
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group h-full relative"
      >
        <Link to={`/products/${product.id}`} className="block h-full">
          <div className="bg-surface-2 rounded-3xl p-4 h-full border border-transparent group-hover:border-black/5 transition-colors overflow-hidden relative">
            {/* Image Container with organic shape mask optionally, or just rounded */}
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative mb-4 bg-surface-3">
              <Image
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                priority={false}
              />

              {/* Floating Action Button (Add to Cart) */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="bg-white/90 backdrop-blur-md text-brand-charcoal hover:bg-accent hover:text-white rounded-full p-3 shadow-lg transition-all"
                  aria-label="Add to cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </button>
              </div>

              {/* Wishlist Button (Top Right) */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/90 backdrop-blur-md rounded-full p-2 shadow-sm hover:shadow-md transition-shadow">
                  <WishlistButton productId={product.id} productName={product.name} size="sm" />
                </div>
              </div>

              {/* Stock Badge (Pill) */}
              {product.stock <= 3 && product.stock > 0 && (
                <span className="absolute top-3 left-3 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                  {product.stock} LEFT
                </span>
              )}
            </div>

            {/* Typography: Google Sans style */}
            <div className="space-y-1">
              <h3 className="font-sans font-medium text-lg text-brand-charcoal leading-tight">
                {product.name}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-brand-warm-gray font-medium uppercase tracking-wider">
                  {product.metal}
                </p>
                <span className="font-serif text-lg text-accent font-bold">
                  ${product.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Legacy Animation Support */}
      {isAnimating && (
        <FlyingCartAnimation
          productImage={product.images[0]}
          startPosition={animationStartPos}
          endPosition={animationEndPos}
          onComplete={handleAnimationComplete}
        />
      )}
    </>
  );
});
/* eslint-enable react/prop-types */

ProductCard.displayName = 'ProductCard';

export default ProductCard;
