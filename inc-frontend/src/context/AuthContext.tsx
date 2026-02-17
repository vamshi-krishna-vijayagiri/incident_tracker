import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../utils/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    
    if (storedIsAuthenticated === "true" && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
    setLoading(false);
  }, []);

  const login = async (usernameInput: string, password: string) => {
    try {
      const response = await apiClient.post<{ success: boolean; username: string }>(
        "/auth/login",
        { username: usernameInput, password }
      );

      if (response.data.success) {
        setIsAuthenticated(true);
        setUsername(response.data.username);
        // Persist to localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", response.data.username);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    // Clear localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
  };

  const value: AuthContextValue = {
    isAuthenticated,
    username,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

