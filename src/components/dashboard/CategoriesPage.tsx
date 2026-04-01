import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Tag, Plus, Edit, Trash2, X, Check } from 'lucide-react';

interface CategoriesPageProps {
  subscriptions: any[];
  isDark: boolean;
  convertToUSD: (amount: number, currency: string) => number;
}

const DEFAULT_CATEGORIES = [
  { name: 'Entertainment', color: '#f43f5e', icon: '🎬', budget: 100 },
  { name: 'Software', color: '#8b5cf6', icon: '💻', budget: 200 },
  { name: 'Utilities', color: '#f59e0b', icon: '⚡', budget: 150 },
  { name: 'Health', color: '#10b981', icon: '💪', budget: 80 },
  { name: 'Education', color: '#3b82f6', icon: '📚', budget: 50 },
  { name: 'Business', color: '#06b6d4', icon: '🏢', budget: 300 },
];

export default function CategoriesPage({ subscriptions, isDark, convertToUSD }: CategoriesPageProps) {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', color: '#22d3ee', icon: '📌', budget: 100 });

  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const subs = subscriptions.filter(s => s.category === cat.name);
      const monthlySpend = subs.reduce((acc, sub) => {
        const usd = convertToUSD(sub.amount, sub.currency || 'USD');
        return acc + (sub.billingCycle === 'yearly' || sub.billingCycle === 'annual' ? usd / 12 : usd);
      }, 0);
      const pct = cat.budget > 0 ? (monthlySpend / cat.budget) * 100 : 0;
      return { ...cat, subCount: subs.length, monthlySpend, budgetPct: Math.min(pct, 120) };
    });
  }, [categories, subscriptions, convertToUSD]);

  const getBudgetStatus = (pct: number) => {
    if (pct >= 100) return { label: 'Over budget', color: 'text-red-400', bg: 'bg-red-500' };
    if (pct >= 80) return { label: 'Approaching', color: 'text-amber-400', bg: 'bg-amber-500' };
    return { label: 'Under budget', color: 'text-teal-400', bg: 'bg-teal-500' };
  };

  const startEdit = (name: string) => { setEditingId(name); setEditName(name); };
  const saveEdit = (oldName: string) => {
    setCategories(prev => prev.map(c => c.name === oldName ? { ...c, name: editName } : c));
    setEditingId(null);
  };

  const addCategory = () => {
    if (!newCat.name.trim()) return;
    setCategories(prev => [...prev, { ...newCat }]);
    setNewCat({ name: '', color: '#22d3ee', icon: '📌', budget: 100 });
    setShowNewForm(false);
  };

  const deleteCategory = (name: string) => { setCategories(prev => prev.filter(c => c.name !== name)); };

  const cardClass = `p-5 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-lg ${isDark ? 'bg-white/[0.03] border-white/5 hover:border-white/10' : 'bg-white border-gray-100 hover:border-gray-200'}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Categories</h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Manage categories & budgets</p>
        </div>
        <button onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-colors">
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {/* New Category Form */}
      {showNewForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <input type="text" placeholder="Category name" value={newCat.name} onChange={e => setNewCat(n => ({ ...n, name: e.target.value }))}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm border-transparent outline-none ${isDark ? 'bg-white/5 text-white placeholder:text-white/30' : 'bg-white text-gray-900 placeholder:text-gray-400'}`} />
            <input type="color" value={newCat.color} onChange={e => setNewCat(n => ({ ...n, color: e.target.value }))} className="w-10 h-10 rounded-xl cursor-pointer border-0" />
            <input type="number" placeholder="Budget" value={newCat.budget} onChange={e => setNewCat(n => ({ ...n, budget: Number(e.target.value) }))}
              className={`w-24 px-3 py-2.5 rounded-xl text-sm border-transparent outline-none ${isDark ? 'bg-white/5 text-white' : 'bg-white text-gray-900'}`} />
            <button onClick={addCategory} className="p-2.5 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600"><Check className="w-4 h-4" /></button>
            <button onClick={() => setShowNewForm(false)} className={`p-2.5 rounded-xl ${isDark ? 'hover:bg-white/5 text-white/30' : 'hover:bg-gray-100 text-gray-400'}`}><X className="w-4 h-4" /></button>
          </div>
        </motion.div>
      )}

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryStats.map((cat, idx) => {
          const budget = getBudgetStatus(cat.budgetPct);
          return (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className={cardClass}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-xl">{cat.icon}</div>
                  {editingId === cat.name ? (
                    <div className="flex items-center gap-1">
                      <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className={`px-2 py-1 rounded-lg text-sm border-transparent outline-none w-28 ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'}`} />
                      <button onClick={() => saveEdit(cat.name)} className="p-1 text-cyan-400"><Check className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div>
                      <span className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{cat.name}</span>
                      <p className={`text-[10px] ${isDark ? 'text-white/20' : 'text-gray-300'}`}>{cat.subCount} subscriptions</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(cat.name)} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5 text-white/20' : 'hover:bg-gray-100 text-gray-300'}`}>
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteCategory(cat.name)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/40 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Spend */}
              <div className="flex items-baseline justify-between mb-3">
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>${cat.monthlySpend.toFixed(2)}</span>
                <span className={`text-xs ${isDark ? 'text-white/20' : 'text-gray-300'}`}>/ ${cat.budget} budget</span>
              </div>

              {/* Budget Bar */}
              <div className={`h-2 rounded-full overflow-hidden mb-2 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(cat.budgetPct, 100)}%` }} transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className={`h-full rounded-full ${budget.bg}`} />
              </div>
              <span className={`text-[10px] font-bold ${budget.color}`}>{budget.label} · {cat.budgetPct.toFixed(0)}%</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
