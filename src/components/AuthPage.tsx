import React, { useState } from 'react';
import { ArrowLeft, Facebook, X, CheckCircle2, Loader2 } from 'lucide-react';
import { Logo } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile, sendEmailVerification, db, doc, updateDoc, setDoc } from '../firebase';

interface AuthPageProps {
  mode: 'login' | 'signup';
  setView: (view: 'home' | 'login' | 'signup' | 'dashboard') => void;
  isDark: boolean;
}

export default function AuthPage({ mode, setView, isDark }: AuthPageProps) {
  const isLogin = mode === 'login';
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    // Normalize to 0-4
    if (pass.length < 6) return 1; // Weak regardless of characters
    if (score <= 2) return 2; // Fair
    if (score <= 4) return 3; // Good
    return 4; // Strong
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    '',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-emerald-500'
  ];

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      // App.tsx handles the view change via onAuthStateChanged
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName) {
          await updateProfile(userCredential.user, { displayName: fullName });
        }
        // Send verification email
        await sendEmailVerification(userCredential.user);
      }
      // App.tsx handles the view change via onAuthStateChanged immediately
    } catch (err: any) {
      console.error('Auth Error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (err: any) {
      console.error('Reset Error:', err);
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setResetEmailSent(false);
    setEmail('');
  };

  return (
    <div className={`min-h-screen flex w-full font-sans transition-colors duration-700 ${
      isDark ? 'bg-[#14291d] text-[#f4f4f0]' : 'bg-[#f4f4f0] text-[#14291d]'
    }`}>
      {/* Left Side - Decorative Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#234733] relative overflow-hidden items-center justify-center">
        {/* Abstract Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-400 blur-[100px]" />
        </div>
        
        <div className="relative z-10 p-12 text-white flex flex-col items-center text-center max-w-md">
          <div className="mb-12 scale-150">
            <Logo isDark={true} />
          </div>
          <h2 className="text-4xl font-serif mb-6 leading-tight">
            Master Your <br/><span className="italic opacity-90">Subscriptions</span>
          </h2>
          <p className="opacity-80 text-lg font-light leading-relaxed">
            Join thousands of users taking control of their recurring expenses with Subledge.
          </p>
        </div>
      </div>

      {/* Right Side - Form Area */}
      <div className={`w-full lg:w-7/12 flex flex-col relative transition-colors duration-700 ${isDark ? 'bg-[#14291d]' : 'bg-white'}`}>
        {/* Back Button */}
        <button 
          onClick={() => setView('home')} 
          className="absolute top-8 left-8 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity z-20"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>

        <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12">
          <div className="w-full max-w-[400px]">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4 tracking-tight">
                {isLogin ? 'Log in' : 'Sign up'}
              </h1>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                Hello, friend! I'm Subledge - subscription manager you can trust everything. Let's get in touch!
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                  {error}
                </div>
              )}
              {!isLogin && (
                <div>
                  <input 
                    type="text" 
                    required
                    placeholder="Full Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-5 py-4 rounded-2xl border-transparent focus:ring-2 outline-none transition-all ${
                      isDark 
                        ? 'bg-white/5 focus:ring-emerald-500/30 text-white placeholder:text-white/30' 
                        : 'bg-gray-100 focus:ring-emerald-500/20 text-black placeholder:text-black/40'
                    }`} 
                  />
                </div>
              )}
              <div>
                <input 
                  type="email" 
                  required
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-5 py-4 rounded-2xl border-transparent focus:ring-2 outline-none transition-all ${
                    isDark 
                      ? 'bg-white/5 focus:ring-emerald-500/30 text-white placeholder:text-white/30' 
                      : 'bg-gray-100 focus:ring-emerald-500/20 text-black placeholder:text-black/40'
                  }`} 
                />
              </div>
              <div>
                <input 
                  type="password" 
                  required
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-5 py-4 rounded-2xl border-transparent focus:ring-2 outline-none transition-all ${
                    isDark 
                      ? 'bg-white/5 focus:ring-emerald-500/30 text-white placeholder:text-white/30' 
                      : 'bg-gray-100 focus:ring-emerald-500/20 text-black placeholder:text-black/40'
                  }`} 
                />
                {password && !isLogin && (
                  <div className="mt-2 px-1">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                            level <= strength 
                              ? strengthColors[strength] 
                              : isDark ? 'bg-white/10' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        strength === 1 ? 'text-red-500' :
                        strength === 2 ? 'text-orange-500' :
                        strength === 3 ? 'text-yellow-500' :
                        strength === 4 ? 'text-emerald-500' : ''
                      }`}>
                        {strengthLabels[strength]}
                      </span>
                      <span className={`text-[10px] opacity-40 font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                        Strength
                      </span>
                    </div>
                  </div>
                )}
                {isLogin && (
                  <div className="flex justify-end mt-2">
                    <button 
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className={`text-xs font-medium hover:underline underline-offset-4 ${isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'}`}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
 
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-[#2a6b45] hover:bg-[#235838] text-white font-bold transition-all mt-6 shadow-[0_8px_20px_rgba(42,107,69,0.25)] hover:shadow-[0_8px_25px_rgba(42,107,69,0.35)] hover:-translate-y-0.5 transform duration-200 disabled:opacity-50 disabled:translate-y-0"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  isLogin ? "Let's start!" : "Create account"
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <button 
                disabled={isLoading}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'
              }`}>
                <Facebook className="w-5 h-5 text-[#1877F2]" fill="currentColor" stroke="none" />
              </button>
              <button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'
              }`}>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin opacity-40" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                    <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                    <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                    <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Toggle Link */}
            <p className={`text-center mt-10 text-sm ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setView(isLogin ? 'signup' : 'login')} 
                className="font-bold text-[#2a6b45] hover:underline underline-offset-4"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForgotModal}
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
                onClick={closeForgotModal}
                className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
                  isDark ? 'hover:bg-white/10 text-white/40' : 'hover:bg-black/5 text-black/40'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              {!resetEmailSent ? (
                <>
                  <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                  <p className={`text-sm mb-8 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <input 
                      type="email" 
                      required
                      placeholder="Email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-5 py-4 rounded-2xl border-transparent focus:ring-2 outline-none transition-all ${
                        isDark 
                          ? 'bg-white/5 focus:ring-emerald-500/30 text-white placeholder:text-white/30' 
                          : 'bg-gray-100 focus:ring-emerald-500/20 text-black placeholder:text-black/40'
                      }`} 
                    />
                    <button 
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-[#2a6b45] hover:bg-[#235838] text-white font-bold transition-colors shadow-lg"
                    >
                      Send Reset Link
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                  <p className={`text-sm mb-8 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    We've sent a password reset link to <span className="font-semibold text-emerald-500">{email}</span>.
                  </p>
                  <button 
                    onClick={closeForgotModal}
                    className="w-full py-4 rounded-2xl bg-[#2a6b45] hover:bg-[#235838] text-white font-bold transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
