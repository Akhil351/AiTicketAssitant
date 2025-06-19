import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("token");
    if (token) {
      // Parse JWT to get user info (simple decode)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ _id: payload._id, role: payload.role, token });
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;

      // Parse JWT to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userData = { _id: payload._id, role: payload.role, token };

      localStorage.setItem("token", token);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const signup = async (email, password, skills = []) => {
    try {
      const response = await api.post("/auth/signup", {
        email,
        password,
        skills,
      });
      const { token } = response.data;

      // Parse JWT to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userData = { _id: payload._id, role: payload.role, token };

      localStorage.setItem("token", token);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Signup failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Continue with logout even if API call fails
    }

    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
