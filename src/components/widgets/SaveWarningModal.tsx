import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  layoutName: string;
}

export const SaveWarningModal = ({ isOpen, onClose, onConfirm, layoutName }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 dark:bg-black/80 w-full max-w-md rounded-lg shadow-2xl backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 m-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
              Override Layout?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              This will replace the existing layout "{layoutName}" with your current workspace configuration. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
              >
                Override Layout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};