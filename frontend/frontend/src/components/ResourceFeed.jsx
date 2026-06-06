import React, { useState, useEffect } from 'react';
import { useResources } from '../context/ResourceContext';
import ResourceCard from './ResourceCard';
import SkeletonLoader from './SkeletonLoader';
import { FileText, Library, Inbox, RefreshCcw } from 'lucide-react';

const Youtube = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const ResourceFeed = ({ searchQuery = '' }) => {
  const { resources } = useResources();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pdf', 'youtube'
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loadingMore, setLoadingMore] = useState(false);

  // Trigger mock loader on tab change or search queries
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab, searchQuery]);

  // Filter resources based on active tab and search query
  const filteredResources = resources.filter(res => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'pdf' && res.type === 'pdf') || 
      (activeTab === 'youtube' && res.type === 'youtube');

    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    return (
      res.title.toLowerCase().includes(query) ||
      res.description.toLowerCase().includes(query) ||
      res.uploader.username.toLowerCase().includes(query) ||
      res.uploader.name.toLowerCase().includes(query)
    );
  });

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setLoadingMore(false);
    }, 800);
  };

  const hasMore = filteredResources.length > visibleCount;

  return (
    <div className="space-y-6">
      {/* Feed Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <Library className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h3 className="font-heading font-bold text-slate-800 dark:text-slate-100">Resource Repository</h3>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            All Shared
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'pdf'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            PDFs
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'youtube'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            Videos
          </button>
        </div>
      </div>

      {/* Main Feed Content */}
      {loading ? (
        <SkeletonLoader count={2} />
      ) : filteredResources.length === 0 ? (
        <div className="glass-panel border rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center text-slate-400 mb-4 animate-bounce">
            <Inbox className="w-8 h-8" />
          </div>
          <h4 className="font-heading font-bold text-lg text-slate-700 dark:text-slate-200 mb-1">No resources found</h4>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {searchQuery ? `We couldn't find anything matching "${searchQuery}". Try editing your search query or uploading one.` : 'Be the first to upload a PDF or share an educational video link!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResources.slice(0, visibleCount).map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>

          {/* Infinite Scroll / Load More pagination */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-2 shadow-sm"
              >
                {loadingMore ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin text-brand-600" />
                    Fetching items...
                  </>
                ) : (
                  'Load More Resources'
                )}
              </button>
            </div>
          )}

          {!hasMore && filteredResources.length > 0 && (
            <p className="text-center text-xs text-slate-400 font-medium pt-4">
              You have caught up with all resources in this section.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceFeed;
