import React from 'react';
import { Download, X, Save, AlertCircle, LogIn } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  onSignIn: () => void;
}

export const SaveWorkspaceModal = ({ isOpen, onClose, onSave, hasUnsavedChanges, onSignIn }: Props) => {
  const { user } = useUser();
  const isGuest = user?.email === 'guest';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 dark:bg-black/80 w-full max-w-md rounded-lg shadow-2xl backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-1">
              Download Workspace
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Save your current workspace configuration
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isGuest ? (
          <div className="mb-6 p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-cyan-500/5 dark:to-cyan-500/10 rounded-lg border border-indigo-200 dark:border-cyan-500/20 text-center">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <LogIn className="w-6 h-6 text-indigo-500 dark:text-cyan-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
              Create a Free Account
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Sign up to save and sync your workspace across devices
            </p>
            <button
              onClick={() => {
                onClose();
                onSignIn();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 dark:bg-cyan-500 text-white rounded-lg hover:brightness-110 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign Up Now</span>
            </button>
          </div>
        ) : (
        <>
        {hasUnsavedChanges && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                  Unsaved Changes Detected
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Your workspace has unsaved changes. Save before downloading to include your latest modifications.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1 mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">Your download will include:</p>
          <ul className="text-sm text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1 pl-1">
            <li>Widget layouts and positions</li>
            <li>Media files and configurations</li>
            <li>Theme and display preferences</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave();
              onClose();
            }}
            disabled={!hasUnsavedChanges}
            className={`flex items-center gap-2 px-4 py-2 ${
              hasUnsavedChanges
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            } rounded-lg transition-colors`}
          >
            <Save className="w-4 h-4" />
            Save First
          </button>
          <button
            onClick={() => {
              onSave();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Workspace
          </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
};