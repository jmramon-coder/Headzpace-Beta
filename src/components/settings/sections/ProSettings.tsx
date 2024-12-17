import React from 'react';
import { Heart, Sparkles, Cloud, Send } from 'lucide-react';
import { WaitlistModal } from '../../waitlist/WaitlistModal';

export const ProSettings = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Heart className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
          <div className="absolute inset-0 text-indigo-500 dark:text-cyan-500 animate-ping">
            <Heart className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-white">
          Pro Plan
        </h3>
      </div>

      {/* Pro Features Preview */}
      <div className="relative group">
        {/* Animated gradient border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-500 dark:from-cyan-500 dark:via-cyan-400 dark:to-cyan-400 rounded-xl opacity-75 animate-gradient-x blur-[1px] group-hover:blur-[2px] transition-all" />
        
        <div className="relative bg-white/95 dark:bg-black/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
                <span className="text-sm font-medium text-slate-800 dark:text-white">
                  Cloud Sync & Cross-Device Access
                </span>
              </div>
              <span className="px-2 py-0.5 text-xs bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-full font-medium">
                In Development
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
                <span className="text-sm font-medium text-slate-800 dark:text-white">
                  Early Access to Premium Widgets
                </span>
              </div>
              <span className="px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white/50 dark:bg-white/5 rounded-xl p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-indigo-50 dark:bg-cyan-500/10 flex items-center justify-center">
          <Send className="w-6 h-6 text-indigo-500 dark:text-cyan-500" />
        </div>
        <h4 className="text-base font-medium text-slate-800 dark:text-white mb-2">
          Join the Waitlist
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Be among the first to experience our Pro features when they launch
        </p>
        <button
          onClick={() => setIsWaitlistOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white rounded-lg hover:brightness-110 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Join Waitlist</span>
        </button>
      </div>

      <WaitlistModal 
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
};