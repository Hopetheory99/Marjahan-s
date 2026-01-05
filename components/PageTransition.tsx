import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/useScrollAnimation';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayChildren(children);
      return;
    }

    // Start exit animation
    setIsTransitioning(true);

    const exitTimer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 150); // Half of transition duration

    return () => clearTimeout(exitTimer);
  }, [location.pathname, children, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={className}>{displayChildren}</div>;
  }

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isTransitioning
          ? 'opacity-0 transform translate-y-4 scale-95'
          : 'opacity-100 transform translate-y-0 scale-100'
      } ${className}`}
    >
      {displayChildren}
    </div>
  );
};

// Advanced page transition with different effects
export const AdvancedPageTransition: React.FC<{
  children: React.ReactNode;
  effect?: 'fade' | 'slide' | 'scale' | 'rotate' | 'flip';
  className?: string;
}> = ({ children, effect = 'fade', className = '' }) => {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayChildren(children);
      return;
    }

    // Exit animation
    setIsVisible(false);

    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname, children, prefersReducedMotion]);

  const getEffectClasses = () => {
    if (!isVisible) {
      switch (effect) {
        case 'fade':
          return 'opacity-0';
        case 'slide':
          return 'opacity-0 transform -translate-x-full';
        case 'scale':
          return 'opacity-0 transform scale-75';
        case 'rotate':
          return 'opacity-0 transform rotate-12 scale-90';
        case 'flip':
          return 'opacity-0 transform rotateY-90';
        default:
          return 'opacity-0';
      }
    }

    switch (effect) {
      case 'fade':
        return 'opacity-100';
      case 'slide':
        return 'opacity-100 transform translate-x-0';
      case 'scale':
        return 'opacity-100 transform scale-100';
      case 'rotate':
        return 'opacity-100 transform rotate-0 scale-100';
      case 'flip':
        return 'opacity-100 transform rotateY-0';
      default:
        return 'opacity-100';
    }
  };

  if (prefersReducedMotion) {
    return <div className={className}>{displayChildren}</div>;
  }

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${getEffectClasses()} ${className}`}
      style={{
        transformStyle: effect === 'flip' ? 'preserve-3d' : 'flat',
      }}
    >
      {displayChildren}
    </div>
  );
};

// Loading transition for route changes
export const RouteLoader: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}> = ({ isLoading, children, loadingComponent }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <>{isLoading ? loadingComponent : children}</>;
  }

  return (
    <div className="relative w-full h-full">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isLoading
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform -translate-y-4 pointer-events-none absolute inset-0'
        }`}
      >
        {loadingComponent || (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div
        className={`transition-all duration-300 ease-in-out delay-150 ${
          isLoading ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// Staggered children animation
export const StaggeredTransition: React.FC<{
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 100, className = '' }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className="animate-fade-in-up"
          style={{
            animationDelay: `${index * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Morphing background transition
export const MorphingBackground: React.FC<{
  children: React.ReactNode;
  colors: string[];
  className?: string;
}> = ({ children, colors, className = '' }) => {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [colors.length, prefersReducedMotion]);

  useEffect(() => {
    setCurrentColorIndex(0);
  }, [location.pathname]);

  if (prefersReducedMotion) {
    return (
      <div className={className} style={{ backgroundColor: colors[0] }}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-1000 ease-in-out ${className}`}
      style={{
        backgroundColor: colors[currentColorIndex],
      }}
    >
      {children}
    </div>
  );
};

// Curtain transition effect
export const CurtainTransition: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}> = ({ children, isOpen, direction = 'horizontal', className = '' }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left/Top curtain */}
      <div
        className={`absolute bg-brand-burgundy transition-all duration-700 ease-in-out z-10 ${
          direction === 'horizontal' ? 'left-0 top-0 w-1/2 h-full' : 'left-0 top-0 w-full h-1/2'
        }`}
        style={{
          transform: isOpen
            ? direction === 'horizontal'
              ? 'translateX(-100%)'
              : 'translateY(-100%)'
            : 'translateX(0)',
        }}
      />

      {/* Right/Bottom curtain */}
      <div
        className={`absolute bg-brand-burgundy transition-all duration-700 ease-in-out z-10 ${
          direction === 'horizontal' ? 'right-0 top-0 w-1/2 h-full' : 'left-0 bottom-0 w-full h-1/2'
        }`}
        style={{
          transform: isOpen
            ? direction === 'horizontal'
              ? 'translateX(100%)'
              : 'translateY(100%)'
            : 'translateX(0)',
        }}
      />

      {/* Content */}
      <div
        className={`transition-opacity duration-500 delay-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// Liquid blob transition
export const LiquidBlobTransition: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}> = ({ children, isActive, className = '' }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Liquid blob background */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          isActive ? 'scale-150 opacity-20' : 'scale-100 opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(114,47,55,0.2) 100%)',
          borderRadius: isActive ? '60% 40% 30% 70%/60% 30% 70% 40%' : '50%',
          animation: isActive ? 'liquid-morph 4s ease-in-out infinite' : 'none',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Add liquid morph keyframes to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes liquid-morph {
    0%, 100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
    25% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
    50% { border-radius: 50% 60% 30% 60%/30% 60% 70% 40%; }
    75% { border-radius: 60% 40% 60% 40%/60% 40% 60% 40%; }
  }
`;
document.head.appendChild(style);

export default PageTransition;
