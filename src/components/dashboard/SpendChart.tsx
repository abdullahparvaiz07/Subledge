import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface SpendChartProps {
  subscriptions: any[];
  isDark: boolean;
  convertToUSD: (amount: number, currency: string) => number;
}

export default function SpendChart({ subscriptions, isDark, convertToUSD }: SpendChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const months: { label: string; value: number; isCurrent: boolean }[] = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = month.toLocaleString('default', { month: 'short' });
      
      const total = subscriptions.reduce((acc, sub) => {
        const usd = convertToUSD(sub.amount, sub.currency || 'USD');
        const monthlyCost = sub.billingCycle === 'yearly' || sub.billingCycle === 'annual' ? usd / 12 : usd;
        
        const subCreated = sub.createdAt?.toDate ? sub.createdAt.toDate() : new Date(sub.createdAt || 0);
        if (subCreated <= new Date(month.getFullYear(), month.getMonth() + 1, 0)) {
          return acc + monthlyCost;
        }
        return acc;
      }, 0);

      months.push({ label: monthLabel, value: total, isCurrent: i === 0 });
    }
    return months;
  }, [subscriptions, convertToUSD]);

  const maxValue = Math.max(...monthlyData.map(d => d.value), 1);
  const chartHeight = 200;
  const barWidth = 40;
  const gap = 24;
  const chartWidth = monthlyData.length * (barWidth + gap);

  return (
    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Monthly Spend</h3>
          <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Last 6 months</p>
        </div>
        <div className={`flex rounded-lg border p-0.5 ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
          {(['bar', 'line'] as const).map(type => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                chartType === type
                  ? isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-900 shadow-sm'
                  : isDark ? 'text-white/30' : 'text-gray-400'
              }`}
            >
              {type === 'bar' ? <BarChart3 className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <div className="relative" style={{ height: chartHeight + 40 }}>
        <svg width="100%" height={chartHeight + 40} viewBox={`0 0 ${chartWidth + 20} ${chartHeight + 40}`} preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
            <line
              key={i}
              x1="0" y1={chartHeight - frac * chartHeight}
              x2={chartWidth + 20} y2={chartHeight - frac * chartHeight}
              stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
              strokeDasharray="4 4"
            />
          ))}

          {chartType === 'bar' ? (
            monthlyData.map((d, i) => {
              const barHeight = (d.value / maxValue) * chartHeight;
              const x = i * (barWidth + gap) + gap / 2;
              const y = chartHeight - barHeight;
              const isHovered = hoveredBar === i;

              return (
                <g key={i} onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                  <motion.rect
                    x={x} width={barWidth}
                    initial={{ y: chartHeight, height: 0 }}
                    animate={{ y, height: barHeight }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    rx="6"
                    fill={d.isCurrent ? '#22d3ee' : isHovered ? (isDark ? 'rgba(34,211,238,0.5)' : 'rgba(34,211,238,0.7)') : (isDark ? 'rgba(34,211,238,0.2)' : 'rgba(34,211,238,0.4)')}
                    className="cursor-pointer transition-colors"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    fill={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                    fontSize="10"
                    fontWeight="600"
                  >
                    {d.label}
                  </text>
                  {isHovered && (
                    <>
                      <rect
                        x={x + barWidth / 2 - 35} y={y - 30}
                        width="70" height="24" rx="8"
                        fill={isDark ? '#1a2332' : '#fff'}
                        stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                        strokeWidth="1"
                      />
                      <text
                        x={x + barWidth / 2}
                        y={y - 14}
                        textAnchor="middle"
                        fill={isDark ? '#22d3ee' : '#0891b2'}
                        fontSize="10"
                        fontWeight="700"
                      >
                        ${d.value.toFixed(0)}
                      </text>
                    </>
                  )}
                </g>
              );
            })
          ) : (
            <>
              <motion.polyline
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                points={monthlyData.map((d, i) => {
                  const x = i * (barWidth + gap) + gap / 2 + barWidth / 2;
                  const y = chartHeight - (d.value / maxValue) * chartHeight;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {monthlyData.map((d, i) => {
                const cx = i * (barWidth + gap) + gap / 2 + barWidth / 2;
                const cy = chartHeight - (d.value / maxValue) * chartHeight;
                return (
                  <g key={i} onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                    <motion.circle
                      cx={cx} cy={cy} r={hoveredBar === i ? 6 : 4}
                      fill={d.isCurrent ? '#22d3ee' : isDark ? '#1a2332' : '#fff'}
                      stroke="#22d3ee"
                      strokeWidth="2"
                      className="cursor-pointer"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.5 }}
                    />
                    <text
                      x={cx}
                      y={chartHeight + 20}
                      textAnchor="middle"
                      fill={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                      fontSize="10"
                      fontWeight="600"
                    >
                      {d.label}
                    </text>
                    {hoveredBar === i && (
                      <>
                        <rect x={cx - 35} y={cy - 30} width="70" height="24" rx="8" fill={isDark ? '#1a2332' : '#fff'} stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="1" />
                        <text x={cx} y={cy - 14} textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="700">${d.value.toFixed(0)}</text>
                      </>
                    )}
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
