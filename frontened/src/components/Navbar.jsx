import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useResources } from '../context/ResourceContext';
import { useToast } from '../context/ToastContext';
import {
  Search,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  User,
} from 'lucide-react';

const Navbar = ({ onSearchChange }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { suggestions, getSearchSuggestions, setSuggestions } = useResources();
  const { showToast } = useToast();

  const [searchVal, setSearchVal] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

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
    if (onSearchChange) onSearchChange(val);
  };

  const handleSuggestionClick = (suggestion) => {
    const cleanText = suggestion.text.startsWith('@')
      ? suggestion.text.substring(1)
      : suggestion.text;

    setSearchVal(cleanText);
    setSuggestions([]);
    if (onSearchChange) onSearchChange(cleanText);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]);
    if (onSearchChange) onSearchChange(searchVal);
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const closeAll = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsGuestMenuOpen(false);
  };

  const showOverlay = isDropdownOpen || isMobileMenuOpen || isGuestMenuOpen;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-[10000] h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" />
            <span className="font-bold text-brand-600">NoteSharing</span>
          </Link>

          {/* Search */}
          {user && (
            <div className="flex-1 max-w-md mx-2 md:mx-8 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <input
                  value={searchVal}
                  onChange={handleSearchInput}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-slate-700"
                />
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              </form>

              {suggestions.length > 0 && (
                <div className="absolute top-12 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border rounded-xl shadow-xl z-[10001]">
                  {suggestions.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RIGHT SIDE */}
          {/* RIGHT SIDE */}
<div className="flex items-center gap-3">

  <button onClick={toggleTheme}>
    {theme === 'dark' ? <Sun /> : <Moon />}
  </button>

  {/* ================= LOGGED IN USER ================= */}
  {user ? (
    <div className="relative" ref={dropdownRef}>
      
      {/* Avatar Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <img
          src={user.avatar}
          className="w-9 h-9 rounded-full object-cover border"
        />

        <div className="hidden sm:block text-left leading-tight">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-[11px] text-slate-400">@{user.username}</p>
        </div>

        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 z-[10003] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border rounded-2xl shadow-xl">

          <div className="px-4 py-2 border-b">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="text-sm font-semibold">{user.email}</p>
          </div>

          <Link
    to={`/profile/${user._id}`}
    state={{ source: "myProfile" }}
    onClick={closeAll}
    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
  >
    <User className="w-4 h-4" />
    My Posts
      </Link>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    /* ================= GUEST USER (NO DROPDOWN ANYMORE) ================= */
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Login
      </Link>

      <Link
        to="/signup"
        className="px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg"
      >
        Sign Up
      </Link>
    </div>
  )}
</div>
        </div>
      </nav>

      {/* ================= OVERLAY ================= */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-md"
          onClick={closeAll}
        />
      )}

      {/* ================= MOBILE USER MENU ================= */}
      {isMobileMenuOpen && user && (
        <div className="fixed top-0 left-0 h-full w-72 z-[10002] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl p-4">

          <div className="flex justify-between items-center border-b pb-3">
            <span className="font-bold">Menu</span>
            <X onClick={closeAll} />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <img src={user.avatar} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-slate-400">@{user.username}</p>
            </div>
          </div>
          <Link
          to={`/profile/${user._id}`}
          onClick={closeAll}
          className="mt-6 flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
          <User className="w-4 h-4" />
            My Posts
          </Link>
          <button
            onClick={handleLogout}
            className="mt-6 w-full text-left text-red-500 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

        </div>
      )}
    </>
  );
};

export default Navbar;