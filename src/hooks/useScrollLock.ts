import { useEffect } from 'react';

export const useScrollLock = (isLocked: boolean) => {
  const lockScroll = () => {
    // Get current scroll position
    const scrollY = window.scrollY;
    
    // Store current body styles
    const originalStyles = {
      position: document.body.style.position,
      width: document.body.style.width,
      top: document.body.style.top,
      overflow: document.body.style.overflow
    };
    
    // Apply scroll lock
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.overflow = 'hidden';
    
    return { scrollY, originalStyles };
  };

  const unlockScroll = (scrollY: number, originalStyles: any) => {
    // Restore original styles
    document.body.style.position = originalStyles.position;
    document.body.style.width = originalStyles.width;
    document.body.style.top = originalStyles.top;
    document.body.style.overflow = originalStyles.overflow;
    
    // Restore scroll position
    window.scrollTo(0, scrollY);
  };

  useEffect(() => {
    if (isLocked) {
      const { scrollY, originalStyles } = lockScroll();
      
      return () => {
        unlockScroll(scrollY, originalStyles);
      };
    }
  }, [isLocked]);
};