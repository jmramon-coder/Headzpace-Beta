import { useEffect, useCallback, useRef } from 'react';
import { useViewport } from '../context/ViewportContext';

const MIN_SCALE = 0.25;
const MAX_SCALE = 4;
const WHEEL_ZOOM_SPEED = 0.001;
const GESTURE_ZOOM_SPEED = 0.005;

const clamp = (value: number, min: number, max: number) => 
  Math.min(Math.max(value, min), max);

export const useViewportControls = () => {
  const { viewport, setScale, setPosition, isPanMode, isPanning, startGrabbing, stopGrabbing } = useViewport();
  const lastTouchDistance = useRef<number | null>(null);
  const isGesturing = useRef(false);

  const handleZoom = useCallback((delta: number, cursorX: number, cursorY: number) => {
    const scaleDelta = -delta * WHEEL_ZOOM_SPEED;
    const newScale = clamp(viewport.scale + scaleDelta, MIN_SCALE, MAX_SCALE);
    
    if (newScale === viewport.scale) return;

    // Calculate cursor position relative to viewport center
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    
    // Calculate the distance from cursor to viewport center
    const distX = cursorX - viewportCenterX;
    const distY = cursorY - viewportCenterY;
    
    // Calculate position adjustment to keep cursor point fixed
    const scaleFactor = (newScale - viewport.scale) / viewport.scale;
    const dx = distX * scaleFactor;
    const dy = distY * scaleFactor;
    
    setScale(newScale);
    setPosition({
      x: viewport.position.x - dx,
      y: viewport.position.y - dy
    });
  }, [viewport.scale, viewport.position, setScale, setPosition]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      handleZoom(-100, window.innerWidth / 2, window.innerHeight / 2);
    } else if (e.key === 'ArrowDown') {
      handleZoom(100, window.innerWidth / 2, window.innerHeight / 2);
    }
  }, [handleZoom]);

  const handleWheel = useCallback((e: WheelEvent) => {
    const isScrollable = (element: Element | null): boolean => {
      if (!element) return false;
      
      // Check for modal overlays and scrollable containers
      if (element.closest('[role="dialog"]') || element.closest('.custom-scrollbar')) return true;
      
      const style = window.getComputedStyle(element);
      const overflowY = style.getPropertyValue('overflow-y');
      return (
        overflowY === 'scroll' || 
        overflowY === 'auto' || 
        (element.scrollHeight > element.clientHeight && 
         element.clientHeight > 0 && 
         overflowY !== 'hidden')
      );
    };

    let target = e.target as Element;
    while (target && target !== document.body) {
      if (isScrollable(target)) {
        return; // Let the default scroll behavior happen
      }
      target = target.parentElement as Element;
    }

    e.preventDefault();
    handleZoom(e.deltaY, e.clientX, e.clientY);
  }, [handleZoom]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning) return;

    setPosition({
      x: viewport.position.x + e.movementX,
      y: viewport.position.y + e.movementY
    });
  }, [isPanning, viewport.position, setPosition]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (isPanMode && e.button === 0) {
      startGrabbing();
    }
  }, [isPanMode, startGrabbing]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (isPanMode && e.button === 0) {
      stopGrabbing();
    }
  }, [isPanMode, stopGrabbing]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    if (isPanning) {
      document.body.style.cursor = 'grabbing';
      window.addEventListener('mousemove', handleMouseMove);
    } else if (isPanMode) {
      document.body.style.cursor = 'grab';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (isPanning) {
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleMouseMove);
      } else if (isPanMode) {
        document.body.style.cursor = '';
      }
    };
  }, [handleKeyDown, handleWheel, handleMouseMove, handleMouseDown, handleMouseUp, isPanning, isPanMode]);

  // Handle trackpad gestures
  useEffect(() => {
    const handleGestureStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        isGesturing.current = true;
        
        // Calculate initial touch distance
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        lastTouchDistance.current = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
      }
    };

    const handleGestureMove = (e: TouchEvent) => {
      if (!isGesturing.current || e.touches.length !== 2) return;
      e.preventDefault();

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      // Calculate new touch distance
      const newDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (lastTouchDistance.current !== null) {
        // Calculate zoom
        const delta = newDistance - lastTouchDistance.current;
        const zoomDelta = delta * GESTURE_ZOOM_SPEED;
        const newScale = clamp(viewport.scale + zoomDelta, MIN_SCALE, MAX_SCALE);

        if (newScale !== viewport.scale) {
          // Calculate center point of the gesture
          const centerX = (touch1.clientX + touch2.clientX) / 2;
          const centerY = (touch1.clientY + touch2.clientY) / 2;

          // Apply zoom centered on gesture
          const viewportCenterX = window.innerWidth / 2;
          const viewportCenterY = window.innerHeight / 2;
          const distX = centerX - viewportCenterX;
          const distY = centerY - viewportCenterY;
          const scaleFactor = (newScale - viewport.scale) / viewport.scale;
          
          setScale(newScale);
          setPosition({
            x: viewport.position.x - (distX * scaleFactor),
            y: viewport.position.y - (distY * scaleFactor)
          });
        }
      }

      lastTouchDistance.current = newDistance;
    };

    const handleGestureEnd = () => {
      isGesturing.current = false;
      lastTouchDistance.current = null;
    };

    // Add touch event listeners
    window.addEventListener('touchstart', handleGestureStart, { passive: false });
    window.addEventListener('touchmove', handleGestureMove, { passive: false });
    window.addEventListener('touchend', handleGestureEnd);
    window.addEventListener('touchcancel', handleGestureEnd);

    return () => {
      window.removeEventListener('touchstart', handleGestureStart);
      window.removeEventListener('touchmove', handleGestureMove);
      window.removeEventListener('touchend', handleGestureEnd);
      window.removeEventListener('touchcancel', handleGestureEnd);
    };
  }, [viewport.scale, viewport.position, setScale, setPosition]);
};