import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, DollarSign, Calendar as CalendarIcon, Tag, FileText, Building2, History } from 'lucide-react';

interface SubscriptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  editData?: any;
  isDark: boolean;
  currencySymbols: Record<string, string>;
  exchangeRates: Record<string, number>;
}

const KNOWN_SERVICES = [
  { name: 'Netflix', category: 'Entertainment', cost: 15.49, cycle: 'monthly' },
  { name: 'Spotify', category: 'Entertainment', cost: 10.99, cycle: 'monthly' },
  { name: 'YouTube Premium', category: 'Entertainment', cost: 13.99, cycle: 'monthly' },
  { name: 'Disney+', category: 'Entertainment', cost: 7.99, cycle: 'monthly' },
  { name: 'Apple Music', category: 'Entertainment', cost: 10.99, cycle: 'monthly' },
  { name: 'Adobe Creative Cloud', category: 'Software', cost: 54.99, cycle: 'monthly' },
  { name: 'Figma', category: 'Software', cost: 12.00, cycle: 'monthly' },
  { name: 'GitHub Pro', category: 'Software', cost: 4.00, cycle: 'monthly' },
  { name: 'Notion', category: 'Software', cost: 8.00, cycle: 'monthly' },
  { name: 'Slack', category: 'Software', cost: 7.25, cycle: 'monthly' },
  { name: 'ChatGPT Plus', category: 'Software', cost: 20.00, cycle: 'monthly' },
  { name: 'AWS', category: 'Utilities', cost: 50.00, cycle: 'monthly' },
  { name: 'Vercel', category: 'Software', cost: 20.00, cycle: 'monthly' },
  { name: 'Gym Membership', category: 'Health', cost: 30.00, cycle: 'monthly' },
  { name: 'Headspace', category: 'Health', cost: 12.99, cycle: 'monthly' },
];

const BILLING_CYCLES = ['weekly', 'monthly', 'quarterly', 'semi-annual', 'annual'];
const STATUSES = ['active', 'trial', 'paused'];

const defaultForm = {
  name: '', amount: '', currency: 'USD', billingCycle: 'monthly',
  startDate: '', nextBillingDate: '', category: 'Entertainment',
  status: 'active', trialEndDate: '', notes: '', workspace: 'personal',
};

export default function SubscriptionDrawer({ isOpen, onClose, onSave, editData, isDark, currencySymbols, exchangeRates }: SubscriptionDrawerProps) {
  const [form, setForm] = useState(defaultForm);
  const [suggestions, setSuggestions] = useState<typeof KNOWN_SERVICES>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (editData) {
      const nextDate = editData.nextBillingDate?.toDate ? editData.nextBillingDate.toDate() : new Date(editData.nextBillingDate || Date.now());
      const startDate = editData.startDate?.toDate ? editData.startDate.toDate() : editData.createdAt?.toDate ? editData.createdAt.toDate() : new Date();
      setForm({
        name: editData.name || '',
        amount: String(editData.amount || ''),
        currency: editData.currency || 'USD',
        billingCycle: editData.billingCycle || 'monthly',
        startDate: startDate.toISOString().split('T')[0],
        nextBillingDate: nextDate.toISOString().split('T')[0],
        category: editData.category || 'Entertainment',
        status: editData.status || 'active',
        trialEndDate: editData.trialEndDate ? (editData.trialEndDate?.toDate ? editData.trialEndDate.toDate() : new Date(editData.trialEndDate)).toISOString().split('T')[0] : '',
        notes: editData.notes || '',
        workspace: editData.workspace || 'personal',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editData, isOpen]);

  const handleNameChange = (value: string) => {
    setForm(f => ({ ...f, name: value }));
    if (value.length >= 2) {
      const matches = KNOWN_SERVICES.filter(s => s.name.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectService = (service: typeof KNOWN_SERVICES[0]) => {
    setForm(f => ({ ...f, name: service.name, amount: String(service.cost), category: service.category, billingCycle: service.cycle }));
    setShowSuggestions(false);
  };

  // Auto-calculate next billing date
  useEffect(() => {
    if (form.startDate && form.billingCycle && !editData) {
      const start = new Date(form.startDate);
      let next = new Date(start);
      switch (form.billingCycle) {
        case 'weekly': next.setDate(next.getDate() + 7); break;
        case 'monthly': next.setMonth(next.getMonth() + 1); break;
        case 'quarterly': next.setMonth(next.getMonth() + 3); break;
        case 'semi-annual': next.setMonth(next.getMonth() + 6); break;
        case 'annual': next.setFullYear(next.getFullYear() + 1); break;
      }
      setForm(f => ({ ...f, nextBillingDate: next.toISOString().split('T')[0] }));
    }
  }, [form.startDate, form.billingCycle, editData]);

  const handleSubmit = async (e: React.FormEvent, addAnother = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({ ...form, amount: parseFloat(form.amount) });
      if (addAnother) {
        setForm(defaultForm);
      } else {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border-transparent focus:ring-2 outline-none transition-all text-sm ${
    isDark ? 'bg-white/5 focus:ring-cyan-500/30 text-white placeholder:text-white/30 [color-scheme:dark]' : 'bg-gray-100 focus:ring-cyan-500/20 text-gray-900 placeholder:text-gray-400'
  }`;
  const labelClass = `text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-white/30' : 'text-gray-400'}`;
  const selectClass = `${inputClass} appearance-none cursor-pointer`;
  const optionClass = isDark ? { style: { backgroundColor: '#1a2332', color: '#e2e8f0' } } : {};

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className={`relative w-full max-w-lg h-full overflow-y-auto ${isDark ? 'bg-[#0f1923]' : 'bg-white'}`}
          >
            {/* Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b backdrop-blur-xl ${isDark ? 'bg-[#0f1923]/90 border-white/5' : 'bg-white/90 border-gray-100'}`}>
              <div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editData ? 'Edit Subscription' : 'Add Subscription'}
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                  {editData ? 'Update subscription details' : 'Track a new recurring expense'}
                </p>
              </div>
              <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-white/30' : 'hover:bg-gray-100 text-gray-400'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={e => handleSubmit(e)} className="p-6 space-y-5">
              {/* Service Name */}
              <div className="relative">
                <label className={labelClass}>Service Name</label>
                <div className="relative">
                  <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                  <input type="text" required placeholder="e.g. Netflix, Spotify" value={form.name} onChange={e => handleNameChange(e.target.value)} onFocus={() => form.name.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)} className={`${inputClass} pl-10`} />
                </div>
                {showSuggestions && (
                  <div className={`absolute z-20 mt-1 w-full rounded-xl border shadow-xl overflow-hidden ${isDark ? 'bg-[#1a2332] border-white/10' : 'bg-white border-gray-200'}`}>
                    {suggestions.slice(0, 5).map(s => (
                      <button key={s.name} type="button" onClick={() => selectService(s)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${isDark ? 'hover:bg-white/5 text-white/70' : 'hover:bg-gray-50 text-gray-700'}`}>
                        <span className="font-medium">{s.name}</span>
                        <span className="text-xs opacity-40">${s.cost}/mo</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cost + Currency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Amount</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold opacity-30">{currencySymbols[form.currency] || '$'}</span>
                    <input type="number" step="0.01" required placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className={`${inputClass} pl-8`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Currency</label>
                  <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className={selectClass}>
                    {Object.keys(exchangeRates).map(c => <option key={c} value={c} {...optionClass}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Billing Cycle + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Billing Cycle</label>
                  <select value={form.billingCycle} onChange={e => setForm(f => ({ ...f, billingCycle: e.target.value }))} className={selectClass}>
                    {BILLING_CYCLES.map(c => <option key={c} value={c} {...optionClass}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={selectClass}>
                    {['Entertainment', 'Software', 'Utilities', 'Health', 'Education', 'Business', 'Other'].map(c => <option key={c} value={c} {...optionClass}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={`${inputClass} ${isDark ? '[color-scheme:dark]' : ''}`} />
                </div>
                <div>
                  <label className={labelClass}>Next Renewal</label>
                  <input type="date" required value={form.nextBillingDate} onChange={e => setForm(f => ({ ...f, nextBillingDate: e.target.value }))} className={`${inputClass} ${isDark ? '[color-scheme:dark]' : ''}`} />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className={labelClass}>Status</label>
                <div className="flex gap-2">
                  {STATUSES.map(s => (
                    <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        form.status === s
                          ? s === 'active' ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : s === 'trial' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
                          : isDark ? 'border-white/5 text-white/20 hover:border-white/10' : 'border-gray-200 text-gray-300 hover:border-gray-300'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Trial End Date (conditional) */}
              {form.status === 'trial' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <label className={labelClass}>Trial End Date</label>
                  <input type="date" value={form.trialEndDate} onChange={e => setForm(f => ({ ...f, trialEndDate: e.target.value }))} className={`${inputClass} ${isDark ? '[color-scheme:dark]' : ''}`} />
                </motion.div>
              )}

              {/* Notes */}
              <div>
                <label className={labelClass}>Notes (Optional)</label>
                <textarea placeholder="Any additional notes..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} className={`${inputClass} resize-none`} />
              </div>

              {/* Workspace */}
              <div>
                <label className={labelClass}>Workspace</label>
                <select value={form.workspace} onChange={e => setForm(f => ({ ...f, workspace: e.target.value }))} className={selectClass}>
                  <option value="personal" {...optionClass}>Personal</option>
                  <option value="work" {...optionClass}>Work</option>
                  <option value="family" {...optionClass}>Family</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <button type="submit" disabled={isSubmitting || !form.name || !form.amount}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Saving...' : editData ? 'Update Subscription' : 'Add Subscription'}
                </button>
                {!editData && (
                  <button type="button" onClick={e => handleSubmit(e as any, true)} disabled={isSubmitting || !form.name || !form.amount}
                    className={`w-full py-3.5 rounded-xl border text-sm font-bold transition-all disabled:opacity-40 ${
                      isDark ? 'border-white/10 text-white/60 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    Save & Add Another
                  </button>
                )}
              </div>

              {/* Price History (Edit Mode) */}
              {editData && editData.priceHistory && editData.priceHistory.length > 0 && (
                <div className={`pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  <h4 className={`flex items-center gap-2 text-xs font-bold mb-3 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                    <History className="w-3.5 h-3.5" /> Price History
                  </h4>
                  <div className="space-y-2">
                    {editData.priceHistory.map((entry: any, i: number) => (
                      <div key={i} className={`flex justify-between text-xs px-3 py-2 rounded-lg ${isDark ? 'bg-white/3' : 'bg-gray-50'}`}>
                        <span className={isDark ? 'text-white/40' : 'text-gray-400'}>{new Date(entry.date).toLocaleDateString()}</span>
                        <span className={isDark ? 'text-white/60' : 'text-gray-600'}>${entry.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delete (Edit Mode) */}
              {editData && (
                <div className={`pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  <button type="button" className="w-full py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors">
                    Delete Subscription
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
