import React, { useState, useEffect } from "react";
import { useResources } from "../context/ResourceContext";
import { useToast } from "../context/ToastContext";
import {
  Link as LinkIcon,
  ArrowRight,
  Play,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Youtube = (props) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const YoutubeShareForm = () => {
  const { addYoutubeResource } = useResources();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url.trim()) {
      setVideoId(null);
      return;
    }

    try {
      const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i
      );

      if (match && match[1] && match[1].length === 11) {
        setVideoId(match[1]);
      } else {
        setVideoId(null);
      }
    } catch {
      setVideoId(null);
    }
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Please enter a resource title", "error");
      return;
    }

    if (!url.trim()) {
      showToast("Please enter a YouTube link", "error");
      return;
    }

    if (!videoId) {
      showToast("Please enter a valid YouTube URL", "error");
      return;
    }

    try {
      setLoading(true);

      await addYoutubeResource(
        title.trim(),
        description.trim(),
        url.trim()
      );

      showToast(
        "YouTube resource shared successfully!",
        "success"
      );

      setTitle("");
      setDescription("");
      setUrl("");
      setVideoId(null);
    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          err.message ||
          "Failed to share resource",
        "error"
      );
    } finally {
      setLoading(false);
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
            <Youtube className="w-4 h-4" />
          </div>

          <h3 className="font-bold text-lg dark:text-slate-100">
            Share YouTube Video
          </h3>
        </div>

        <button
          type="button"
          className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
        >
          <Plus
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-5">
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Resource Title
                  </label>

                  <input
                    type="text"
                    placeholder="Tailwind CSS Crash Course"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Description
                  </label>

                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Video description..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 resize-none"
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    YouTube URL
                  </label>

                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                    <input
                      type="text"
                      value={url}
                      onChange={(e) =>
                        setUrl(e.target.value)
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-900 ${
                        url.trim() && !videoId
                          ? "border-red-500"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    />
                  </div>
                </div>

                {/* Validation + Preview */}
                {videoId ? (
                  <div className="space-y-2 animate-fade-in">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Live Preview
                    </span>

                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-black">
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                        alt="Video Thumbnail"
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  url.trim() && (
                    <div className="flex items-center gap-2 text-red-500 text-xs animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Please enter a valid YouTube link
                    </div>
                  )
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !title.trim() ||
                    !videoId
                  }
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2"
                >
                  {loading
                    ? "Publishing..."
                    : "Share Resource"}

                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YoutubeShareForm;

