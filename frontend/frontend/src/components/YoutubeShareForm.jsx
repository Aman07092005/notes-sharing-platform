import React, { useState, useEffect } from 'react';
import { useResources } from '../context/ResourceContext';
import { useToast } from '../context/ToastContext';
import { Video, Link as LinkIcon, ArrowRight, Play, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Youtube = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const YoutubeShareForm = () => {
  const { addYoutubeResource } = useResources();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Validate YouTube URL and extract ID in real-time
  useEffect(() => {
    if (!url.trim()) {
      setVideoId(null);
      return;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      setVideoId(match[2]);
    } else {
      setVideoId(null);
    }
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a resource title', 'error');
      return;
    }
    if (!url.trim()) {
      showToast('Please enter a YouTube link', 'error');
      return;
    }
    if (!videoId) {
      showToast('Please enter a valid YouTube URL', 'error');
      return;
    }

    try {
      addYoutubeResource(title.trim(), description.trim(), url.trim());
      showToast('YouTube resource shared successfully!', 'success');
      
      // Reset form fields
      setTitle('');
      setDescription('');
      setUrl('');
      setVideoId(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="glass-panel border rounded-2xl p-5 shadow-md transition-all flex flex-col justify-between">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Youtube className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-heading font-bold text-lg dark:text-slate-100">Share YouTube Video</h3>
        </div>
        <button
          type="button"
          className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
          aria-label={isExpanded ? "Collapse YouTube form" : "Expand YouTube form"}
        >
          <Plus className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`} />
        </button>
      </div>

      <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-5 flex flex-col justify-between h-full">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Resource Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tailwind CSS v4 Crash Course"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      placeholder="Explain what concepts are explained in this video tutorial..."
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      YouTube Video URL
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100"
                        required
                      />
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Live Thumbnail Preview */}
                  {videoId ? (
                    <div className="space-y-1.5 animate-fade-in">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Live Video Preview
                      </span>
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm aspect-video bg-black group">
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                          alt="Video Thumbnail"
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg transition-transform duration-250 group-hover:scale-110">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-[10px] text-white font-extrabold uppercase rounded tracking-wider flex items-center gap-1">
                          <Youtube className="w-3.5 h-3.5" />
                          Live Preview
                        </div>
                      </div>
                    </div>
                  ) : url.trim() && !videoId ? (
                    <div className="flex items-center gap-2 text-rose-500 text-xs mt-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Please enter a valid YouTube link (e.g. https://www.youtube.com/watch?v=...)
                    </div>
                  ) : null}
                </form>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!videoId || !title.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 dark:disabled:bg-slate-900 disabled:text-slate-400 dark:disabled:text-slate-600 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/10 flex items-center justify-center gap-2"
                  >
                    Share Resource
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};

export default YoutubeShareForm;
