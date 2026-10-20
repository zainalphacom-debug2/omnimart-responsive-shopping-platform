import React, { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 p-4 select-none ${className}`}>
        <Package className="w-8 h-8 mb-2 opacity-50 text-neutral-500" />
        <span className="text-xs text-neutral-500 font-medium text-center line-clamp-1">{alt}</span>
        <span className="text-[10px] text-neutral-400 mt-0.5">OMNIMART Studio</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100">
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};
