import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Download, Calendar, Sparkles, AlertTriangle } from 'lucide-react';
import SpendChart from './SpendChart';

interface AnalyticsPageProps {
  subscriptions: any[];
  isDark: boolean;
  convertToUSD: (amount: number, currency: string) => number;
  currencySymbols: Record<string, string>;
}

export default function AnalyticsPage({ subscriptions, isDark, convertToUSD, currencySymbols }: AnalyticsPageProps) {
  const [dateRange, setDateRange] = useState('6months');

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    subscriptions.forEach(sub => {
      const cat = sub.category || 'Other';
      const usd = convertToUSD(sub.amount, sub.currency || 'USD');
      const monthly = sub.billingCycle === 'yearly' || sub.billingCycle === 'annual' ? usd / 12 : usd;
      if (!map[cat]) map[cat] = { total: 0, count: 0 };
      map[cat].total += monthly;
      map[cat].count++;
    });
    const totalSpend = Object.values(map).reduce((a, b) => a + b.total, 0);
    return Object.entries(map)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([name, data]) => ({ name, ...data, pct: totalSpend > 0 ? (data.total / totalSpend) * 100 : 0 }));
  }, [subscriptions, convertToUSD]);

  const roiScores = useMemo(() => {
    return subscriptions
      .map(sub => {
        const usd = convertToUSD(sub.amount, sub.currency || 'USD');
        const monthly = sub.billingCycle === 'yearly' || sub.billingCycle === 'annual' ? usd / 12 : usd;
        const usage = sub.usageFrequency || 'monthly';
        const usageScore = usage === 'daily' ? 5 : usage === 'weekly' ? 4 : usage === 'monthly' ? 3 : usage === 'rarely' ? 2 : 1;
        const roiScore = Math.round((usageScore / (monthly / 10 + 1)) * 20);
        return { ...sub, monthlyCost: monthly, usageScore, roiScore: Math.min(roiScore, 100) };
      })
      .sort((a, b) => a.roiScore - b.roiScore);
  }, [subscriptions, convertToUSD]);

  const totalSavings = useMemo(() => {
    return roiScores.filter(s => s.roiScore < 30).reduce((a, s) => a + s.monthlyCost, 0) * 12;
  }, [roiScores]);

  const cardClass = `p-6 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100'}`;
  const exportCSV = (data: any[], filename: string) => {
    const rows = data.map(r => Object.values(r).join(',')).join('\n');
    const header = Object.keys(data[0] || {}).join(',');
    const blob = new Blob([header + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Spend Analytics</h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Track and optimize your subscription costs</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'} outline-none`}>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button onClick={() => exportCSV(subscriptions.map(s => ({ name: s.name, amount: s.amount, currency: s.currency, cycle: s.billingCycle, category: s.category })), 'subledge-export.csv')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Spend Over Time */}
      <SpendChart subscriptions={subscriptions} isDark={isDark} convertToUSD={convertToUSD} />

      {/* Category Breakdown */}
      <div className={cardClass}>
        <h3 className={`text-sm font-bold mb-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Category Breakdown</h3>
        <div className="space-y-4">
          {categoryBreakdown.map((cat, idx) => (
            <motion.div key={cat.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{cat.name}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{cat.count} subs</span>
                  <span className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>${cat.total.toFixed(2)}/mo</span>
                  <span className={`text-xs ${isDark ? 'text-white/20' : 'text-gray-300'}`}>{cat.pct.toFixed(0)}%</span>
                </div>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }} transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ROI Scores + Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROI Table */}
        <div className={`${cardClass} lg:col-span-2`}>
          <h3 className={`text-sm font-bold mb-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Subscription ROI Scores</h3>
          <div className="space-y-3">
            {roiScores.slice(0, 8).map(sub => (
              <div key={sub.id} className={`flex items-center gap-4 px-4 py-3 rounded-xl ${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'}`}>
                <span className={`text-sm font-medium flex-1 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{sub.name}</span>
                <span className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>${sub.monthlyCost.toFixed(2)}/mo</span>
                <div className="w-24 flex items-center gap-2">
                  <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}>
                    <div className={`h-full rounded-full ${sub.roiScore >= 60 ? 'bg-emerald-500' : sub.roiScore >= 30 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${sub.roiScore}%` }} />
                  </div>
                  <span className={`text-[10px] font-bold w-7 text-right ${sub.roiScore >= 60 ? 'text-emerald-400' : sub.roiScore >= 30 ? 'text-amber-400' : 'text-red-400'}`}>{sub.roiScore}</span>
                </div>
                {sub.roiScore < 30 && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded">Review</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Savings Panel */}
        <div className={`p-6 rounded-2xl border bg-gradient-to-br ${isDark ? 'from-teal-500/5 to-emerald-500/5 border-teal-500/10' : 'from-teal-50 to-emerald-50 border-teal-200'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h3 className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Potential Savings</h3>
          </div>
          <div className="text-4xl font-bold text-teal-400 mb-2">${totalSavings.toFixed(0)}</div>
          <p className={`text-xs mb-6 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Estimated annual savings</p>
          <div className="space-y-3">
            {roiScores.filter(s => s.roiScore < 30).slice(0, 4).map(sub => (
              <div key={sub.id} className={`flex items-center justify-between px-3 py-2 rounded-xl ${isDark ? 'bg-white/[0.03]' : 'bg-white/60'}`}>
                <span className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{sub.name}</span>
                <span className="text-xs font-bold text-teal-400">${(sub.monthlyCost * 12).toFixed(0)}/yr</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
