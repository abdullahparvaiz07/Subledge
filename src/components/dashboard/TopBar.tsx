import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Plus, Menu, Sun, Moon, ChevronDown, User, Settings, LogOut, CheckCircle2, AlertCircle, Clock, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Notification } from '../../services/NotificationService';

interface TopBarProps {
  pageTitle: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenMobileSidebar: () => void;
  onAddSubscription: () => void;
  user: any;
  onSignOut: () => void;
  onNavigate: (page: string) => void;
  notifications?: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export default function TopBar({
  pageTitle, isDark, onToggleTheme, onOpenSearch,
  onOpenMobileSidebar, onAddSubscription, user, onSignOut, onNavigate,
  notifications = [], onMarkRead, onMarkAllRead
}: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'renewal': return <Bell className="w-4 h-4" />;
      case 'trial': return <AlertCircle className="w-4 h-4" />;
      case 'overspend': return <AlertCircle className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getNotifColor = (type: string, read: boolean) => {
    if (read) return isDark ? 'text-white/20' : 'text-gray-300';
    switch (type) {
      case 'renewal': return 'text-cyan-400';
      case 'trial': return 'text-amber-400';
      case 'overspend': return 'text-red-400';
      default: return 'text-emerald-400';
    }
  };

  const timeAgo = (date: any) => {
    const d = date?.toDate ? date.toDate() : new Date(date);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <header className={`sticky top-0 z-50 flex items-center gap-4 px-4 sm:px-6 py-4 border-b backdrop-blur-xl ${
      isDark ? 'bg-[#0d1520]/80 border-white/5' : 'bg-white/80 border-black/5'
    }`}>
      {/* Mobile menu */}
      <button onClick={onOpenMobileSidebar} className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-white/60">
        <Menu className="w-5 h-5" />
      </button>

      {/* Page Title */}
      <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {pageTitle}
      </h1>

      {/* Search Bar Trigger */}
      <button
        onClick={onOpenSearch}
        className={`hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl flex-1 max-w-md ml-8 text-sm transition-colors ${
          isDark ? 'bg-white/5 hover:bg-white/8 text-white/30' : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
        }`}
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded border ${
          isDark ? 'bg-white/5 border-white/10 text-white/20' : 'bg-white border-gray-200 text-gray-400'
        }`}>⌘K</kbd>
      </button>

      <div className="flex-1 sm:hidden" />

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Add Button */}
        <button
          onClick={onAddSubscription}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Sub</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-white/40' : 'hover:bg-gray-100 text-gray-400'}`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Bell + Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className={`relative p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-white/40' : 'hover:bg-gray-100 text-gray-400'}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifPanel && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[420px] rounded-2xl border shadow-2xl overflow-hidden ${
                  isDark ? 'bg-[#1a2332] border-white/10' : 'bg-white border-gray-200'
                }`}
              >
                {/* Header */}
                <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded-full">{unreadCount} new</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && onMarkAllRead && (
                      <button onClick={onMarkAllRead} className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 px-2 py-1">
                        Mark all read
                      </button>
                    )}
                    <button onClick={() => { onNavigate('reminders'); setShowNotifPanel(false); }}
                      className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 px-2 py-1">
                      View All
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto max-h-[340px] scrollbar-dark">
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <Bell className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-white/10' : 'text-gray-200'}`} />
                      <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>No notifications yet</p>
                      <p className={`text-[10px] mt-1 ${isDark ? 'text-white/15' : 'text-gray-300'}`}>
                        We'll alert you when subscriptions are due
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 15).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => { if (!notif.read && onMarkRead) onMarkRead(notif.id); }}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                          !notif.read
                            ? isDark ? 'bg-white/[0.03] hover:bg-white/[0.06]' : 'bg-blue-50/50 hover:bg-blue-50'
                            : isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`mt-0.5 shrink-0 ${getNotifColor(notif.type, notif.read)}`}>
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium ${
                            !notif.read
                              ? isDark ? 'text-white/80' : 'text-gray-700'
                              : isDark ? 'text-white/30' : 'text-gray-400'
                          }`}>
                            {notif.title}
                          </p>
                          <p className={`text-[10px] mt-0.5 leading-relaxed ${isDark ? 'text-white/20' : 'text-gray-300'}`}>
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] ${isDark ? 'text-white/15' : 'text-gray-300'}`}>
                              {timeAgo(notif.createdAt)}
                            </span>
                            {notif.emailSent && (
                              <span className="text-[10px] text-emerald-400/60 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Email sent
                              </span>
                            )}
                          </div>
                        </div>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar + Dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-colors ${
              isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'
            }`}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-lg border border-white/10 object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {(user?.displayName || user?.email || '?')[0].toUpperCase()}
              </div>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showUserMenu ? 'rotate-180' : ''} ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-2xl overflow-hidden ${
                  isDark ? 'bg-[#1a2332] border-white/10' : 'bg-white border-gray-200'
                }`}
              >
                <div className={`px-4 py-3 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user?.displayName || 'User'}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{user?.email}</p>
                </div>
                <div className="p-1.5">
                  {[
                    { icon: User, label: 'Profile', action: () => { onNavigate('settings'); setShowUserMenu(false); } },
                    { icon: Settings, label: 'Settings', action: () => { onNavigate('settings'); setShowUserMenu(false); } },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                  <div className={`my-1 h-px ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
                  <button
                    onClick={() => { onSignOut(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
