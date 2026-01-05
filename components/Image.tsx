import React, { useState } from 'react';

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  // Art direction options
  avifSrc?: string;
  webpSrc?: string;
  // Performance options
  priority?: boolean;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  placeholderSrc = 'https://placehold.co/400x400?text=No+Image',
  className,
  avifSrc,
  webpSrc,
  priority = false,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc(placeholderSrc);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Generate optimized image URLs (assuming Vite optimizer will handle this)
  const getOptimizedSrc = (originalSrc: string, format?: string) => {
    if (!format) return originalSrc;
    // Vite plugin will automatically generate these during build
    return originalSrc.replace(/\.(png|jpg|jpeg)$/i, `.$1.${format}`);
  };

  const avifSource = avifSrc || getOptimizedSrc(src, 'avif');
  const webpSource = webpSrc || getOptimizedSrc(src, 'webp');

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      <picture>
        {/* AVIF format for modern browsers */}
        <source srcSet={avifSource} type="image/avif" />
        {/* WebP format for broader support */}
        <source srcSet={webpSource} type="image/webp" />
        {/* Fallback to original format */}
        <img
          src={imgSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={handleError}
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          {...props}
        />
      </picture>
    </div>
  );
};

export default Image;
