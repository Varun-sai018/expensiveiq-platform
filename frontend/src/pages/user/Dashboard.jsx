import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Wallet, TrendingUp, PiggyBank, AlertCircle, ArrowUpRight, Activity } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <Activity className="h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">Loading your insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Oops!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-blue-400 dark:to-indigo-400">
              Overview
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Here's what's happening with your finances today.</p>
          </div>
          <button className="mt-4 inline-flex items-center space-x-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl md:mt-0">
            <span>Add Transaction</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="Total Expenses" 
            amount={`$${data.totalExpenses}`} 
            icon={<DollarSign className="h-6 w-6 text-white" />} 
            gradient="from-rose-500 to-pink-500" 
          />
          <MetricCard 
            title="Remaining Budget" 
            amount={`$${data.remainingBudget}`} 
            icon={<Wallet className="h-6 w-6 text-white" />} 
            gradient="from-emerald-500 to-teal-500" 
          />
          <MetricCard 
            title="Financial Score" 
            amount={data.financialScore} 
            icon={<TrendingUp className="h-6 w-6 text-white" />} 
            gradient="from-blue-500 to-indigo-500" 
          />
          <MetricCard 
            title="Savings Progress" 
            amount={`${data.savingsProgress}%`} 
            icon={<PiggyBank className="h-6 w-6 text-white" />} 
            gradient="from-amber-400 to-orange-500" 
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Chart Area */}
          <div className="col-span-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 lg:col-span-2">
            <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Monthly Spending Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    dx={-10} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#4F46E5" 
                    strokeWidth={4} 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 8, stroke: '#4F46E5', strokeWidth: 2, fill: '#fff' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
            <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Spending by Category</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions List */}
          <div className="col-span-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">View All</button>
            </div>
            {data.recentTransactions.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {data.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: `${tx.categoryColor}20` }}>
                         <div className="h-4 w-4 rounded-full" style={{ backgroundColor: tx.categoryColor }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{tx.description}</p>
                        <p className="text-sm text-gray-500">{tx.categoryName} • {tx.expenseDate}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">-${tx.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                  <Wallet className="h-8 w-8 text-gray-400" />
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">No recent transactions to show.</p>
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
            <div className="space-y-4">
              {data.insights.map((insight, index) => (
                <div key={index} className="rounded-xl bg-white/10 p-4 backdrop-blur-md transition-all hover:bg-white/20">
                  <h4 className="font-semibold text-white">{insight.title}</h4>
                  <p className="mt-2 text-sm text-indigo-100">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, amount, icon, gradient }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800 dark:ring-gray-700">
    <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`}></div>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight dark:text-white">{amount}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

export default Dashboard;
