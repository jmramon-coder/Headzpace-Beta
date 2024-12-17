import React, { useState, useEffect } from 'react';
import { X, Settings, Palette, Brain, Heart } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { GeneralSettings } from './sections/GeneralSettings';
import { DesignSettings } from './sections/DesignSettings';
import { AISettings } from './sections/AISettings';
import { ProSettings } from './sections/ProSettings';

interface Props {
  onClose: () => void;
  initialSection?: string;
}

type Section = 'general' | 'design' | 'ai' | 'pro';

export const SettingsModal = ({ onClose, initialSection = 'general' }: Props) => {
  const [activeSection, setActiveSection] = useState<Section>(initialSection as Section);
  useScrollLock(true);

  useEffect(() => {
    // Add modal-open class to body
    document.body.classList.add('modal-open');
    document.body.classList.add('settings-open');
    document.body.classList.add('settings-open');

    return () => {
      document.body.classList.remove('modal-open');
      document.body.classList.remove('settings-open');
      document.body.classList.remove('settings-open');
    };
  }, []);

  const sections = [{
    id: 'general',
    label: 'General',
    icon: Settings
  }, {
    id: 'design',
    label: 'Design',
    icon: Palette
  }, {
    id: 'ai',
    label: 'Intelligence',
    icon: Brain
  }, {
    id: 'pro',
    label: 'Pro',
    icon: Heart,
    badge: 'Beta'
  }] as const;

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />;
      case 'design':
        return <DesignSettings />;
      case 'ai':
        return <AISettings />;
      case 'pro':
        return <ProSettings />;
    }
  };

  return (
    <div role="dialog" className="fixed inset-0 z-[200] flex items-start sm:items-center justify-center bg-black/30 backdrop-blur-sm overflow-hidden">
      <div className="bg-white/90 dark:bg-black/90 w-full sm:w-[800px] h-[100dvh] sm:h-[600px] sm:max-h-[calc(100vh-2rem)] rounded-none sm:rounded-lg shadow-2xl border-0 sm:border border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:mx-4 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
          <h2 className="text-lg font-medium text-slate-800 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-indigo-600 dark:text-cyan-400/60 dark:hover:text-cyan-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-48 border-r border-slate-200 dark:border-slate-700/50">
            {sections.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full text-left px-6 py-3 transition-colors ${
                  activeSection === id
                    ? 'bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                {label}
                  {badge && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-cyan-500/20 text-indigo-600 dark:text-cyan-300">
                      {badge}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden flex items-center justify-between border-b border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-black/80 backdrop-blur-sm px-1">
            {sections.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeSection === id
                    ? 'border-indigo-500 dark:border-cyan-500 text-indigo-600 dark:text-cyan-300'
                    : 'border-transparent text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  activeSection === id
                    ? 'text-indigo-500 dark:text-cyan-500'
                    : 'text-slate-400 dark:text-slate-500'
                }`} />
                {label}
                {badge && (
                  <span className="px-1 py-0.5 text-[10px] rounded-full bg-indigo-100 dark:bg-cyan-500/20 text-indigo-600 dark:text-cyan-300">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 min-h-0 overscroll-contain">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};