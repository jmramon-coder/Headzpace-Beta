import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  layoutName: string;
}

export const DeleteLayoutModal = ({ isOpen, onClose, onConfirm, layoutName }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 dark:bg-black/80 w-full max-w-md rounded-lg shadow-2xl backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 m-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
              Delete Layout?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Are you sure you want to delete "{layoutName}"? This action cannot be undone.
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
                className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete Layout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};