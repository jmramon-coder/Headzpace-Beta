import React, { useState } from 'react';
import { X, User, Lock, Key, Mail, ArrowRight } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useAuthContext } from '../../context/AuthContext';
import { GoogleButton } from './GoogleButton';

interface Props {
  onClose: () => void;
  onLogin: (email: string) => void;
  initialMode?: AuthMode;
}

type AuthMode = 'signin' | 'signup';

const titles = [
  "Step Into Your Sanctuary",
  "Welcome to Your Space of Focus",
  "Your Digital Refuge Awaits",
  "Enter Your Creative Haven",
  "Unlock Your Personal Hub",
  "Discover Your Headzpace",
  "Your Batcave, Your Rules",
  "Create, Think, and Thrive",
  "Customize Your World",
  "Your Gateway to Clarity"
];

export const LoginModal = ({ onClose, onLogin, initialMode = 'signin' }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, signInWithGoogle, error: authError, isLoading } = useAuthContext();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  useScrollLock(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      let success;
      if (mode === 'signup') {
        success = await signUp(email, password);
      } else {
        success = await signIn(email, password);
      }
      
      if (success) {
        onLogin(email);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 shadow-xl dark:bg-black/30 p-6 sm:p-8 rounded-lg backdrop-blur-md border border-slate-200 dark:border-cyan-500/20 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 dark:text-cyan-400/60 dark:hover:text-cyan-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Headzpace
          </h1>
          <div className="h-6 relative overflow-hidden text-center">
            <p
              key={titleIndex}
              className="text-indigo-600 dark:text-cyan-400 transition-opacity duration-500 text-sm"
            >
              {titles[titleIndex]}
            </p>
          </div>
        </div>

        {/* Google Sign In Button */}
        <GoogleButton 
          onClick={signInWithGoogle}
          isLoading={isLoading} 
        />

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-cyan-500/20"></div>
          </div>
          <div className="relative flex justify-center text-sm backdrop-blur-none">
            <span className="px-2 text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-black/30">
              or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-cyan-500 h-5 w-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-cyan-500/30 rounded-lg py-3 px-10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-cyan-500/50 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20"
                placeholder="Full name"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-cyan-500 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-cyan-500/30 rounded-lg py-3 px-10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-cyan-500/50 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-cyan-500 h-5 w-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-cyan-500/30 rounded-lg py-3 px-10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-cyan-500/50 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20"
              placeholder="Enter your password"
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-cyan-500 h-5 w-5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-cyan-500/30 rounded-lg py-3 px-10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-cyan-500/50 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20"
                placeholder="Confirm password"
                required
              />
            </div>
          )}

          {(error || authError) && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {error || authError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white font-semibold py-3 rounded-lg hover:brightness-110 shadow-lg shadow-indigo-500/20 dark:shadow-cyan-500/20 transition-all"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Please wait...</span>
              </div>
            ) : (
              mode === 'signin' ? 'Sign In' : 'Create Account'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
            >
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};