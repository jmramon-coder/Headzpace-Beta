import React from 'react';
import { Key, MessageCircle, Eye, EyeOff, Trash2, Plus, Check, Unlink, Copy } from 'lucide-react';
import { useAI } from '../../../context/AIContext';
import { APIKeyForm } from './ai/APIKeyForm';
import { APIKeyList } from './ai/APIKeyList';
import { AIStatusBanner } from './ai/AIStatusBanner';

export const AISettings = () => {
  const { isAuthenticated } = useAI();
  const [showAddForm, setShowAddForm] = React.useState(false);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">
        AI Intelligence
      </h3>
      
      <AIStatusBanner isAuthenticated={isAuthenticated} />
      
      {/* API Keys Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            API Keys
          </h4>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 hover:bg-indigo-50 dark:hover:bg-cyan-500/10 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap">Add Key</span>
            </button>
          )}
        </div>

        {showAddForm ? (
          <APIKeyForm onCancel={() => setShowAddForm(false)} />
        ) : (
          <APIKeyList />
        )}
      </div>
    </div>
  );
};