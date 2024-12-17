import React from 'react';
import { X, Upload, AlertTriangle } from 'lucide-react';
import { useWorkspaceImport } from '../../hooks/useWorkspaceImport';
import type { Widget } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (widgets: Widget[]) => void;
}

export const ImportWorkspaceModal = ({ isOpen, onClose, onImport }: Props) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const { isImporting, error, importWorkspace } = useWorkspaceImport(onImport);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Reset file input first to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await importWorkspace(file);
      onClose();
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    try {
      const files = Array.from(e.dataTransfer.files);
      const zipFile = files.find(f => f.name.toLowerCase().endsWith('.zip'));
    
      if (zipFile) {
        await importWorkspace(zipFile);
        onClose();
      }
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onDragOver={handleDragOver}
      onDragEnter={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="bg-white/90 dark:bg-black/80 w-full max-w-md rounded-lg shadow-2xl backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 m-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            Import Workspace
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Select a workspace file (.zip) to import your previously saved configuration.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Drop Zone */}
        <div 
          className={`mb-6 p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
            isDragging
              ? 'border-indigo-500 dark:border-cyan-500 bg-indigo-50 dark:bg-cyan-500/10'
              : 'border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 dark:hover:border-cyan-500/50'
          }`}
        >
          <Upload className={`w-8 h-8 mx-auto mb-2 transition-colors ${
            isDragging
              ? 'text-indigo-500 dark:text-cyan-500'
              : 'text-slate-400 dark:text-slate-500'
          }`} />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Drag and drop your workspace file here, or
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mx-1 text-indigo-600 dark:text-cyan-400 hover:underline"
            >
              browse
            </button>
            to upload
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports .zip files up to 50MB
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
            disabled={isImporting}
          >
            Cancel
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Select File</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};