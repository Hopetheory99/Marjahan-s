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
      <div ref={cardRef} className="group card-luxury luxury-glow magnetic-hover h-full gold-dust">
        <Link to={`/products/${product.id}`} className="block h-full">
          {/* Image Container */}
          <div className="img-zoom-container aspect-square bg-brand-cream relative overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              priority={false}
            />

            {/* Luxury overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Stock badge with luxury styling */}
            {product.stock <= 3 && product.stock > 0 && (
              <span className="absolute bottom-3 left-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] px-3 py-1.5 tracking-wider uppercase shadow-lg border border-red-500/30">
                Only {product.stock} left
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute bottom-3 left-3 bg-brand-charcoal/90 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 tracking-wider uppercase border border-white/20">
                Sold Out
              </span>
            )}

            {/* Add to Cart Button - appears on hover */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-liquid text-white text-xs px-4 py-2 rounded-full font-medium tracking-wide shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>

          {/* Product Info with luxury styling */}
          <div className="p-6 text-center velvet-texture">
            <h3 className="font-serif text-lg text-white group-hover:text-brand-gold transition-colors duration-500 leading-tight mb-2">
              {product.name}
            </h3>

            <div className="price-luxury mb-2">${product.price.toLocaleString()}</div>

            {/* Metal type with gold accent */}
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="gold-accent" />
              <p className="text-[11px] text-gray-300 tracking-wider uppercase font-medium">
                {product.metal}
              </p>
              <div className="gold-accent" />
            </div>

            {/* Luxury view details hint */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <span className="inline-block text-[11px] text-brand-gold tracking-wider uppercase border-b border-brand-gold/50 pb-0.5 hover:border-brand-gold transition-colors duration-300">
                Discover More →
              </span>
            </div>
          </div>
        </Link>

        {/* Enhanced Wishlist button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
          <div className="bg-white/95 backdrop-blur-md rounded-full p-2 shadow-luxury hover:shadow-gold transition-all duration-300 crystal-effect">
            <WishlistButton productId={product.id} productName={product.name} size="sm" />
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 floating-particles opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
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
