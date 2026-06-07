import React, { useState, useRef } from 'react';
import { useResources } from '../context/ResourceContext';
import { useToast } from '../context/ToastContext';
import { FileText, Upload, AlertCircle, CheckCircle, X, ArrowRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PdfUploadForm = () => {
  const { addPdfResource } = useResources();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const fileInputRef = useRef(null);

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      showToast('Only PDF files are allowed!', 'error');
      return;
    }

    // Check size limit: let's say 15MB
    if (selectedFile.size > 15 * 1024 * 1024) {
      showToast('File size must be less than 15MB', 'error');
      return;
    }

    setFile(selectedFile);
    showToast(`PDF loaded: ${selectedFile.name}`, 'info');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleClear = () => {
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a note title', 'error');
      return;
    }
    if (!file) {
      showToast('Please select or drag a PDF file', 'error');
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Add resource to state
          setTimeout(() => {
            try {
              addPdfResource(
                title.trim(),
                description.trim(),
                file.name,
                formatBytes(file.size)
              );
              showToast('PDF notes shared successfully!', 'success');
              
              // Clear fields
              setTitle('');
              setDescription('');
              setFile(null);
              setUploading(false);
              setProgress(0);
            } catch (err) {
              showToast(err.message, 'error');
              setUploading(false);
            }
          }, 400);

          return 100;
        }
        // Random incremental tick
        const tick = Math.floor(Math.random() * 15) + 10;
        return Math.min(prev + tick, 100);
      });
    }, 150);
  };

  return (
    <div className="glass-panel border rounded-2xl p-5 shadow-md transition-all flex flex-col justify-between">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Upload className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-heading font-bold text-lg dark:text-slate-100">Upload PDF Notes</h3>
        </div>
        <button
          type="button"
          className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
          aria-label={isExpanded ? "Collapse PDF form" : "Expand PDF form"}
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
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Note Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Data Structures Cheat Sheet"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100"
                    disabled={uploading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Brief summary of what this PDF study guide covers..."
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-slate-100 resize-none"
                    disabled={uploading}
                  />
                </div>

                {/* Drag & Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={!file && !uploading ? triggerFileInput : undefined}
                  className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${
                    file ? 'border-brand-500 bg-brand-50/10 dark:bg-brand-950/10' : 'border-slate-200 dark:border-slate-800 hover:border-brand-400 cursor-pointer'
                  } ${isDragActive ? 'border-brand-600 bg-brand-100/20 dark:bg-brand-900/20' : ''}`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,application/pdf"
                    className="hidden"
                    disabled={uploading}
                  />

                  {file ? (
                    <div className="w-full flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="max-w-[200px] sm:max-w-xs leading-tight">
                          <p className="text-sm font-semibold truncate dark:text-slate-200">{file.name}</p>
                          <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                        </div>
                      </div>

                      {!uploading && (
                        <button
                          type="button"
                          onClick={handleClear}
                          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 mb-3">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold dark:text-slate-300">Drag & Drop PDF or click to browse</p>
                      <p className="text-xs text-slate-400 mt-1">Supports PDF files up to 15MB</p>
                    </div>
                  )}
                </div>
              </form>

              {/* Progress & Submit Button */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                {uploading && (
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                        Uploading document...
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-600 dark:bg-brand-500 h-full rounded-full transition-all duration-150"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleUploadSubmit}
                  disabled={uploading || !file || !title.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 dark:disabled:bg-slate-900 disabled:text-slate-400 dark:disabled:text-slate-600 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/10 flex items-center justify-center gap-2"
                >
                  {uploading ? 'Processing note...' : 'Upload Notes'}
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

export default PdfUploadForm;
