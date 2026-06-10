import React, { useState, useEffect } from "react";
import { useResources } from "../context/ResourceContext";
import ResourceCard from "./ResourceCard";
import SkeletonLoader from "./SkeletonLoader";
import {
  FileText,
  Library,
  Inbox,
  RefreshCcw,
} from "lucide-react";

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

const ResourceFeed = ({ searchQuery = "" }) => {
  const { resources, refreshResources } =
    useResources();

  const [activeTab, setActiveTab] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [visibleCount, setVisibleCount] =
    useState(6);

  const [loadingMore, setLoadingMore] =
    useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        await refreshResources();
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const filteredResources = resources.filter(
    (res) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "pdf" &&
          res.type === "pdf") ||
        (activeTab === "youtube" &&
          res.type === "youtube") ||
        (activeTab === "link" &&
          res.type === "link");

      if (!matchesTab) return false;

      if (!searchQuery.trim()) return true;

      const query =
        searchQuery.toLowerCase();

      return (
        res.title
          ?.toLowerCase()
          .includes(query) ||
        res.description
          ?.toLowerCase()
          .includes(query) ||
        res.uploader?.username
          ?.toLowerCase()
          .includes(query)
      );
    }
  );

  const handleLoadMore = () => {
    setLoadingMore(true);

    setTimeout(() => {
      setVisibleCount(
        (prev) => prev + 6
      );
      setLoadingMore(false);
    }, 500);
  };

  const hasMore =
    filteredResources.length >
    visibleCount;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <Library className="w-5 h-5 text-indigo-600" />

          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            Resource Repository
          </h3>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex flex-wrap bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
          <button
            onClick={() =>
              setActiveTab("all")
            }
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-white dark:bg-slate-800 shadow text-slate-800 dark:text-white"
                : "text-slate-500"
            }`}
          >
            All (
            {resources.length})
          </button>

          <button
            onClick={() =>
              setActiveTab("pdf")
            }
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === "pdf"
                ? "bg-white dark:bg-slate-800 shadow text-rose-600"
                : "text-slate-500"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            PDFs (
            {
              resources.filter(
                (r) =>
                  r.type ===
                  "pdf"
              ).length
            }
            )
          </button>

          <button
            onClick={() =>
              setActiveTab("youtube")
            }
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab ===
              "youtube"
                ? "bg-white dark:bg-slate-800 shadow text-red-600"
                : "text-slate-500"
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            Videos (
            {
              resources.filter(
                (r) =>
                  r.type ===
                  "youtube"
              ).length
            }
            )
          </button>

          <button
            onClick={() =>
              setActiveTab("link")
            }
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "link"
                ? "bg-white dark:bg-slate-800 shadow text-green-600"
                : "text-slate-500"
            }`}
          >
            Links (
            {
              resources.filter(
                (r) =>
                  r.type ===
                  "link"
              ).length
            }
            )
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : filteredResources.length ===
        0 ? (
        <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>

          <h4 className="font-bold text-lg mb-2">
            No Posts Found
          </h4>

          <p className="text-slate-500 text-sm">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : "No posts available yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredResources
              .slice(
                0,
                visibleCount
              )
              .map((resource) => (
                <ResourceCard
                  key={
                    resource.id ||
                    resource._id
                  }
                  resource={
                    resource
                  }
                />
              ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={
                  handleLoadMore
                }
                disabled={
                  loadingMore
                }
                className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}

          {!hasMore &&
            filteredResources.length >
              0 && (
              <p className="text-center text-xs text-slate-400">
                You've reached the end.
              </p>
            )}
        </div>
      )}
    </div>
  );
};

export default ResourceFeed;