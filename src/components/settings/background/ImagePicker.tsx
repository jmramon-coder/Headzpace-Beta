import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import type { ImageConfig } from '../../../types/design';

interface Props {
  value: ImageConfig | null;
  curatedImages: ImageConfig[];
  onChange: (image: ImageConfig) => void;
}

export const ImagePicker = ({ value, curatedImages, onChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedImage(dataUrl);
      onChange({
        type: 'custom',
        url: dataUrl,
        blur: 0,
        opacity: 1
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Curated Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {curatedImages.map((image) => (
          <button
            key={image.id}
            onClick={() => onChange({ ...image, blur: 0, opacity: 1 })}
            className="group relative aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800"
          >
            <img
              src={image.url}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                value?.url === image.url ? 'ring-2 ring-indigo-500 dark:ring-cyan-500' : ''
              }`}
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg group-hover:ring-indigo-500 dark:group-hover:ring-cyan-500 transition-colors" />
          </button>
        ))}
      </div>

      {/* Upload Section */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-indigo-500 dark:hover:border-cyan-500 transition-colors group"
        >
          <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-cyan-500 transition-colors" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Upload your own image
          </span>
        </button>
      </div>
    </div>
  );
};