import React, { useState } from 'react';
import api from '../../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { name, email, password });
      alert('Signup successful! Please check your email.');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="text" required className="w-full px-3 py-2 border rounded" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <input type="email" required className="w-full px-3 py-2 border rounded" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" required className="w-full px-3 py-2 border rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Sign up</button>
        </form>
      </div>
    </div>
  );
};
export default Signup;
