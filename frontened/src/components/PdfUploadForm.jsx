import React, { useState } from "react";
import { useResources } from "../context/ResourceContext";
import { useToast } from "../context/ToastContext";
import {
  Upload,
  ArrowRight,
  Plus,
  Link as LinkIcon,
  FileText,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PdfUploadForm = () => {
  const { addPdfResource } = useResources();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const [uploading, setUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const detectResourceType = (url) => {
    if (!url) return "link";

    const lowerUrl = url.toLowerCase();

    if (
      lowerUrl.endsWith(".pdf") ||
      lowerUrl.includes(".pdf?")
    ) {
      return "pdf";
    }

    return "link";
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Please enter a note title", "error");
      return;
    }

    if (!pdfUrl.trim()) {
      showToast("Please enter URL", "error");
      return;
    }

    if (!isValidUrl(pdfUrl)) {
      showToast("Please enter a valid URL", "error");
      return;
    }

    try {
      setUploading(true);

      const resourceType =
        detectResourceType(pdfUrl);

      await addPdfResource(
        title.trim(),
        description.trim(),
        pdfUrl.trim(),
        resourceType
      );

      showToast(
        "Resource shared successfully!",
        "success"
      );

      setTitle("");
      setDescription("");
      setPdfUrl("");
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Upload failed",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  const resourceType =
    detectResourceType(pdfUrl);

  return (
    <div className="glass-panel border rounded-2xl p-5 shadow-md transition-all flex flex-col">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Upload className="w-4 h-4" />
          </div>

          <h3 className="font-bold text-lg dark:text-slate-100">
            Share PDF / Link
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

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="overflow-hidden"
          >
            <div className="pt-5">
              <form
                onSubmit={handleUploadSubmit}
                className="space-y-4"
              >
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Title
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    placeholder="Data Structures Notes"
                    className="
                      w-full
                      px-4
                      py-2
                      rounded-xl
                      border
                      border-slate-200
                      dark:border-slate-800
                      bg-slate-50
                      dark:bg-slate-900
                      focus:outline-none
                      focus:ring-2
                      focus:ring-brand-500/50
                    "
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
                    placeholder="Brief description..."
                    className="
                      w-full
                      px-4
                      py-2
                      rounded-xl
                      border
                      border-slate-200
                      dark:border-slate-800
                      bg-slate-50
                      dark:bg-slate-900
                      resize-none
                      focus:outline-none
                      focus:ring-2
                      focus:ring-brand-500/50
                    "
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    PDF URL or Website URL
                  </label>

                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                    <input
                      type="url"
                      value={pdfUrl}
                      onChange={(e) =>
                        setPdfUrl(e.target.value)
                      }
                      className={`
                        w-full
                        pl-10
                        pr-4
                        py-2
                        rounded-xl
                        border
                        bg-slate-50
                        dark:bg-slate-900
                        focus:outline-none
                        focus:ring-2
                        focus:ring-brand-500/50
                        ${
                          pdfUrl.trim() &&
                          !isValidUrl(pdfUrl)
                            ? "border-red-500"
                            : "border-slate-200 dark:border-slate-800"
                        }
                      `}
                    />
                  </div>

                  {pdfUrl.trim() && (
                    <p className="text-xs text-slate-500 mt-2">
                      Resource Type:
                      <span className="font-semibold ml-1 capitalize">
                        {resourceType}
                      </span>
                    </p>
                  )}
                </div>

                {/* Preview */}
                {pdfUrl.trim() &&
                  isValidUrl(pdfUrl) && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Live Preview
                      </span>

                      {resourceType ===
                      "pdf" ? (
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
                          <FileText className="w-14 h-14 text-red-500" />

                          <p className="mt-3 font-semibold">
                            PDF Document
                          </p>

                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 text-sm text-blue-500 hover:underline"
                          >
                            Open PDF
                          </a>
                        </div>
                      ) : (
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
                          <Globe className="w-14 h-14 text-blue-500" />

                          <p className="mt-3 font-semibold">
                            Website Link
                          </p>

                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 text-sm text-blue-500 hover:underline break-all text-center"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                {/* Invalid URL */}
                {pdfUrl.trim() &&
                  !isValidUrl(pdfUrl) && (
                    <div className="flex items-center gap-2 text-red-500 text-xs animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Please enter a valid URL
                    </div>
                  )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={
                    uploading ||
                    !title.trim() ||
                    !pdfUrl.trim()
                  }
                  className="
                    w-full
                    py-3
                    rounded-xl
                    bg-brand-600
                    hover:bg-brand-700
                    disabled:bg-slate-300
                    disabled:cursor-not-allowed
                    text-white
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition-all
                  "
                >
                  {uploading
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

export default PdfUploadForm;