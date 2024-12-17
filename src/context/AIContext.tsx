import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initializeOpenAI } from '../utils/openai';
import type { APIKey } from '../types';

interface AIContextType {
  apiKeys: APIKey[];
  activeKey: APIKey | null;
  addApiKey: (name: string, key: string) => void;
  removeApiKey: (id: string) => void;
  setActiveKey: (id: string) => void;
  isAuthenticated: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>(() => {
    const stored = localStorage.getItem('openai_api_keys');
    return stored ? JSON.parse(stored) : [];
  });

  const activeKey = apiKeys.find(key => key.isActive) || null;

  const saveKeys = useCallback((keys: APIKey[]) => {
    localStorage.setItem('openai_api_keys', JSON.stringify(keys));
    setApiKeys(keys);
  }, []);

  const addApiKey = useCallback((name: string, key: string) => {
    if (!key.trim() || !name.trim()) {
      return;
    }

    if (apiKeys.length >= 5) {
      throw new Error('Maximum number of API keys reached (5)');
    }

    try {
      initializeOpenAI(key);
      
      const newKey: APIKey = {
        id: crypto.randomUUID(),
        name: name.trim(),
        key: key.trim(),
        isActive: apiKeys.length === 0, // Make active if it's the first key
        createdAt: Date.now(),
      };

      const updatedKeys = [...apiKeys, newKey];
      saveKeys(updatedKeys);

    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      throw error;
    }
  }, [apiKeys, saveKeys]);

  const removeApiKey = useCallback((id: string) => {
    const updatedKeys = apiKeys.filter(key => key.id !== id);
    saveKeys(updatedKeys);
  }, [apiKeys, saveKeys]);

  const setActiveKey = useCallback((id: string) => {
    const updatedKeys = apiKeys.map(key => ({
      ...key,
      isActive: key.id === id && id !== '', // Allow deactivating by passing empty string
    }));
    saveKeys(updatedKeys);
  }, [apiKeys, saveKeys]);

  // Initialize OpenAI with active key
  useEffect(() => {
    if (activeKey) {
      try {
        initializeOpenAI(activeKey.key);
      } catch (error) {
        console.error('Failed to initialize OpenAI with stored key:', error);
        const updatedKeys = apiKeys.filter(key => key.id !== activeKey.id);
        saveKeys(updatedKeys);
      }
    }
  }, [activeKey, apiKeys, saveKeys]);

  return (
    <AIContext.Provider value={{ 
      apiKeys,
      activeKey,
      addApiKey,
      removeApiKey,
      setActiveKey,
      isAuthenticated: !!activeKey
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}