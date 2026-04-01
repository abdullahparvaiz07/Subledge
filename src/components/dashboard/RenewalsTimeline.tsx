import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface RenewalsTimelineProps {
  subscriptions: any[];
  isDark: boolean;
  onNavigate: (page: string) => void;
  getCategoryIcon: (category: string) => React.ReactNode;
  currencySymbols: Record<string, string>;
}

export default function RenewalsTimeline({ subscriptions, isDark, onNavigate, getCategoryIcon, currencySymbols }: RenewalsTimelineProps) {
  const renewals = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return subscriptions
      .filter(sub => {
        if (!sub.nextBillingDate) return false;
        const nextDate = sub.nextBillingDate?.toDate ? sub.nextBillingDate.toDate() : new Date(sub.nextBillingDate);
        return nextDate >= now && nextDate <= thirtyDaysFromNow;
      })
      .map(sub => {
        const nextDate = sub.nextBillingDate?.toDate ? sub.nextBillingDate.toDate() : new Date(sub.nextBillingDate);
        const daysRemaining = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { ...sub, nextDate, daysRemaining };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [subscriptions]);

  const getUrgencyColor = (days: number) => {
    if (days <= 0) return { bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400', dot: 'bg-red-500' };
    if (days <= 3) return { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', dot: 'bg-red-500' };
    if (days <= 7) return { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-500' };
    return { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500' };
  };

  if (renewals.length === 0) {
    return (
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Upcoming Renewals</h3>
        </div>
        <p className={`text-sm text-center py-8 ${isDark ? 'text-white/20' : 'text-gray-300'}`}>No upcoming renewals in the next 30 days</p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Upcoming Renewals</h3>
          <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Next 30 days</p>
        </div>
        <button
          onClick={() => onNavigate('reminders')}
          className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {renewals.map((renewal, idx) => {
          const urgency = getUrgencyColor(renewal.daysRemaining);
          return (
            <motion.button
              key={renewal.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-lg ${urgency.bg}`}
            >
              {renewal.daysRemaining <= 0 && (
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${urgency.dot}`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${urgency.dot}`} />
                </span>
              )}
              <div className="text-left min-w-0">
                <p className={`text-sm font-semibold truncate max-w-[120px] ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{renewal.name}</p>
                <p className={`text-xs ${urgency.text}`}>
                  {renewal.daysRemaining <= 0 ? 'Renews today' : `${renewal.daysRemaining}d left`}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  {currencySymbols[renewal.currency || 'USD'] || '$'}{renewal.amount?.toFixed(2)}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
