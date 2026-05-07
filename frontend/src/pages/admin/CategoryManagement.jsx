import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [icon, setIcon] = useState('DefaultIcon');
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(/admin/categories/${editId}, { name, color, icon });
      else await api.post('/admin/categories', { name, color, icon });
      setName(''); setColor('#000000'); setIcon('DefaultIcon'); setEditId(null);
      fetchCategories();
    } catch (err) { alert('Error saving category'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try { await api.delete(/admin/categories/${id}); fetchCategories(); } catch (e) { alert('Error deleting'); }
  };

  const editCat = (c) => { setEditId(c.id); setName(c.name); setColor(c.color); setIcon(c.icon); };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4 items-end">
        <div><label className="block text-sm">Name</label><input required className="border p-2 rounded" value={name} onChange={e => setName(e.target.value)} /></div>
        <div><label className="block text-sm">Color</label><input type="color" className="h-10 w-10" value={color} onChange={e => setColor(e.target.value)} /></div>
        <div><label className="block text-sm">Icon Name</label><input className="border p-2 rounded" value={icon} onChange={e => setIcon(e.target.value)} /></div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">{editId ? 'Update' : 'Add'} Category</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setName(''); }} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>}
      </form>
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-50"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Color</th><th className="p-3 text-left">Icon</th><th className="p-3 text-right">Actions</th></tr></thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id} className="border-t">
              <td className="p-3"><span className="px-2 py-1 rounded text-white" style={{ backgroundColor: c.color }}>{c.name}</span></td>
              <td className="p-3">{c.color}</td>
              <td className="p-3">{c.icon}</td>
              <td className="p-3 text-right space-x-2">
                <button onClick={() => editCat(c)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CategoryManagement;
