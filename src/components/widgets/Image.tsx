import React, { useState } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';

export const Image = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
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
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
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
      {image ? (
        <div className="absolute inset-0">
          <img
            src={image}
            alt="Uploaded"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ) : (
        <label className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer
          ${isDragging 
            ? 'border-cyan-500 bg-cyan-500/10' 
            : 'bg-cyan-500/5 hover:bg-cyan-500/10'}`}
        >
          <Upload className="w-8 h-8 text-cyan-500/50" />
          <p className="text-cyan-500/50 text-sm">Drop image or click</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};