"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { parseSessionToken } from "../lib/auth/sessionClient";

const STORAGE_KEY = "divasAuthSession";

const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { user: null, token: null };
    }

    const parsed = JSON.parse(stored);
    const verifiedUser = parseSessionToken(parsed.token);

    if (verifiedUser) {
      return {
        user: { ...verifiedUser, name: parsed.user?.name || verifiedUser.name || "" },
        token: parsed.token,
      };
    }

    window.localStorage.removeItem(STORAGE_KEY);
    return { user: null, token: null };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const session = readStoredSession();
      setUser(session.user);
      setToken(session.token);
      setIsLoading(false);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const login = useCallback((session) => {
    const verifiedUser = parseSessionToken(session.token);
    if (!verifiedUser) {
      return false;
    }

    const nextUser = {
      phone: verifiedUser.phone,
      name: session.user?.name || verifiedUser.name || "",
    };

    setUser(nextUser);
    setToken(session.token);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: session.token, user: nextUser }),
    );
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
