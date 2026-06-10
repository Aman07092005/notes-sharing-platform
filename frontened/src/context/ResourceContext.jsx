import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { useAuth } from "./AuthContext";

const ResourceContext = createContext();

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const ResourceProvider = ({ children }) => {
  const { user } = useAuth();

  const [resources, setResources] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // =========================
  // LOAD POSTS
  // =========================
  const loadResources = async (type = "") => {
    try {
      const res = await API.get("/posts", {
        params: type ? { type } : {},
      });

      const mapped = res.data.map((post) => ({
        id: post._id,
        type: post.resourceType,
        title: post.title,
        description: post.description,
        url: post.url,
        uploader: post.owner,
        date: post.createdAt,
        likes: 0,
        views: 0,
        likedBy: [],
      }));

      setResources(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  // =========================
  // ADD PDF
  // =========================
  const addPdfResource = async (
  title,
  description,
  fileUrl,
  resourceType = "link"
) => {
  if (!user) {
    throw new Error("Login required");
  }

  const res = await API.post("/posts", {
    title,
    description,
    resourceType,
    url: fileUrl,
  });

  await loadResources();

  return res.data.post;
};

  // =========================
  // ADD YOUTUBE
  // =========================
  const addYoutubeResource = async (
    title,
    description,
    url
  ) => {
    if (!user) {
      throw new Error("Login required");
    }

    const youtubeRegex =
      /^.*(youtu\.be\/|watch\?v=)([^#&?]*).*/;

    const match = url.match(youtubeRegex);

    if (!match) {
      throw new Error("Invalid YouTube URL");
    }

    const res = await API.post("/posts", {
      title,
      description,
      resourceType: "youtube",
      url,
    });

    await loadResources();

    return res.data.post;
  };

  // =========================
  // DELETE
  // =========================
  const deleteResource = async (id) => {
    try {
      await API.delete(`/posts/${id}`);

      setResources((prev) =>
        prev.filter((r) => r.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // SEARCH
  // =========================
  const getSearchSuggestions = (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase();

    const results = [];

    resources.forEach((resource) => {
      if (
        resource.title.toLowerCase().includes(q)
      ) {
        results.push({
          type: "Title",
          text: resource.title,
        });
      }

      if (
        resource.uploader?.username
          ?.toLowerCase()
          .includes(q)
      ) {
        results.push({
          type: "Author",
          text: `@${resource.uploader.username}`,
        });
      }
    });

    const unique = [];
    const seen = new Set();

    for (const item of results) {
      const key = `${item.type}-${item.text}`;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }

      if (unique.length >= 5) break;
    }

    setSuggestions(unique);
  };

  // =========================
  // TEMPORARY LOCAL FEATURES
  // =========================
  const likeResource = () => {};

  const incrementViews = () => {};

  const incrementDownloads = () => {};

  return (
    <ResourceContext.Provider
      value={{
        resources,
        suggestions,

        loadResources,

        addPdfResource,
        addYoutubeResource,

        deleteResource,

        getSearchSuggestions,
        setSuggestions,

        likeResource,
        incrementViews,
        incrementDownloads,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => {
  const context = useContext(ResourceContext);

  if (!context) {
    throw new Error(
      "useResources must be used within ResourceProvider"
    );
  }

  return context;
};