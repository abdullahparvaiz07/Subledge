import React from 'react';
import KPICards from './KPICards';
import SpendChart from './SpendChart';
import CategoryDonut from './CategoryDonut';
import RenewalsTimeline from './RenewalsTimeline';
import SubscriptionTable from './SubscriptionTable';
import { Monitor, Zap, CreditCard, Heart, Tag } from 'lucide-react';

interface DashboardPageProps {
  subscriptions: any[];
  isDark: boolean;
  onNavigate: (page: string) => void;
  onEdit: (sub: any) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  processingSubId: string | null;
  convertToUSD: (amount: number, currency: string) => number;
  currencySymbols: Record<string, string>;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Entertainment': return <Monitor className="w-5 h-5" />;
    case 'Software': return <Zap className="w-5 h-5" />;
    case 'Utilities': return <CreditCard className="w-5 h-5" />;
    case 'Health': return <Heart className="w-5 h-5" />;
    default: return <Tag className="w-5 h-5" />;
  }
};

export default function DashboardPage({ subscriptions, isDark, onNavigate, onEdit, onDelete, onAddNew, processingSubId, convertToUSD, currencySymbols }: DashboardPageProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICards subscriptions={subscriptions} isDark={isDark} onNavigate={onNavigate} convertToUSD={convertToUSD} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SpendChart subscriptions={subscriptions} isDark={isDark} convertToUSD={convertToUSD} />
        </div>
        <div className="lg:col-span-2">
          <CategoryDonut subscriptions={subscriptions} isDark={isDark} convertToUSD={convertToUSD} />
        </div>
      </div>

      {/* Upcoming Renewals */}
      <RenewalsTimeline
        subscriptions={subscriptions}
        isDark={isDark}
        onNavigate={onNavigate}
        getCategoryIcon={getCategoryIcon}
        currencySymbols={currencySymbols}
      />

      {/* Subscription Table */}
      <SubscriptionTable
        subscriptions={subscriptions}
        isDark={isDark}
        currencySymbols={currencySymbols}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddNew={onAddNew}
        processingSubId={processingSubId}
      />
    </div>
  );
}
