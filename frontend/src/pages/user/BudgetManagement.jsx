import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Calendar, Plus, Wallet, AlertTriangle, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [formData, setFormData] = useState({ amount: '', categoryId: '' });

  useEffect(() => {
    fetchBudgets();
  }, [month]);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/budgets/utilization?month=${month}`);
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets', error);
    } finally {
      setLoading(false);
    }
  };

  const hasExceededBudgets = budgets.some(b => b.utilizationPercentage >= 80);

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setCurrentBudget(budget);
      setFormData({ amount: budget.limit, categoryId: budget.categoryId || '' });
    } else {
      setCurrentBudget(null);
      setFormData({ amount: '', categoryId: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        month,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      };

      if (currentBudget) {
        await api.put(`/budgets/${currentBudget.budgetId}`, payload);
      } else {
        await api.post('/budgets', payload);
      }
      setIsModalOpen(false);
      fetchBudgets();
    } catch (error) {
      console.error('Error saving budget', error);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (error) {
        console.error('Error deleting budget', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 md:p-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Header & Month Selector */}
        <div className="mb-8 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your spending limits.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-transparent font-medium text-gray-700 focus:outline-none dark:text-white"
              />
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              <span>New Budget</span>
            </button>
          </div>
        </div>

        {/* Global Alert Banner */}
        {hasExceededBudgets && (
          <div className="mb-8 flex items-center space-x-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            <AlertTriangle className="h-6 w-6 flex-shrink-0" />
            <p className="font-medium">Warning: You have budgets that are nearing or have exceeded their limits for this month.</p>
          </div>
        )}

        {/* Budget Cards */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          </div>
        ) : budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 dark:border-gray-700 dark:bg-gray-800">
            <Wallet className="h-16 w-16 text-gray-300 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No budgets found</h3>
            <p className="mt-1 text-gray-500">Create a budget to start tracking your spending.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => {
              const pct = budget.utilizationPercentage;
              let barColor = 'bg-emerald-500';
              let bgColor = 'bg-emerald-100 dark:bg-emerald-900/30';
              if (pct >= 80) {
                barColor = 'bg-red-500';
                bgColor = 'bg-red-100 dark:bg-red-900/30';
              } else if (pct >= 60) {
                barColor = 'bg-yellow-500';
                bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
              }

              return (
                <div key={budget.budgetId} className="group relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md dark:bg-gray-800 dark:ring-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{budget.categoryName}</h3>
                    <div className="flex items-center space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => handleOpenModal(budget)} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteBudget(budget.budgetId)} className="rounded-full p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">${budget.spent}</p>
                      <p className="mt-1 text-sm font-medium text-gray-500">of ${budget.limit}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold ${pct >= 100 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className={`mt-4 h-3 w-full overflow-hidden rounded-full ${bgColor}`}>
                    <div 
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  
                  {budget.exceeded && (
                    <div className="mt-3 flex items-center space-x-1 text-xs font-medium text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      <span>Budget exceeded!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentBudget ? 'Edit Budget' : 'New Budget'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveBudget} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount Limit ($)</label>
                <input 
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category (Optional)</label>
                <select 
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">Overall (All Categories)</option>
                  {/* Options would be dynamically populated in a real app */}
                  <option value="1">Food</option>
                  <option value="2">Entertainment</option>
                  <option value="3">Housing</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">Leave blank to set an overall budget limit for the month.</p>
              </div>
              <button 
                type="submit"
                className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-center font-bold text-white transition-colors hover:bg-emerald-700"
              >
                {currentBudget ? 'Update Budget' : 'Save Budget'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetManagement;
