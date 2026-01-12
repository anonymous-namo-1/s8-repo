import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * ImageWithSkeleton - Optimized image component with loading states
 *
 * Features:
 * - Animated skeleton placeholder during load
 * - Smooth fade-in transition when loaded
 * - Error state with fallback UI
 * - Native lazy loading support
 * - Prevents layout shift
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - Additional CSS classes for the image
 * @param {string} containerClassName - Additional CSS classes for the container
 * @param {boolean} lazy - Enable native lazy loading (default: true)
 * @param {function} onLoad - Callback when image loads
 * @param {function} onError - Callback when image fails to load
 */
export const ImageWithSkeleton = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  lazy = true,
  onLoad,
  onError,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = (e) => {
    setLoading(false);
    setError(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setLoading(false);
    setError(true);
    if (onError) onError(e);
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${containerClassName}`}>
      {/* Skeleton Loader - Shows while loading */}
      {loading && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Error State - Shows if image fails to load */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
          <ImageOff className="w-12 h-12 mb-2" />
          <p className="text-xs">Image unavailable</p>
        </div>
      )}

      {/* Actual Image - Fades in when loaded */}
      {!error && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};
