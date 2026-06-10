import React from "react";
import axios from "axios"
import {
  FileText,
  Copy,
  Edit,
  Trash2,
  Calendar,
  User,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResources } from "../context/ResourceContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

axios.defaults.withCredentials = true;
const ResourceCard = ({ resource }) => {
  const navigate = useNavigate();
  const { deleteResource } = useResources();
  const { showToast } = useToast();

  const { user } = useAuth();

  const currentUserId = user?._id;

  const getYoutubeThumbnail = (url) => {
    const match = url.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/
    );

    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
    }

    return null;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${resource.url}`
      );

      showToast("link copied!", "success");
    } catch {
      showToast("Failed to copy link", "error");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this resource?")) {
      return;
    }

    try {
      await deleteResource(resource.id);

      showToast(
        "Resource deleted successfully!",
        "success"
      );
    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          "Failed to delete resource",
        "error"
      );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">

      {/* Thumbnail Section */}
      {resource.type === "youtube" &&
        getYoutubeThumbnail(resource.url) && (
          <div className="relative">
            <img
              src={getYoutubeThumbnail(resource.url)}
              alt={resource.title}
              className="w-full h-56 object-cover"
            />

            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
              VIDEO
            </div>
          </div>
        )}

      {resource.type === "pdf" && (
        <div className="h-56 bg-blue-50 dark:bg-blue-950/20 flex flex-col items-center justify-center">
          <FileText
            size={70}
            className="text-red-500"
          />

          <span className="mt-2 text-white-500 font-semibold">
            PDF Document
          </span>
        </div>
      )}

      {resource.type === "link" && (
  <div className="h-56 bg-blue-50 dark:bg-blue-950/20 flex flex-col items-center justify-center">
    <Globe className="w-14 h-14 text-blue-500" />

    <p className="mt-3 font-semibold text-slate-700 dark:text-slate-300">
      Website Link
    </p>
  </div>
)}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          {resource.title}
        </h3>

        {resource.description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {resource.description}
          </p>
        )}

        {/* Author */}
        <div className="mt-4">
  <button
    onClick={() =>
      navigate(`/profile/${resource.uploader?._id}`)
    }
    className="flex items-center gap-2 hover:opacity-80 transition"
  >
    <img
      src={
        resource.uploader?.avatar ||
        "/default-avatar.png"
      }
      alt="avatar"
      className="w-8 h-8 rounded-full object-cover border"
    />

    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
      {resource.uploader?.username ||
        "Unknown User"}
    </span>
  </button>
</div>

        {/* Date */}
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Calendar size={14} />
          <span>
            {new Date(
              resource.date
            ).toLocaleDateString()}
          </span>
        </div>

        {/* Type Badge */}
        <div className="mt-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              resource.type === "pdf"
                ? "bg-red-100 text-red-600"
                : resource.type === "youtube"
                ? "bg-red-100 text-red-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {resource.type.toUpperCase()}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-2 mt-5">
  
  <div className="flex gap-2">
    <button
      onClick={() => window.open(resource.url, "_blank")}
      className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
    >
      View
    </button>

    <button
      onClick={handleCopyLink}
      className="px-3 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
    >
      Copy Link
    </button>
  </div>

  {resource.uploader?._id === currentUserId && (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/posts/${resource.id}/edit`)}
        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Edit
      </button>

      <button
        onClick={handleDelete}
        className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
      >
        Delete
      </button>
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default ResourceCard;