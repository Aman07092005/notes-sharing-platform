import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  User, Mail, Lock, UserCheck, ArrowRight, 
  BookOpen, Eye, EyeOff, CheckCircle, AlertCircle 
} from 'lucide-react';

const SignUp = () => {
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Live Password Strength Check
    if (name === 'password') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[^A-Za-z0-9]/.test(value)
      });
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    
    if (!formData.name.trim()) tempErrors.name = 'Full Name is required';
    if (!formData.username.trim()) tempErrors.username = 'Username is required';
    else if (formData.username.length < 3) tempErrors.username = 'Username must be at least 3 characters';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) tempErrors.email = 'Email address is required';
    else if (!emailRegex.test(formData.email)) tempErrors.email = 'Please enter a valid email address';

    // Password validations
    if (!formData.password) tempErrors.password = 'Password is required';
    else {
      const isStrong = 
        formData.password.length >= 8 &&
        /[A-Z]/.test(formData.password) &&
        /[0-9]/.test(formData.password) &&
        /[^A-Za-z0-9]/.test(formData.password);
      
      if (!isStrong) {
        tempErrors.password = 'Password must meet all strength criteria';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct form errors', 'error');
      return;
    }

    try {
      signUp(formData.name.trim(), formData.username.trim(), formData.email.trim(), formData.password);
      showToast('Registration successful! Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.message, 'error');
      setErrors(prev => ({ ...prev, email: err.message.includes('Email') ? err.message : '', username: err.message.includes('Username') ? err.message : '' }));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-slate-50 dark:bg-slate-950/80 transition-colors">
      {/* Background Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Main card container */}
      <div className="relative w-full max-w-lg glass-panel border rounded-3xl shadow-2xl p-8 md:p-10 animate-slide-up">
        {/* Header Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold mb-4 shadow-lg shadow-brand-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-slate-800 dark:text-slate-100">
            Create an Account
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Join the community and start exchanging study materials today.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50/40 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100 transition-all ${
                    errors.name ? 'border-rose-400 focus:ring-rose-500/30' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-[13px]" />
              </div>
              {errors.name && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="johndoe"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50/40 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100 transition-all ${
                    errors.username ? 'border-rose-400 focus:ring-rose-500/30' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-[13px]" />
              </div>
              {errors.username && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.username}</p>}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50/40 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100 transition-all ${
                  errors.email ? 'border-rose-400 focus:ring-rose-500/30' : 'border-slate-200 dark:border-slate-800'
                }`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-[13px]" />
            </div>
            {errors.email && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm bg-slate-50/40 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100 transition-all ${
                    errors.confirmPassword ? 'border-rose-400 focus:ring-rose-500/30' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-[13px]" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2.5 top-2"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Password Strength Checklist Indicator */}
          {formData.password && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password Requirements</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className={`flex items-center gap-1 ${passwordStrength.length ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <CheckCircle className="w-3.5 h-3.5 fill-current" />
                  Min. 8 characters
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.uppercase ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <CheckCircle className="w-3.5 h-3.5 fill-current" />
                  One uppercase letter
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.number ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <CheckCircle className="w-3.5 h-3.5 fill-current" />
                  One number (0-9)
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.special ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <CheckCircle className="w-3.5 h-3.5 fill-current" />
                  One special char
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign Up
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </form>

        {/* Navigation bottom Link */}
        <div className="text-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline transition-all"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
