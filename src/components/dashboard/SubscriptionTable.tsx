import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ChevronUp, ChevronDown, ArrowUpDown, Filter, MoreVertical,
  Trash2, Pause, Tag, Download, X, Plus, Edit, Monitor, Zap, CreditCard, Heart
} from 'lucide-react';

interface SubscriptionTableProps {
  subscriptions: any[];
  isDark: boolean;
  currencySymbols: Record<string, string>;
  onEdit: (sub: any) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  processingSubId: string | null;
}

type SortField = 'name' | 'amount' | 'nextBillingDate' | 'status' | 'category';
type SortDir = 'asc' | 'desc';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  trial: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  paused: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Entertainment': return <Monitor className="w-4 h-4" />;
    case 'Software': return <Zap className="w-4 h-4" />;
    case 'Utilities': return <CreditCard className="w-4 h-4" />;
    case 'Health': return <Heart className="w-4 h-4" />;
    default: return <Tag className="w-4 h-4" />;
  }
};

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: 'bg-rose-500/10 text-rose-400',
  Software: 'bg-purple-500/10 text-purple-400',
  Utilities: 'bg-amber-500/10 text-amber-400',
  Health: 'bg-emerald-500/10 text-emerald-400',
  Education: 'bg-blue-500/10 text-blue-400',
  Other: 'bg-gray-500/10 text-gray-400',
};

export default function SubscriptionTable({
  subscriptions, isDark, currencySymbols, onEdit, onDelete, onAddNew, processingSubId
}: SubscriptionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => [...new Set(subscriptions.map(s => s.category || 'Other'))], [subscriptions]);

  const filtered = useMemo(() => {
    let result = [...subscriptions];

    if (searchTerm) {
      result = result.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterCategory !== 'all') {
      result = result.filter(s => s.category === filterCategory);
    }
    if (filterStatus !== 'all') {
      result = result.filter(s => (s.status || 'active') === filterStatus);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'amount': cmp = (a.amount || 0) - (b.amount || 0); break;
        case 'nextBillingDate': {
          const aDate = a.nextBillingDate?.toDate?.() || new Date(a.nextBillingDate || 0);
          const bDate = b.nextBillingDate?.toDate?.() || new Date(b.nextBillingDate || 0);
          cmp = aDate.getTime() - bDate.getTime();
          break;
        }
        case 'status': cmp = (a.status || 'active').localeCompare(b.status || 'active'); break;
        case 'category': cmp = (a.category || '').localeCompare(b.category || ''); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [subscriptions, searchTerm, sortField, sortDir, filterCategory, filterStatus]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginated.map(s => s.id)));
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const getDaysUntil = (date: any) => {
    if (!date) return null;
    const d = date?.toDate ? date.toDate() : new Date(date);
    return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100'}`}>
      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1">
          <h3 className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>All Subscriptions</h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{filtered.length} total</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl flex-1 sm:flex-none sm:w-64 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <Search className="w-4 h-4 opacity-30" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={`bg-transparent text-sm outline-none flex-1 ${isDark ? 'text-white placeholder:text-white/30' : 'text-gray-900 placeholder:text-gray-400'}`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-cyan-500/10 text-cyan-400' : isDark ? 'hover:bg-white/5 text-white/40' : 'hover:bg-gray-50 text-gray-400'}`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`px-5 pb-4 flex flex-wrap gap-3 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              <select
                value={filterCategory}
                onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                className={`px-3 py-2 rounded-lg text-xs border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'} outline-none`}
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className={`px-3 py-2 rounded-lg text-xs border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'} outline-none`}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`px-5 py-3 flex items-center gap-3 border-b ${isDark ? 'border-white/5 bg-cyan-500/5' : 'border-gray-100 bg-cyan-50'}`}>
              <span className="text-xs font-medium text-cyan-400">{selectedIds.size} selected</span>
              <div className="flex items-center gap-2 ml-auto">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-white/5 transition-colors">
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-white/5 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                <button onClick={() => setSelectedIds(new Set())} className="p-1.5 rounded-lg text-gray-400 hover:bg-white/5">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              <th className="w-12 px-5 py-3">
                <input
                  type="checkbox"
                  checked={paginated.length > 0 && selectedIds.size === paginated.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded accent-cyan-500"
                />
              </th>
              {[
                { key: 'name', label: 'Service Name' },
                { key: 'category', label: 'Category' },
                { key: 'amount', label: 'Cost' },
                { key: 'billingCycle', label: 'Billing' },
                { key: 'nextBillingDate', label: 'Next Date' },
                { key: 'status', label: 'Status' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key as SortField)}
                  className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider cursor-pointer select-none ${isDark ? 'text-white/30' : 'text-gray-400'}`}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <SortIcon field={col.key as SortField} />
                  </span>
                </th>
              ))}
              <th className={`px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      {searchTerm ? <Search className="w-7 h-7 opacity-20" /> : <Plus className="w-7 h-7 opacity-20" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        {searchTerm ? `No results for "${searchTerm}"` : 'No subscriptions yet'}
                      </p>
                      {!searchTerm && (
                        <button onClick={onAddNew} className="text-xs text-cyan-400 hover:text-cyan-300 mt-2 transition-colors">
                          Add your first subscription →
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((sub, idx) => {
                const daysUntil = getDaysUntil(sub.nextBillingDate);
                const status = sub.status || 'active';
                const isProcessing = processingSubId === sub.id;

                return (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isProcessing ? 0.4 : 1 }}
                    className={`group border-b transition-colors ${isDark ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-gray-50 hover:bg-gray-50/50'}`}
                  >
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(sub.id)}
                        onChange={() => toggleSelect(sub.id)}
                        className="w-4 h-4 rounded accent-cyan-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-white/5 text-white/40' : 'bg-gray-50 text-gray-400'}`}>
                          {getCategoryIcon(sub.category)}
                        </div>
                        <span className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{sub.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[sub.category] || CATEGORY_COLORS.Other}`}>
                        {sub.category || 'Other'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                        {currencySymbols[sub.currency || 'USD'] || '$'}{sub.amount?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        {sub.billingCycle === 'yearly' ? 'Annual' : sub.billingCycle === 'monthly' ? 'Monthly' : sub.billingCycle || 'Monthly'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs ${daysUntil !== null && daysUntil <= 3 ? 'text-red-400 font-bold' : isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        {sub.nextBillingDate ? (sub.nextBillingDate?.toDate ? sub.nextBillingDate.toDate() : new Date(sub.nextBillingDate)).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[status] || STATUS_COLORS.active}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(sub)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5 text-white/40' : 'hover:bg-gray-100 text-gray-400'}`}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(sub.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > rowsPerPage && (
        <div className={`px-5 py-3 flex items-center justify-between border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Rows:</span>
            <select
              value={rowsPerPage}
              onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className={`text-xs px-2 py-1 rounded border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'} outline-none`}
            >
              {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-20 ${isDark ? 'hover:bg-white/5 text-white/60' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-20 ${isDark ? 'hover:bg-white/5 text-white/60' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
