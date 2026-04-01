import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, Mail, Shield, Eye, Edit, Trash2, UserPlus, Send, X, Check,
  BarChart3, Download, Clock
} from 'lucide-react';

interface TeamPageProps {
  isDark: boolean;
  user: any;
  userProfile: any;
}

const MOCK_MEMBERS = [
  { id: '1', name: 'Abdullah P.', email: 'abdullah@example.com', role: 'admin', avatar: null, joined: '2024-01-15' },
  { id: '2', name: 'Sarah K.', email: 'sarah@example.com', role: 'editor', avatar: null, joined: '2024-03-22' },
  { id: '3', name: 'Ali R.', email: 'ali@example.com', role: 'viewer', avatar: null, joined: '2024-06-10' },
];

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  editor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  viewer: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function TeamPage({ isDark, user, userProfile }: TeamPageProps) {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [approvalEnabled, setApprovalEnabled] = useState(false);

  const cardClass = `p-6 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100'}`;

  // Mock spending data per member
  const memberSpends = [
    { name: 'Abdullah P.', spend: 245.50 },
    { name: 'Sarah K.', spend: 132.20 },
    { name: 'Ali R.', spend: 67.80 },
  ];
  const maxSpend = Math.max(...memberSpends.map(m => m.spend));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Team Workspace</h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{members.length} members</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowInvite(!showInvite)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 transition-colors">
            <UserPlus className="w-4 h-4" /> Invite Member
          </button>
        </div>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'}`}>
          <div className="flex items-center gap-3">
            <input type="email" placeholder="colleague@company.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm border-transparent outline-none ${isDark ? 'bg-white/5 text-white placeholder:text-white/30' : 'bg-white text-gray-900'}`} />
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold">
              <Send className="w-4 h-4" /> Send Invite
            </button>
            <button onClick={() => setShowInvite(false)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/5 text-white/30' : 'hover:bg-gray-100 text-gray-400'}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members List */}
        <div className={`${cardClass} lg:col-span-2`}>
          <h3 className={`text-sm font-bold mb-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Members</h3>
          <div className="space-y-2">
            {members.map((member, idx) => (
              <motion.div key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {member.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{member.name}</p>
                  <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{member.email}</p>
                </div>
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${ROLE_COLORS[member.role]}`}>
                  {member.role}
                </span>
                <p className={`text-xs hidden sm:block ${isDark ? 'text-white/20' : 'text-gray-300'}`}>
                  {new Date(member.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
                <div className="flex items-center gap-1">
                  <select defaultValue={member.role} className={`text-[10px] px-2 py-1 rounded-lg border-transparent outline-none ${isDark ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-700'}`}>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  {member.role !== 'admin' && (
                    <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/40 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Team Analytics */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Team Spend</h3>
              <button className="text-[10px] font-bold text-cyan-400 flex items-center gap-1"><Download className="w-3 h-3" /> Export</button>
            </div>
            <div className="space-y-3">
              {memberSpends.map((m, i) => (
                <div key={m.name}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{m.name}</span>
                    <span className={`text-xs font-bold ${isDark ? 'text-white/70' : 'text-gray-600'}`}>${m.spend.toFixed(2)}</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(m.spend / maxSpend) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Workflow */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Approval Workflow</h3>
              <div className="relative">
                <input type="checkbox" checked={approvalEnabled} onChange={e => setApprovalEnabled(e.target.checked)} className="sr-only peer" id="approval-toggle" />
                <label htmlFor="approval-toggle" className={`block w-10 h-5 rounded-full cursor-pointer transition-colors ${approvalEnabled ? 'bg-cyan-500' : 'bg-gray-600'}`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${approvalEnabled ? 'translate-x-5' : ''}`} />
              </div>
            </div>
            <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              {approvalEnabled ? 'New subscriptions by Editors require admin approval.' : 'Editors can add subscriptions directly.'}
            </p>
            {approvalEnabled && (
              <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
                  <span className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>No pending approvals</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
