import React, { useState, useEffect, useRef } from 'react';

interface Props {
  images: string[];
  interval?: number;
  onImageLoad?: () => void;
}

export const ImageCycler = ({ images, interval = 5000, onImageLoad }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [nextImageLoaded, setNextImageLoaded] = useState(false);
  const nextImageRef = useRef<HTMLImageElement>(null);
  const preloadImageRef = useRef<HTMLImageElement | null>(null);

  // Preload next image
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    if (!preloadImageRef.current) {
      preloadImageRef.current = new Image();
    }
    preloadImageRef.current.src = images[nextIndex];
    preloadImageRef.current.onload = () => setNextImageLoaded(true);
    
    return () => {
      if (preloadImageRef.current) {
        preloadImageRef.current.onload = null;
      }
    };
  }, [currentIndex, images]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (nextImageLoaded) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % images.length);
          setIsTransitioning(false);
          setNextImageLoaded(false);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, nextImageLoaded]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onImageLoad?.();
  };
  return (
    <div className="relative w-full h-full">
      <img
        src={images[currentIndex]}
        alt={`Artwork ${currentIndex + 1}`}
        onLoad={handleImageLoad}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
          !isLoaded ? 'opacity-0 scale-[1.02]' :
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-black/5 to-black/20 transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};