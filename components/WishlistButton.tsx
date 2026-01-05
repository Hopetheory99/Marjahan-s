import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const HeartIcon: React.FC<{ filled: boolean; className?: string }> = ({
  filled,
  className = 'h-6 w-6',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill={filled ? 'currentColor' : 'none'}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  productName = 'item',
  className = '',
  size = 'md',
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const [isAnimating, setIsAnimating] = React.useState(false);
  const isWishlisted = isInWishlist(productId);

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    toggleWishlist(productId);

    if (isWishlisted) {
      addToast(`Removed ${productName} from wishlist`, 'info');
    } else {
      addToast(`Added ${productName} to wishlist ❤️`, 'success');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-white/90
        backdrop-blur-sm
        shadow-md
        hover:shadow-lg
        transition-all
        duration-300
        hover:scale-110
        active:scale-95
        ${isAnimating ? 'animate-ping' : ''}
        ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}
        ${className}
      `}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <HeartIcon filled={isWishlisted} className={iconSizes[size]} />

      {/* Heartbeat effect for added items */}
      {isWishlisted && !isAnimating && (
        <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
      )}
    </button>
  );
};

export default WishlistButton;
