import React from 'react';
import { Type, Maximize } from 'lucide-react';

interface Props {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const DesignNavigation = ({ activeSection, onSectionChange }: Props) => {
  const sections = [
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'sizing', label: 'Sizing', icon: Maximize }
  ];

  return (
    <div className="flex flex-nowrap overflow-x-auto no-scrollbar p-1 bg-slate-100 dark:bg-white/5 rounded-lg mb-6">
      {sections.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSectionChange(id)}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
            activeSection === id
              ? 'bg-white dark:bg-black/40 text-indigo-600 dark:text-cyan-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="whitespace-nowrap">{label}</span>
        </button>
      ))}
    </div>
  );
};