import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  User, Lock, LogIn, ArrowRight, BookOpen, 
  Eye, EyeOff, AlertCircle, Mail, CheckCircle 
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Pre-populate identifier if we stored it in cookies/local storage for convenience
  useEffect(() => {
    const savedId = localStorage.getItem('remembered_identifier');
    if (savedId) {
      setIdentifier(savedId);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const tempErrors = {};
    if (!identifier.trim()) tempErrors.identifier = 'Email or Username is required';
    if (!password) tempErrors.password = 'Password is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      login(identifier.trim(), password, rememberMe);
      showToast('Logged in successfully!', 'success');
      
      // Handle Remember Me storage
      if (rememberMe) {
        localStorage.setItem('remembered_identifier', identifier.trim());
      } else {
        localStorage.removeItem('remembered_identifier');
      }

      navigate('/dashboard');
    } catch (err) {
      showToast(err.message, 'error');
      setErrors({ form: err.message });
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showToast('Email address is required', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    showToast(`Password reset link has been dispatched to ${forgotEmail}`, 'success');
    setForgotEmail('');
    setIsForgotOpen(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-slate-50 dark:bg-slate-950/80 transition-colors">
      {/* Background Orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2.s' }} />

      {/* Main card container */}
      <div className="relative w-full max-w-md glass-panel border rounded-3xl shadow-2xl p-8 md:p-10 animate-slide-up">
        {/* Header Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-bold mb-4 shadow-lg shadow-brand-500/10">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-slate-800 dark:text-slate-100">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Access your notes and discover shared video tutorials.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.form && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Identifier Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email or Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errors.identifier) setErrors(prev => ({ ...prev, identifier: '' }));
                }}
                placeholder="you@example.com or username"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50/40 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100 transition-all ${
                  errors.identifier ? 'border-rose-400 focus:ring-rose-500/30' : 'border-slate-200 dark:border-slate-800'
                }`}
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-[13px]" />
            </div>
            {errors.identifier && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.identifier}</p>}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm bg-slate-50/40 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100 transition-all ${
                  errors.password ? 'border-rose-400 focus:ring-rose-500/30' : 'border-slate-200 dark:border-slate-800'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-[13px]" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2.5 top-2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500 focus:ring-offset-0 dark:bg-slate-900 dark:border-slate-800"
            />
            <label htmlFor="rememberMe" className="ml-2.5 block text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              Remember Me
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In
              <LogIn className="w-4.5 h-4.5" />
            </button>
          </div>
        </form>

        {/* Demo Account Callout */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-[11px] leading-relaxed text-slate-500">
          <p className="font-bold text-slate-600 dark:text-slate-400 mb-0.5">💡 Demo Accounts Available:</p>
          <p>Email: <span className="font-semibold text-slate-700 dark:text-slate-300">demo@example.com</span> | Password: <span className="font-semibold text-slate-700 dark:text-slate-300">Password123!</span></p>
        </div>

        {/* Navigation bottom Link */}
        <div className="text-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline transition-all"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Dialog Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setIsForgotOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
          />
          <div className="relative glass-panel w-full max-w-sm border rounded-2xl shadow-2xl p-6 md:p-8 animate-slide-up bg-white dark:bg-slate-900">
            <h3 className="font-heading font-bold text-lg mb-2 dark:text-slate-100">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Provide your email address and we will forward a secured token to update your login credentials.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
