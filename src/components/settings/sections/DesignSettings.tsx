import React, { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { DesignNavigation } from './design/DesignNavigation';
import { TypographySection } from './design/TypographySection';
import { SizingSection } from './design/SizingSection';

export const DesignSettings = () => {
  const { user } = useUser();
  const isGuest = user?.email === 'guest';
  const [activeSection, setActiveSection] = useState('typography');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">
        Design Settings
      </h3>
      
      {isGuest && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Design customization is only available for registered users. Sign up to personalize your experience!
          </p>
        </div>
      )}

      <DesignNavigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {activeSection === 'typography' && <TypographySection />}
      {activeSection === 'sizing' && <SizingSection />}
    </div>
  );
};