import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { ImageCycler } from './Media/ImageCycler';
import type { Widget } from '../../types';

type MediaType = 'image' | 'video';

interface MediaState {
  url: string;
  type: MediaType;
}

export const Media = ({ widget }: { widget?: Widget }) => {
  const [media, setMedia] = useState<MediaState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // If widget has default images, show them
  if (widget?.defaultImages) {
    return (
      <>
        <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 dark:from-cyan-500/5 dark:to-cyan-400/5 transition-opacity duration-500 ${
          isImageLoaded ? 'opacity-0' : 'opacity-100'
        }`} />
        <ImageCycler 
          images={widget.defaultImages} 
          interval={6000}
          onImageLoad={() => setIsImageLoaded(true)}
        />
      </>
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMedia({
          url: e.target?.result as string,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMedia({
          url: e.target?.result as string,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="absolute inset-0"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {media ? (
        <div className="absolute inset-0">
          {media.type === 'image' ? (
            <img
              src={media.url}
              alt="Uploaded media"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <video
              src={media.url}
              autoPlay
              loop
              muted
              controls
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      ) : (
        <label className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer
          ${isDragging 
            ? 'border-indigo-500 dark:border-cyan-500 bg-indigo-500/10 dark:bg-cyan-500/10' 
            : 'bg-indigo-500/5 hover:bg-indigo-500/10 dark:bg-cyan-500/5 dark:hover:bg-cyan-500/10'}`}
        >
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};