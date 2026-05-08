import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import {
  DollarSign, Wallet, TrendingUp, PiggyBank,
  AlertCircle, ArrowUpRight, Activity, Plus,
  ChevronRight, BarChart2, Target
} from 'lucide-react';

// ── Quick-Add Expense Modal ──────────────────────────────────────────────────
const QuickAddModal = ({ categories, onClose, onSave }) => {
  const [form, setForm] = useState({ amount: '', description: '', date: new Date().toISOString().slice(0, 10), categoryId: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/expenses', {
        amount: parseFloat(form.amount),
        description: form.description,
        date: form.date,
        categoryId: form.categoryId || null,
        isRecurring: false,
      });
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Quick Add Expense</h3>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition text-xl leading-none">✕</button>
        </div>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input type="number" step="0.01" min="0.01" required
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" required
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input type="text"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What did you spend on?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">No Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 rounded-xl text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition">
              {saving ? 'Saving…' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const fetchDashboard = async () => {
    try {
      const [dashRes, catRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/categories'),
      ]);
      setData(dashRes.data);
      setCategories(catRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Dashboard fetch error', err);
      setError('Failed to load dashboard data. Make sure the backend is running.');
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="mt-4 text-lg font-medium text-gray-600">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl bg-white p-10 text-center shadow-lg max-w-md">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Could not load dashboard</h2>
          <p className="mt-2 text-gray-500 text-sm">{error}</p>
          <button onClick={fetchDashboard}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-white font-semibold hover:bg-indigo-700 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const METRIC_CARDS = [
    {
      title: 'Total Expenses',
      value: `$${(data.totalExpenses ?? 0).toFixed(2)}`,
      icon: <DollarSign className="h-6 w-6 text-white" />,
      gradient: 'from-rose-500 to-pink-500',
      onClick: () => navigate('/expenses'),
      hint: 'View all expenses →',
    },
    {
      title: 'Remaining Budget',
      value: `$${(data.remainingBudget ?? 0).toFixed(2)}`,
      icon: <Wallet className="h-6 w-6 text-white" />,
      gradient: 'from-emerald-500 to-teal-500',
      onClick: () => navigate('/budgets'),
      hint: 'Manage budgets →',
    },
    {
      title: 'Financial Score',
      value: data.financialScore ?? '—',
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      gradient: 'from-blue-500 to-indigo-500',
      onClick: () => navigate('/analytics'),
      hint: 'View analytics →',
    },
    {
      title: 'Savings Progress',
      value: `${data.savingsProgress ?? 0}%`,
      icon: <PiggyBank className="h-6 w-6 text-white" />,
      gradient: 'from-amber-400 to-orange-500',
      onClick: () => navigate('/budgets'),
      hint: 'View savings →',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
              Overview
            </h1>
            <p className="mt-2 text-gray-500">Here's what's happening with your finances today.</p>
          </div>
          <div className="mt-4 flex items-center space-x-3 md:mt-0">
            <button
              onClick={() => navigate('/analytics')}
              className="inline-flex items-center space-x-2 rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 transition">
              <BarChart2 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setShowQuickAdd(true)}
              className="inline-flex items-center space-x-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Metric Cards (all clickable) ────────────────────────────────── */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {METRIC_CARDS.map((card) => (
            <button key={card.title} onClick={card.onClick}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 text-left transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer w-full">
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">{card.value}</p>
                  <p className="mt-2 text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">{card.hint}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                  {card.icon}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ── Charts + Recent Transactions ────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Monthly Spending Trend */}
          <div className="col-span-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Monthly Spending Trend</h3>
              <button onClick={() => navigate('/analytics')}
                className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
                Full Analytics <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[300px] w-full">
              {data.monthlyTrend && data.monthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <Activity className="h-12 w-12 mb-3 text-gray-300" />
                  <p className="font-medium">No spending data yet</p>
                  <p className="text-sm mt-1">Add some expenses to see your trend.</p>
                  <button onClick={() => setShowQuickAdd(true)}
                    className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">
                    Add your first expense
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Spending by Category</h3>
              <button onClick={() => navigate('/expenses')}
                className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
                All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[250px] w-full">
              {data.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {data.categoryBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <Target className="h-10 w-10 mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No category data yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="col-span-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
              <button
                onClick={() => navigate('/expenses')}
                className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {data.recentTransactions && data.recentTransactions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.recentTransactions.map((tx) => (
                  <div key={tx.id}
                    onClick={() => navigate('/expenses')}
                    className="flex items-center justify-between py-4 rounded-xl px-2 cursor-pointer hover:bg-indigo-50 transition">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${tx.categoryColor || '#6366F1'}20` }}>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: tx.categoryColor || '#6366F1' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{tx.description || 'Expense'}</p>
                        <p className="text-xs text-gray-500">{tx.categoryName || 'Uncategorized'} • {tx.expenseDate}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">-${Number(tx.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-4">
                  <Wallet className="h-8 w-8 text-gray-400" />
                </div>
                <p className="mt-4 font-medium text-gray-500">No recent transactions</p>
                <p className="text-sm text-gray-400 mt-1">Start by adding your first expense.</p>
                <button onClick={() => setShowQuickAdd(true)}
                  className="mt-4 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">
                  Add Expense
                </button>
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-lg">
            <div className="mb-6 flex items-center space-x-3">
              <div className="rounded-full bg-white/20 p-2">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {data.insights && data.insights.length > 0 ? data.insights.map((insight, i) => (
                <div key={i} className="rounded-xl bg-white/10 p-4 backdrop-blur-md hover:bg-white/20 transition cursor-default">
                  <h4 className="font-semibold text-white text-sm">{insight.title}</h4>
                  <p className="mt-1 text-xs text-indigo-100 leading-relaxed">{insight.description}</p>
                </div>
              )) : (
                <div className="rounded-xl bg-white/10 p-4">
                  <h4 className="font-semibold text-sm">Getting started</h4>
                  <p className="mt-1 text-xs text-indigo-100 leading-relaxed">Add expenses and budgets to see personalized AI insights here.</p>
                </div>
              )}
            </div>
            <button onClick={() => navigate('/analytics')}
              className="mt-5 w-full rounded-xl bg-white/20 py-2 text-sm font-semibold text-white hover:bg-white/30 transition">
              View Full Analytics →
            </button>
          </div>

        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAddModal
          categories={categories}
          onClose={() => setShowQuickAdd(false)}
          onSave={fetchDashboard}
        />
      )}
    </div>
  );
};

export default Dashboard;
