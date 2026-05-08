import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); return; }
    api.post(`/auth/verify-email?token=${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          {status === 'verifying' && (
            <>
              <div className="animate-spin inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4" />
              <h2 className="text-xl font-bold text-gray-900">Verifying your email…</h2>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email verified!</h2>
              <p className="text-gray-500 mb-6">Your account is now active. You can sign in.</p>
              <Link to="/login" className="block w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition">
                Go to Login
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-xl mb-4">
                <span className="text-red-600 text-2xl">✕</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification failed</h2>
              <p className="text-gray-500 mb-6">The link is invalid or has already been used.</p>
              <Link to="/login" className="text-indigo-600 hover:underline">Back to Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
