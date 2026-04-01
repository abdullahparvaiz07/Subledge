import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User, Settings, Bell, Shield, CreditCard, Link2, Camera, Moon, Sun, Monitor,
  Globe, Calendar, Trash2, Smartphone, LogOut, QrCode, Key, Check
} from 'lucide-react';

interface SettingsPageProps {
  isDark: boolean;
  user: any;
  userProfile: any;
  onSignOut: () => void;
  onToggleTheme: () => void;
}

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'connected', label: 'Connected', icon: Link2 },
];

export default function SettingsPage({ isDark, user, userProfile, onSignOut, onToggleTheme }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(isDark ? 'dark' : 'light');
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [budgetDay, setBudgetDay] = useState(1);

  const cardClass = `p-6 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100'}`;
  const inputClass = `w-full px-4 py-3 rounded-xl text-sm border-transparent focus:ring-2 outline-none transition-all ${
    isDark ? 'bg-white/5 focus:ring-cyan-500/30 text-white placeholder:text-white/30' : 'bg-gray-100 focus:ring-cyan-500/20 text-gray-900 placeholder:text-gray-400'
  }`;
  const labelClass = `text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-white/30' : 'text-gray-400'}`;

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className={cardClass}>
              <h3 className={`text-sm font-bold mb-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Profile Information</h3>
              <div className="flex items-center gap-6 mb-6">
                <div className="relative group">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-20 h-20 rounded-2xl border-2 border-white/10 object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      {(user?.displayName || user?.email || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.displayName || 'User'}</p>
                  <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelClass}>Full Name</label><input type="text" defaultValue={user?.displayName || ''} className={inputClass} /></div>
                <div><label className={labelClass}>Email</label><input type="email" defaultValue={user?.email || ''} className={inputClass} /></div>
              </div>
              <button className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 transition-colors">Save Changes</button>
            </div>
            <div className={cardClass}>
              <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Change Password</h3>
              <div className="space-y-3 max-w-md">
                <div><label className={labelClass}>Current Password</label><input type="password" className={inputClass} /></div>
                <div><label className={labelClass}>New Password</label><input type="password" className={inputClass} /></div>
                <div><label className={labelClass}>Confirm New Password</label><input type="password" className={inputClass} /></div>
                <button className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 transition-colors">Update Password</button>
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
              <h3 className="text-sm font-bold text-red-400 mb-2">Danger Zone</h3>
              <p className={`text-xs mb-4 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Delete your account and all data. This has a 14-day grace period.</p>
              <button className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors">Delete Account</button>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className={cardClass}>
            <h3 className={`text-sm font-bold mb-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Preferences</h3>
            <div className="space-y-5 max-w-md">
              <div>
                <label className={labelClass}>Theme</label>
                <div className="flex gap-2">
                  {[{ key: 'dark', icon: Moon, label: 'Dark' }, { key: 'light', icon: Sun, label: 'Light' }, { key: 'system', icon: Monitor, label: 'System' }].map(t => (
                    <button key={t.key} onClick={() => { setTheme(t.key as any); if (t.key !== 'system') onToggleTheme(); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border transition-all ${
                        theme === t.key ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : isDark ? 'border-white/5 text-white/30 hover:border-white/10' : 'border-gray-200 text-gray-400 hover:border-gray-300'
                      }`}>
                      <t.icon className="w-4 h-4" /> {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className={labelClass}>Base Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className={`${inputClass} appearance-none`}>
                  {['USD', 'EUR', 'GBP', 'PKR', 'INR', 'JPY'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Date Format</label>
                <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className={`${inputClass} appearance-none`}>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                </select>
              </div>
              <div><label className={labelClass}>Budget Month Starts On</label>
                <select value={budgetDay} onChange={e => setBudgetDay(Number(e.target.value))} className={`${inputClass} appearance-none`}>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'}</option>)}
                </select>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className={cardClass}>
            <h3 className={`text-sm font-bold mb-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Notification Preferences</h3>
            <div className="space-y-3 max-w-md">
              {[
                'Renewal reminders', 'Trial ending alerts', 'Overspend alerts',
                'AI insights', 'Weekly digest email', 'Price change alerts'
              ].map(item => (
                <label key={item} className={`flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                  <span className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{item}</span>
                  <div className="relative">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-600 peer-checked:bg-cyan-500 rounded-full transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow" />
                  </div>
                </label>
              ))}
              <div className="pt-4">
                <button className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-colors">
                  Send Test Notification
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className={cardClass}>
              <h3 className={`text-sm font-bold mb-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Active Sessions</h3>
              <div className="space-y-3">
                {[
                  { device: 'Chrome on Windows', location: 'Islamabad, PK', current: true, lastActive: 'Now' },
                  { device: 'Safari on iPhone', location: 'Islamabad, PK', current: false, lastActive: '2 hours ago' },
                ].map((session, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl ${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <Monitor className={`w-5 h-5 ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                          {session.device} {session.current && <span className="text-[9px] font-bold text-cyan-400 ml-2">CURRENT</span>}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-white/20' : 'text-gray-300'}`}>{session.location} · {session.lastActive}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-xs text-red-400 hover:text-red-300 font-medium">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
              <button className="mt-4 text-xs text-red-400 hover:text-red-300 font-medium">Revoke All Other Sessions</button>
            </div>
            <div className={cardClass}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Two-Factor Authentication</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Not Enabled</span>
              </div>
              <p className={`text-xs mb-4 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Add an extra layer of security with TOTP 2FA.</p>
              <button className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 transition-colors flex items-center gap-2">
                <Key className="w-4 h-4" /> Enable 2FA
              </button>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border bg-gradient-to-br ${isDark ? 'from-cyan-500/5 to-purple-500/5 border-cyan-500/10' : 'from-cyan-50 to-purple-50 border-cyan-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Free Plan</span>
                  <h3 className={`text-lg font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Subledge Free</h3>
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                  Upgrade to Pro
                </button>
              </div>
              <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Up to 10 subscriptions, basic analytics, email reminders only.</p>
            </div>
            <div className={cardClass}>
              <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Billing History</h3>
              <p className={`text-xs ${isDark ? 'text-white/20' : 'text-gray-300'}`}>No billing history yet — you're on the free plan.</p>
            </div>
          </div>
        );

      case 'connected':
        return (
          <div className={cardClass}>
            <h3 className={`text-sm font-bold mb-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Connected Accounts</h3>
            <div className="space-y-3">
              {[
                { name: 'Google', connected: !!user?.providerData?.find?.((p: any) => p.providerId === 'google.com'), color: 'text-blue-400' },
                { name: 'GitHub', connected: false, color: 'text-white' },
              ].map(acc => (
                <div key={acc.name} className={`flex items-center justify-between px-4 py-4 rounded-xl ${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <Globe className={`w-5 h-5 ${acc.color}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{acc.name}</span>
                  </div>
                  {acc.connected ? (
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-emerald-400">Connected</span>
                      <button className="text-xs text-red-400 hover:text-red-300">Disconnect</button>
                    </div>
                  ) : (
                    <button className="px-4 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-colors">Connect</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Nav */}
        <div className={`lg:w-56 shrink-0 p-2 rounded-2xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-900 shadow-sm'
                    : isDark ? 'text-white/30 hover:text-white/60 hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                }`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
