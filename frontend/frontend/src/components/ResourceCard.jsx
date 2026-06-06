import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../context/ResourceContext';
import { useToast } from '../context/ToastContext';
import { 
  FileText, ThumbsUp, Eye, Download, Share2, 
  Trash2, X, Play, Calendar, ExternalLink, Minimize2, Maximize2 
} from 'lucide-react';

const Youtube = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const ResourceCard = ({ resource }) => {
  const { user } = useAuth();
  const { likeResource, incrementViews, incrementDownloads, deleteResource } = useResources();
  const { showToast } = useToast();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const isLiked = resource.likedBy?.includes(user?.username);
  const isUploader = resource.uploader.username === user?.username;

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Recent';
    }
  };

  const handleLike = () => {
    if (!user) {
      showToast('Please log in to like resources', 'error');
      return;
    }
    likeResource(resource.id);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/resource/${resource.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Link copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy link', 'error');
    });
  };

  const handleDownload = () => {
    incrementDownloads(resource.id);
    showToast(`Downloading: ${resource.fileName}`, 'success');
    // Simulated anchor download
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', resource.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPreview = () => {
    incrementViews(resource.id);
    setIsPreviewOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove "${resource.title}"?`)) {
      deleteResource(resource.id);
      showToast('Resource deleted successfully', 'info');
    }
  };

  return (
    <>
      <div className="glass-panel border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-800 transition-all flex flex-col justify-between h-full animate-fade-in group">
        <div>
          {/* Card Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              {resource.type === 'pdf' ? (
                <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/40">
                  <FileText className="w-5.5 h-5.5" />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                  <Youtube className="w-5.5 h-5.5" />
                </div>
              )}
              
              <div className="leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {resource.type === 'pdf' ? 'PDF Document' : 'YouTube Video'}
                </span>
                <h4 className="font-heading font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                  {resource.title}
                </h4>
              </div>
            </div>

            {/* Actions: Delete */}
            {isUploader && (
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                title="Delete shared resource"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Card Body */}
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 min-h-[60px]">
            {resource.description || 'No description provided for this shared resource.'}
          </p>

          {/* YouTube Thumbnail (For Videos) */}
          {resource.type === 'youtube' && (
            <div 
              onClick={handleOpenPreview}
              className="relative rounded-xl overflow-hidden mb-4 aspect-video bg-black cursor-pointer group/thumb border border-slate-100 dark:border-slate-900"
            >
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-full object-cover opacity-90 group-hover/thumb:scale-105 transition-transform duration-350"
              />
              <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-md group-hover/thumb:scale-110 transition-transform">
                  <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          )}

          {/* PDF Details Panel (For Documents) */}
          {resource.type === 'pdf' && (
            <div className="bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-3 mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                {resource.fileName}
              </span>
              <span className="font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
                {resource.fileSize}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="border-t border-slate-100 dark:border-slate-900/80 pt-3">
          {/* Uploader Details */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <img
                src={resource.uploader.avatar}
                alt={resource.uploader.name}
                className="w-7 h-7 rounded-full border border-brand-500/25 bg-slate-100 dark:bg-slate-900"
              />
              <div className="leading-tight">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{resource.uploader.name}</p>
                <p className="text-[10px] text-slate-400">@{resource.uploader.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
              <Calendar className="w-3 h-3" />
              {formatDate(resource.date)}
            </div>
          </div>

          {/* Interactive Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Like Trigger */}
              <button
                onClick={handleLike}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isLiked
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title={isLiked ? 'Unlike resource' : 'Like resource'}
              >
                <ThumbsUp className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : ''}`} />
                {resource.likes}
              </button>

              {/* Share Trigger */}
              <button
                onClick={handleShare}
                className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                title="Copy share link"
              >
                <Share2 className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Action Triggers */}
            {resource.type === 'pdf' ? (
              <div className="flex gap-1.5">
                <button
                  onClick={handleOpenPreview}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-all flex items-center gap-1 shadow-sm shadow-brand-500/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenPreview}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all flex items-center gap-1 shadow-sm shadow-rose-500/10"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                View Video
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PDF & YouTube Overlay Modal Preview */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setIsPreviewOpen(false)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />
          
          <div className="relative glass-panel w-full max-w-5xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-slide-up bg-white dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {resource.type === 'pdf' ? (
                  <FileText className="w-5.5 h-5.5 text-rose-500" />
                ) : (
                  <Youtube className="w-5.5 h-5.5 text-rose-600" />
                )}
                <div>
                  <h3 className="font-heading font-bold text-slate-800 dark:text-slate-100">{resource.title}</h3>
                  <p className="text-xs text-slate-400">Uploaded by @{resource.uploader.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {resource.type === 'pdf' && (
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden mr-2">
                    <button 
                      onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
                      className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold text-slate-600 dark:text-slate-300">{zoomLevel}%</span>
                    <button 
                      onClick={() => setZoomLevel(prev => Math.min(200, prev + 10))}
                      className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-6 flex justify-center items-start">
              {resource.type === 'pdf' ? (
                /* Premium PDF Reader Workspace Layout */
                <div 
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-4xl p-8 transition-all duration-200"
                  style={{ width: `${zoomLevel}%` }}
                >
                  {/* PDF Cover Header */}
                  <div className="border-b-2 border-slate-100 dark:border-slate-800 pb-6 mb-6 flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                        Document Preview
                      </span>
                      <h2 className="font-heading font-bold text-2xl text-slate-800 dark:text-slate-100">{resource.title}</h2>
                      <p className="text-xs text-slate-400">Total Estimated Pages: {resource.pageCount} pages | Size: {resource.fileSize}</p>
                    </div>
                    <FileText className="w-12 h-12 text-rose-500/30" />
                  </div>

                  {/* Simulated PDF Notes Text Layout */}
                  <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans select-none">
                    <div>
                      <h3 className="font-heading font-bold text-slate-800 dark:text-slate-200 text-base mb-2">1. Introduction to Core Concepts</h3>
                      <p>
                        This study guide covers the fundamental principles of the topic. Ensure that you pay close attention to structural patterns, optimizations, and syntax formatting conventions. Key parameters should be memorized for quick reference.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-800">
                      <span className="block text-xs font-bold uppercase tracking-wide text-brand-500 mb-1">PRO TIP</span>
                      <p className="text-xs">
                        When reviewing this topic, draw comparison diagrams and structure cards to map dependencies. Pay close attention to rendering cycles and hook behaviors.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-slate-800 dark:text-slate-200 text-base mb-2">2. Detailed Breakdown & Implementations</h3>
                      <p>
                        Review code syntax blocks, execution threads, and asynchronous event loops. In multiple scenarios, standard libraries provide optimal helper methods to avoid custom boilerplate logic.
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Understand resource lifetimes and scope.</li>
                        <li>Implement proper error boundaries and fail-safes.</li>
                        <li>Configure caching thresholds to enhance overall retrieval speeds.</li>
                      </ul>
                    </div>

                    {/* Watermark Overlay */}
                    <div className="pt-12 text-center text-xs text-slate-300 dark:text-slate-700 font-heading font-semibold uppercase tracking-widest select-none">
                      --- NoteSharing Platform Secured Document ---
                    </div>
                  </div>
                </div>
              ) : (
                /* Youtube Inline IFrame Embed Video Player */
                <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${resource.videoId}?autoplay=1`}
                    title={resource.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Opened {formatDate(resource.date)} by @{resource.uploader.username}
              </span>

              {resource.type === 'pdf' ? (
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/10 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Download Notes PDF
                </button>
              ) : (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/10 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch on YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResourceCard;
