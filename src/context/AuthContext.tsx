"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { logout } from "@/lib/auth";

type AuthContextType = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage immediately — no effect needed
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem("sb_user");
    try {
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api<{ success: boolean; data: { user: AuthUser } }>("/api/auth/me")
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("sb_user", JSON.stringify(res.data.user));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const signOut = async () => {
    await logout().catch(() => {});
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
