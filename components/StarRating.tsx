import React from 'react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!interactive) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(index);
    }

    // Allow arrow key navigation
    if (e.key === 'ArrowRight' && index < maxStars - 1) {
      e.preventDefault();
      const nextButton = e.currentTarget.nextElementSibling as HTMLElement;
      nextButton?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevButton = e.currentTarget.previousElementSibling as HTMLElement;
      prevButton?.focus();
    }
  };

  return (
    <div
      className="flex items-center gap-0.5"
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={
        interactive ? `Rate with ${maxStars} stars` : `Rating: ${rating} out of ${maxStars} stars`
      }
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const filled = index < rating;
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={!interactive}
            className={`
              ${interactive ? 'cursor-pointer hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-1' : 'cursor-default'}
              transition-transform disabled:cursor-default
            `}
            aria-label={
              interactive ? `Rate ${starValue} star${starValue > 1 ? 's' : ''}` : undefined
            }
            aria-checked={interactive ? filled : undefined}
            role={interactive ? 'radio' : undefined}
            tabIndex={interactive ? 0 : -1}
          >
            <svg
              className={`${sizeClasses[size]} ${filled ? 'text-yellow-400' : 'text-gray-300'} transition-colors`}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
