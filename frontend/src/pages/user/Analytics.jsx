import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Activity, DollarSign, Target, BarChart3 } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/analytics?month=${month}`);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [month]);

  if (loading && !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Activity className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Sticky Header with Month Selector */}
        <div className="sticky top-0 z-10 mb-8 flex flex-col items-center justify-between rounded-2xl bg-white/80 px-6 py-4 backdrop-blur-lg shadow-sm dark:bg-gray-800/80 md:flex-row">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
              <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          </div>
          <div className="mt-4 flex items-center space-x-3 md:mt-0">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>

        {data && (
          <>
            {/* Top Summary Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard 
                title="Total Spent" 
                value={`$${data.totalSpent}`} 
                icon={<DollarSign className="h-6 w-6 text-white" />} 
                color="bg-indigo-600" 
              />
              <SummaryCard 
                title="Avg Daily Spend" 
                value={`$${data.averageDailySpend}`} 
                icon={<Activity className="h-6 w-6 text-white" />} 
                color="bg-pink-500" 
              />
              <SummaryCard 
                title="Projected Spend" 
                value={`$${data.projectedSpend}`} 
                icon={<Target className="h-6 w-6 text-white" />} 
                color="bg-teal-500" 
              />
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">MoM Change</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.monthOverMonthChange}%</p>
                  <div className={`flex items-center space-x-1 rounded-full px-2 py-1 text-sm font-semibold ${data.monthOverMonthChange > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {data.monthOverMonthChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              
              {/* Daily Spending Line Chart */}
              <div className="col-span-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 lg:col-span-2">
                <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Daily Spending</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.dailySpending}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="amount" stroke="#EC4899" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
                <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Distribution</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.categoryDistribution}
                        cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                      >
                        {data.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-3">
                  {data.categoryDistribution.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">${cat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Progress Bars */}
              <div className="col-span-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 lg:col-span-3">
                <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Budget Utilization</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {data.budgetProgress.map((budget, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-100 p-4 dark:border-gray-700">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">{budget.categoryName}</span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{budget.percentage}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${Math.min(budget.percentage, 100)}%`, 
                            backgroundColor: budget.color 
                          }}
                        ></div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Spent: ${budget.spent}</span>
                        <span className="text-gray-500 dark:text-gray-400">Limit: ${budget.limit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color }) => (
  <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} shadow-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

export default Analytics;
