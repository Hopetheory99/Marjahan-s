import React, { useState, useEffect } from 'react';
import { usePrefersReducedMotion } from '../hooks/useScrollAnimation';

// Floating Action Button with ripple effect
export const FloatingButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ onClick, children, className = '' }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) {
      onClick();
      return;
    }

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-brand-gold/30 rounded-full ${className}`}
    >
      {children}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
    </button>
  );
};

// Success animation component
export const SuccessAnimation: React.FC<{ show: boolean; message: string }> = ({
  show,
  message,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white dark:bg-dark-surface rounded-2xl p-8 shadow-2xl transform transition-all duration-500 ${
          prefersReducedMotion ? '' : 'animate-bounce-in'
        }`}
      >
        <div className="text-center">
          {/* Success checkmark animation */}
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div
              className={`w-full h-full border-4 border-green-200 rounded-full ${
                prefersReducedMotion ? '' : 'animate-ping'
              }`}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className={`w-8 h-8 text-green-600 transform transition-all duration-500 ${
                  prefersReducedMotion ? '' : 'animate-scale-in'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-serif text-brand-charcoal dark:text-dark-text mb-2">
            Success!
          </h3>
          <p className="text-brand-warm-gray dark:text-dark-text-secondary">{message}</p>

          {/* Confetti animation */}
          {!prefersReducedMotion && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading dots animation
export const LoadingDots: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  if (prefersReducedMotion) {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${sizeClasses[size]} bg-current rounded-full opacity-60`} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

// Heart animation for wishlist
export const HeartAnimation: React.FC<{
  isActive: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}> = ({ isActive, onClick, size = 'md' }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = () => {
    if (!isActive && !prefersReducedMotion) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 rounded ${
        isActive ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
      }`}
    >
      <svg
        className={`${sizeClasses[size]} fill-current ${isAnimating ? 'animate-heart-beat' : ''}`}
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
};

// Progress bar with smooth animation
export const ProgressBar: React.FC<{
  progress: number;
  className?: string;
  showPercentage?: boolean;
}> = ({ progress, className = '', showPercentage = false }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedProgress(progress);
      return;
    }

    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [progress, prefersReducedMotion]);

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
      <div
        className="bg-gradient-to-r from-brand-gold to-brand-burgundy h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
        style={{ width: `${animatedProgress}%` }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>

      {showPercentage && (
        <div className="text-xs text-center mt-1 text-brand-warm-gray dark:text-dark-text-secondary">
          {Math.round(animatedProgress)}%
        </div>
      )}
    </div>
  );
};

// Notification toast with slide-in animation
export const NotificationToast: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}> = ({ message, type, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white border-green-600',
    error: 'bg-red-500 text-white border-red-600',
    info: 'bg-blue-500 text-white border-blue-600',
    warning: 'bg-yellow-500 text-black border-yellow-600',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${prefersReducedMotion ? '' : 'animate-slide-in-right'}`}
    >
      <div
        className={`${typeStyles[type]} p-4 rounded-lg shadow-lg border-l-4 flex items-start space-x-3`}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          {type === 'success' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {type === 'error' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {type === 'info' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {type === 'warning' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Message */}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 ml-2 hover:bg-black/10 rounded p-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Pulse notification badge
export const PulseBadge: React.FC<{
  count: number;
  className?: string;
}> = ({ count, className = '' }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (count === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {count > 99 ? '99+' : count}
      </span>

      {!prefersReducedMotion && (
        <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
      )}
    </div>
  );
};

// Morphing button with shape changes
export const MorphingButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'circle' | 'square' | 'rounded';
  className?: string;
}> = ({ children, onClick, variant = 'rounded', className = '' }) => {
  const [currentVariant, setCurrentVariant] = useState(variant);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleClick = () => {
    if (!prefersReducedMotion) {
      // Cycle through variants on click
      const variants = ['circle', 'square', 'rounded'];
      const currentIndex = variants.indexOf(currentVariant);
      const nextIndex = (currentIndex + 1) % variants.length;
      setCurrentVariant(variants[nextIndex] as typeof variant);
    }
    onClick();
  };

  const variantClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-3 bg-gradient-to-r from-brand-burgundy to-brand-gold text-white font-medium transform transition-all duration-500 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-brand-gold/30 ${variantClasses[currentVariant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Add custom animations to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes heart-beat {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.1); }
    50% { transform: scale(1.2); }
    75% { transform: scale(1.1); }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .animate-heart-beat {
    animation: heart-beat 0.6s ease-in-out;
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;
document.head.appendChild(style);
