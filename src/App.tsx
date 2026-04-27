import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { 
  ChevronRight, Moon, Sun, LayoutDashboard, Brain, 
  Bell, PieChart, BarChart3, BarChart2, Globe, Zap, RefreshCw,
  Figma, Headphones, BookOpen, Home, Settings, Plus, ArrowLeft, Search, AlertCircle,
  X, Calendar as CalendarIcon, DollarSign, Tag, Trash2, CreditCard, Monitor, Heart, 
  MoreVertical, Mail, LogOut, CheckCircle2, Twitter, Github, Linkedin
} from 'lucide-react';
export const Logo = ({ isDark }: { isDark: boolean }) => (
  <div className="relative w-8 h-8 flex items-center justify-center">
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
      <path 
        d="M35 15C45 10 65 10 80 25C95 40 95 65 80 80C65 95 35 95 20 80C10 70 10 50 15 35" 
        stroke={isDark ? "white" : "#14291d"} 
        strokeWidth="4" 
        strokeLinecap="round" 
        className="transition-colors duration-700 opacity-80"
      />
    </svg>
    <div className={`flex items-baseline font-serif ${isDark ? 'text-white' : 'text-[#14291d]'} transition-colors duration-700`}>
      <span className="text-xl font-bold leading-none translate-y-[-1px]">S</span>
      <span className="text-xs font-bold leading-none translate-x-[-1px]">L</span>
    </div>
  </div>
);

const PhoneMockup = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-[300px] sm:w-[340px] h-[650px] bg-[#fbfbfb] rounded-[48px] shadow-2xl overflow-hidden border-[10px] border-[#1a1a1a] flex flex-col shrink-0"
    >
      {/* Header */}
      <div className="bg-[#0a0a0a] text-white p-8 pb-20 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Hey Jack</h2>
          <div className="space-y-1.5 cursor-pointer">
            <div className="w-6 h-0.5 bg-white rounded-full"></div>
            <div className="w-4 h-0.5 bg-white ml-auto rounded-full"></div>
          </div>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed font-light">
          manage your subscriptions<br/>with subledge
        </p>
      </div>

      {/* Netflix Card (Floating) */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[150px] left-6 right-6 z-10"
      >
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden flex h-[140px] border border-transparent hover:-translate-y-1.5 hover:shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:border-[#E50914]/40 transition-all duration-300 cursor-pointer">
          <div className="w-[30%] bg-[#E50914] flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#E50914] text-2xl font-black tracking-tighter">N</span>
            </div>
          </div>
          <div className="p-5 flex-1 text-black flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg leading-tight">Netflix</h3>
              <p className="text-xs text-gray-400 mt-0.5">Family pack</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <span className="font-bold text-xl">$9.99</span>
                <span className="text-[10px] text-gray-400 font-medium"> / month</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-10 h-10 flex items-center justify-center mb-1">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="20" cy="20" r="18" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                    <circle cx="20" cy="20" r="18" fill="none" stroke="#E50914" strokeWidth="3" strokeDasharray="113" strokeDashoffset="40" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs font-bold">15</span>
                </div>
                <span className="text-[8px] text-gray-400 font-medium">Days left</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Subscriptions */}
      <div className="flex-1 bg-[#fbfbfb] pt-28 px-6 text-black">
        <h3 className="font-bold text-sm mb-6">Recent Subscriptions</h3>
        <div className="space-y-2">
          {/* Item 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between p-3 -mx-3 rounded-xl border border-transparent hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(242,78,30,0.15)] hover:border-[#F24E1E]/30 hover:bg-white transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-[#F24E1E]">
                  <Figma className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Figma</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Team plan</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">$23.45</div>
                <div className="text-[10px] text-gray-400 mt-0.5">/ month</div>
              </div>
            </div>
          </motion.div>
          {/* Item 2 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between p-3 -mx-3 rounded-xl border border-transparent hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(29,185,84,0.15)] hover:border-[#1DB954]/30 hover:bg-white transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-[#1DB954]">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Spotify</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Team plan</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">$12.06</div>
                <div className="text-[10px] text-gray-400 mt-0.5">/ month</div>
              </div>
            </div>
          </motion.div>
          {/* Item 3 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center justify-between p-3 -mx-3 rounded-xl border border-transparent hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:border-black/20 hover:bg-white transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-black">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Notion</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Team plan</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">$32.50</div>
                <div className="text-[10px] text-gray-400 mt-0.5">/ month</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="h-[88px] bg-white flex items-start justify-around px-4 pt-4 relative rounded-b-[38px] shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center gap-1">
          <Home className="w-6 h-6 text-[#E50914]" />
          <div className="w-1 h-1 bg-[#E50914] rounded-full"></div>
        </div>
        <Settings className="w-6 h-6 text-gray-300" />
        <div className="w-14 h-14 bg-[#E50914] rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(229,9,20,0.4)] -mt-10 cursor-pointer hover:scale-105 transition-transform">
          <Plus className="w-7 h-7" />
        </div>
        <BarChart2 className="w-6 h-6 text-gray-300" />
        <Bell className="w-6 h-6 text-gray-300" />
      </div>
    </motion.div>
  );
};

const features = [
  {
    title: "Smart Dashboard",
    desc: "Get a bird's-eye view of your entire subscription landscape. Track monthly and annual spend in one unified, beautiful interface.",
    icon: LayoutDashboard,
    wide: true,
    badge: "CORE"
  },
  {
    title: "AI Spend Intelligence",
    desc: "Our AI analyzes your usage patterns and highlights subscriptions you're paying for but rarely use.",
    icon: Brain,
    badge: "AI-POWERED"
  },
  {
    title: "Renewal Reminders",
    desc: "Never get caught by a surprise auto-renewal again. Get notified days before you're charged.",
    icon: Bell,
    badge: "REAL-TIME"
  },
  {
    title: "Category Intelligence",
    desc: "Automatically categorize your subscriptions into Entertainment, Software, Utilities, and more.",
    icon: PieChart
  },
  {
    title: "Spend Analytics",
    desc: "Visualize your subscription spending trends over time with beautiful, interactive charts.",
    icon: BarChart3
  },
  {
    title: "Multi-Currency Support",
    desc: "Paying in USD, EUR, and GBP? We automatically convert and track everything in your local currency.",
    icon: Globe
  }
];

const steps = [
  { num: "01", emoji: "👋", title: "Create Your Account", desc: "30 seconds, no card needed." },
  { num: "02", emoji: "🔗", title: "Add Subscriptions", desc: "Manual or pick from 200+ preloaded." },
  { num: "03", emoji: "🔔", title: "Get Smart Reminders", desc: "Customisable per subscription." },
  { num: "04", emoji: "✨", title: "Optimise & Save", desc: "AI surfaces wasted spend." }
];

import AuthPage from './components/AuthPage';
import { auth, onAuthStateChanged, signOut, db, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, query, where, onSnapshot, Timestamp, FirebaseUser, handleFirestoreError, OperationType, sendEmailVerification, reload } from './firebase';

function VerifyEmailView({ user, onSignOut, isDark }: { user: FirebaseUser, onSignOut: () => void, isDark: boolean }) {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    
    setIsResending(true);
    setResendStatus('idle');
    setErrorMessage(null);
    try {
      await sendEmailVerification(user);
      setResendStatus('sent');
      setCooldown(60); // 60 seconds cooldown
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      setResendStatus('error');
      if (error.code === 'auth/too-many-requests') {
        setErrorMessage('Too many requests. Please wait a moment before trying again.');
        setCooldown(30); // Set a shorter cooldown if Firebase already blocked us
      } else {
        setErrorMessage('Failed to resend. Please try again later.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await reload(user);
      // The onAuthStateChanged listener in App.tsx will pick up the change if verified
      if (user.emailVerified) {
        window.location.reload(); // Force a full reload to ensure all states are fresh
      }
    } catch (error) {
      console.error('Error refreshing user status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-700 ${isDark ? 'bg-[#14291d] text-white' : 'bg-[#f4f4f0] text-[#14291d]'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md p-8 rounded-[32px] shadow-2xl ${isDark ? 'bg-[#1a3a28]' : 'bg-white'}`}
      >
        <div className="flex justify-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
            <Mail className="w-10 h-10" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-4 tracking-tight">Verify your email</h1>
        <p className={`text-center mb-8 leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
          We've sent a verification link to <span className="font-semibold text-emerald-500">{user.email}</span>. 
          Please check your inbox and follow the instructions to verify your account.
        </p>

        <div className="space-y-4">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full py-4 rounded-2xl bg-[#2a6b45] hover:bg-[#235838] text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isRefreshing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            I've verified my email
          </button>

          <button 
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className={`w-full py-4 rounded-2xl border font-bold transition-all flex items-center justify-center gap-2 ${
              isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isResending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
            {cooldown > 0 ? `Resend in ${cooldown}s` : (resendStatus === 'sent' ? 'Email Sent!' : 'Resend Verification Email')}
          </button>

          {resendStatus === 'sent' && (
            <div className="flex items-center gap-2 text-emerald-500 text-sm justify-center">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verification email resent successfully!</span>
            </div>
          )}

          {resendStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-500 text-sm justify-center">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage || 'Failed to resend. Please try again later.'}</span>
            </div>
          )}

          <div className="pt-4 border-t border-white/10">
            <button 
              onClick={onSignOut}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'
              }`}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const SubscriptionSkeleton = ({ isDark }: { isDark: boolean }) => (
  <div className={`flex items-center justify-between p-6 rounded-[32px] border animate-pulse ${
    isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'
  }`}>
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
      <div className="space-y-2">
        <div className={`h-5 w-32 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
        <div className={`h-3 w-20 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
      </div>
    </div>
    <div className="text-right space-y-2">
      <div className={`h-5 w-20 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
      <div className={`h-3 w-16 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
    </div>
  </div>
);

const EXCHANGE_RATES: { [key: string]: number } = {
  USD: 1, EUR: 0.92, GBP: 0.79, PKR: 278.50, INR: 83.30, JPY: 151.30
};

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  USD: '$', EUR: '€', GBP: '£', PKR: 'Rs', INR: '₹', JPY: '¥'
};

const convertToUSD = (amount: number, currency: string) => {
  const rate = EXCHANGE_RATES[currency] || 1;
  return amount / rate;
};

const getBrandColor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('netflix')) return 'rgba(229, 9, 20, 0.4)';
  if (n.includes('spotify')) return 'rgba(30, 215, 96, 0.4)';
  if (n.includes('youtube')) return 'rgba(255, 0, 0, 0.4)';
  if (n.includes('amazon') || n.includes('prime')) return 'rgba(255, 153, 0, 0.4)';
  if (n.includes('apple')) return 'rgba(255, 255, 255, 0.3)';
  if (n.includes('hulu')) return 'rgba(28, 231, 131, 0.4)';
  if (n.includes('disney')) return 'rgba(17, 60, 207, 0.4)';
  return 'rgba(16, 185, 129, 0.3)';
};

const getDomain = (name: string) => {
  const n = name.toLowerCase().replace(/\s+/g, '');
  if (n.includes('netflix')) return 'netflix.com';
  if (n.includes('spotify')) return 'spotify.com';
  if (n.includes('youtube')) return 'youtube.com';
  if (n.includes('amazon') || n.includes('prime')) return 'amazon.com';
  if (n.includes('apple')) return 'apple.com';
  if (n.includes('hulu')) return 'hulu.com';
  if (n.includes('disney')) return 'disneyplus.com';
  if (n.includes('chatgpt') || n.includes('openai')) return 'openai.com';
  if (n.includes('figma')) return 'figma.com';
  if (n.includes('adobe')) return 'adobe.com';
  if (n.includes('github')) return 'github.com';
  return `${n}.com`;
};

const AntigravityOfficialLogoContainer = ({ name, domain }: { name: string, domain: string }) => {
  const [imgError, setImgError] = useState(false);
  
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="relative w-14 h-14 rounded-2xl bg-[#14291D] backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(163,255,18,0.3),_0_5px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(163,255,18,0.6),_0_10px_20px_rgba(0,0,0,0.6)] z-20 pointer-events-auto overflow-hidden group"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#A3FF12]/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 rounded-2xl shadow-[0_0_15px_rgba(163,255,18,0.2)] animate-pulse pointer-events-none" />
      
      {!imgError ? (
        <img 
          src={`https://logo.clearbit.com/${domain}`} 
          alt={domain} 
          onError={() => setImgError(true)}
          className="w-8 h-8 object-contain rounded-md relative z-10"
        />
      ) : (
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <span className="text-[#A3FF12] font-serif font-black text-2xl tracking-widest drop-shadow-[0_0_8px_rgba(163,255,18,0.8)]">
            {initial}
          </span>
        </div>
      )}
    </motion.div>
  );
};

const SubscriptionCard = ({ sub, isDark, processingSubId, handleDeleteSubscription, getCategoryIcon }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;

    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const brandColor = getBrandColor(sub.name);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ 
        y: -8, 
        boxShadow: `0 20px 40px ${brandColor}`, 
        scale: 1.02,
        borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative flex flex-col justify-between p-6 rounded-[32px] border backdrop-blur-md transition-colors overflow-hidden ${
        isDark ? 'bg-[#14291D]/60 border-white/10' : 'bg-white border-black/5'
      } ${processingSubId === sub.id ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Radial Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-[32px] pointer-events-none" 
        style={{
          background: `radial-gradient(circle at center, ${brandColor}, transparent)`
        }}
      />
      
      {/* Content Layer */}
      <div style={{ transform: "translateZ(50px)" }} className="flex flex-col h-full justify-between pointer-events-none">
        <div className="flex justify-between items-start mb-6">
          <AntigravityOfficialLogoContainer 
            name={sub.name}
            domain={getDomain(sub.name)} 
          />
          <div className="text-right">
            <div className="font-bold text-2xl">
              {CURRENCY_SYMBOLS[sub.currency || 'USD']}{sub.amount.toFixed(2)}
            </div>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${isDark ? 'bg-white/10 text-white/60' : 'bg-black/5 text-black/60'}`}>
                {sub.billingCycle}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 mb-4">
          <h4 className="font-bold text-xl tracking-tight truncate">{sub.name}</h4>
          <span className="text-[10px] opacity-40 uppercase tracking-widest">{sub.category}</span>
        </div>
        
        <div className="pt-4 border-t border-current/10 flex items-center justify-between">
          <div className="text-[10px] opacity-60 font-medium uppercase tracking-widest">
            Next: {sub.nextBillingDate?.toDate().toLocaleDateString()}
          </div>
          {processingSubId === sub.id ? (
            <RefreshCw className="w-5 h-5 animate-spin opacity-50" />
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); handleDeleteSubscription(sub.id); }}
              className={`p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 relative z-20 pointer-events-auto ${
                isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {processingSubId === sub.id && (
        <div style={{ transform: "translateZ(60px)" }} className="absolute inset-0 flex items-center justify-center bg-transparent z-20 rounded-[32px]">
          <RefreshCw className="w-6 h-6 animate-spin opacity-50" />
        </div>
      )}
    </motion.div>
  );
};

const GhostAlert = ({ upcomingBills }) => {
  const urgentBills = upcomingBills.filter(s => s.diffDays <= 2);
  
  return (
    <AnimatePresence>
      {urgentBills.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
          animate={{ height: 'auto', opacity: 1, marginBottom: 32 }}
          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
          className="overflow-hidden"
        >
          <div className="p-6 rounded-[32px] border border-white/10 backdrop-blur-md shadow-[0_0_40px_rgba(139,92,246,0.15)] relative overflow-hidden bg-white/5">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-lime-500/10" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-violet-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-sm bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-lime-400">
                    Payment Due Soon
                  </h3>
                  <p className="text-sm opacity-70 mt-1 font-medium">
                    {urgentBills.map(b => b.name).join(', ')} renewing within 48 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SmartBurnRateBar = ({ subscriptions, displayCurrency }) => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthProgress = (now.getDate() / daysInMonth) * 100;

  const totalMonthlySpend = subscriptions.reduce((acc, sub) => {
    const amountInUSD = convertToUSD(sub.amount, sub.currency || 'USD');
    const amountInDisplay = amountInUSD * (EXCHANGE_RATES[displayCurrency] || 1);
    return acc + (sub.billingCycle === 'monthly' ? amountInDisplay : amountInDisplay / 12);
  }, 0);

  const spentSoFar = subscriptions.reduce((acc, sub) => {
    if (!sub.nextBillingDate) return acc;
    const subDate = sub.nextBillingDate.toDate();
    const amountInUSD = convertToUSD(sub.amount, sub.currency || 'USD');
    const amountInDisplay = amountInUSD * (EXCHANGE_RATES[displayCurrency] || 1);
    const monthlyAmount = sub.billingCycle === 'monthly' ? amountInDisplay : amountInDisplay / 12;
    
    if (subDate.getDate() <= now.getDate()) {
      return acc + monthlyAmount;
    }
    return acc;
  }, 0);

  const spentProgress = totalMonthlySpend > 0 ? (spentSoFar / totalMonthlySpend) * 100 : 0;

  return (
    <div className="mt-10 space-y-5 w-full relative z-10">
      <div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">
          <span>Month Passed</span>
          <span>{Math.round(monthProgress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${monthProgress}%` }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="h-full bg-white/40 rounded-full"
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">
          <span>Burned So Far</span>
          <span>{Math.round(spentProgress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${spentProgress}%` }}
            transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full shadow-[0_0_10px_rgba(163,255,18,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [view, setView] = useState<'home' | 'login' | 'signup' | 'dashboard'>('home');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubsLoading, setIsSubsLoading] = useState(true);
  const [processingSubId, setProcessingSubId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState('USD');

  const [newSub, setNewSub] = useState({
    name: '',
    amount: '',
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: '',
    category: 'Entertainment'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);
      
      if (firebaseUser) {
        // Redirect immediately for better UX
        if (view === 'login' || view === 'signup') {
          setView('dashboard');
        }

        // Determine role immediately based on email
        const role = (firebaseUser.email === 'abdullahparvaiz2025@gmail.com' || 
                      firebaseUser.email === 'abdullahparvaizofficial@gmail.com') 
                      ? 'admin' : 'user';

        // Start listening to subscriptions immediately
        const q = role === 'admin' 
          ? query(collection(db, 'subscriptions'))
          : query(collection(db, 'subscriptions'), where('userId', '==', firebaseUser.uid));
          
        const unsubSubs = onSnapshot(q, (snapshot) => {
          const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setSubscriptions(subs);
          setIsSubsLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'subscriptions');
          setIsSubsLoading(false);
        });

        // Handle user profile in background
        const checkProfile = async () => {
          try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userRef);
            
            let profileData;
            if (!userSnap.exists()) {
              profileData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                createdAt: new Date(),
                role: role
              };
              await setDoc(userRef, profileData);
            } else {
              profileData = userSnap.data();
              if (profileData.role !== role && role === 'admin') {
                profileData.role = role;
                await updateDoc(userRef, { role: role });
              }
            }
            setUserProfile(profileData);
          } catch (err) {
            console.error("Profile check error:", err);
          }
        };
        
        checkProfile();

        return () => unsubSubs();
      } else {
        setSubscriptions([]);
        setUserProfile(null);
        if (view === 'dashboard') {
          setView('home');
        }
      }
    });

    return () => unsubscribe();
  }, [view]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setView('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const newDocRef = doc(collection(db, 'subscriptions'));
      const subData = {
        id: newDocRef.id,
        userId: user.uid,
        name: newSub.name,
        amount: parseFloat(newSub.amount),
        currency: newSub.currency,
        billingCycle: newSub.billingCycle,
        nextBillingDate: Timestamp.fromDate(new Date(newSub.nextBillingDate)),
        category: newSub.category,
        createdAt: Timestamp.now()
      };

      await setDoc(newDocRef, subData);
      setShowAddModal(false);
      setNewSub({
        name: '',
        amount: '',
        currency: 'USD',
        billingCycle: 'monthly',
        nextBillingDate: '',
        category: 'Entertainment'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'subscriptions');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    
    setProcessingSubId(id);
    try {
      await deleteDoc(doc(db, 'subscriptions', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `subscriptions/${id}`);
    } finally {
      setProcessingSubId(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Entertainment': return <Monitor className="w-5 h-5" />;
      case 'Software': return <Zap className="w-5 h-5" />;
      case 'Utilities': return <CreditCard className="w-5 h-5" />;
      case 'Health': return <Heart className="w-5 h-5" />;
      default: return <Tag className="w-5 h-5" />;
    }
  };

  if (!isAuthReady) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#14291d]' : 'bg-[#f4f4f0]'}`}>
        <div className="animate-pulse">
          <Logo isDark={isDark} />
        </div>
      </div>
    );
  }

  if (view === 'login' || view === 'signup') {
    return <AuthPage mode={view} setView={setView} isDark={isDark} />;
  }

  if (view === 'dashboard' && user) {
    if (!user.emailVerified) {
      return <VerifyEmailView user={user} onSignOut={handleSignOut} isDark={isDark} />;
    }

    const upcomingBills = subscriptions
      .filter(s => s.nextBillingDate)
      .map(s => {
        const diffTime = s.nextBillingDate.toDate().getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...s, diffDays };
      })
      .filter(s => s.diffDays >= 0);

    const nextBigBill = upcomingBills.length > 0 
      ? upcomingBills.sort((a, b) => convertToUSD(b.amount, b.currency || 'USD') - convertToUSD(a.amount, a.currency || 'USD'))[0]
      : null;

    return (
      <div 
        className={`min-h-screen p-8 transition-colors duration-700 ${isDark ? 'text-white' : 'bg-[#f4f4f0] text-[#14291d]'}`}
        style={isDark ? { background: 'radial-gradient(circle at center, #1b3a29 0%, #14291D 100%)' } : {}}
      >
        <div className="max-w-5xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <Logo isDark={isDark} />
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Subledge</h1>
                {userProfile?.role === 'admin' && (
                  <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold">{user.displayName || user.email}</p>
                  <button onClick={handleSignOut} className="text-xs opacity-60 hover:opacity-100">Sign Out</button>
                </div>
                {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-white/10" referrerPolicy="no-referrer" />}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className={`p-10 rounded-[40px] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-xl'}`}>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-serif italic">Welcome back, {user.displayName?.split(' ')[0] || 'Friend'}!</h2>
                    <p className="opacity-60 text-sm mt-1">You have {subscriptions.length} active subscriptions.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20"
                  >
                    <Plus className="w-5 h-5" /> Add New
                  </button>
                </div>

                <div className="mb-8 relative">
                  <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/30' : 'text-black/30'}`} />
                  <input 
                    type="text"
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-14 pr-6 py-4 rounded-2xl border-transparent focus:ring-2 outline-none transition-all ${
                      isDark 
                        ? 'bg-white/5 focus:ring-emerald-500/30 text-white placeholder:text-white/30' 
                        : 'bg-gray-100 focus:ring-emerald-500/20 text-black placeholder:text-black/40'
                    }`}
                  />
                </div>

                {/* Predictive Ghost Alert */}
                {!isSubsLoading && <GhostAlert upcomingBills={upcomingBills} />}

                {isSubsLoading ? (
                  <div className="space-y-4">
                    <SubscriptionSkeleton isDark={isDark} />
                    <SubscriptionSkeleton isDark={isDark} />
                    <SubscriptionSkeleton isDark={isDark} />
                  </div>
                ) : subscriptions.filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                  <div className="py-20 text-center opacity-40 border-2 border-dashed border-current rounded-[40px] flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-current/10 flex items-center justify-center">
                      {searchTerm ? <Search className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                    </div>
                    <p className="font-medium">
                      {searchTerm ? `No results for "${searchTerm}"` : "No subscriptions added yet."}
                    </p>
                    {!searchTerm && (
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className="text-xs underline underline-offset-4 hover:opacity-100"
                      >
                        Add your first one
                      </button>
                    )}
                  </div>
                ) : (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } },
                      hidden: {}
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {subscriptions
                      .filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((sub) => (
                      <SubscriptionCard 
                        key={sub.id} 
                        sub={sub} 
                        isDark={isDark} 
                        processingSubId={processingSubId} 
                        handleDeleteSubscription={handleDeleteSubscription}
                        getCategoryIcon={getCategoryIcon}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Sidebar / Stats */}
            <div className="space-y-8">
              {/* Currency Switcher */}
              <div className={`p-4 rounded-[24px] border flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-md'}`}>
                {Object.keys(EXCHANGE_RATES).map(curr => (
                  <button
                    key={curr}
                    onClick={() => setDisplayCurrency(curr)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 ${
                      displayCurrency === curr
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>

              {/* The Floating Burn Rate Sphere */}
              <div className={`relative p-8 rounded-[40px] border flex flex-col items-center justify-center overflow-hidden transition-all hover:shadow-2xl min-h-[350px] ${
                isDark ? 'bg-white/5 border-white/10 hover:shadow-emerald-500/5' : 'bg-white border-black/5 shadow-xl hover:shadow-emerald-500/10'
              }`}>
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none" />
                
                <h3 className="font-bold mb-8 flex items-center gap-2 text-sm uppercase tracking-widest opacity-60 z-10">
                  <PieChart className="w-4 h-4 text-emerald-500" /> Monthly Burn Rate
                </h3>
                
                {/* The Sphere */}
                <motion.div 
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className={`relative z-10 w-56 h-56 rounded-full flex flex-col items-center justify-center backdrop-blur-md border border-white/20 shadow-[inset_0_4px_30px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.1)] ${
                    isDark ? 'bg-white/10 shadow-[0_0_50px_rgba(16,185,129,0.15)]' : 'bg-white/60 shadow-[0_0_50px_rgba(16,185,129,0.08)]'
                  }`}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/10 to-transparent" />
                  <div className="text-4xl font-serif italic font-bold text-center z-10 relative px-4 flex flex-col items-center">
                    <span className="text-lg opacity-70 mb-1">{CURRENCY_SYMBOLS[displayCurrency] || '$'}</span>
                    <span>
                      {subscriptions.reduce((acc, sub) => {
                        const amountInUSD = convertToUSD(sub.amount, sub.currency || 'USD');
                        const amountInDisplay = amountInUSD * (EXCHANGE_RATES[displayCurrency] || 1);
                        return acc + (sub.billingCycle === 'monthly' ? amountInDisplay : amountInDisplay / 12);
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-60 uppercase tracking-[0.2em] font-bold mt-2 z-10 relative">Total Spent</p>
                </motion.div>

                {/* Next Big Bill (Upcoming Payments) */}
                {nextBigBill && (
                  <div className={`mt-10 w-full p-5 rounded-3xl flex items-center justify-between backdrop-blur-md border relative z-10 shadow-lg ${
                    isDark ? 'bg-gradient-to-r from-violet-500/20 to-lime-500/20 border-white/10' : 'bg-gradient-to-r from-violet-500/10 to-lime-500/10 border-black/5'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="transform scale-[0.7] origin-left -my-4 -ml-2">
                        <AntigravityOfficialLogoContainer 
                          name={nextBigBill.name}
                          domain={getDomain(nextBigBill.name)} 
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Next Big Bill</p>
                        <p className="font-bold text-sm truncate max-w-[120px]">{nextBigBill.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-500">
                        {nextBigBill.diffDays === 0 ? 'Today' : `${nextBigBill.diffDays}d`}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mt-0.5">Left</p>
                    </div>
                  </div>
                )}
                
                <SmartBurnRateBar 
                  subscriptions={subscriptions} 
                  displayCurrency={displayCurrency} 
                />
              </div>

              <button 
                onClick={() => setView('home')}
                className={`w-full py-4 rounded-3xl border transition-all flex items-center justify-center gap-2 font-bold ${
                  isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Landing Page
              </button>
            </div>
          </div>
        </div>

        {/* Add Subscription Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative w-full max-w-md p-8 rounded-[32px] shadow-2xl ${
                  isDark ? 'bg-[#1a3a28] text-white' : 'bg-white text-[#14291d]'
                }`}
              >
                <button 
                  onClick={() => setShowAddModal(false)}
                  className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
                    isDark ? 'hover:bg-white/10 text-white/40' : 'hover:bg-black/5 text-black/40'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-2">Add Subscription</h2>
                <p className={`text-sm mb-8 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  Keep track of your recurring expenses.
                </p>

                <form onSubmit={handleAddSubscription} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50 ml-1">Service Name</label>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {newSub.name.trim().length > 2 ? (
                          <div className="transform scale-[0.85] origin-center -my-2 -mx-1">
                            <AntigravityOfficialLogoContainer 
                              name={newSub.name}
                              domain={getDomain(newSub.name)} 
                            />
                          </div>
                        ) : (
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isDark ? 'bg-white/5 border-white/10 shadow-inner' : 'bg-black/5 border-black/5'}`}>
                            <Zap className="w-5 h-5 opacity-30" />
                          </div>
                        )}
                      </div>
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Netflix, Spotify" 
                          value={newSub.name}
                          onChange={(e) => setNewSub({...newSub, name: e.target.value})}
                          className={`w-full px-5 py-4 rounded-2xl border-transparent focus:ring-2 outline-none transition-all ${
                            isDark 
                              ? 'bg-white/5 focus:ring-emerald-500/30 text-white placeholder:text-white/30' 
                              : 'bg-gray-100 focus:ring-emerald-500/20 text-black placeholder:text-black/40'
                          }`} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-50 ml-1">Amount</label>
                      <div className="relative">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-40`}>
                          {CURRENCY_SYMBOLS[newSub.currency] || '$'}
                        </div>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          placeholder="0.00" 
                          value={newSub.amount}
                          onChange={(e) => setNewSub({...newSub, amount: e.target.value})}
                          className={`w-full pl-12 pr-5 py-4 rounded-2xl border-transparent focus:ring-2 outline-none transition-all ${
                            isDark 
                              ? 'bg-white/5 focus:ring-emerald-500/30 text-white placeholder:text-white/30' 
                              : 'bg-gray-100 focus:ring-emerald-500/20 text-black placeholder:text-black/40'
                          }`} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-50 ml-1">Currency</label>
                      <select 
                        value={newSub.currency}
                        onChange={(e) => setNewSub({...newSub, currency: e.target.value})}
                        className={`w-full px-5 py-4 rounded-2xl border-transparent focus:ring-2 outline-none transition-all appearance-none ${
                          isDark 
                            ? 'bg-white/5 focus:ring-emerald-500/30 text-white' 
                            : 'bg-gray-100 focus:ring-emerald-500/20 text-black'
                        }`}
                      >
                        {Object.keys(EXCHANGE_RATES).map(curr => (
                          <option key={curr} value={curr}>{curr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-50 ml-1">Cycle</label>
                      <select 
                        value={newSub.billingCycle}
                        onChange={(e) => setNewSub({...newSub, billingCycle: e.target.value})}
                        className={`w-full px-5 py-4 rounded-2xl border-transparent focus:ring-2 outline-none transition-all appearance-none ${
                          isDark 
                            ? 'bg-white/5 focus:ring-emerald-500/30 text-white' 
                            : 'bg-gray-100 focus:ring-emerald-500/20 text-black'
                        }`}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50 ml-1">Next Billing Date</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                      <input 
                        type="date" 
                        required
                        value={newSub.nextBillingDate}
                        onChange={(e) => setNewSub({...newSub, nextBillingDate: e.target.value})}
                        className={`w-full pl-12 pr-5 py-4 rounded-2xl border-transparent focus:ring-2 outline-none transition-all ${
                          isDark 
                            ? 'bg-white/5 focus:ring-emerald-500/30 text-white [color-scheme:dark]' 
                            : 'bg-gray-100 focus:ring-emerald-500/20 text-black'
                        }`} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50 ml-1">Category</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                      <select 
                        value={newSub.category}
                        onChange={(e) => setNewSub({...newSub, category: e.target.value})}
                        className={`w-full pl-12 pr-5 py-4 rounded-2xl border-transparent focus:ring-2 outline-none transition-all appearance-none ${
                          isDark 
                            ? 'bg-white/5 focus:ring-emerald-500/30 text-white' 
                            : 'bg-gray-100 focus:ring-emerald-500/20 text-black'
                        }`}
                      >
                        <option value="Entertainment">Entertainment</option>
                        <option value="Software">Software</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Health">Health</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg hover:shadow-emerald-500/20 mt-4 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Subscription'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans relative overflow-hidden transition-colors duration-700 ${
      isDark 
        ? 'bg-[radial-gradient(circle_at_top_right,_#234733,_#14291d)] text-[#f4f4f0] selection:bg-white/20' 
        : 'bg-[#f4f4f0] text-[#14291d] selection:bg-[#14291d]/20'
    }`}>
      {/* Noise overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isDark ? 'opacity-[0.05] mix-blend-overlay' : 'opacity-[0.03] mix-blend-multiply'
        }`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      <div className="relative z-10 flex flex-col max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-24">
        {/* Header */}
        <header className="flex items-center justify-between py-10">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="transition-transform duration-500 group-hover:rotate-90">
              <Logo isDark={isDark} />
            </div>
            <span className="text-xl font-medium tracking-wide">Subledge</span>
          </div>

          <nav className={`hidden md:flex items-center gap-8 text-[10px] font-semibold tracking-[0.2em] uppercase px-8 py-3.5 rounded-full backdrop-blur-md border transition-colors duration-500 ${
            isDark 
              ? 'bg-white/5 border-white/10 text-white/70 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' 
              : 'bg-black/5 border-black/10 text-black/70 shadow-[0_4px_30px_rgba(0,0,0,0.05)]'
          }`}>
            <a href="#" className={`relative py-1 transition-colors ${isDark ? 'hover:text-white after:bg-white' : 'hover:text-black after:bg-black'} after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out`}>About</a>
            <a href="#" className={`relative py-1 transition-colors ${isDark ? 'hover:text-white after:bg-white' : 'hover:text-black after:bg-black'} after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out`}>Partners</a>
            <a href="#" className={`relative py-1 transition-colors ${isDark ? 'hover:text-white after:bg-white' : 'hover:text-black after:bg-black'} after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out`}>Features</a>
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full transition-colors duration-300 ${
                isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-[#14291d]'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? (
              <button 
                onClick={() => setView('dashboard')}
                className="btn-uiverse-login"
              >
                Dashboard
              </button>
            ) : (
              <button 
                onClick={() => setView('login')}
                className="btn-uiverse-login"
              >
                Log In
              </button>
            )}
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-between pb-20 pt-12 gap-12">
            <div className="max-w-3xl lg:w-1/2">
              <h1 className="font-serif text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[80px] leading-[0.9] tracking-[-0.02em] mb-8">
                <span className="block">Track Every</span>
                <span className="block italic pr-4 opacity-90">Subscription.</span>
                <span className="block mt-2 md:mt-4">Control Every</span>
                <span className="block italic pr-4 opacity-90">Penny.</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl font-light opacity-80 max-w-2xl leading-[1.4] tracking-wide mb-10">
                Simplify your financial journey with us. Join today and experience hassle-free subscription management.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => setView('signup')}
                  className="btn-17"
                >
                  <span className="text-container">
                    <span className="text">Get Started</span>
                  </span>
                </button>
                <button 
                  className="btn-uiverse-how"
                >
                  How it Works
                </button>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex justify-center lg:justify-end w-full">
              <PhoneMockup />
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className={`py-32 px-8 md:px-16 rounded-[64px] my-20 border transition-all duration-700 ${
            isDark 
              ? 'bg-white/[0.02] border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.2)]' 
              : 'bg-white border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.04)]'
          }`}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-20"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-6 border ${
                isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <Zap className="w-3.5 h-3.5" /> Features
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 leading-[1.1]">
                Everything You Need to <br className="hidden md:block" />
                <span className="italic opacity-90 text-emerald-500">Master Your Subscriptions</span>
              </h2>
              <p className="text-lg md:text-xl opacity-60 max-w-2xl font-light leading-relaxed">
                Powerful tools designed to give you complete visibility and control over your recurring expenses.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative p-10 rounded-[40px] border transition-all duration-500 hover:-translate-y-3 ${
                    feature.wide ? 'md:col-span-2' : 'col-span-1'
                  } ${
                    isDark 
                      ? 'bg-white/[0.03] border-white/10 hover:border-emerald-500/40 hover:shadow-[0_30px_60px_rgba(16,185,129,0.1)]' 
                      : 'bg-gray-50/50 border-black/5 hover:bg-white hover:border-emerald-600/20 hover:shadow-[0_30px_60px_rgba(16,185,129,0.08)]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-12">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br transition-transform duration-500 group-hover:scale-110 ${
                      isDark ? 'from-emerald-400/20 to-teal-600/20 text-emerald-400' : 'from-emerald-500/20 to-teal-700/20 text-emerald-700'
                    }`}>
                      <feature.icon className="w-7 h-7 transition-transform duration-500 group-hover:rotate-12" />
                    </div>
                    {feature.badge && (
                      <span className={`text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full border ${
                        isDark ? 'bg-white/5 border-white/10 text-white/70' : 'bg-black/5 border-black/10 text-black/70'
                      }`}>
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 tracking-tight">{feature.title}</h3>
                  <p className={`text-base font-light leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-32 relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-20 text-center flex flex-col items-center"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-6 border ${
                isDark ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-700'
              }`}>
                <RefreshCw className="w-3.5 h-3.5" /> How It Works
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
                Up and Running in <span className="italic opacity-90 text-cyan-500">Minutes</span>
              </h2>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 relative group/section">
              {/* Connector Line */}
              <div className={`hidden lg:block absolute top-[50%] left-0 w-full h-[1px] -translate-y-1/2 overflow-hidden ${
                isDark ? 'bg-white/10' : 'bg-black/10'
              }`}>
                <motion.div 
                  initial={{ x: "-100%" }}
                  whileInView={{ x: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" 
                />
              </div>
              
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 relative group cursor-default pt-12 lg:pt-0"
                >
                  {/* Step Number */}
                  <div className={`text-[100px] xl:text-[120px] leading-none font-mono font-bold absolute -top-6 lg:-top-14 -left-4 lg:-left-6 transition-all duration-700 z-0 select-none pointer-events-none
                    ${isDark 
                      ? 'text-white/[0.03] group-hover:text-cyan-400/20 group-hover:drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]' 
                      : 'text-black/[0.03] group-hover:text-cyan-500/20 group-hover:drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                    }`}>
                    {step.num}
                  </div>
                  
                  {/* Card */}
                  <div className={`relative z-10 p-10 rounded-[40px] border transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_30px_60px_-15px_rgba(34,211,238,0.15)] h-full ${
                    isDark 
                      ? 'bg-[#14291d]/80 backdrop-blur-2xl border-white/10 group-hover:border-cyan-400/40' 
                      : 'bg-white/80 backdrop-blur-2xl border-black/10 group-hover:border-cyan-500/40 shadow-sm'
                  }`}>
                    <div className="text-4xl mb-8 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6 origin-left">{step.emoji}</div>
                    <h3 className={`font-bold text-xl mb-3 transition-colors duration-300 ${isDark ? 'group-hover:text-cyan-400' : 'group-hover:text-cyan-600'}`}>{step.title}</h3>
                    <p className={`text-base font-light leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className={`pt-20 pb-10 mt-32 border-t ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex items-center gap-3 group cursor-pointer w-fit">
                <div className="transition-transform duration-500 group-hover:rotate-12">
                  <Logo isDark={isDark} />
                </div>
                <span className="text-xl font-medium tracking-wide">Subledge</span>
              </div>
              <p className={`text-sm leading-relaxed max-w-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                Your ultimate subscription management platform. Track expenses, get smart reminders, and optimize your financial life with AI-powered insights.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <a href="#" className={`p-2.5 rounded-full transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white' : 'bg-black/5 hover:bg-black/10 text-black/60 hover:text-black'}`}>
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className={`p-2.5 rounded-full transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white' : 'bg-black/5 hover:bg-black/10 text-black/60 hover:text-black'}`}>
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className={`p-2.5 rounded-full transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white' : 'bg-black/5 hover:bg-black/10 text-black/60 hover:text-black'}`}>
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="font-bold text-sm tracking-widest uppercase">Product</h4>
              <div className="flex flex-col gap-3 text-sm">
                <a href="#" className={`transition-colors ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-black/50 hover:text-emerald-600'}`}>Features</a>
                <a href="#" className={`transition-colors ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-black/50 hover:text-emerald-600'}`}>Integrations</a>
                <a href="#" className={`transition-colors ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-black/50 hover:text-emerald-600'}`}>Pricing</a>
                <a href="#" className={`transition-colors ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-black/50 hover:text-emerald-600'}`}>Changelog</a>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="font-bold text-sm tracking-widest uppercase">Resources</h4>
              <div className="flex flex-col gap-3 text-sm">
                <a href="#" className={`transition-colors ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-black/50 hover:text-emerald-600'}`}>Help Center</a>
                <a href="#" className={`transition-colors ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-black/50 hover:text-emerald-600'}`}>Community</a>
                <a href="#" className={`transition-colors ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-black/50 hover:text-emerald-600'}`}>Blog</a>
                <a href="#" className={`transition-colors ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-black/50 hover:text-emerald-600'}`}>Status</a>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="font-bold text-sm tracking-widest uppercase">Legal</h4>
              <div className="flex flex-col gap-3 text-sm">
                <a href="#" className={`transition-colors ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-black/50 hover:text-emerald-600'}`}>Privacy Policy</a>
                <a href="#" className={`transition-colors ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-black/50 hover:text-emerald-600'}`}>Terms of Service</a>
                <a href="#" className={`transition-colors ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-black/50 hover:text-emerald-600'}`}>Cookie Policy</a>
              </div>
            </div>
          </div>

          <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
            <div className={`text-xs font-light tracking-wider ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              &copy; {new Date().getFullYear()} Subledge Inc. Crafted for financial freedom.
            </div>
            
            <div className="flex items-center gap-2 group cursor-pointer">
              <Mail className={`w-3.5 h-3.5 transition-colors ${isDark ? 'text-emerald-500/60 group-hover:text-emerald-400' : 'text-emerald-600/60 group-hover:text-emerald-700'}`} />
              <a 
                href="mailto:abdullahparvaizofficial@gmail.com" 
                className={`text-[10px] font-bold tracking-[0.1em] transition-colors ${isDark ? 'text-white/30 group-hover:text-white/60' : 'text-black/30 group-hover:text-black/60'}`}
              >
                abdullahparvaizofficial@gmail.com
              </a>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
