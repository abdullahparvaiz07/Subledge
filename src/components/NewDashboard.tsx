import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SquaresFour, CreditCard as CreditCardIcon, ChartLine, Bell as BellIcon,
  SignOut, List, Plus, Trash, PencilSimple, ArrowsClockwise, Wallet,
  ChartLineUp, CalendarCheck, Warning
} from '@phosphor-icons/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Logo } from '../App';

const navItems = [
  { id: "overview", label: "Overview", icon: SquaresFour },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCardIcon },
  { id: "analytics", label: "Analytics", icon: ChartLine },
  { id: "alerts", label: "Alerts", icon: BellIcon },
];

const categoryColors: Record<string, string> = {
  Entertainment: "#E07A5F", Software: "#52B788", Utilities: "#4A90D9",
  Health: "#D4A5FF", Other: "#2D6A4F",
};

// ─── Sidebar ────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, user, onSignOut, onGoHome }: any) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#081C15] border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
          <Logo isDark={true} />
          <span className="font-bold text-white text-lg tracking-tight">Subledge</span>
        </div>
        <div className="flex items-center gap-2">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`p-2 rounded-lg transition-colors ${activeTab === item.id ? 'bg-[#2D6A4F] text-[#D8F3DC]' : 'text-[#95D5B2] hover:bg-[#1B4332]'}`}>
              <item.icon size={18} weight={activeTab === item.id ? "fill" : "regular"} />
            </button>
          ))}
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-[#081C15] border-r border-white/5 h-screen sticky top-0 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
          <Logo isDark={true} />
          {!collapsed && <span className="font-bold text-white text-xl tracking-tight">Subledge</span>}
        </div>
        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id ? "bg-[#2D6A4F] text-[#D8F3DC]" : "text-[#95D5B2] hover:bg-[#1B4332] hover:text-white"}`}>
              <item.icon size={22} weight={activeTab === item.id ? "fill" : "regular"} className="flex-shrink-0" />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={() => setCollapsed(!collapsed)} className="w-full text-xs text-[#74C69D] hover:text-white mb-3 text-center transition-colors">
            {collapsed ? ">>" : "<< Collapse"}
          </button>
          {user && (
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover border border-white/10 flex-shrink-0" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#2D6A4F] flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#D8F3DC]">{(user.displayName || user.email || '?')[0].toUpperCase()}</span>
                </div>
              )}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.displayName || user.email}</p>
                  <button onClick={onSignOut} className="text-xs text-[#E07A5F] hover:text-[#E07A5F]/80 transition-colors flex items-center gap-1 mt-0.5">
                    <SignOut size={12} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ─── Stats Cards ────────────────────────────────────────────
function StatsCards({ subscriptions, displayCurrency, CURRENCY_SYMBOLS, EXCHANGE_RATES, convertToUSD }: any) {
  const totalMonthly = subscriptions.reduce((acc: number, sub: any) => {
    const usd = convertToUSD(sub.amount, sub.currency || 'USD');
    const display = usd * (EXCHANGE_RATES[displayCurrency] || 1);
    return acc + (sub.billingCycle === 'monthly' ? display : display / 12);
  }, 0);
  const totalYearly = totalMonthly * 12;
  const sym = CURRENCY_SYMBOLS[displayCurrency] || '$';

  const cards = [
    { label: "Monthly Spend", value: `${sym}${totalMonthly.toFixed(2)}`, icon: Wallet, color: "#D8F3DC" },
    { label: "Yearly Spend", value: `${sym}${totalYearly.toFixed(2)}`, icon: ChartLineUp, color: "#52B788" },
    { label: "Active Subs", value: subscriptions.length, icon: CreditCardIcon, color: "#B7E4C7" },
    { label: "Categories", value: [...new Set(subscriptions.map((s: any) => s.category))].length, icon: CalendarCheck, color: "#74C69D" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }}
          className="bg-[#1B4332] border border-white/10 rounded-2xl p-5 hover:border-[#52B788] hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${card.color}15` }}>
            <card.icon size={22} weight="duotone" style={{ color: card.color }} />
          </div>
          <p className="font-mono text-2xl font-bold text-white tracking-tight">{card.value}</p>
          <p className="text-xs font-medium text-[#74C69D] mt-1 uppercase tracking-widest">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Spending Chart ─────────────────────────────────────────
function SpendingChart({ subscriptions }: any) {
  const catBreakdown = subscriptions.reduce((acc: any, sub: any) => {
    const cat = sub.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12);
    return acc;
  }, {});
  const catData = Object.entries(catBreakdown).map(([category, amount]) => ({ category, amount: amount as number }));
  const maxAmount = Math.max(...catData.map(c => c.amount), 1);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-[#1B4332] border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white tracking-tight mb-6">Spending by Category</h3>
      <div className="space-y-3">
        {catData.length > 0 ? catData.map((cat, i) => (
          <div key={cat.category} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#95D5B2]">{cat.category}</span>
              <span className="font-mono text-sm text-white">${cat.amount.toFixed(2)}/mo</span>
            </div>
            <div className="h-2 bg-[#081C15] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${((cat.amount / maxAmount) * 100).toFixed(0)}%` }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className="h-full rounded-full bg-gradient-to-r from-[#40916C] to-[#52B788]" />
            </div>
          </div>
        )) : (
          <p className="text-[#74C69D] text-sm text-center py-8">No categories yet. Add a subscription to get started.</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Alerts List ────────────────────────────────────────────
function AlertsList({ upcomingBills }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}
      className="bg-[#1B4332] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <BellIcon size={20} weight="duotone" className={upcomingBills.length > 0 ? "text-[#FCA311]" : "text-[#D8F3DC]"} />
        <h3 className="text-lg font-semibold text-white tracking-tight">Upcoming Renewals</h3>
        {upcomingBills.length > 0 && (
          <span className="ml-auto bg-[#FCA311]/15 text-[#FCA311] text-xs font-bold px-2 py-0.5 rounded-full">{upcomingBills.length}</span>
        )}
      </div>
      {upcomingBills.length === 0 ? (
        <div className="text-center py-6"><p className="text-[#74C69D] text-sm">No upcoming renewals in the next 7 days</p></div>
      ) : (
        <div className="space-y-3">
          {upcomingBills.slice(0, 8).map((alert: any, i: number) => (
            <motion.div key={alert.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i, duration: 0.3 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#081C15]/50 border border-white/5">
              <Warning size={20} weight="duotone" className={alert.diffDays <= 1 ? "text-[#E07A5F]" : "text-[#FCA311]"} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{alert.name}</p>
                <p className="text-xs text-[#74C69D]">
                  {alert.diffDays === 0 ? "Renews today" : alert.diffDays === 1 ? "Renews tomorrow" : `Renews in ${alert.diffDays} days`}
                </p>
              </div>
              <span className="font-mono text-sm font-bold text-white">${alert.amount?.toFixed(2)}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Subscription Cards ─────────────────────────────────────
function SubsList({ subscriptions, onDelete, processingSubId, searchTerm, onAdd, CURRENCY_SYMBOLS }: any) {
  const filtered = subscriptions.filter((s: any) => s.name.toLowerCase().includes((searchTerm || '').toLowerCase()));

  if (filtered.length === 0) {
    return (
      <div className="bg-[#1B4332] border border-white/10 rounded-2xl p-12 text-center">
        <p className="text-[#74C69D] text-sm">{searchTerm ? `No results for "${searchTerm}"` : 'No subscriptions yet. Click "Add Subscription" to get started.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filtered.map((sub: any, i: number) => {
        const catColor = categoryColors[sub.category] || "#2D6A4F";
        return (
          <motion.div key={sub.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`bg-[#1B4332] border border-white/10 rounded-2xl p-5 relative group hover:border-[#52B788] hover:-translate-y-0.5 transition-all duration-200 ${processingSubId === sub.id ? 'opacity-50' : ''}`}>
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button onClick={() => onDelete(sub.id)} className="p-1.5 rounded-lg bg-[#081C15]/60 hover:bg-[#E07A5F]/20 text-[#E07A5F] transition-colors">
                <Trash size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${catColor}15` }}>
                <span className="text-lg font-bold" style={{ color: catColor }}>{sub.name?.[0]?.toUpperCase() || "S"}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-semibold text-sm truncate">{sub.name}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${catColor}20`, color: catColor }}>{sub.category}</span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-xl font-bold text-white">{CURRENCY_SYMBOLS[sub.currency || 'USD'] || '$'}{sub.amount?.toFixed(2)}</p>
                <p className="text-xs text-[#74C69D] capitalize">/{sub.billingCycle}</p>
              </div>
              {sub.nextBillingDate && (
                <div className="text-right flex items-center gap-1 text-[#95D5B2]">
                  <ArrowsClockwise size={14} />
                  <span className="text-xs">{sub.nextBillingDate.toDate().toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main Dashboard Export ───────────────────────────────────
export default function NewDashboardView({
  user, subscriptions, isSubsLoading, searchTerm, setSearchTerm,
  showAddModal, setShowAddModal, processingSubId, handleDeleteSubscription,
  handleSignOut, setView, displayCurrency, setDisplayCurrency,
  EXCHANGE_RATES, CURRENCY_SYMBOLS, convertToUSD, isDark
}: any) {
  const [activeTab, setActiveTab] = useState("overview");

  const upcomingBills = subscriptions
    .filter((s: any) => s.nextBillingDate)
    .map((s: any) => {
      const diffTime = s.nextBillingDate.toDate().getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...s, diffDays };
    })
    .filter((s: any) => s.diffDays >= 0 && s.diffDays <= 7)
    .sort((a: any, b: any) => a.diffDays - b.diffDays);

  return (
    <div className="flex min-h-screen bg-[#081C15] text-[#D8F3DC]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onSignOut={handleSignOut} onGoHome={() => setView('home')} />

      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
              {activeTab === "overview" && "Dashboard"}
              {activeTab === "subscriptions" && "Subscriptions"}
              {activeTab === "analytics" && "Analytics"}
              {activeTab === "alerts" && "Alerts"}
            </h1>
            <p className="text-[#95D5B2] text-sm mt-1">
              {user?.displayName ? `Welcome back, ${user.displayName.split(" ")[0]}` : "Manage your subscriptions"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Currency switcher */}
            <div className="flex gap-1 bg-[#081C15] border border-white/10 rounded-lg p-1">
              {Object.keys(EXCHANGE_RATES).slice(0, 4).map((curr: string) => (
                <button key={curr} onClick={() => setDisplayCurrency(curr)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${displayCurrency === curr ? 'bg-[#2D6A4F] text-white' : 'text-[#74C69D] hover:text-white'}`}>
                  {curr}
                </button>
              ))}
            </div>
            <button onClick={() => setShowAddModal(true)}
              className="bg-[#D8F3DC] text-[#081C15] hover:bg-[#B7E4C7] font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-md flex items-center gap-2 text-sm">
              <Plus size={18} weight="bold" /> Add Subscription
            </button>
          </div>
        </div>

        {isSubsLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#D8F3DC] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <StatsCards subscriptions={subscriptions} displayCurrency={displayCurrency} CURRENCY_SYMBOLS={CURRENCY_SYMBOLS} EXCHANGE_RATES={EXCHANGE_RATES} convertToUSD={convertToUSD} />
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2"><SpendingChart subscriptions={subscriptions} /></div>
                  <div><AlertsList upcomingBills={upcomingBills} /></div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white tracking-tight mb-4">Recent Subscriptions</h2>
                  <SubsList subscriptions={subscriptions.slice(0, 6)} onDelete={handleDeleteSubscription} processingSubId={processingSubId} searchTerm="" onAdd={() => setShowAddModal(true)} CURRENCY_SYMBOLS={CURRENCY_SYMBOLS} />
                </div>
              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === "subscriptions" && (
              <div className="space-y-4">
                <div className="relative">
                  <input type="text" placeholder="Search subscriptions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1B4332] border border-white/10 rounded-xl pl-4 pr-4 py-3 text-sm text-white placeholder:text-[#74C69D]/60 focus:outline-none focus:ring-2 focus:ring-[#52B788]/40" />
                </div>
                <SubsList subscriptions={subscriptions} onDelete={handleDeleteSubscription} processingSubId={processingSubId} searchTerm={searchTerm} onAdd={() => setShowAddModal(true)} CURRENCY_SYMBOLS={CURRENCY_SYMBOLS} />
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <StatsCards subscriptions={subscriptions} displayCurrency={displayCurrency} CURRENCY_SYMBOLS={CURRENCY_SYMBOLS} EXCHANGE_RATES={EXCHANGE_RATES} convertToUSD={convertToUSD} />
                <SpendingChart subscriptions={subscriptions} />
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === "alerts" && <AlertsList upcomingBills={upcomingBills} />}
          </>
        )}
      </main>
    </div>
  );
}
