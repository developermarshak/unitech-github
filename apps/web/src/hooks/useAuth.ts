import { useState, useEffect, useCallback } from "react";
import { setAccessToken as setApiAccessToken } from "@repo/api-client";

interface UseAuthReturn {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

/**
 * Centralised authentication hook.
 *
 * Persists the JWT in localStorage, it's not secure, but it's ok for a demo.
 * In a real app, I would use a cookie and pair access token with a refresh token.
 */
export const useAuth = (): UseAuthReturn => {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem("accessToken");
  });

  // Keep api-client up to date whenever token changes
  useEffect(() => {
    setApiAccessToken(token);
  }, [token]);

  setApiAccessToken(token);

  const setToken = useCallback((newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    setTokenState(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setTokenState(null);
  }, []);

  return { token, setToken, logout };
};
