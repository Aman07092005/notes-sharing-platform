import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../context/ResourceContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PdfUploadForm from '../components/PdfUploadForm';
import YoutubeShareForm from '../components/YoutubeShareForm';
import ResourceFeed from '../components/ResourceFeed';
import { 
  Sparkles, Clock, Sunrise, Sun, Moon
} from 'lucide-react';

const Youtube = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const getGreetingConfig = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        text: 'Good Morning',
        icon: <Sunrise className="w-4.5 h-4.5 text-amber-500" />,
        bg: 'bg-amber-500/10'
      };
    }
    if (hour < 17) {
      return {
        text: 'Good Afternoon',
        icon: <Sun className="w-4.5 h-4.5 text-amber-500" />,
        bg: 'bg-amber-500/10'
      };
    }
    return {
      text: 'Good Evening',
      icon: <Moon className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400" />,
      bg: 'bg-indigo-500/10'
    };
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const greetingConfig = getGreetingConfig();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/60 transition-colors flex flex-col justify-between pt-16">
      {/* Global Navbar */}
      <Navbar onSearchChange={setSearchQuery} />

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-12">
        
        {/* Minimal Greeting Header */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=user'}
                alt={user?.name || 'User'}
                className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-50 dark:border-slate-950" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-xl md:text-2xl text-slate-800 dark:text-slate-100 leading-tight">
                  {greetingConfig.text}, {user?.name}!
                </h2>
                <div className={`p-1.5 rounded-lg ${greetingConfig.bg} flex items-center justify-center`}>
                  {greetingConfig.icon}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {getFormattedDate()}
              </p>
            </div>
          </div>

          {/* Connected workspace pill */}
          <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Workspace Connected
          </div>
        </section>

        {/* Upload Panels Side-By-Side */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
          <PdfUploadForm />
          <YoutubeShareForm />
        </section>

        {/* Search Results indicator */}
        {searchQuery.trim() && (
          <div className="p-3 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900 rounded-xl text-xs text-brand-600 dark:text-brand-400 flex items-center justify-between">
            <span>Showing results matching filter: <span className="font-bold">"{searchQuery}"</span></span>
            <button 
              onClick={() => setSearchQuery('')}
              className="font-bold underline hover:no-underline"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Resource Feed Repository */}
        <section className="pt-2">
          <ResourceFeed searchQuery={searchQuery} />
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
