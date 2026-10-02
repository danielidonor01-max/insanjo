import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "loading" until a stored token has been checked against the backend.
  const [status, setStatus] = useState(() => (auth.getToken() ? "loading" : "anonymous"));

  useEffect(() => {
    if (status !== "loading") return;

    let cancelled = false;
    auth
      .fetchCurrentUser()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus("authenticated");
      })
      .catch(() => {
        if (cancelled) return;
        auth.logout();
        setStatus("anonymous");
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  const signIn = useCallback((nextUser) => {
    if (nextUser) {
      setUser(nextUser);
      setStatus("authenticated");
    }
  }, []);

  const login = useCallback(
    async (identifier, password) => {
      const me = await auth.login(identifier, password);
      signIn(me);
      return me;
    },
    [signIn]
  );

  const signup = useCallback(
    async (payload) => {
      const me = await auth.signup(payload);
      signIn(me);
      return me;
    },
    [signIn]
  );

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      isDemo: auth.isDemoAuth,
      login,
      signup,
      logout,
    }),
    [user, status, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider.");
  }

  return context;
}
