import React, { useState, useRef, useEffect } from 'react';
import { Key, ChevronDown, Settings, Brain as BrainIcon } from 'lucide-react';
import { getOpenAIInstance } from '../../../utils/openai';
import { useAI } from '../../../context/AIContext';
import type { OpenAI } from 'openai';
import type { ChatMessage } from '../../../types';

export const ChatWidget = () => {
  const { isAuthenticated, apiKeys, activeKey } = useAI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeySelector, setShowKeySelector] = React.useState(false);
  const [selectedKeyId, setSelectedKeyId] = React.useState(activeKey?.id || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const selectedKey = selectedKeyId 
    ? apiKeys.find(k => k.id === selectedKeyId)
    : activeKey;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowKeySelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. How can I help you today?'
      }]);
    }
  }, [isAuthenticated]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage: ChatMessage = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const openai = getOpenAIInstance();
        const completion = await openai.chat.completions.create({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role as OpenAI.ChatCompletionMessageParam['role'],
            content: msg.content
          })),
          model: 'gpt-3.5-turbo',
        });

        const assistantMessage = completion.choices[0]?.message?.content;
        if (assistantMessage) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: assistantMessage
          }]);
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
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: userFriendlyMessage,
          error: true
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!isAuthenticated ? (
        <div className="h-full flex flex-col items-center justify-center p-4">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-indigo-500/20 dark:bg-cyan-500/20 rounded-full blur-lg animate-pulse" />
            <div className="relative p-3 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 dark:from-cyan-500/10 dark:to-cyan-400/10 rounded-xl">
              <BrainIcon className="w-8 h-8 text-indigo-500 dark:text-cyan-500" />
            </div>
          </div>
          <h3 className="text-base font-medium text-indigo-600 dark:text-cyan-300 mb-1">
            Connect Your AI Assistant
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">
            Add your API key to start chatting
          </p>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('openSettings', { detail: { section: 'ai' } }));
            }}
            className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white rounded-lg hover:brightness-110 transition-all group"
          >
            <Key className="w-4 h-4" />
            <span>Add API Key</span>
            <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* API Key Selector */}
          <div className="px-4 py-2 border-b border-indigo-200 dark:border-cyan-500/20">
            <div
              ref={selectorRef}
              className="relative max-w-[200px] z-20"
            >
              <div
                onClick={() => setShowKeySelector(!showKeySelector)}
                className="w-full flex items-center justify-between gap-2 px-2 py-1 bg-white dark:bg-black/30 border border-indigo-200 dark:border-cyan-500/30 rounded-lg text-xs text-slate-800 dark:text-white hover:border-indigo-500 dark:hover:border-cyan-500 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-500" />
                  <span>{selectedKey?.name || 'Select API Key'}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 group-hover:text-indigo-500 dark:group-hover:text-cyan-500 ${
                  showKeySelector ? 'rotate-180' : ''
                }`} />
              </div>

              {/* Dropdown */}
              {showKeySelector && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-black/90 rounded-lg shadow-xl border border-slate-200 dark:border-cyan-500/20 py-1 z-10 backdrop-blur-sm">
                  {apiKeys.map((key) => (
                    <button
                      key={key.id}
                      onClick={() => {
                        setSelectedKeyId(key.id);
                        setShowKeySelector(false);
                      }}
                      className={`w-full px-2 py-1 text-left text-xs flex items-center gap-2 ${
                        key.id === selectedKeyId
                          ? 'bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-300'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <Key className={`w-2.5 h-2.5 ${
                        key.id === selectedKeyId
                          ? 'text-indigo-500 dark:text-cyan-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`} />
                      {key.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${message.error ? 'opacity-75' : ''}`}
              >
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-indigo-500 dark:bg-cyan-500 text-white'
                    : `${message.error ? 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-200' : 'bg-indigo-100 dark:bg-cyan-500/20 text-slate-800 dark:text-white'}`
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
            <div className="flex gap-2 pr-6">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white dark:bg-black/30 border border-indigo-200 dark:border-cyan-500/30 rounded-lg px-4 py-2 text-slate-800 dark:text-white placeholder:text-indigo-400 dark:placeholder:text-cyan-500/50 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500 min-w-0"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="shrink-0 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white px-4 py-2 rounded-lg hover:brightness-110 transition-all font-medium"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};