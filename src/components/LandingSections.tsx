import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { SiNetflix, SiSpotify, SiYoutube, SiApple, SiGithub, SiSlack, SiNotion } from 'react-icons/si';
import { FaAmazon } from 'react-icons/fa';
import {
  CreditCard, ChartLineUp, Bell, ShieldCheck,
  Lightning, Eye, ArrowRight, Star, Check
} from '@phosphor-icons/react';

// ─── Animated Section Wrapper ───────────────────────────────
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Bento Feature Card ─────────────────────────────────────
function BentoCard({ icon: Icon, title, description, className = "", delay = 0, children }: { icon: any; title: string; description: string; className?: string; delay?: number; children?: React.ReactNode }) {
  return (
    <AnimatedSection delay={delay} className={className}>
      <div className="h-full rounded-3xl p-8 relative overflow-hidden group bg-[#1B4332]/30 border border-[#D8F3DC]/10 backdrop-blur-md transition-all duration-500 hover:bg-[#1B4332]/50 hover:border-[#D8F3DC]/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(8,28,21,0.6)]">
        {/* Ambient glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] bg-[#D8F3DC]/5" />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC]/10 flex items-center justify-center mb-5 group-hover:bg-[#D8F3DC]/15 transition-colors duration-300">
            <Icon size={24} weight="duotone" className="text-[#D8F3DC]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">{title}</h3>
          <p className="text-sm text-[#95D5B2] leading-relaxed">{description}</p>
          {children}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Brand Marquee ──────────────────────────────────────────
export function BrandMarquee() {
  const brands = [
    { icon: SiNetflix, name: "Netflix", color: "#E50914" },
    { icon: SiSpotify, name: "Spotify", color: "#1DB954" },
    { icon: FaAmazon, name: "Amazon", color: "#FF9900" },
    { icon: SiYoutube, name: "YouTube", color: "#FF0000" },
    { icon: SiApple, name: "Apple", color: "#A2AAAD" },
    { icon: SiGithub, name: "GitHub", color: "#FFFFFF" },
    { icon: SiSlack, name: "Slack", color: "#4A154B" },
    { icon: SiNotion, name: "Notion", color: "#FFFFFF" },
  ];

  return (
    <section className="border-y border-[#D8F3DC]/5 bg-[#081C15]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-[#74A787] font-bold pt-6">Track subscriptions from 100+ services</p>
        <div className="relative overflow-hidden py-8">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#081C15] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#081C15] to-transparent z-10" />
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 items-center"
          >
            {[...brands, ...brands, ...brands].map((b, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300">
                <b.icon size={24} style={{ color: b.color }} />
                <span className="text-sm font-medium text-[#95D5B2] whitespace-nowrap">{b.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Features Bento Grid ────────────────────────────────────
export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] rounded-full blur-[150px] bg-[#52B788]/5 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-[#D8F3DC] mb-4">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Everything you need to<br />
            <span className="bg-gradient-to-r from-[#F8FFF9] to-[#52B788] text-transparent bg-clip-text">take control</span>
          </h2>
          <p className="text-[#95D5B2] max-w-lg mx-auto">One dashboard to rule all your recurring charges. No more surprise bills.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          <BentoCard
            icon={ChartLineUp}
            title="Spending Analytics"
            description="Beautiful charts showing your monthly and yearly spending trends. Know exactly where your money goes with category breakdowns."
            className="md:col-span-7"
            delay={0.1}
          >
            <div className="mt-6 h-28 relative rounded-xl overflow-hidden bg-[#081C15]/40 border border-[#D8F3DC]/5">
              <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="bentoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#52B788" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#52B788" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d="M0,70 C40,65 80,30 140,45 C200,60 240,20 300,35 C360,50 380,25 400,30 L400,100 L0,100 Z" fill="url(#bentoGrad)" />
                <path d="M0,70 C40,65 80,30 140,45 C200,60 240,20 300,35 C360,50 380,25 400,30" fill="none" stroke="#D8F3DC" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div className="absolute bottom-2 right-3 bg-[#1B4332]/80 px-2 py-1 rounded-md">
                <span className="text-[10px] font-mono text-[#D8F3DC]">-12% vs last month</span>
              </div>
            </div>
          </BentoCard>

          <BentoCard
            icon={Bell}
            title="Smart Alerts"
            description="Get notified before any renewal. Never be surprised by unexpected charges again."
            className="md:col-span-5"
            delay={0.2}
          >
            <div className="mt-5 space-y-2">
              {[{ name: "Netflix", days: "1 day", urgent: true }, { name: "Spotify", days: "5 days", urgent: false }].map((a) => (
                <div key={a.name} className={`flex items-center justify-between p-2.5 rounded-lg border ${a.urgent ? "border-[#FCA311]/20 bg-[#FCA311]/5" : "border-[#D8F3DC]/5 bg-[#081C15]/30"}`}>
                  <span className="text-xs text-white font-medium">{a.name}</span>
                  <span className={`text-[10px] font-mono ${a.urgent ? "text-[#FCA311]" : "text-[#74A787]"}`}>{a.days}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard
            icon={Eye}
            title="Category Insights"
            description="See spending by category at a glance — Entertainment, Productivity, Cloud, and more."
            className="md:col-span-5"
            delay={0.3}
          >
            <div className="mt-5 flex gap-2 flex-wrap">
              {["Entertainment", "Music", "Cloud", "Dev"].map((c) => (
                <span key={c} className="text-[10px] px-3 py-1.5 rounded-full border border-[#D8F3DC]/10 text-[#95D5B2] bg-[#081C15]/30">{c}</span>
              ))}
            </div>
          </BentoCard>

          <BentoCard
            icon={ShieldCheck}
            title="Secure & Private"
            description="Your data is encrypted and never shared. We use bank-level security to protect your information."
            className="md:col-span-7"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ───────────────────────────────────────────
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative">
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] bg-[#D8F3DC]/4 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-[#D8F3DC] mb-4">How it works</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Three steps to <span className="bg-gradient-to-r from-[#F8FFF9] to-[#52B788] text-transparent bg-clip-text">clarity</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: "01", title: "Connect", desc: "Sign in with Google and start adding your subscriptions in seconds." },
            { num: "02", title: "Track", desc: "See all your recurring charges, analytics, and category breakdowns at a glance." },
            { num: "03", title: "Save", desc: "Get alerts before renewals. Cancel what you don't need. Keep more money." },
          ].map((step, i) => (
            <AnimatedSection key={step.num} delay={i * 0.15}>
              <div className="relative group">
                <div className="text-6xl font-black text-[#1B4332]/60 font-mono mb-4 group-hover:text-[#2D6A4F] transition-colors duration-500">{step.num}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#95D5B2] leading-relaxed">{step.desc}</p>
                {i < 2 && <div className="hidden md:block absolute top-8 -right-4 w-8 text-[#2D6A4F]"><ArrowRight size={24} /></div>}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Section ──────────────────────────────────────────
export function StatsSection() {
  return (
    <section className="py-16 border-y border-[#D8F3DC]/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { val: "2,400+", label: "Active Users" },
            { val: "$340K", label: "Tracked Monthly" },
            { val: "12,000+", label: "Subscriptions" },
            { val: "99.9%", label: "Uptime" },
          ].map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1} className="text-center">
              <p className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">{stat.val}</p>
              <p className="text-xs text-[#74A787] uppercase tracking-widest mt-1">{stat.label}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ────────────────────────────────────────────
export function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[180px] bg-[#52B788]/8 pointer-events-none" />
      <div className="max-w-3xl mx-auto px-6 md:px-8 text-center relative z-10">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 bg-[#1B4332]/60 border border-[#D8F3DC]/10 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-bold text-[#52B788]">FREE FOREVER</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
            Ready to take control?
          </h2>
          <p className="text-base md:text-lg text-[#95D5B2] mb-10 max-w-lg mx-auto">
            Join thousands of users who have already saved money by tracking their subscriptions with Subledge.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-[#D8F3DC] text-[#081C15] font-bold px-10 py-5 rounded-full hover:bg-white transition-all shadow-[0_0_30px_rgba(216,243,220,0.3)] hover:shadow-[0_0_60px_rgba(216,243,220,0.5)] text-lg group inline-flex items-center gap-3"
          >
            Get Started — It's Free
            <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-[#74A787] mt-4">No credit card required.</p>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────
export function LandingFooter() {
  return (
    <footer className="border-t border-[#D8F3DC]/5 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D8F3DC] flex items-center justify-center">
            <CreditCard size={16} weight="duotone" className="text-[#081C15]" />
          </div>
          <span className="font-bold text-white tracking-tight">Subledge</span>
        </div>
        <p className="text-xs text-[#74A787]">&copy; {new Date().getFullYear()} Subledge. All rights reserved.</p>
      </div>
    </footer>
  );
}
