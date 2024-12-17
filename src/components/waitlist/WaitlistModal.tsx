import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export const WaitlistModal = ({ isOpen, onClose }: Props) => {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState('submitting');

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store email in localStorage for demo
      const waitlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
      waitlist.push({ email, timestamp: Date.now() });
      localStorage.setItem('waitlist', JSON.stringify(waitlist));
      
      setSubmitState('success');
      setTimeout(() => {
        onClose();
        setEmail('');
        setSubmitState('idle');
      }, 2000);
    } catch (error) {
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-black/90 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitState === 'success' ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              You're on the List!
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              We'll notify you when Pro features are ready.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                Join the Waitlist
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Be the first to experience our Pro features
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500"
                />
              </div>

              {submitState === 'error' && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Something went wrong. Please try again.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitState === 'submitting'}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white font-medium py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitState === 'submitting' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Join Waitlist</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                We'll only email you about Pro features and updates.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};