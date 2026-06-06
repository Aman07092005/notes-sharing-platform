import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Shield, Scale } from 'lucide-react';

const Github = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Twitter = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <span className="font-heading font-bold text-lg dark:text-slate-100">
                NoteSharing
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              A collaborative space for students and educators to share structured PDF study guides, video resources, and lecture summaries. Learn together, succeed together.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/dashboard" className="text-sm text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Legal Info
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Support
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Have questions, issues, or suggestions? Get in touch with our team.
            </p>
            <a 
              href="mailto:support@notesharing.com" 
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors"
            >
              <Mail className="w-4 h-4 text-brand-500" />
              support@notesharing.com
            </a>
          </div>
        </div>

        {/* Lower Banner */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © 2026 NoteSharing. All Rights Reserved. Built with React, Vite & Tailwind.
          </p>
          <div className="flex gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">FAQ</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Feedback</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
