import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError, errorMessage } from "../lib/api";

export type Role = "admin" | "customer";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  /** True until the session has been checked with the server. */
  loading: boolean;
  /** Set when the API or database is unreachable. */
  dbError: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: RegisterInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<User, "firstName" | "lastName" | "phone">>) => Promise<AuthResult>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type SessionResponse = { user: User | null };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    try {
      const data = await api<SessionResponse>("/api/auth/session");
      setUser(data.user);
      setDbError(null);
    } catch (err) {
      // 503 means the deployment has no database configured; anything else is
      // treated as "not signed in" but still surfaced so failures aren't silent.
      setUser(null);
      setDbError(
        err instanceof ApiError && err.status === 401
          ? null
          : errorMessage(err, "Unable to reach the server.")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const cleaned = email.trim();
      if (!cleaned || !password) {
        return { ok: false, error: "Enter your email and password." };
      }
      try {
        const data = await api<{ user: User }>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: cleaned, password }),
        });
        setUser(data.user);
        setDbError(null);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: errorMessage(err, "Unable to sign in.") };
      }
    },
    []
  );

  const register = useCallback(async (data: RegisterInput): Promise<AuthResult> => {
    try {
      const res = await api<{ user: User }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setUser(res.user);
      setDbError(null);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: errorMessage(err, "Unable to create the account.") };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
      /* the cookie may already be gone */
    }
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<User, "firstName" | "lastName" | "phone">>): Promise<AuthResult> => {
      try {
        const res = await api<{ user: User }>("/api/profile", {
          method: "PATCH",
          body: JSON.stringify(patch),
        });
        setUser(res.user);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: errorMessage(err, "Unable to save your changes.") };
      }
    },
    []
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      dbError,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      updateProfile,
      refresh: loadSession,
    }),
    [user, loading, dbError, login, register, logout, updateProfile, loadSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
