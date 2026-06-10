import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, FileText, Link as LinkIcon } from "lucide-react";
import ResourceCard from "../components/ResourceCard";

axios.defaults.withCredentials = true;

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

const Profile = () => {
  const { userId } = useParams();
  const location = useLocation();
  const { user: authUser } = useAuth();

  const source = location.state?.source; // "myProfile" or "post"

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${userId}/posts`
        );

        const fetchedPosts = res.data.posts || res.data;

        setPosts(fetchedPosts);

        if (fetchedPosts.length > 0) {
          if (source === "myProfile") {
            // logged-in user profile
            setUser(authUser);
          } else {
            // visited from post page
            setUser(fetchedPosts[0].owner || fetchedPosts[0].uploader);
          }
        } else {
          // fallback
          setUser(source === "myProfile" ? authUser : null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId, source, authUser]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" || post.resourceType === filterType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">

            <img
              src={
                user?.avatar
                  ? user.avatar.startsWith("http")
                    ? user.avatar
                    : `http://localhost:5000/uploads/${user.avatar}`
                  : "/default-avatar.png"
              }
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
            />

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                {user?.username || "Unknown User"}
              </h1>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                {filteredPosts.length} Resources Found
              </p>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm mb-8">

          <div className="flex flex-col lg:flex-row lg:items-center gap-4">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl">

              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold ${
                  filterType === "all"
                    ? "bg-white dark:bg-slate-700 shadow"
                    : "text-slate-500"
                }`}
              >
                All ({posts.length})
              </button>

              <button
                onClick={() => setFilterType("pdf")}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  filterType === "pdf"
                    ? "bg-white dark:bg-slate-700 shadow text-red-600"
                    : "text-slate-500"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                PDFs ({posts.filter((p) => p.resourceType === "pdf").length})
              </button>

              <button
                onClick={() => setFilterType("youtube")}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  filterType === "youtube"
                    ? "bg-white dark:bg-slate-700 shadow text-red-600"
                    : "text-slate-500"
                }`}
              >
                <Youtube className="w-3.5 h-3.5" />
                Videos ({posts.filter((p) => p.resourceType === "youtube").length})
              </button>

              <button
                onClick={() => setFilterType("link")}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  filterType === "link"
                    ? "bg-white dark:bg-slate-700 shadow text-green-600"
                    : "text-slate-500"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Links ({posts.filter((p) => p.resourceType === "link").length})
              </button>

            </div>
          </div>
        </div>

        {/* Resources */}
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
          Shared Resources
        </h2>

        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
            <p className="text-slate-500">No resources found.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <ResourceCard
                key={post._id}
                resource={{
                  id: post._id,
                  title: post.title,
                  description: post.description,
                  url: post.url,
                  type: post.resourceType,
                  date: post.createdAt,
                  uploader: post.owner,
                }}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;