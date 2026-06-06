import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useResources } from '../context/ResourceContext';
import { useToast } from '../context/ToastContext';
import { 
  Search, LogOut, Sun, Moon, User, Menu, X, 
  ChevronDown, Settings, BookOpen, UserCheck 
} from 'lucide-react';

const Navbar = ({ onSearchChange }) => {
  const { user, logout, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { suggestions, getSearchSuggestions, setSuggestions } = useResources();
  const { showToast } = useToast();
  
  const [searchVal, setSearchVal] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  // Edit Profile Form States
  const [newName, setNewName] = useState(user?.name || '');
  const [avatarSeed, setAvatarSeed] = useState(user?.username || 'user');

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [setSuggestions]);

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    getSearchSuggestions(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // If user clicked suggestion, search that text
    const cleanText = suggestion.text.startsWith('@') ? suggestion.text.substring(1) : suggestion.text;
    setSearchVal(cleanText);
    setSuggestions([]);
    if (onSearchChange) {
      onSearchChange(cleanText);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]);
    if (onSearchChange) {
      onSearchChange(searchVal);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    const newAvatar = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${avatarSeed}`;
    updateProfile(newName, newAvatar);
    showToast('Profile updated successfully!', 'success');
    setIsEditProfileOpen(false);
  };

  return (
    <>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-indigo-500 dark:from-brand-500 dark:to-indigo-400 bg-clip-text text-transparent">
              NoteSharing
            </span>
          </Link>

          {/* Search bar - Desktop */}
          {user && (
            <div className="hidden md:block flex-1 max-w-md mx-8 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search resources, authors or titles..."
                  value={searchVal}
                  onChange={handleSearchInput}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 dark:text-slate-100 transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-[11px]" />
              </form>

              {/* Suggestions List */}
              {suggestions.length > 0 && (
                <div className="absolute top-12 left-0 right-0 glass-panel border rounded-xl shadow-xl z-50 py-2 overflow-hidden animate-fade-in">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">{item.text}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right Hand Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {user ? (
              <>
                {/* User Dropdown Desktop */}
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-left"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-brand-500/20 bg-slate-100 dark:bg-slate-900 object-cover"
                    />
                    <div className="leading-tight pr-1">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{user.name}</p>
                      <p className="text-[10px] text-slate-400">@{user.username}</p>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-250 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-12 w-56 glass-panel border rounded-2xl shadow-xl z-50 py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold truncate dark:text-slate-200">{user.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsEditProfileOpen(true);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Edit Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-500 px-3 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl transition-all shadow-md shadow-brand-500/20 hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden glass-panel border-b absolute top-16 left-0 right-0 z-40 py-4 px-4 shadow-xl animate-fade-in flex flex-col gap-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={handleSearchInput}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 focus:outline-none dark:text-slate-100"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-[11px]" />
            </form>

            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-brand-500/20 bg-slate-100 dark:bg-slate-900 object-cover"
              />
              <div>
                <p className="text-sm font-semibold dark:text-slate-200">{user.name}</p>
                <p className="text-xs text-slate-400">@{user.username}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsEditProfileOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-3 rounded-xl text-left text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Edit Profile Modal Dialog */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setIsEditProfileOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
          />
          
          {/* Card */}
          <div className="relative glass-panel w-full max-w-md border rounded-2xl shadow-2xl p-6 md:p-8 animate-slide-up">
            <button 
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-bold text-xl mb-4 dark:text-slate-100">Edit Profile</h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Avatar Seed (Dicebear emoji)
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={avatarSeed}
                    onChange={(e) => setAvatarSeed(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100 text-sm"
                    placeholder="Enter seed term..."
                  />
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${avatarSeed || 'empty'}`}
                      alt="Avatar Preview"
                      className="w-10 h-10 object-cover"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Type any name or word to instantly generate a custom cartoon avatar.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-sm font-semibold text-white transition-colors flex items-center gap-1.5 shadow-md shadow-brand-500/20"
                >
                  <UserCheck className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
