import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CommandPalette from '../ui/CommandPalette';
import SubscriptionDrawer from './SubscriptionDrawer';
import DashboardPage from './DashboardPage';
import AnalyticsPage from './AnalyticsPage';
import RemindersPage from './RemindersPage';
import CategoriesPage from './CategoriesPage';
import SettingsPage from './SettingsPage';
import TeamPage from './TeamPage';
import { useToast } from '../ui/ToastSystem';
import {
  db, doc, addDoc, updateDoc, deleteDoc, collection, Timestamp
} from '../../firebase';
import {
  checkAndGenerateNotifications,
  subscribeToNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  requestBrowserNotificationPermission,
  type Notification
} from '../../services/NotificationService';

interface DashboardLayoutProps {
  user: any;
  userProfile: any;
  subscriptions: any[];
  isDark: boolean;
  onToggleTheme: () => void;
  onSignOut: () => void;
  isSubsLoading: boolean;
  processingSubId: string | null;
  setProcessingSubId: (id: string | null) => void;
}

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  subscriptions: 'Subscriptions',
  analytics: 'Analytics',
  reminders: 'Reminders',
  categories: 'Categories',
  team: 'Team Workspace',
  settings: 'Settings',
};

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, PKR: 278.50, INR: 83.30, JPY: 151.30,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', PKR: 'Rs', INR: '₹', JPY: '¥',
};

const convertToUSD = (amount: number, currency: string) => {
  return amount / (EXCHANGE_RATES[currency] || 1);
};

export default function DashboardLayout({
  user, userProfile, subscriptions, isDark, onToggleTheme, onSignOut,
  isSubsLoading, processingSubId, setProcessingSubId
}: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifCheckDone, setNotifCheckDone] = useState(false);
  const { addToast } = useToast();

  // Subscribe to real-time notifications from Firestore
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToNotifications(user.uid, setNotifications);
    return () => unsub();
  }, [user?.uid]);

  // Check and generate notifications on dashboard load (once per session)
  useEffect(() => {
    if (!user?.uid || !user?.email || notifCheckDone || subscriptions.length === 0) return;

    const runCheck = async () => {
      try {
        // Request browser notification permission
        requestBrowserNotificationPermission();

        // Generate notifications for subscriptions expiring within 2 days
        const generated = await checkAndGenerateNotifications(
          user.uid,
          user.email,
          user.displayName || '',
          subscriptions,
          2 // 2 days lead time as requested
        );

        if (generated.length > 0) {
          addToast(`${generated.length} subscription${generated.length > 1 ? 's' : ''} renewing soon!`, 'warning');
        }
      } catch (err) {
        console.error('Notification check failed:', err);
      } finally {
        setNotifCheckDone(true);
      }
    };

    // Small delay to avoid blocking the initial render
    const timer = setTimeout(runCheck, 2000);
    return () => clearTimeout(timer);
  }, [user?.uid, user?.email, subscriptions, notifCheckDone]);

  const handleMarkRead = async (id: string) => {
    try { await markNotificationRead(id); } catch (e) { /* silent */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead(notifications);
      addToast('All notifications marked as read', 'success');
    } catch (e) { /* silent */ }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'k') { e.preventDefault(); setCommandPaletteOpen(true); }
      if (mod && e.key === 'n') { e.preventDefault(); openAddDrawer(); }
      if (mod && e.key === '/') { e.preventDefault(); setSidebarCollapsed(c => !c); }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setDrawerOpen(false);
        setEditingSub(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const openAddDrawer = () => { setEditingSub(null); setDrawerOpen(true); };
  const openEditDrawer = (sub: any) => { setEditingSub(sub); setDrawerOpen(true); };

  const handleSaveSubscription = async (data: any) => {
    if (!user) return;
    try {
      if (editingSub) {
        await updateDoc(doc(db, 'subscriptions', editingSub.id), {
          name: data.name,
          amount: data.amount,
          currency: data.currency,
          billingCycle: data.billingCycle,
          nextBillingDate: Timestamp.fromDate(new Date(data.nextBillingDate)),
          category: data.category,
          status: data.status || 'active',
          notes: data.notes || '',
          workspace: data.workspace || 'personal',
          ...(data.trialEndDate ? { trialEndDate: Timestamp.fromDate(new Date(data.trialEndDate)) } : {}),
        });
        addToast(`${data.name} updated successfully`, 'success');
      } else {
        await addDoc(collection(db, 'subscriptions'), {
          userId: user.uid,
          name: data.name,
          amount: data.amount,
          currency: data.currency,
          billingCycle: data.billingCycle,
          nextBillingDate: Timestamp.fromDate(new Date(data.nextBillingDate)),
          category: data.category,
          status: data.status || 'active',
          notes: data.notes || '',
          workspace: data.workspace || 'personal',
          createdAt: Timestamp.now(),
          ...(data.startDate ? { startDate: Timestamp.fromDate(new Date(data.startDate)) } : {}),
          ...(data.trialEndDate ? { trialEndDate: Timestamp.fromDate(new Date(data.trialEndDate)) } : {}),
        });
        addToast(`${data.name} added to your subscriptions`, 'success');
      }
      setDrawerOpen(false);
      setEditingSub(null);
    } catch (error: any) {
      addToast(`Error: ${error.message}`, 'error');
      throw error;
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    setProcessingSubId(id);
    try {
      const sub = subscriptions.find(s => s.id === id);
      await deleteDoc(doc(db, 'subscriptions', id));
      addToast(`${sub?.name || 'Subscription'} deleted`, 'success', {
        undoAction: () => addToast('Undo is not available for deletions', 'info')
      });
    } catch (error: any) {
      addToast(`Error: ${error.message}`, 'error');
    } finally {
      setProcessingSubId(null);
    }
  };

  const renderPage = () => {
    const commonProps = { subscriptions, isDark, convertToUSD, currencySymbols: CURRENCY_SYMBOLS };

    switch (currentPage) {
      case 'dashboard':
      case 'subscriptions':
        return (
          <DashboardPage
            {...commonProps}
            onNavigate={setCurrentPage}
            onEdit={openEditDrawer}
            onDelete={handleDeleteSubscription}
            onAddNew={openAddDrawer}
            processingSubId={processingSubId}
          />
        );
      case 'analytics':
        return <AnalyticsPage {...commonProps} />;
      case 'reminders':
        return <RemindersPage subscriptions={subscriptions} isDark={isDark} currencySymbols={CURRENCY_SYMBOLS} notifications={notifications} onMarkRead={handleMarkRead} onMarkAllRead={handleMarkAllRead} />;
      case 'categories':
        return <CategoriesPage subscriptions={subscriptions} isDark={isDark} convertToUSD={convertToUSD} />;
      case 'settings':
        return <SettingsPage isDark={isDark} user={user} userProfile={userProfile} onSignOut={onSignOut} onToggleTheme={onToggleTheme} />;
      case 'team':
        return <TeamPage isDark={isDark} user={user} userProfile={userProfile} />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-[#0d1520]' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        isDark={isDark}
        user={user}
        userProfile={userProfile}
        onSignOut={onSignOut}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          pageTitle={PAGE_TITLES[currentPage] || 'Dashboard'}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onOpenMobileSidebar={() => setMobileMenuOpen(true)}
          onAddSubscription={openAddDrawer}
          user={user}
          onSignOut={onSignOut}
          onNavigate={setCurrentPage}
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
        />

        {/* Scrollable Content */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${isDark ? 'scrollbar-dark' : 'scrollbar-light'}`}>
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Overlays */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={setCurrentPage}
        subscriptions={subscriptions}
      />

      <SubscriptionDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditingSub(null); }}
        onSave={handleSaveSubscription}
        editData={editingSub}
        isDark={isDark}
        currencySymbols={CURRENCY_SYMBOLS}
        exchangeRates={EXCHANGE_RATES}
      />
    </div>
  );
}
