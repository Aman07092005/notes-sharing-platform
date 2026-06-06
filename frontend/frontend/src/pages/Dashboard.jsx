import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../context/ResourceContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PdfUploadForm from '../components/PdfUploadForm';
import YoutubeShareForm from '../components/YoutubeShareForm';
import ResourceFeed from '../components/ResourceFeed';
import { 
  FileText, Heart, Download, 
  ArrowUpRight, Sparkles, BookOpen, Clock 
} from 'lucide-react';

const Youtube = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { resources } = useResources();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate quick metrics based on current resources database state
  const totalPdfs = resources.filter(r => r.type === 'pdf').length;
  const totalYoutubes = resources.filter(r => r.type === 'youtube').length;
  const totalLikes = resources.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const totalDownloads = resources.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/60 transition-colors flex flex-col justify-between pt-16">
      {/* Global Navbar */}
      <Navbar onSearchChange={setSearchQuery} />

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Welcome Dashboard Banner Header */}
        <section className="relative glass-panel border rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
          {/* Decorative gradients */}
          <div className="absolute right-0 top-0 w-60 h-60 bg-gradient-to-br from-brand-500/20 to-indigo-500/20 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=user'}
                alt={user?.name || 'User'}
                className="w-16 h-16 rounded-2xl border-2 border-brand-500/30 bg-slate-50 dark:bg-slate-900 object-cover shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-white border border-white dark:border-slate-950">
                <Sparkles className="w-3 h-3 fill-current" />
              </div>
            </div>
            
            <div className="leading-tight">
              <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-3 h-3 text-slate-400" />
                {getFormattedDate()}
              </p>
              <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-slate-800 dark:text-slate-100 mt-1">
                {getGreeting()}, {user?.name}!
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Check out the latest reference notes and educational videos shared today.
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-pulse" />
            Workspace Connected
          </div>
        </section>

        {/* Statistics Panels Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Stat 1 */}
          <div className="glass-panel border rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PDF Notes</span>
              <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">{totalPdfs}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="glass-panel border rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Videos</span>
              <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">{totalYoutubes}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
              <Youtube className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="glass-panel border rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Likes</span>
              <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">{totalLikes}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
          </div>

          {/* Stat 4 */}
          <div className="glass-panel border rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Downloads</span>
              <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">{totalDownloads}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Upload Panels Side-By-Side */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="h-full">
            <PdfUploadForm />
          </div>
          <div className="h-full">
            <YoutubeShareForm />
          </div>
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
