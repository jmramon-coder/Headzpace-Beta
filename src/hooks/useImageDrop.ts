import { useCallback } from 'react';
import type { Widget } from '../types';

interface AddWidgetOptions {
  type: Widget['type'];
  defaultImages?: string[];
}

export const useImageDrop = (addWidget: (options: AddWidgetOptions) => void) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleImageFile = useCallback((file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Handle files
    if (e.dataTransfer.files?.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        try {
          const imageUrl = await handleImageFile(file);
          addWidget({ 
            type: 'media',
            defaultImages: [imageUrl]
          });
        } catch (error) {
          console.error('Failed to process dropped image:', error);
        }
        return;
      }
    }

    // Handle image URLs
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (url && (/\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.startsWith('data:image/'))) {
      addWidget({ 
        type: 'media',
        defaultImages: [url]
      });
      return;
    }
  }, [addWidget, handleImageFile]);

  return {
    handleDragOver,
    handleDrop
  };
};