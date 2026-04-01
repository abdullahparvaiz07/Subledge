import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, CreditCard, BarChart3, Bell, Tag, Users, Settings,
  LogOut, ChevronLeft, ChevronRight, Gem, X
} from 'lucide-react';
import { Logo } from '../../App';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isDark: boolean;
  user: any;
  userProfile: any;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '📊' },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, emoji: '💳' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, emoji: '📈' },
  { id: 'reminders', label: 'Reminders', icon: Bell, emoji: '🔔' },
  { id: 'categories', label: 'Categories', icon: Tag, emoji: '🏷️' },
  { id: 'team', label: 'Team', icon: Users, emoji: '👥' },
  { id: 'settings', label: 'Settings', icon: Settings, emoji: '⚙️' },
];

function SidebarContent({
  currentPage, onNavigate, isCollapsed, onToggleCollapse,
  isDark, user, userProfile, onSignOut, onMobileClose
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 ${isCollapsed ? 'justify-center' : ''}`}>
        <Logo isDark={true} />
        {!isCollapsed && (
          <span className="text-lg font-semibold text-white tracking-wide">Subledge</span>
        )}
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/40"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1 mt-4">
        {NAV_ITEMS.map(item => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onMobileClose(); }}
              className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-cyan-400 rounded-r-full shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Upgrade Card (for free users) */}
      {!isCollapsed && userProfile?.plan !== 'pro' && (
        <div className="mx-3 mb-4 p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Gem className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white/80">Upgrade to Pro</span>
          </div>
          <p className="text-[10px] text-white/40 mb-3 leading-relaxed">
            Unlock AI insights, team features, and unlimited exports.
          </p>
          <button className="w-full py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/30 transition-colors">
            View Plans
          </button>
        </div>
      )}

      {/* Collapse Toggle (Desktop only) */}
      <div className="hidden lg:block px-3 mb-2">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors text-xs"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> <span>Collapse</span></>}
        </button>
      </div>

      {/* User Profile */}
      <div className={`px-3 pb-4 border-t border-white/5 pt-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isCollapsed ? (
          <button
            onClick={onSignOut}
            className="p-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full border border-white/10" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {(user?.displayName || user?.email || '?')[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/80 truncate">{user?.displayName || 'User'}</p>
              <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
            </div>
            <button
              onClick={onSignOut}
              className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: props.isCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col h-screen bg-[#0f1923] border-r border-white/5 shrink-0 overflow-hidden sticky top-0"
      >
        <SidebarContent {...props} />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {props.isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[90] lg:hidden backdrop-blur-sm"
              onClick={props.onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0f1923] z-[100] lg:hidden overflow-hidden"
            >
              <SidebarContent {...props} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
