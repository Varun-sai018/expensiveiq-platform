import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import VerifyEmail from './pages/public/VerifyEmail';
import ForgotPassword from './pages/public/ForgotPassword';

import Dashboard from './pages/user/Dashboard';
import ExpenseList from './pages/user/ExpenseList';
import Analytics from './pages/user/Analytics';
import BudgetManagement from './pages/user/BudgetManagement';

import CategoryManagement from './pages/admin/CategoryManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected user routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><BudgetManagement /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/categories" element={<ProtectedRoute roleRequired="ADMIN"><CategoryManagement /></ProtectedRoute>} />

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
