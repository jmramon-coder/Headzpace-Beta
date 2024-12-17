import React, { useState, useRef, useEffect } from 'react';
import { X, Expand, Minimize2, Key, Settings, Brain as BrainIcon } from 'lucide-react';
import { ChatTabs } from './ChatTabs';
import { ChatHeader } from './ChatHeader';
import { getOpenAIInstance } from '../../utils/openai';
import { useAI } from '../../context/AIContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { MasterChatHeader } from './MasterChatHeader';
import type { OpenAI } from 'openai';
import type { ChatTab } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const createNewTab = (index: number): ChatTab => ({
  id: crypto.randomUUID(),
  name: `Chat ${index + 1}`,
  messages: []
});

export const ChatModal = ({ isOpen, onClose }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isAuthenticated, activeKey } = useAI();
  const [tabs, setTabs] = useState<ChatTab[]>([createNewTab(0)]);
  const [activeTabId, setActiveTabId] = useState('master');
  const [selectedTabs, setSelectedTabs] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useScrollLock(isOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTab = activeTabId === 'master' 
    ? { id: 'master', name: 'Master', messages: [] }
    : tabs.find(tab => tab.id === activeTabId)!;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeTab.messages]);

  useEffect(() => {
    if (isAuthenticated && activeTab.messages.length === 0) {
      setTabs(tabs.map(tab => 
        tab.id === activeTabId
          ? {
              ...tab,
              messages: [{
                role: 'assistant',
                content: 'Hello! I\'m your AI assistant. How can I help you today?'
              }]
            }
          : tab
      ));
    }
  }, [isAuthenticated, activeTabId]);

  const handleNewTab = () => {
    if (tabs.length >= 5) return;
    const newTab = createNewTab(tabs.length);
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    if (id === activeTabId) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const handleChangeApiKey = (tabId: string, apiKeyId: string) => {
    setTabs(tabs.map(tab =>
      tab.id === tabId ? { ...tab, apiKeyId } : tab
    ));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { role: 'user' as const, content: input };
      
      if (activeTabId === 'master') {
        // Send message to all selected tabs
        if (selectedTabs.length === 0) {
          setTabs(tabs.map(tab => ({
            ...tab,
            messages: [...tab.messages, userMessage]
          })));
        } else {
          setTabs(tabs.map(tab => ({
            ...tab,
            messages: selectedTabs.includes(tab.id)
              ? [...tab.messages, userMessage]
              : tab.messages
          })));
        }
      } else {
        // Send message to single tab
        setTabs(tabs.map(tab =>
          tab.id === activeTabId
            ? { ...tab, messages: [...tab.messages, userMessage] }
            : tab
        ));
      }

      setInput('');
      setIsLoading(true);

      try {
        const openai = getOpenAIInstance();
        
        if (activeTabId === 'master') {
          // Process each selected tab (or all tabs if none selected)
          const targetTabs = selectedTabs.length > 0 
            ? tabs.filter(tab => selectedTabs.includes(tab.id))
            : tabs;

          await Promise.all(targetTabs.map(async (tab) => {
            const completion = await openai.chat.completions.create({
              messages: [...tab.messages, userMessage].map(msg => ({
                role: msg.role as OpenAI.ChatCompletionMessageParam['role'],
                content: msg.content
              })),
              model: 'gpt-3.5-turbo',
            });

            const assistantMessage = completion.choices[0]?.message?.content;
            if (assistantMessage) {
              setTabs(prev => prev.map(t =>
                t.id === tab.id
                  ? {
                      ...t,
                      messages: [...t.messages, {
                        role: 'assistant',
                        content: assistantMessage
                      }]
                    }
                  : t
              ));
            }
          }));
        } else {
          // Process single tab
          const completion = await openai.chat.completions.create({
            messages: [...activeTab.messages, userMessage].map(msg => ({
              role: msg.role as OpenAI.ChatCompletionMessageParam['role'],
              content: msg.content
            })),
            model: 'gpt-3.5-turbo',
          });
          
          const assistantMessage = completion.choices[0]?.message?.content;
          if (assistantMessage) {
            setTabs(tabs.map(tab =>
              tab.id === activeTabId
                ? {
                    ...tab,
                    messages: [...tab.messages, {
                      role: 'assistant',
                      content: assistantMessage
                    }]
                  }
                : tab
            ));
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Chat Error:', errorMessage);
        
        let userFriendlyMessage = 'Sorry, I encountered an error. Please try again.';
        
        if (errorMessage.includes('insufficient_quota')) {
          userFriendlyMessage = 'Your OpenAI API quota has been exceeded. Please check your API key quota and billing details at platform.openai.com.';
        } else if (errorMessage.includes('invalid_api_key')) {
          userFriendlyMessage = 'Invalid API key. Please check your API key and try again.';
        }
        
        if (activeTabId === 'master') {
          const targetTabs = selectedTabs.length > 0 
            ? tabs.filter(tab => selectedTabs.includes(tab.id))
            : tabs;

          setTabs(tabs.map(tab =>
            targetTabs.some(t => t.id === tab.id)
              ? {
                  ...tab,
                  messages: [...tab.messages, {
                    role: 'assistant',
                    content: userFriendlyMessage,
                    error: true
                  }]
                }
              : tab
          ));
        } else {
          setTabs(tabs.map(tab =>
            tab.id === activeTabId
              ? {
                  ...tab,
                  messages: [...tab.messages, {
                    role: 'assistant',
                    content: userFriendlyMessage,
                    error: true
                  }]
                }
              : tab
          ));
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div role="dialog" className={`fixed z-[200] transition-all duration-300 shadow-2xl ${
      isExpanded 
        ? 'inset-0 sm:inset-4 lg:inset-8' 
        : 'bottom-20 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-96 h-[32rem]'
    } overflow-hidden`}
    >
      <div className="bg-white/80 dark:bg-black/30 backdrop-blur-md border border-indigo-200 dark:border-cyan-500/20 rounded-lg h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-200 dark:border-cyan-500/20">
          <h2 className="text-lg font-medium text-indigo-600 dark:text-cyan-300">AI Assistants</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Expand className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        {isAuthenticated && (
          <ChatTabs
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
            onNewTab={handleNewTab}
            onCloseTab={handleCloseTab}
          />
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {!isAuthenticated ? (
            <div className="h-full flex flex-col items-center justify-center p-6 relative">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 dark:from-cyan-500/5 dark:to-cyan-400/5 opacity-50" />
              
              {/* Content */}
              <div className="relative space-y-6 text-center max-w-sm">
                {/* Icon with glow effect */}
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-indigo-500/20 dark:bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 dark:from-cyan-500/10 dark:to-cyan-400/10 p-4 rounded-2xl">
                    <BrainIcon className="w-12 h-12 text-indigo-500 dark:text-cyan-500" />
                  </div>
                </div>
                
                {/* Main heading */}
                <div>
                  <h3 className="text-xl font-bold text-indigo-600 dark:text-cyan-300 mb-2">
                    Multi-Agent Chat Hub
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                    Connect with multiple AI models simultaneously
                  </p>
                  <p className="text-xs text-indigo-500/60 dark:text-cyan-400/60">
                    Compare responses, get diverse perspectives, all in one place
                  </p>
                </div>

                {/* Action button */}
                <button
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('openSettings', { detail: { section: 'ai' } }));
                  }}
                  className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white rounded-lg shadow-lg shadow-indigo-500/20 dark:shadow-cyan-500/20 hover:brightness-110 transition-all"
                >
                  <Key className="w-4 h-4" />
                  <span className="font-medium">Connect Your First Model</span>
                  <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Feature badges */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-2 py-1 text-xs bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 rounded-full">
                    Multiple Models
                  </span>
                  <span className="px-2 py-1 text-xs bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 rounded-full">
                    Parallel Chats
                  </span>
                  <span className="px-2 py-1 text-xs bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 rounded-full">
                    Response Comparison
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {activeTabId === 'master' ? (
                <MasterChatHeader
                  tabs={tabs}
                  selectedTabs={selectedTabs}
                  onSelectedTabsChange={setSelectedTabs}
                />
              ) : (
                <ChatHeader
                  selectedKeyId={activeTab.apiKeyId}
                  onKeyChange={(keyId) => handleChangeApiKey(activeTabId, keyId)}
                />
              )}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain custom-scrollbar">
                {activeTab.messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${message.error ? 'opacity-75' : ''}`}
                  >
                    <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-indigo-500 dark:bg-cyan-500 text-white'
                        : `${message.error ? 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-200' : 'bg-indigo-100 dark:bg-cyan-500/20 text-slate-800 dark:text-white'} break-words`
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-indigo-100 dark:bg-cyan-500/20">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-indigo-200 dark:border-cyan-500/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-white dark:bg-black/30 border border-indigo-200 dark:border-cyan-500/30 rounded-lg px-4 py-2 text-slate-800 dark:text-white placeholder:text-indigo-400 dark:placeholder:text-cyan-500/50 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white px-4 py-2 rounded-lg hover:brightness-110 transition-all font-medium"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};