import React, { useState } from 'react';
import { imageOptimizer } from '../../utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  responsive?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  className = '',
  quality = 'auto',
  format = 'auto',
  responsive = true
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Generate optimized image URL
  const optimizedSrc = src.includes('pexels.com') 
    ? imageOptimizer.optimizePexelsImage(src, width, height)
    : imageOptimizer.optimizeImage(src, {
        width,
        height,
        quality,
        format
      });

  // Generate responsive URLs if needed
  const responsiveUrls = responsive && !src.includes('pexels.com') 
    ? imageOptimizer.generateResponsiveUrls(src) 
    : null;

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      {responsive ? (
        <picture>
          <source 
            media="(max-width: 400px)" 
            srcSet={responsiveUrls?.small} 
          />
          <source 
            media="(max-width: 800px)" 
            srcSet={responsiveUrls?.medium} 
          />
          <source 
            media="(min-width: 801px)" 
            srcSet={responsiveUrls?.large} 
          />
          <img
            src={optimizedSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
          />
        </picture>
      ) : (
        <img
          src={optimizedSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default OptimizedImage;