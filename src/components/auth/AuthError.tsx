import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  message: string;
  onRetry?: () => void;
}

export const AuthError = ({ message, onRetry }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          Authentication Error
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-indigo-500 dark:bg-cyan-500 text-white rounded-lg hover:brightness-110 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};