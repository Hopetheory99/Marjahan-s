import React, { useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, className = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
            setIsLoaded(true);
            setHasError(true);
        }}
        loading="lazy"
        {...props}
      />

      {/* Error Fallback */}
      {hasError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20 text-gray-400 text-xs text-center p-2">
              Image unavailable
          </div>
      )}
    </div>
  );
};

export default Image;