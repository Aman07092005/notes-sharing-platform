import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check logged in user on page load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/me"
        );

        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Register
  const signUp = async (username, email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  // Login
  const login = async (email, password) => {
    try {
    await axios.post(
    "http://localhost:5000/api/auth/login",
   {
    email,
    password,
   },
   {
    withCredentials: true,
   }
  );

  const userResponse = await axios.get(
  "http://localhost:5000/api/users/me",
  {
    withCredentials: true,
  }
  );

  setUser(userResponse.data);
  return userResponse.data;
} catch (error) {
      throw new Error(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout"
      );
    } catch (error) {
      console.error(error);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};