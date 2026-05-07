import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import ExpenseList from './pages/user/ExpenseList';
import CategoryManagement from './pages/admin/CategoryManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/expenses" element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
          <Route path="/dashboard" element={<Navigate to="/expenses" />} />
          <Route path="/admin/categories" element={<ProtectedRoute roleRequired="ADMIN"><CategoryManagement /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<Navigate to="/admin/categories" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
