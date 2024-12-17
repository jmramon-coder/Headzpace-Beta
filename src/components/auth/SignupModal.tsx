import React from 'react';
import { LogIn, X } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { useScrollLock } from '../../hooks/useScrollLock';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SignupModal = ({ isOpen, onClose }: Props) => {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white/95 dark:bg-black/95 w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

        <div className="w-full max-w-2xl mx-auto p-8 text-center">
          {/* Logo/Branding */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-cyan-400 mb-4">
              Headzpace
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Your Personal Productivity Sanctuary
            </p>
          </div>

          {/* Value Proposition */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-indigo-50 dark:bg-cyan-500/10 rounded-xl">
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-cyan-400 mb-2">
                Personalized Workspace
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Create and save custom layouts that adapt to your workflow
              </p>
            </div>
            <div className="p-6 bg-indigo-50 dark:bg-cyan-500/10 rounded-xl">
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-cyan-400 mb-2">
                Multi-AI Integration
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Connect multiple AI models for diverse perspectives
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white py-4 px-8 rounded-xl font-semibold hover:brightness-110 transition-all mb-4"
            >
              <LogIn className="w-5 h-5" />
              Create Free Account
            </button>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No credit card required. Start organizing your digital space today.
            </p>
          </div>
        </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          initialMode="signup"
          onLogin={() => {
            setShowLoginModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
};