import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, LayoutDashboard, CreditCard, BarChart3, Bell, Tag, Users, Settings, ArrowRight } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: 'page' | 'subscription' | 'action';
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  subscriptions: any[];
}

const PAGE_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'reminders', label: 'Reminders', icon: <Bell className="w-4 h-4" /> },
  { id: 'categories', label: 'Categories', icon: <Tag className="w-4 h-4" /> },
  { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export default function CommandPalette({ isOpen, onClose, onNavigate, subscriptions }: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    ...PAGE_ITEMS.map(p => ({
      ...p,
      category: 'page' as const,
      action: () => { onNavigate(p.id); onClose(); },
    })),
    ...subscriptions.map(sub => ({
      id: `sub-${sub.id}`,
      label: sub.name,
      icon: <CreditCard className="w-4 h-4" />,
      category: 'subscription' as const,
      action: () => { onNavigate('subscriptions'); onClose(); },
    })),
  ];

  const filtered = searchQuery
    ? items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [filtered, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-[#1a2332] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-white/30" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search subscriptions, pages, actions..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
              />
              <kbd className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-1 rounded border border-white/10">ESC</kbd>
            </div>
            <div className="max-h-[360px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-white/30 text-sm">No results found</div>
              ) : (
                <>
                  {['page', 'subscription'].map(category => {
                    const categoryItems = filtered.filter(i => i.category === category);
                    if (categoryItems.length === 0) return null;
                    return (
                      <div key={category} className="mb-2">
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20 px-3 py-2">
                          {category === 'page' ? 'Pages' : 'Subscriptions'}
                        </div>
                        {categoryItems.map(item => {
                          const globalIdx = filtered.indexOf(item);
                          return (
                            <button
                              key={item.id}
                              onClick={item.action}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors ${
                                globalIdx === selectedIndex
                                  ? 'bg-cyan-500/10 text-cyan-400'
                                  : 'text-white/60 hover:text-white/80'
                              }`}
                            >
                              <span className="opacity-60">{item.icon}</span>
                              <span className="flex-1 text-left">{item.label}</span>
                              {globalIdx === selectedIndex && <ArrowRight className="w-4 h-4 opacity-40" />}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            <div className="flex items-center gap-4 px-5 py-3 border-t border-white/5 text-[10px] text-white/20">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
