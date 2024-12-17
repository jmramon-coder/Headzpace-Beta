import React, { useState } from 'react';
import {
  ChevronDown,
  Sparkles,
  Brain,
  Palette,
  Clock,
  FileText,
  Radio,
  CheckSquare,
  MessageCircle,
  Shuffle,
  Check,
  Database,
  LogIn
} from 'lucide-react';
import { DndContext, DragEndEvent, pointerWithin } from '@dnd-kit/core';
import { ImageCycler } from './widgets/Media/ImageCycler';
import { getNextLayout } from '../utils/layouts';
import { WaitlistModal } from './waitlist/WaitlistModal';
import { WidgetWrapper } from './WidgetWrapper';
import { DemoRadio } from './widgets/DemoRadio';
import type { Widget } from '../types';

interface Props {
  onSignup: () => void;
}

const titles = [
  "Step Into Your Sanctuary",
  "Welcome to Your Space of Focus",
  "Your Digital Refuge Awaits",
  "Enter Your Creative Haven",
  "Unlock Your Personal Hub",
  "Discover Your Headspace",
  "Your Batcave, Your Rules",
  "Create, Think, and Thrive",
  "Customize Your World",
  "Your Gateway to Clarity"
];

export const Login = ({ onSignup }: Props) => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentLayout, setCurrentLayout] = useState(0);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'chat-widget',
      type: 'chat',
      position: { x: 20, y: 20 },
      size: { width: 480, height: 320 }
    },
    {
      id: 'media-widget-1',
      type: 'media',
      position: { x: 520, y: 20 },
      size: { width: 480, height: 160 }
    },
    {
      id: 'media-widget-2',
      type: 'media',
      position: { x: 20, y: 360 },
      size: { width: 480, height: 160 }
    },
    {
      id: 'clock-widget',
      type: 'clock',
      position: { x: 520, y: 200 },
      size: { width: 240, height: 140 }
    },
    {
      id: 'music-widget',
      type: 'radio',
      position: { x: 780, y: 200 },
      size: { width: 240, height: 180 }
    },
    {
      id: 'tasks-widget',
      type: 'tasks',
      position: { x: 520, y: 400 },
      size: { width: 480, height: 160 }
    }
  ]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    setWidgets(widgets.map(widget => {
      if (widget.id === active.id) {
        return {
          ...widget,
          position: {
            x: widget.position.x + delta.x,
            y: widget.position.y + delta.y
          }
        };
      }
      return widget;
    }));
  };

  const handleResize = (id: string, size: { width: number; height: number }) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    ));
  };

  const shuffleWidgets = () => {
    const newWidgets = getNextLayout(widgets, currentLayout);
    setCurrentLayout((prev) => (prev + 1) % 5);
    setWidgets(newWidgets);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Widget Showcase */}
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="max-w-7xl w-full mx-auto mt-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 bg-clip-text text-transparent">
              Experience Your Workspace
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4">
              The tools you need, in the space you deserve
            </p>
            <button
              onClick={shuffleWidgets}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-cyan-500/10 text-indigo-600 dark:text-cyan-300 rounded-lg backdrop-blur-sm border border-slate-200 dark:border-cyan-500/20 transition-all hover:scale-105"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle Layout</span>
            </button>
          </div>

          <div className="relative h-[640px] max-w-6xl mx-auto mb-24">
            <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
              {widgets.map(widget => (
                <WidgetWrapper
                  key={widget.id}
                  widget={widget}
                  onRemove={() => {}}
                  onResize={handleResize}
                >
                  {widget.type === 'chat' && (
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <MessageCircle className="w-5 h-5 text-indigo-500 dark:text-cyan-500 mr-2" />
                        <span className="text-slate-800 dark:text-white font-medium">AI Chat</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-start">
                          <div className="bg-indigo-500/10 dark:bg-cyan-500/10 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-400 max-w-[80%]">
                            Welcome! I'm your AI assistant. How can I help enhance your productivity today?
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-indigo-500 dark:bg-cyan-500 p-3 rounded-lg text-sm text-white max-w-[80%]">
                            I need help brainstorming ideas for my new project and managing tasks
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-indigo-500/10 dark:bg-cyan-500/10 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-400 max-w-[80%]">
                            I'd be happy to help! Let's break this down into manageable steps. First, let's outline your project goals and create a structured task list.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {widget.type === 'media' && (
                    <ImageCycler
                      images={[
                        widget.id === 'media-widget-1'
                          ? 'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733940233/maza2019_surrealistic_linocut_black__white_art_of_a_guyanese_bl_5b4f758b-b775-40d0-979e-7a75b5482ae9_foh91l.png'
                          : 'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733947883/creatorstuart_Red_balloons_float_on_a_misty_street_in_1920s_Der_d5c5aeac-c3f4-4335-a199-f60beb9e6064_b7q3di.png',
                        widget.id === 'media-widget-1'
                          ? 'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733940237/joekr_engineer_armor_--v_6.1_e3b1abe8-412f-4fd4-96f1-1018efb9877f_b2mbnz.png'
                          : 'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733947880/s3chek_92897_real_image_of_wooden_bench_in_nature_on_top_of_a_h_cf577a48-3c31-4ee5-85fa-4ea849a8bc24_fvirjt.png'
                      ]}
                      interval={6000}
                    />
                  )}
                  {widget.type === 'clock' && (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Clock className="w-8 h-8 text-indigo-500 dark:text-cyan-500 mb-2" />
                      <div className="text-base font-medium text-indigo-600 dark:text-cyan-300">12:00</div>
                      <div className="text-xs text-indigo-500/60 dark:text-cyan-400/60">Monday, Jan 1</div>
                    </div>
                  )}
                  {widget.type === 'radio' && (
                    <DemoRadio />
                  )}
                  {widget.type === 'tasks' && (
                    <div className="p-4">
                      <div className="flex items-center mb-4">
                        <CheckSquare className="w-5 h-5 text-indigo-500 dark:text-cyan-500 mr-2" />
                        <span className="text-slate-800 dark:text-white font-medium">Tasks</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 border border-indigo-500 dark:border-cyan-500 rounded-sm mr-2" />
                          <span className="text-slate-600 dark:text-slate-400">Complete project setup</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-indigo-500 dark:bg-cyan-500 rounded-sm mr-2" />
                          <span className="text-slate-400 dark:text-slate-500 line-through">Update dependencies</span>
                        </div>
                      </div>
                    </div>
                  )}
                </WidgetWrapper>
              ))}
            </DndContext>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-sm text-slate-600 dark:text-slate-400 mb-2">Discover More</span>
          <ChevronDown className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
        </div>
      </div>

      {/* Product Section */}
      <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/80 to-white dark:from-[#1a2628] dark:to-[#2C3B3E] py-24 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mt-12 mb-16">
            <h2 className="text-4xl font-bold text-indigo-600 dark:text-white mb-4 leading-tight">
              Unleash Your Potential with a Space Built for You
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Transform how you work, think, and create with an AI-powered workspace that adapts to your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative">
            {/* Decorative gradient circles */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl" />
            </div>

            {/* Feature 1: Customizable Workspace */}
            <div className="group relative bg-white/80 dark:bg-[#2C3B3E]/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-indigo-100 dark:border-[#3d4f53] hover:border-indigo-500 dark:hover:border-cyan-400 transition-all hover:scale-[1.02] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 dark:from-cyan-500/5 dark:to-cyan-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-[#3d4f53] dark:to-[#2C3B3E] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-lg">
                <Palette className="w-6 h-6 text-indigo-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                Your Space, Your Rules
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Save custom layouts like 'Focus Mode' or 'Creative Space'. Effortlessly arrange, resize, and personalize widgets with instant layout shuffling.
              </p>
              <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-cyan-400">
                <span>Try shuffling</span>
                <Shuffle className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            
            {/* Feature 2: AI Integration */}
            <div className="group relative bg-white/80 dark:bg-[#2C3B3E]/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-indigo-100 dark:border-[#3d4f53] hover:border-indigo-500 dark:hover:border-cyan-400 transition-all hover:scale-[1.02] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 dark:from-cyan-500/5 dark:to-cyan-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-[#3d4f53] dark:to-[#2C3B3E] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-lg">
                <Brain className="w-6 h-6 text-indigo-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                Multi-LLM Mastery
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Connect multiple AI models and use Master Chat to broadcast queries across them. Compare responses and get diverse perspectives instantly.
              </p>
              <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-cyan-400">
                <span>Multiple models</span>
                <div className="flex -space-x-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 dark:bg-cyan-500/20" />
                  <div className="w-4 h-4 rounded-full bg-indigo-500/40 dark:bg-cyan-500/40" />
                  <div className="w-4 h-4 rounded-full bg-indigo-500/60 dark:bg-cyan-500/60" />
                </div>
              </div>
            </div>
            
            {/* Feature 3: Smart Features */}
            <div className="group relative bg-white/80 dark:bg-[#2C3B3E]/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-indigo-100 dark:border-[#3d4f53] hover:border-indigo-500 dark:hover:border-cyan-400 transition-all hover:scale-[1.02] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 dark:from-cyan-500/5 dark:to-cyan-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-[#3d4f53] dark:to-[#2C3B3E] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-lg">
                <Sparkles className="w-6 h-6 text-indigo-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                Essential Widgets
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                From AI Chat and Notes to Tasks and Radio Player, our core widgets work together seamlessly. Stay focused and productive with everything you need.
              </p>
              <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-cyan-400">
                <span>Core widgets</span>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <FileText className="w-4 h-4" />
                  <CheckSquare className="w-4 h-4" />
                  <Radio className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
            
          {/* Pricing Section */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-indigo-600 dark:text-white mb-4">
                Choose Your Experience
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                First month free during our beta phase. No credit card required.
              </p>
              <div className="relative max-w-3xl mx-auto mb-12 group">
                {/* Animated gradient border */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-500 dark:from-cyan-500 dark:via-cyan-400 dark:to-cyan-400 rounded-2xl opacity-75 animate-gradient-x blur-[1px] group-hover:blur-[2px] transition-all" />
                
                <div className="relative bg-white/95 dark:bg-black/90 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative p-2.5 bg-indigo-100 dark:bg-cyan-500/30 rounded-xl">
                        <Database className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                      </div>
                      <h4 className="text-base font-medium text-slate-800 dark:text-white">
                        Storage System Update
                      </h4>
                      <span className="px-2 py-0.5 text-xs bg-indigo-100 dark:bg-cyan-500/40 text-indigo-600 dark:text-cyan-300 rounded-full font-medium">
                        Beta Phase
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-indigo-50/50 dark:bg-cyan-500/10 rounded-xl border border-indigo-100/50 dark:border-cyan-500/20">
                      <p className="text-sm font-medium text-slate-800 dark:text-white mb-1">Currently</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                        Browser-based storage
                      </p>
                    </div>
                    <div className="p-3 bg-indigo-50/50 dark:bg-cyan-500/10 rounded-xl border border-indigo-100/50 dark:border-cyan-500/20">
                      <p className="text-sm font-medium text-slate-800 dark:text-white mb-1">Free Users</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                        Local file system with import/export
                      </p>
                      <span className="inline-block px-1.5 py-0.5 text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
                        Coming Soon
                      </span>
                    </div>
                    <div className="p-3 bg-indigo-50/50 dark:bg-cyan-500/10 rounded-xl border border-indigo-100/50 dark:border-cyan-500/20">
                      <p className="text-sm font-medium text-slate-800 dark:text-white mb-1">Pro Users</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                        Cloud sync & cross-device access
                      </p>
                      <span className="inline-block px-1.5 py-0.5 text-[10px] bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-full font-medium">
                        In Development
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="relative bg-white dark:bg-[#2C3B3E] rounded-2xl shadow-xl border border-indigo-100 dark:border-[#3d4f53] p-8">
                <div className="absolute -top-4 left-4 px-4 py-1 bg-indigo-100 dark:bg-cyan-500/20 rounded-full">
                  <span className="text-sm font-medium text-indigo-600 dark:text-cyan-300">
                    Local Storage
                  </span>
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Free</h3>
                  <p className="text-slate-600 dark:text-slate-400">Perfect for personal use</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600 dark:text-slate-300">All Core Widgets</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 dark:text-slate-300">Local Layout Saving</span>
                      <span className="px-2 py-0.5 text-xs bg-indigo-100 dark:bg-cyan-500/20 text-indigo-600 dark:text-cyan-300 rounded-full">Beta</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600 dark:text-slate-300">Multiple API Keys</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600 dark:text-slate-300">Master Chat</span>
                  </li>
                </ul>
                <button
                  onClick={onSignup}
                  className="w-full py-3 px-6 rounded-lg bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-300 font-medium hover:bg-indigo-100 dark:hover:bg-cyan-500/20 transition-colors group relative"
                >
                  Enter Your Space
                  <div className="absolute inset-0 bg-indigo-500/5 dark:bg-cyan-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-cyan-500/5 dark:to-cyan-500/10 rounded-full">
                    <span className="text-xs text-indigo-600 dark:text-cyan-300">Will always be free</span>
                    <div className="relative">
                      <div className="absolute inset-0 text-red-500 dark:text-red-400 animate-ping">❤</div>
                      <div className="relative text-red-500 dark:text-red-400">❤</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="relative bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-400 rounded-2xl shadow-xl p-8 text-white">
                <div className="absolute -top-4 left-4 px-4 py-1 bg-white/90 dark:bg-black/30 backdrop-blur-sm rounded-full">
                  <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 bg-clip-text text-transparent">
                    Early Access
                  </span>
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">$5</span>
                    <span className="text-white/80">/month</span>
                  </div>
                  <p className="text-white/80 mt-2">For power users</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    <span>All Free Features</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    <span>Cloud Sync & Cross-Device Access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    <div>
                      <span>Early Access to Premium Widgets</span>
                      <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">Coming Soon</span>
                    </div>
                  </li>
                </ul>
                <button
                  onClick={() => setIsWaitlistOpen(true)}
                  className="w-full py-3 px-6 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors relative group"
                >
                  <span>Join Waitlist</span>
                  <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <p className="text-center text-white/60 text-sm mt-4 group">
                  <span className="inline-flex items-center gap-2">
                    <span>Exclusive drops of game-changing features</span>
                    <Sparkles className="w-3.5 h-3.5 opacity-75 group-hover:scale-110 transition-transform" />
                  </span>
                </p>
              </div>
            </div>
          </div>
      </div>
    </div>
      
      {/* Guest CTA Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 bg-clip-text text-transparent">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Create your free account and unlock the full potential of your digital workspace.
          </p>
          <button
            onClick={onSignup}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white rounded-xl font-semibold hover:brightness-110 transition-all"
          >
            <LogIn className="w-5 h-5" />
            Get Started
          </button>
        </div>
      </div>
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
};