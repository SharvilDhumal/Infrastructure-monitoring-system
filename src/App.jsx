import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './features/auth/forms/LoginForm';
import Signup from './features/auth/forms/SignupForm';
import ResetPassword from './features/auth/forms/ResetPasswordForm';
import ProtectedRoute from './components/ProtectedRoute';
import EmailVerified from './features/auth/EmailVerified';
import AuthSuccess from './features/auth/AuthSuccess';
import AccountExists from './features/auth/AccountExists';
import VerifyEmail from './features/auth/VerifyEmail';
import LandingPage from './pages/LandingPage';
import AuthLayout from './features/auth/layout/AuthLayout';
import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    // Save token if present, BUT only if it's an auth token (not reset token)
    if (token && location.pathname !== '/reset-password') {
      localStorage.setItem('token', token);
    }

    // Get stored token (just saved or existing)
    const storedToken = localStorage.getItem('token');

    // If we have a token from URL...
    if (token && location.pathname !== '/reset-password') {
      if (location.pathname === '/auth-success') {
        // If explicitly sent to success page, clean URL but STAY there.
        // Pass the 'type' (login/signup) via state so the component can render correct text
        const type = params.get('type');
        navigate('/auth-success', { replace: true, state: { type } });
      } else {
        // Otherwise, normal redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route path="/email-verified" element={<EmailVerified />} />

      <Route path="/verify/:id/:token" element={<VerifyEmail />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/account-exists" element={<AccountExists />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Catch all - redirect to login for now */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
