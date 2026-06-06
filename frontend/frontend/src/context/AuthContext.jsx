import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's an active session in localStorage
    const savedSession = localStorage.getItem('active_session') || sessionStorage.getItem('active_session');
    if (savedSession) {
      try {
        const parsedUser = JSON.parse(savedSession);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error loading session', e);
      }
    }
    
    // Seed initial users list if not exists
    const existingUsers = localStorage.getItem('users_db');
    if (!existingUsers) {
      const defaultUsers = [
        {
          name: 'Jane Doe',
          username: 'janedoe',
          email: 'demo@example.com',
          password: 'Password123!',
          avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Jane'
        },
        {
          name: 'Ashish Kumar',
          username: 'ashish_dev',
          email: 'ashish@example.com',
          password: 'Password123!',
          avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Ashish'
        }
      ];
      localStorage.setItem('users_db', JSON.stringify(defaultUsers));
    }
    setLoading(false);
  }, []);

  const signUp = (name, username, email, password) => {
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    const usernameExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());

    if (emailExists) {
      throw new Error('Email address already registered.');
    }
    if (usernameExists) {
      throw new Error('Username already taken.');
    }

    const newUser = {
      name,
      username,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${username}`
    };

    users.push(newUser);
    localStorage.setItem('users_db', JSON.stringify(users));
    return true;
  };

  const login = (identifier, password, rememberMe) => {
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    
    const foundUser = users.find(
      u => (u.email.toLowerCase() === identifier.toLowerCase() || 
            u.username.toLowerCase() === identifier.toLowerCase()) && 
           u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email/username or password.');
    }

    const sessionData = {
      name: foundUser.name,
      username: foundUser.username,
      email: foundUser.email,
      avatar: foundUser.avatar
    };

    setUser(sessionData);

    if (rememberMe) {
      localStorage.setItem('active_session', JSON.stringify(sessionData));
    } else {
      sessionStorage.setItem('active_session', JSON.stringify(sessionData));
    }

    return sessionData;
  };

  const logout = () => {
    localStorage.removeItem('active_session');
    sessionStorage.removeItem('active_session');
    setUser(null);
  };

  const updateProfile = (name, avatar) => {
    if (!user) return;

    const updatedUser = { ...user, name, avatar };
    setUser(updatedUser);

    // Update session storage
    if (localStorage.getItem('active_session')) {
      localStorage.setItem('active_session', JSON.stringify(updatedUser));
    }
    if (sessionStorage.getItem('active_session')) {
      sessionStorage.setItem('active_session', JSON.stringify(updatedUser));
    }

    // Update in user database
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    const index = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (index !== -1) {
      users[index] = { ...users[index], name, avatar };
      localStorage.setItem('users_db', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
