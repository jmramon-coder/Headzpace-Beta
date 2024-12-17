import React from 'react';

export const AuthLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 dark:border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};