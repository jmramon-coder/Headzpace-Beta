import React from 'react';
import { EnterButton } from './EnterButton';

interface Props {
  onClick: () => void;
}

export const StickyEnterButton = ({ onClick }: Props) => {
  return (
    <div className="fixed bottom-0 sm:bottom-8 right-0 sm:right-8 z-50 w-full sm:w-auto p-4 sm:p-0 bg-gradient-to-t from-black/20 to-transparent sm:bg-none">
      <EnterButton onClick={onClick} />
    </div>
  );
};