import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getAuthStatus } from "./api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    loading: true,
    user: null,
    error: null
  });

  const refreshAuth = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await getAuthStatus();
      setAuthState({
        loading: false,
        user: data.user,
        error: null
      });
    } catch (error) {
      setAuthState({
        loading: false,
        user: null,
        error: error.message
      });
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ ...authState, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
