import React, { useState } from 'react';
import { X, Save, Layout } from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { Widget } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentWidgets: Widget[];
}

export const SaveLayoutModal = ({ isOpen, onClose, currentWidgets }: Props) => {
  const { saveCurrentLayout } = useLayout();
  const [name, setName] = useState('');
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCurrentLayout(name, currentWidgets);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 dark:bg-black/80 w-full max-w-md rounded-lg shadow-2xl backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Save Layout</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Layout Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Productive Setup"
              className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white font-medium py-2 rounded-lg hover:brightness-110 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Layout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}