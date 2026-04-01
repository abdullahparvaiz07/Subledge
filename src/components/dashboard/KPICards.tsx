import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard, AlertTriangle, Sparkles } from 'lucide-react';

interface KPICardsProps {
  subscriptions: any[];
  isDark: boolean;
  onNavigate: (page: string) => void;
  convertToUSD: (amount: number, currency: string) => number;
}

function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const start = Date.now();
    const startValue = 0;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(startValue + (value - startValue) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{prefix}{display.toFixed(decimals)}{suffix}</>;
}

export default function KPICards({ subscriptions, isDark, onNavigate, convertToUSD }: KPICardsProps) {
  const stats = useMemo(() => {
    const activeSubs = subscriptions.filter(s => s.status !== 'cancelled' && s.status !== 'paused');
    const trialSubs = subscriptions.filter(s => s.status === 'trial');
    
    const monthlySpend = activeSubs.reduce((acc, sub) => {
      const usd = convertToUSD(sub.amount, sub.currency || 'USD');
      if (sub.billingCycle === 'monthly' || sub.billingCycle === 'weekly') return acc + (sub.billingCycle === 'weekly' ? usd * 4.33 : usd);
      if (sub.billingCycle === 'quarterly') return acc + usd / 3;
      if (sub.billingCycle === 'semi-annual') return acc + usd / 6;
      if (sub.billingCycle === 'yearly' || sub.billingCycle === 'annual') return acc + usd / 12;
      return acc + usd;
    }, 0);

    const annualProjection = activeSubs.reduce((acc, sub) => {
      const usd = convertToUSD(sub.amount, sub.currency || 'USD');
      if (sub.billingCycle === 'monthly') return acc + usd * 12;
      if (sub.billingCycle === 'weekly') return acc + usd * 52;
      if (sub.billingCycle === 'quarterly') return acc + usd * 4;
      if (sub.billingCycle === 'semi-annual') return acc + usd * 2;
      return acc + usd;
    }, 0);

    const now = new Date();
    const trialsEndingSoon = trialSubs.filter(s => {
      if (!s.trialEndDate) return false;
      const end = s.trialEndDate?.toDate ? s.trialEndDate.toDate() : new Date(s.trialEndDate);
      const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });

    const nearestTrial = trialsEndingSoon.reduce((nearest: number | null, s: any) => {
      const end = s.trialEndDate?.toDate ? s.trialEndDate.toDate() : new Date(s.trialEndDate);
      const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return nearest === null ? diff : Math.min(nearest, diff);
    }, null);

    const categories = [...new Set(activeSubs.map(s => s.category))];
    const potentialSavings = monthlySpend * 0.12; // Estimate

    return { monthlySpend, annualProjection, activeSubs: activeSubs.length, trialsEndingSoon: trialsEndingSoon.length, nearestTrial, categories: categories.length, potentialSavings };
  }, [subscriptions, convertToUSD]);

  const cards = [
    {
      title: 'Total Monthly Spend',
      value: stats.monthlySpend,
      prefix: '$',
      decimals: 2,
      subtitle: '↑ 12% from last month',
      subtitleColor: 'text-emerald-400',
      icon: DollarSign,
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      onClick: () => onNavigate('analytics'),
    },
    {
      title: 'Annual Projection',
      value: stats.annualProjection,
      prefix: '$',
      decimals: 2,
      subtitle: stats.annualProjection > 5000 ? '⚠️ Review suggested' : 'On track',
      subtitleColor: stats.annualProjection > 5000 ? 'text-amber-400' : 'text-emerald-400',
      icon: Calendar,
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconBg: 'bg-amber-500/10 text-amber-400',
      onClick: () => onNavigate('analytics'),
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubs,
      prefix: '',
      decimals: 0,
      subtitle: `${stats.categories} categories`,
      subtitleColor: 'text-cyan-400',
      icon: CreditCard,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      iconBg: 'bg-cyan-500/10 text-cyan-400',
      onClick: () => onNavigate('subscriptions'),
    },
    {
      title: 'Trials Ending Soon',
      value: stats.trialsEndingSoon,
      prefix: '',
      decimals: 0,
      subtitle: stats.nearestTrial !== null ? `Next: in ${stats.nearestTrial} days` : 'No active trials',
      subtitleColor: stats.nearestTrial !== null && stats.nearestTrial <= 3 ? 'text-red-400' : 'text-white/40',
      icon: AlertTriangle,
      gradient: 'from-red-500/20 to-rose-500/20',
      iconBg: 'bg-red-500/10 text-red-400',
      onClick: () => onNavigate('reminders'),
    },
    {
      title: 'Potential Savings',
      value: stats.potentialSavings,
      prefix: '$',
      decimals: 2,
      subtitle: 'View Details →',
      subtitleColor: 'text-teal-400',
      icon: Sparkles,
      gradient: 'from-teal-500/20 to-emerald-500/20',
      iconBg: 'bg-teal-500/10 text-teal-400',
      onClick: () => onNavigate('analytics'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
            onClick={card.onClick}
            className={`group text-left p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl ${
              isDark
                ? 'bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.06]'
                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-gray-200/50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{card.title}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <AnimatedCounter value={card.value} prefix={card.prefix} decimals={card.decimals} />
            </div>
            <span className={`text-[11px] font-medium ${card.subtitleColor}`}>{card.subtitle}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
