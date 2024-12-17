import React from 'react';

interface Props {
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = ({ children, position = 'bottom' }: Props) => {
  const positionClasses = {
    top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
    bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
    left: '-left-2 top-1/2 -translate-x-full -translate-y-1/2',
    right: '-right-2 top-1/2 translate-x-full -translate-y-1/2'
  };

  return (
    <div className={`absolute ${positionClasses[position]} scale-0 group-hover:scale-100 transition-transform duration-100 origin-center`}>
      <div className="bg-slate-800 dark:bg-black text-white dark:text-cyan-300 text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
        {children}
      </div>
    </div>
  );
};