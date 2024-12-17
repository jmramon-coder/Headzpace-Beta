import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  message: string;
  onClose: () => void;
}

export const Toast = ({ message, onClose }: Props) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 left-4 z-[200] animate-fade-in">
      <div className="bg-white/80 dark:bg-black/30 backdrop-blur-md border border-slate-200 dark:border-cyan-500/20 rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
        <Check className="w-4 h-4 text-green-500" />
        <span className="text-sm text-slate-800 dark:text-white">{message}</span>
      </div>
    </div>
  );
};