import React, { useState, useRef } from 'react';
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
      <div ref={cardRef} className="group card h-full">
        <Link to={`/products/${product.id}`} className="block h-full">
          {/* Image Container */}
          <div className="aspect-square bg-gray-900 relative overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full img-zoom"
              imgClassName="w-full h-full object-cover"
              priority={false}
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Stock badges */}
            {product.stock <= 3 && product.stock > 0 && (
              <span className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-2 py-1 tracking-wide uppercase">
                Only {product.stock} left
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute bottom-3 left-3 bg-gray-800 text-white text-xs px-2 py-1 tracking-wide uppercase">
                Sold Out
              </span>
            )}

            {/* Add to Cart Button */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-brand-burgundy text-white text-xs px-3 py-2 rounded hover:bg-brand-burgundy-light transition-colors disabled:opacity-50"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 text-center">
            <h3 className="font-serif text-lg text-white group-hover:text-brand-gold transition-colors duration-300 leading-tight mb-2">
              {product.name}
            </h3>

            <div className="text-brand-gold font-serif text-xl mb-2">
              ${product.price.toLocaleString()}
            </div>

            {/* Metal type */}
            <p className="text-xs text-gray-400 tracking-wider uppercase mb-3">{product.metal}</p>

            {/* View details link */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="inline-block text-xs text-brand-gold tracking-wider uppercase border-b border-brand-gold/50 pb-0.5 hover:border-brand-gold">
                Discover More →
              </span>
            </div>
          </div>
        </Link>

        {/* Wishlist button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/90 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
            <WishlistButton productId={product.id} productName={product.name} size="sm" />
          </div>
        </div>
      </div>

      {/* Flying Cart Animation */}
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

export default ProductCard;
