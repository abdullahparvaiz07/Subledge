import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Calendar, List, Clock, CheckCircle2, AlertCircle, ChevronRight, Mail, Smartphone, Monitor, Settings, ExternalLink } from 'lucide-react';
import type { Notification } from '../../services/NotificationService';

interface RemindersPageProps {
  subscriptions: any[];
  isDark: boolean;
  currencySymbols: Record<string, string>;
  notifications?: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export default function RemindersPage({ subscriptions, isDark, currencySymbols, notifications = [], onMarkRead, onMarkAllRead }: RemindersPageProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [defaultLeadDays, setDefaultLeadDays] = useState(2);
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [emailConfig, setEmailConfig] = useState({
    serviceId: localStorage.getItem('subledge_emailjs_service_id') || '',
    templateId: localStorage.getItem('subledge_emailjs_template_id') || '',
    publicKey: localStorage.getItem('subledge_emailjs_public_key') || '',
  });

  const reminders = useMemo(() => {
    const now = new Date();
    return subscriptions
      .filter(sub => sub.nextBillingDate)
      .map(sub => {
        const nextDate = sub.nextBillingDate?.toDate ? sub.nextBillingDate.toDate() : new Date(sub.nextBillingDate);
        const diff = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { ...sub, nextDate, daysRemaining: diff };
      })
      .filter(s => s.daysRemaining >= -1)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [subscriptions]);

  const groups = useMemo(() => {
    const today = reminders.filter(r => r.daysRemaining <= 0);
    const tomorrow = reminders.filter(r => r.daysRemaining === 1);
    const thisWeek = reminders.filter(r => r.daysRemaining >= 2 && r.daysRemaining <= 7);
    const nextWeek = reminders.filter(r => r.daysRemaining >= 8 && r.daysRemaining <= 14);
    const later = reminders.filter(r => r.daysRemaining > 14);
    return [
      { label: 'Today', items: today, color: 'text-red-400' },
      { label: 'Tomorrow', items: tomorrow, color: 'text-amber-400' },
      { label: 'This Week', items: thisWeek, color: 'text-amber-400' },
      { label: 'Next Week', items: nextWeek, color: 'text-emerald-400' },
      { label: 'Later', items: later, color: 'text-white/40' },
    ].filter(g => g.items.length > 0);
  }, [reminders]);

  const getUrgencyBg = (days: number) => {
    if (days <= 0) return isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200';
    if (days <= 3) return isDark ? 'bg-red-500/5 border-red-500/10' : 'bg-red-50/50 border-red-100';
    if (days <= 7) return isDark ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50/50 border-amber-100';
    return isDark ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100';
  };

  const unreadNotifs = notifications.filter(n => !n.read);
  const readNotifs = notifications.filter(n => n.read);

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

  const handleSaveEmailConfig = () => {
    localStorage.setItem('subledge_emailjs_service_id', emailConfig.serviceId);
    localStorage.setItem('subledge_emailjs_template_id', emailConfig.templateId);
    localStorage.setItem('subledge_emailjs_public_key', emailConfig.publicKey);
    setShowEmailSetup(false);
  };

  const isEmailConfigured = emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey;

  const cardClass = `rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100'}`;
  const inputClass = `w-full px-3 py-2.5 rounded-xl text-xs border outline-none transition-all ${isDark ? 'bg-white/5 border-white/10 text-white focus:ring-1 focus:ring-cyan-500/30 placeholder:text-white/20' : 'bg-gray-50 border-gray-200 text-gray-700 focus:ring-1 focus:ring-cyan-500/20 placeholder:text-gray-400'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Reminders</h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{reminders.length} upcoming renewals</p>
        </div>
        <div className={`flex rounded-lg border p-0.5 ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
          {[{ key: 'list', icon: List }, { key: 'calendar', icon: Calendar }].map(v => (
            <button key={v.key} onClick={() => setViewMode(v.key as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === v.key ? (isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-900 shadow-sm') : (isDark ? 'text-white/30' : 'text-gray-400')
              }`}>
              <v.icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reminder Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {groups.map(group => (
            <div key={group.label}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${group.color}`}>{group.label}</h3>
              <div className="space-y-2">
                {group.items.map((item, idx) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all hover:-translate-y-0.5 ${getUrgencyBg(item.daysRemaining)}`}>
                    {item.daysRemaining <= 0 && (
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{item.name}</p>
                      <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                        {item.nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                        {currencySymbols[item.currency || 'USD'] || '$'}{item.amount?.toFixed(2)}
                      </p>
                      <p className={`text-[10px] font-bold ${item.daysRemaining <= 0 ? 'text-red-400' : item.daysRemaining <= 3 ? 'text-red-400' : item.daysRemaining <= 7 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {item.daysRemaining <= 0 ? 'Today' : `${item.daysRemaining}d`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          {groups.length === 0 && (
            <div className={`${cardClass} p-12 text-center`}>
              <Bell className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-white/10' : 'text-gray-200'}`} />
              <p className={`text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>No upcoming reminders</p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Email Setup */}
          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Email Reminders</h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isEmailConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {isEmailConfigured ? 'Active' : 'Not Set Up'}
              </span>
            </div>

            <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              {isEmailConfigured
                ? 'Email reminders are active! You\'ll receive emails 2 days before subscriptions renew.'
                : 'Set up EmailJS to receive email reminders before your subscriptions renew.'}
            </p>

            {!showEmailSetup ? (
              <button
                onClick={() => setShowEmailSetup(true)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isEmailConfigured
                    ? isDark ? 'border border-white/10 text-white/40 hover:bg-white/5' : 'border border-gray-200 text-gray-400 hover:bg-gray-50'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                {isEmailConfigured ? 'Update Config' : 'Set Up EmailJS'}
              </button>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Service ID</label>
                  <input type="text" value={emailConfig.serviceId} onChange={e => setEmailConfig(c => ({ ...c, serviceId: e.target.value }))}
                    placeholder="service_xxxxxxx" className={inputClass} />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Template ID</label>
                  <input type="text" value={emailConfig.templateId} onChange={e => setEmailConfig(c => ({ ...c, templateId: e.target.value }))}
                    placeholder="template_xxxxxxx" className={inputClass} />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Public Key</label>
                  <input type="text" value={emailConfig.publicKey} onChange={e => setEmailConfig(c => ({ ...c, publicKey: e.target.value }))}
                    placeholder="Your EmailJS public key" className={inputClass} />
                </div>
                <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] text-cyan-400 hover:text-cyan-300">
                  <ExternalLink className="w-3 h-3" /> Get free EmailJS keys (200 emails/month)
                </a>
                <div className="flex gap-2">
                  <button onClick={handleSaveEmailConfig}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold transition-colors">
                    Save
                  </button>
                  <button onClick={() => setShowEmailSetup(false)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-colors ${isDark ? 'border-white/10 text-white/40 hover:bg-white/5' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Defaults */}
          <div className={`${cardClass} p-5`}>
            <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Reminder Defaults</h3>
            <div className="space-y-4">
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Lead Time</label>
                <select value={defaultLeadDays} onChange={e => setDefaultLeadDays(Number(e.target.value))}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'} outline-none`}>
                  {[1, 2, 3, 5, 7, 14, 30].map(d => <option key={d} value={d} style={isDark ? { backgroundColor: '#1a2332', color: '#e2e8f0' } : {}}>{d} days before</option>)}
                </select>
              </div>
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Channels</label>
                <div className="space-y-2">
                  {[
                    { icon: Mail, label: 'Email', sublabel: isEmailConfigured ? 'Configured' : 'Not set up', checked: !!isEmailConfigured },
                    { icon: Monitor, label: 'Browser', sublabel: 'Push notifications', checked: true },
                    { icon: Bell, label: 'In-App', sublabel: 'Always active', checked: true },
                  ].map(ch => (
                    <label key={ch.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                      <input type="checkbox" defaultChecked={ch.checked} className="w-4 h-4 accent-cyan-500 rounded" />
                      <ch.icon className="w-4 h-4 opacity-40" />
                      <div className="flex-1">
                        <span className={`text-xs block ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{ch.label}</span>
                        <span className={`text-[10px] ${isDark ? 'text-white/20' : 'text-gray-300'}`}>{ch.sublabel}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification History — from real Firestore data */}
          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Recent Notifications</h3>
              {unreadNotifs.length > 0 && onMarkAllRead && (
                <button onClick={onMarkAllRead} className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300">Mark all read</button>
              )}
            </div>
            <div className="space-y-1">
              {notifications.length === 0 ? (
                <div className="py-6 text-center">
                  <Bell className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-white/10' : 'text-gray-200'}`} />
                  <p className={`text-xs ${isDark ? 'text-white/20' : 'text-gray-300'}`}>No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 10).map(n => (
                  <div
                    key={n.id}
                    onClick={() => !n.read && onMarkRead?.(n.id)}
                    className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                      !n.read ? (isDark ? 'bg-white/[0.03] hover:bg-white/[0.06]' : 'bg-blue-50/50 hover:bg-blue-50') : (isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50')
                    }`}
                  >
                    {n.type === 'renewal' ? (
                      <Bell className={`w-4 h-4 mt-0.5 shrink-0 ${!n.read ? 'text-cyan-400' : isDark ? 'text-white/20' : 'text-gray-300'}`} />
                    ) : n.type === 'trial' ? (
                      <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${!n.read ? 'text-amber-400' : isDark ? 'text-white/20' : 'text-gray-300'}`} />
                    ) : (
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${!n.read ? 'text-emerald-400' : isDark ? 'text-white/20' : 'text-gray-300'}`} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${!n.read ? (isDark ? 'text-white/70' : 'text-gray-700') : (isDark ? 'text-white/30' : 'text-gray-400')}`}>{n.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className={`text-[10px] ${isDark ? 'text-white/20' : 'text-gray-300'}`}>{timeAgo(n.createdAt)}</p>
                        {n.emailSent && (
                          <span className="text-[10px] text-emerald-400/60 flex items-center gap-0.5">
                            <Mail className="w-2.5 h-2.5" /> sent
                          </span>
                        )}
                      </div>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
