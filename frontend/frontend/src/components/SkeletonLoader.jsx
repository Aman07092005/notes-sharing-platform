import React from 'react';

const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="glass-panel border rounded-2xl p-5 shadow-sm overflow-hidden flex flex-col justify-between h-[280px]"
        >
          {/* Card Header Shimmer */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 w-3/4">
                <div className="w-12 h-12 rounded-xl shimmer-bg animate-shimmer flex-shrink-0" />
                <div className="w-full space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="w-8 h-8 rounded-full shimmer-bg animate-shimmer flex-shrink-0" />
            </div>
            
            {/* Description Shimmer */}
            <div className="space-y-2 mt-4 mb-4">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
            </div>
          </div>

          {/* Card Footer Shimmer */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full shimmer-bg animate-shimmer" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
