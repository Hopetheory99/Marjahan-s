import React from 'react';

interface LuxuryLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'shimmer' | 'golddust';
  text?: string;
  className?: string;
}

const LuxuryLoader: React.FC<LuxuryLoaderProps> = ({
  size = 'md',
  variant = 'golddust',
  text,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const renderLoader = () => {
    switch (variant) {
      case 'golddust':
        return (
          <div className={`relative ${sizeClasses[size]} ${className}`}>
            {/* Central diamond */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 rounded-full animate-pulse" />
            </div>
            {/* Gold dust particles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-yellow-400 rounded-full animate-ping"
                style={{
                  top: `${20 + Math.sin((i * 45 * Math.PI) / 180) * 15}%`,
                  left: `${20 + Math.cos((i * 45 * Math.PI) / 180) * 15}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
            {/* Outer ring */}
            <div
              className="absolute inset-0 border border-yellow-400/30 rounded-full animate-spin"
              style={{ animationDuration: '3s' }}
            />
          </div>
        );

      case 'spinner':
        return (
          <div className={`relative ${sizeClasses[size]} ${className}`}>
            <div className="absolute inset-0 border-2 border-transparent border-t-yellow-400 border-r-yellow-500 rounded-full animate-spin" />
            <div
              className="absolute inset-1 border border-transparent border-b-yellow-300 rounded-full animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
            />
          </div>
        );

      case 'pulse':
        return (
          <div className={`relative ${sizeClasses[size]} ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-ping opacity-75" />
          </div>
        );

      case 'shimmer':
        return (
          <div
            className={`relative ${sizeClasses[size]} overflow-hidden bg-gray-200 rounded ${className}`}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderLoader()}
      {text && <p className="text-sm text-gray-600 font-medium tracking-wide uppercase">{text}</p>}
    </div>
  );
};

export default LuxuryLoader;
