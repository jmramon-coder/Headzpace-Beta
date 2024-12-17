import React from 'react';
import { Sun, Moon, LogOut, Settings, Play, Pause, LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useVideo } from '../context/VideoContext';
import { useNavigate } from '../hooks/useNavigate';
import { SettingsModal } from './settings/SettingsModal';

interface HeaderProps {
  user: { email: string } | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

export const Header = ({ user, onLogout, onLoginClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { isPlaying, setIsPlaying } = useVideo();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false);
  const { navigateToLanding } = useNavigate();
  const [initialSettingsSection, setInitialSettingsSection] = React.useState<string>('general');

  React.useEffect(() => {
    const handleOpenSettings = (e: CustomEvent<{ section: string }>) => {
      setInitialSettingsSection(e.detail.section);
      setIsSettingsOpen(true);
    };

    window.addEventListener('openSettings', handleOpenSettings as EventListener);
    return () => window.removeEventListener('openSettings', handleOpenSettings as EventListener);
  }, []);

  return (
    <>
      <header className="fixed top-[18px] sm:top-4 left-0 right-0 flex justify-center px-4 z-50">
        <div className="relative bg-white/80 shadow-xl dark:bg-black/30 backdrop-blur-md border border-slate-200 dark:border-cyan-500/20 rounded-full px-4 sm:px-6 py-2 flex items-center gap-4 pointer-events-auto">
          <button
            onClick={navigateToLanding}
            className="text-indigo-600 dark:text-cyan-300 font-medium hover:text-indigo-700 dark:hover:text-cyan-200 transition-colors text-sm sm:text-base"
          >
            Headzpace
          </button>
          {!user && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`text-slate-400 hover:text-indigo-600 dark:text-cyan-400/60 dark:hover:text-cyan-300 transition-colors hover:scale-110 ${isPlaying ? 'animate-pulse' : ''} scale-90 sm:scale-100`}
                aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleTheme}
                className="text-slate-400 hover:text-indigo-600 dark:text-cyan-400/60 dark:hover:text-cyan-300 transition-colors hover:scale-110 scale-90 sm:scale-100"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={onLoginClick}
                className="text-slate-400 hover:text-indigo-600 dark:text-cyan-400/60 dark:hover:text-cyan-300 transition-colors hover:scale-110 group relative scale-90 sm:scale-100"
                aria-label="Log in"
              >
                <LogIn className="w-4 h-4" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 dark:bg-black/80 text-white dark:text-cyan-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Ready to focus?
                </span>
              </button>
            </div>
          )}
          {user && (
            <>
              <div className="h-4 w-px bg-slate-200 dark:bg-cyan-500/20" />
              <span className="hidden sm:inline-block text-sm text-slate-500 dark:text-cyan-400/60">
                {user.email === 'guest' ? 'Guest' : user.email}
              </span>
              <div className="flex items-center gap-3"> 
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-slate-400 hover:text-indigo-600 dark:text-cyan-400/60 dark:hover:text-cyan-300 transition-colors hover:scale-110 scale-90 sm:scale-100"
                  aria-label="Open settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="text-slate-400 hover:text-indigo-600 dark:text-cyan-400/60 dark:hover:text-cyan-300 transition-colors hover:scale-110 scale-90 sm:scale-100"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={user.email === 'guest' ? onLoginClick : onLogout}
                  className="text-slate-400 hover:text-indigo-600 dark:text-cyan-400/60 dark:hover:text-cyan-300 transition-colors hover:scale-110 scale-90 sm:scale-100"
                  aria-label={user.email === 'guest' ? 'Log in' : 'Log out'}
                >
                  {user.email === 'guest' ? <LogIn className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                </button>
              </div>
            </>
          )}
        </div>
      </header>
      {isSettingsOpen && (
        <SettingsModal
          initialSection={initialSettingsSection}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
};