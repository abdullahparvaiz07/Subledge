import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';

interface CategoryDonutProps {
  subscriptions: any[];
  isDark: boolean;
  convertToUSD: (amount: number, currency: string) => number;
  onCategoryClick?: (category: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: '#f43f5e',
  Software: '#8b5cf6',
  Utilities: '#f59e0b',
  Health: '#10b981',
  Education: '#3b82f6',
  Business: '#06b6d4',
  Other: '#6b7280',
};

export default function CategoryDonut({ subscriptions, isDark, convertToUSD, onCategoryClick }: CategoryDonutProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const data = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    subscriptions.forEach(sub => {
      const cat = sub.category || 'Other';
      const usd = convertToUSD(sub.amount, sub.currency || 'USD');
      const monthly = sub.billingCycle === 'yearly' || sub.billingCycle === 'annual' ? usd / 12 : usd;
      categoryMap[cat] = (categoryMap[cat] || 0) + monthly;
    });
    const total = Object.values(categoryMap).reduce((a, b) => a + b, 0);
    return Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
      }));
  }, [subscriptions, convertToUSD]);

  const total = data.reduce((a, d) => a + d.value, 0);

  // SVG donut math
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 75;
  const strokeWidth = 28;

  const segments = useMemo(() => {
    let cumulative = 0;
    return data.map(d => {
      const startAngle = cumulative;
      const sweep = (d.value / total) * 360;
      cumulative += sweep;
      return { ...d, startAngle, sweep };
    });
  }, [data, total]);

  const describeArc = (startAngle: number, sweep: number) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((startAngle + sweep - 90) * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const largeArc = sweep > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  if (data.length === 0) {
    return (
      <div className={`p-6 rounded-2xl border flex items-center justify-center h-full ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100'}`}>
        <div className="text-center py-12">
          <p className={`text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>No categories to display</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-white/20' : 'text-gray-300'}`}>Add subscriptions to see the breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100'}`}>
      <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Category Split</h3>
      <p className={`text-xs mb-6 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Monthly spend by category</p>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background circle */}
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} strokeWidth={strokeWidth} />
            
            {segments.map((seg, i) => (
              <motion.path
                key={seg.name}
                d={describeArc(seg.startAngle, Math.max(seg.sweep - 2, 0.5))}
                fill="none"
                stroke={seg.color}
                strokeWidth={hoveredSegment === seg.name ? strokeWidth + 4 : strokeWidth}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-200"
                style={{ filter: hoveredSegment === seg.name ? `drop-shadow(0 0 8px ${seg.color}60)` : undefined }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHoveredSegment(seg.name)}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={() => onCategoryClick?.(seg.name)}
              />
            ))}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ${total.toFixed(0)}
            </span>
            <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-gray-400'}`}>/month</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5 min-w-0">
          {data.slice(0, 5).map(d => (
            <button
              key={d.name}
              onClick={() => onCategoryClick?.(d.name)}
              onMouseEnter={() => setHoveredSegment(d.name)}
              onMouseLeave={() => setHoveredSegment(null)}
              className={`w-full flex items-center gap-3 py-1.5 px-2 rounded-lg transition-colors text-left ${
                hoveredSegment === d.name ? (isDark ? 'bg-white/5' : 'bg-gray-50') : ''
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className={`text-xs flex-1 truncate ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{d.name}</span>
              <span className={`text-xs font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>${d.value.toFixed(0)}</span>
              <span className={`text-[10px] ${isDark ? 'text-white/20' : 'text-gray-300'}`}>{d.percentage.toFixed(0)}%</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
