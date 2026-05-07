import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id: null, amount: '', description: '', date: '', categoryId: '', isRecurring: false, recurrenceInterval: 'NONE' });

  const fetchExpenses = async () => {
    const res = await api.get('/expenses', { params: { search, categoryId: categoryFilter || null } });
    setExpenses(res.data.content || []);
  };

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  useEffect(() => { fetchExpenses(); }, [search, categoryFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, categoryId: form.categoryId || null };
      if (form.id) await api.put(/expenses/${form.id}, payload);
      else await api.post('/expenses', payload);
      setShowModal(false);
      setForm({ id: null, amount: '', description: '', date: '', categoryId: '', isRecurring: false, recurrenceInterval: 'NONE' });
      fetchExpenses();
    } catch (err) { alert('Error saving expense'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete expense?')) return;
    try { await api.delete(/expenses/${id}); fetchExpenses(); } catch (e) { alert('Error deleting'); }
  };

  const editExp = (exp) => {
    setForm({ id: exp.id, amount: exp.amount, description: exp.description, date: exp.date, categoryId: exp.category ? exp.category.id : '', isRecurring: exp.isRecurring, recurrenceInterval: exp.recurrenceInterval || 'NONE' });
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Expenses</h1>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded shadow">Add Expense</button>
      </div>
      <div className="flex gap-4 mb-6">
        <input placeholder="Search description..." className="border p-2 rounded flex-1" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="border p-2 rounded w-48" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-50"><tr><th className="p-3 text-left">Date</th><th className="p-3 text-left">Description</th><th className="p-3 text-left">Category</th><th className="p-3 text-right">Amount</th><th className="p-3 text-right">Actions</th></tr></thead>
        <tbody>
          {expenses.map(e => (
            <tr key={e.id} className="border-t">
              <td className="p-3">{e.date}</td>
              <td className="p-3">{e.description} {e.isRecurring && <span title="Recurring">??</span>}</td>
              <td className="p-3">{e.category && <span className="px-2 py-1 rounded text-white text-xs" style={{backgroundColor: e.category.color}}>{e.category.name}</span>}</td>
              <td className="p-3 text-right font-semibold"></td>
              <td className="p-3 text-right space-x-2">
                <button onClick={() => editExp(e)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(e.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{form.id ? 'Edit' : 'Add'} Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm">Amount</label><input type="number" step="0.01" required className="w-full border p-2 rounded" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
              <div><label className="block text-sm">Description</label><input required className="w-full border p-2 rounded" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div><label className="block text-sm">Date</label><input type="date" required className="w-full border p-2 rounded" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              <div><label className="block text-sm">Category</label><select className="w-full border p-2 rounded" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}><option value="">Select...</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={form.isRecurring} onChange={e => setForm({...form, isRecurring: e.target.checked})} /> Recurring?</div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ExpenseList;
