import {
  db, doc, addDoc, updateDoc, deleteDoc, collection, query, where, onSnapshot, Timestamp, getDoc, setDoc
} from '../firebase';

export interface Notification {
  id: string;
  userId: string;
  type: 'renewal' | 'trial' | 'overspend' | 'info';
  title: string;
  message: string;
  subscriptionId?: string;
  subscriptionName?: string;
  amount?: number;
  currency?: string;
  daysUntil?: number;
  read: boolean;
  emailSent: boolean;
  createdAt: any;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', PKR: 'Rs', INR: '₹', JPY: '¥',
};

/**
 * Checks all subscriptions and generates in-app notifications + sends email
 * reminders for subscriptions expiring within the lead time.
 */
export async function checkAndGenerateNotifications(
  userId: string,
  userEmail: string,
  userName: string,
  subscriptions: any[],
  leadDays: number = 2
): Promise<Notification[]> {
  const now = new Date();
  const generated: Notification[] = [];

  for (const sub of subscriptions) {
    if (!sub.nextBillingDate) continue;
    if (sub.status === 'cancelled' || sub.status === 'paused') continue;

    const nextDate = sub.nextBillingDate?.toDate
      ? sub.nextBillingDate.toDate()
      : new Date(sub.nextBillingDate);
    const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Generate notification for subscriptions within lead time
    if (daysUntil >= 0 && daysUntil <= leadDays) {
      // Check if we already generated a notification for this sub today
      const todayKey = `${sub.id}_${now.toISOString().split('T')[0]}`;
      const notifRef = doc(db, 'notificationsSent', todayKey);

      try {
        const existing = await getDoc(notifRef);
        if (existing.exists()) continue; // Already notified today

        const symbol = CURRENCY_SYMBOLS[sub.currency || 'USD'] || '$';
        const title = daysUntil === 0
          ? `${sub.name} renews today!`
          : daysUntil === 1
            ? `${sub.name} renews tomorrow`
            : `${sub.name} renews in ${daysUntil} days`;
        const message = `Your ${sub.name} subscription (${symbol}${sub.amount?.toFixed(2)}/${sub.billingCycle || 'month'}) is renewing on ${nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}.`;

        // Create in-app notification
        const notifData = {
          userId,
          type: sub.status === 'trial' ? 'trial' : 'renewal',
          title,
          message,
          subscriptionId: sub.id,
          subscriptionName: sub.name,
          amount: sub.amount,
          currency: sub.currency || 'USD',
          daysUntil,
          read: false,
          emailSent: false,
          createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'notifications'), notifData);
        generated.push({ id: docRef.id, ...notifData } as Notification);

        // Mark as sent for today
        await setDoc(notifRef, {
          subscriptionId: sub.id,
          userId,
          date: now.toISOString().split('T')[0],
          createdAt: Timestamp.now(),
        });

        // Send email reminder
        await sendEmailReminder(userEmail, userName, sub, daysUntil, nextDate);

        // Update notification as email sent
        await updateDoc(doc(db, 'notifications', docRef.id), { emailSent: true });

      } catch (err) {
        console.error(`Failed to generate notification for ${sub.name}:`, err);
      }
    }

    // Trial ending notifications
    if (sub.status === 'trial' && sub.trialEndDate) {
      const trialEnd = sub.trialEndDate?.toDate
        ? sub.trialEndDate.toDate()
        : new Date(sub.trialEndDate);
      const trialDaysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (trialDaysLeft >= 0 && trialDaysLeft <= leadDays) {
        const todayKey = `trial_${sub.id}_${now.toISOString().split('T')[0]}`;
        const notifRef = doc(db, 'notificationsSent', todayKey);

        try {
          const existing = await getDoc(notifRef);
          if (existing.exists()) continue;

          const title = trialDaysLeft === 0
            ? `${sub.name} trial ends today!`
            : `${sub.name} trial ends in ${trialDaysLeft} day${trialDaysLeft > 1 ? 's' : ''}`;

          const notifData = {
            userId,
            type: 'trial' as const,
            title,
            message: `Your free trial for ${sub.name} is ending. Cancel before it converts to a paid subscription.`,
            subscriptionId: sub.id,
            subscriptionName: sub.name,
            amount: sub.amount,
            currency: sub.currency || 'USD',
            daysUntil: trialDaysLeft,
            read: false,
            emailSent: false,
            createdAt: Timestamp.now(),
          };

          const docRef = await addDoc(collection(db, 'notifications'), notifData);
          generated.push({ id: docRef.id, ...notifData } as Notification);

          await setDoc(notifRef, {
            subscriptionId: sub.id,
            userId,
            date: now.toISOString().split('T')[0],
            type: 'trial',
            createdAt: Timestamp.now(),
          });

          await sendEmailReminder(userEmail, userName, sub, trialDaysLeft, trialEnd, true);
          await updateDoc(doc(db, 'notifications', docRef.id), { emailSent: true });

        } catch (err) {
          console.error(`Failed to generate trial notification for ${sub.name}:`, err);
        }
      }
    }
  }

  return generated;
}

/**
 * Listen to real-time notifications from Firestore
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): () => void {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Notification))
      .sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });
    callback(notifs);
  });
}

/**
 * Mark a notification as read
 */
export async function markNotificationRead(notifId: string): Promise<void> {
  await updateDoc(doc(db, 'notifications', notifId), { read: true });
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(notifications: Notification[]): Promise<void> {
  const unread = notifications.filter(n => !n.read);
  await Promise.all(unread.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true })));
}

/**
 * Delete a notification
 */
export async function deleteNotification(notifId: string): Promise<void> {
  await deleteDoc(doc(db, 'notifications', notifId));
}

/**
 * Send email reminder using EmailJS (free, no backend needed)
 * Falls back to browser Notification API if EmailJS is not configured
 */
async function sendEmailReminder(
  userEmail: string,
  userName: string,
  subscription: any,
  daysUntil: number,
  renewalDate: Date,
  isTrial: boolean = false
): Promise<boolean> {
  const symbol = CURRENCY_SYMBOLS[subscription.currency || 'USD'] || '$';
  const formattedDate = renewalDate.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // EmailJS integration — uses their free tier (200 emails/month)
  // Users can set up EmailJS by adding their keys to localStorage
  const emailjsServiceId = localStorage.getItem('subledge_emailjs_service_id');
  const emailjsTemplateId = localStorage.getItem('subledge_emailjs_template_id');
  const emailjsPublicKey = localStorage.getItem('subledge_emailjs_public_key');

  if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          template_id: emailjsTemplateId,
          user_id: emailjsPublicKey,
          template_params: {
            to_email: userEmail,
            to_name: userName || 'User',
            subscription_name: subscription.name,
            amount: `${symbol}${subscription.amount?.toFixed(2)}`,
            billing_cycle: subscription.billingCycle || 'monthly',
            renewal_date: formattedDate,
            days_until: daysUntil,
            is_trial: isTrial ? 'Yes' : 'No',
            subject: isTrial
              ? `⚠️ ${subscription.name} trial ends ${daysUntil === 0 ? 'today' : `in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`}`
              : `🔔 ${subscription.name} renews ${daysUntil === 0 ? 'today' : `in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`}`,
          },
        }),
      });

      if (response.ok) {
        console.log(`✅ Email reminder sent to ${userEmail} for ${subscription.name}`);
        return true;
      } else {
        console.warn(`⚠️ EmailJS returned ${response.status}`);
      }
    } catch (err) {
      console.error('❌ EmailJS error:', err);
    }
  }

  // Fallback: Browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new window.Notification(
      isTrial ? `${subscription.name} trial ending` : `${subscription.name} renewal reminder`,
      {
        body: `${isTrial ? 'Trial ends' : 'Renews'} ${daysUntil === 0 ? 'today' : `in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`} — ${symbol}${subscription.amount?.toFixed(2)}/${subscription.billingCycle || 'month'}`,
        icon: '/favicon.ico',
        tag: `subledge-${subscription.id}`,
      }
    );
    return true;
  } else if ('Notification' in window && Notification.permission === 'default') {
    // Request permission for next time
    Notification.requestPermission();
  }

  return false;
}

/**
 * Request browser notification permission
 */
export function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if ('Notification' in window) {
    return Notification.requestPermission();
  }
  return Promise.resolve('denied' as NotificationPermission);
}
