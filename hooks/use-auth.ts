"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  // Fetch user profile on mount to check auth status
  useEffect(() => {
    console.log("AuthProvider mounted, checking user session...");
    // Add timeout to avoid infinite loading
    const timeoutId = setTimeout(() => {
      console.warn("Auth loading timeout reached, forcing loading false");
      setLoading(false);
    }, 10000); // 10 seconds timeout

    refreshUser()
      .catch((err) => {
        console.error("refreshUser failed:", err);
        setError(err);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching user profile...");
      const response = await apiClient.get("/profile");
      console.log("Profile response:", response);
      if (response && response.data) {
        setUser(response.data);
        console.log("User profile fetched:", response.data);
      } else {
        console.error("Profile response missing data");
        setUser(null);
        setError(new Error("Profile response missing data"));
      }
    } catch (err: any) {
      console.error("Failed to fetch user profile:", err);
      setUser(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Logging in user...");
      const response = await apiClient.post("/login", { email, password });
      // Assuming token is set in cookies or localStorage by apiClient interceptor
      await refreshUser();
      router.push("/dashboard");
      console.log("Login successful");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Logging out user...");
    // Clear user and token
    setUser(null);
    // Assuming apiClient or backend clears token on this call
    apiClient.get("/logout").catch((err) => {
      console.error("Logout error:", err);
    });
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
