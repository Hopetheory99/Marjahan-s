import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from './Image';

interface FlyingCartAnimationProps {
  productImage: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onComplete: () => void;
}

const FlyingCartAnimation: React.FC<FlyingCartAnimationProps> = ({
  productImage,
  startPosition,
  endPosition,
  onComplete,
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(startPosition);

  useEffect(() => {
    // Calculate the path using a bezier curve
    const duration = 800; // ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const easedProgress = easeOutCubic(progress);

      // Calculate bezier curve point
      const controlPointX = (startPosition.x + endPosition.x) / 2;
      const controlPointY = Math.min(startPosition.y, endPosition.y) - 100; // Arc upward

      const x =
        Math.pow(1 - easedProgress, 2) * startPosition.x +
        2 * (1 - easedProgress) * easedProgress * controlPointX +
        Math.pow(easedProgress, 2) * endPosition.x;

      const y =
        Math.pow(1 - easedProgress, 2) * startPosition.y +
        2 * (1 - easedProgress) * easedProgress * controlPointY +
        Math.pow(easedProgress, 2) * endPosition.y;

      setCurrentPosition({ x, y });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setTimeout(onComplete, 200); // Small delay before removing
      }
    };

    requestAnimationFrame(animate);
  }, [startPosition, endPosition, onComplete]);

  if (!isAnimating) return null;

  return createPortal(
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: currentPosition.x - 24, // Center the 48px image
        top: currentPosition.y - 24,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative">
        {/* Main product image */}
        <Image
          src={productImage}
          alt="Flying to cart"
          className="w-12 h-12 object-cover rounded-lg shadow-lg border-2 border-white"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          }}
        />

        {/* Sparkle effects */}
        <div className="absolute -inset-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s',
              }}
            />
          ))}
        </div>

        {/* Trail effect */}
        <div className="absolute inset-0 bg-gradient-radial from-yellow-400/20 to-transparent rounded-full animate-pulse" />
      </div>
    </div>,
    document.body,
  );
};

export default FlyingCartAnimation;
