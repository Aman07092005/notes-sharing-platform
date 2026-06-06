import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const savedResources = localStorage.getItem('resources_db');
    if (savedResources) {
      setResources(JSON.parse(savedResources));
    } else {
      const defaultResources = [
        {
          id: 'res_1',
          type: 'pdf',
          title: 'React.js v19 Hooks Cheat Sheet',
          description: 'A comprehensive guide to React hooks including useState, useEffect, useMemo, and the new use() hook in React 19.',
          fileName: 'react_v19_hooks_cheatsheet.pdf',
          fileSize: '1.4 MB',
          pageCount: 8,
          downloadCount: 142,
          likes: 48,
          views: 320,
          uploader: {
            name: 'Jane Doe',
            username: 'janedoe',
            avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Jane'
          },
          date: '2026-06-05T10:30:00.000Z',
          likedBy: []
        },
        {
          id: 'res_2',
          type: 'youtube',
          title: 'Tailwind CSS v4.0 Walkthrough & Demo',
          description: 'Learn what is new in Tailwind CSS v4: CSS-first configuration, lighting-fast Rust engine, new theme syntax, and standard grids.',
          url: 'https://www.youtube.com/watch?v=N6Lp6SefFpU',
          videoId: 'N6Lp6SefFpU',
          thumbnail: 'https://img.youtube.com/vi/N6Lp6SefFpU/mqdefault.jpg',
          likes: 95,
          views: 580,
          uploader: {
            name: 'Jane Doe',
            username: 'janedoe',
            avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Jane'
          },
          date: '2026-06-04T15:20:00.000Z',
          likedBy: []
        },
        {
          id: 'res_3',
          type: 'pdf',
          title: 'System Design Interview Essentials',
          description: 'Detailed study notes covering distributed systems, load balancing, caching strategies (Redis), CDNs, and database partitioning.',
          fileName: 'system_design_essentials.pdf',
          fileSize: '4.8 MB',
          pageCount: 24,
          downloadCount: 389,
          likes: 120,
          views: 940,
          uploader: {
            name: 'Ashish Kumar',
            username: 'ashish_dev',
            avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Ashish'
          },
          date: '2026-06-03T08:45:00.000Z',
          likedBy: []
        },
        {
          id: 'res_4',
          type: 'youtube',
          title: 'Learn Vite.js in 10 Minutes',
          description: 'A beginner-friendly guide to installing, configuring, and building modern web apps with Vite.js + React.',
          url: 'https://www.youtube.com/watch?v=L8yV5SFiZ5U',
          videoId: 'L8yV5SFiZ5U',
          thumbnail: 'https://img.youtube.com/vi/L8yV5SFiZ5U/mqdefault.jpg',
          likes: 67,
          views: 410,
          uploader: {
            name: 'Ashish Kumar',
            username: 'ashish_dev',
            avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Ashish'
          },
          date: '2026-06-02T14:10:00.000Z',
          likedBy: []
        }
      ];
      setResources(defaultResources);
      localStorage.setItem('resources_db', JSON.stringify(defaultResources));
    }
  }, []);

  const saveToLocal = (newResources) => {
    setResources(newResources);
    localStorage.setItem('resources_db', JSON.stringify(newResources));
  };

  const addPdfResource = (title, description, fileName, fileSize) => {
    if (!user) throw new Error('You must be logged in to share resources.');

    const newResource = {
      id: 'res_' + Date.now(),
      type: 'pdf',
      title,
      description,
      fileName,
      fileSize: fileSize || '1.5 MB',
      pageCount: Math.floor(Math.random() * 15) + 3,
      downloadCount: 0,
      likes: 0,
      views: 1,
      uploader: {
        name: user.name,
        username: user.username,
        avatar: user.avatar
      },
      date: new Date().toISOString(),
      likedBy: []
    };

    const updated = [newResource, ...resources];
    saveToLocal(updated);
    return newResource;
  };

  const addYoutubeResource = (title, description, url) => {
    if (!user) throw new Error('You must be logged in to share resources.');

    // YouTube regex
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (!videoId) {
      throw new Error('Invalid YouTube URL. Please enter a valid YouTube video link.');
    }

    const newResource = {
      id: 'res_' + Date.now(),
      type: 'youtube',
      title,
      description,
      url,
      videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      likes: 0,
      views: 1,
      uploader: {
        name: user.name,
        username: user.username,
        avatar: user.avatar
      },
      date: new Date().toISOString(),
      likedBy: []
    };

    const updated = [newResource, ...resources];
    saveToLocal(updated);
    return newResource;
  };

  const likeResource = (id) => {
    if (!user) return;
    const updated = resources.map(res => {
      if (res.id === id) {
        const likedBy = res.likedBy || [];
        const userIndex = likedBy.indexOf(user.username);
        let likes = res.likes;
        let newLikedBy = [...likedBy];

        if (userIndex === -1) {
          likes += 1;
          newLikedBy.push(user.username);
        } else {
          likes -= 1;
          newLikedBy.splice(userIndex, 1);
        }
        return { ...res, likes, likedBy: newLikedBy };
      }
      return res;
    });
    saveToLocal(updated);
  };

  const incrementViews = (id) => {
    const updated = resources.map(res => {
      if (res.id === id) {
        return { ...res, views: res.views + 1 };
      }
      return res;
    });
    saveToLocal(updated);
  };

  const incrementDownloads = (id) => {
    const updated = resources.map(res => {
      if (res.id === id && res.type === 'pdf') {
        return { ...res, downloadCount: (res.downloadCount || 0) + 1 };
      }
      return res;
    });
    saveToLocal(updated);
  };

  // Autocomplete search suggestions generator
  const getSearchSuggestions = (query) => {
    if (!query || query.trim() === '') {
      setSuggestions([]);
      return;
    }
    const cleanQuery = query.toLowerCase().trim();
    
    // Find unique tags, titles, or authors
    const filtered = [];
    resources.forEach(res => {
      if (res.title.toLowerCase().includes(cleanQuery)) {
        filtered.push({ type: 'Title', text: res.title });
      }
      if (res.uploader.username.toLowerCase().includes(cleanQuery)) {
        filtered.push({ type: 'Author', text: `@${res.uploader.username}` });
      }
    });

    // Deduplicate suggestions and limit to 5
    const unique = [];
    const seen = new Set();
    for (const item of filtered) {
      const key = `${item.type}-${item.text}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
      if (unique.length >= 5) break;
    }
    setSuggestions(unique);
  };

  const deleteResource = (id) => {
    const updated = resources.filter(res => res.id !== id);
    saveToLocal(updated);
  };

  return (
    <ResourceContext.Provider value={{
      resources,
      suggestions,
      addPdfResource,
      addYoutubeResource,
      likeResource,
      incrementViews,
      incrementDownloads,
      getSearchSuggestions,
      setSuggestions,
      deleteResource
    }}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
};
