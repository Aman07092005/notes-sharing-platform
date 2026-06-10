import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Link as LinkIcon,
  Play,
  FileText,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

axios.defaults.withCredentials = true;

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    resourceType: "link",
  });

  // ================= HELPERS =================
  const detectTypeFromUrl = (url) => {
    if (!url) return "link";

    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be")
    ) {
      return "youtube";
    }

    if (url.toLowerCase().includes(".pdf")) {
      return "pdf";
    }

    return "link";
  };

  const getYoutubeId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
    );
    return match?.[1] || null;
  };

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/posts/${id}`
        );

        const post = res.data.post || res.data;

        setFormData({
          title: post.title || "",
          description: post.description || "",
          url: post.url || "",
          resourceType:
            post.resourceType ||
            detectTypeFromUrl(post.url || ""),
        });
      } catch (error) {
        showToast(
          error?.response?.data?.message ||
            "Failed to load post",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "url") {
        updated.resourceType =
          detectTypeFromUrl(value);
      }

      return updated;
    });
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!formData.url.trim()) {
      return "Please enter a URL";
    }

    if (formData.resourceType === "youtube") {
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

      if (!youtubeRegex.test(formData.url)) {
        return "Please enter a valid YouTube URL";
      }
    }

    if (formData.resourceType === "pdf") {
      try {
        new URL(formData.url);

        const pdfRegex =
          /\.pdf(\?.*)?$/i;

        if (!pdfRegex.test(formData.url)) {
          return "Please enter a valid PDF URL";
        }
      } catch {
        return "Please enter a valid PDF URL";
      }
    }

    if (formData.resourceType === "link") {
      try {
        new URL(formData.url);
      } catch {
        return "Please enter a valid website URL";
      }
    }

    return null;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();

    if (error) {
      showToast(error, "error");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/posts/${id}`,
        formData
      );

      showToast(
        "Resource updated successfully!",
        "success"
      );

      window.location.href = "/dashboard";
    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          "Failed to update post",
        "error"
      );
    }
  };

  const youtubeId = getYoutubeId(
    formData.url
  );

  const validationError = validate();

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}
        <div className="glass-panel border rounded-2xl p-5 shadow-md">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-5 text-slate-600 dark:text-slate-400 hover:text-blue-500"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h2 className="text-2xl font-bold mb-5">
            Edit Resource
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* TITLE */}
            <div>
              <label className="text-xs uppercase text-slate-500">
                Title
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-900"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-xs uppercase text-slate-500">
                Description
              </label>

              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-900"
              />
            </div>

            {/* URL */}
            <div>
              <label className="text-xs uppercase text-slate-500">
                Resource URL
              </label>

              <div className="relative mt-1">
                <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                <input
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-900 ${
                    formData.url.trim() &&
                    validationError
                      ? "border-red-500"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                />
              </div>

              {formData.url.trim() &&
                validationError && (
                  <div className="flex items-center gap-2 text-red-500 text-xs mt-2 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    {validationError}
                  </div>
                )}

              <p className="text-xs text-slate-400 mt-2">
                Type:
                <b className="ml-1">
                  {formData.resourceType}
                </b>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Update Resource
            </button>

          </form>
        </div>

        {/* ================= PREVIEW ================= */}
        <div className="glass-panel border rounded-2xl p-5 shadow-md">

          <h2 className="text-xl font-bold mb-4">
            Live Preview
          </h2>

          {/* YOUTUBE */}
          {formData.resourceType ===
            "youtube" &&
            youtubeId && (
              <div className="rounded-xl overflow-hidden border">
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                  alt="YouTube Preview"
                  className="w-full"
                />

                <div className="p-3 flex items-center gap-2">
                  <Play className="text-red-500" />
                  YouTube Preview
                </div>
              </div>
            )}

          {/* PDF */}
          {formData.resourceType ===
            "pdf" && (
              <div className="flex flex-col items-center justify-center h-60 border rounded-xl bg-slate-100 dark:bg-slate-900">
                <FileText
                  size={50}
                  className="text-red-500"
                />

                <p className="mt-2 font-semibold">
                  PDF Document
                </p>

                <a
                  href={formData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 text-sm mt-2"
                >
                  Open PDF
                </a>
              </div>
            )}

          {/* LINK */}
          {formData.resourceType ===
            "link" && (
              <div className="flex flex-col items-center justify-center h-60 border rounded-xl bg-slate-100 dark:bg-slate-900">
                <LinkIcon
                  size={40}
                  className="text-slate-400"
                />

                <p className="mt-2 text-sm text-slate-500">
                  Link Preview
                </p>

                <a
                  href={formData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 text-sm mt-2"
                >
                  Open Link
                </a>
              </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Edit;