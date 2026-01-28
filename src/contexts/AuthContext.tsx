import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";

type AppRole = "admin" | "restaurant" | "orphanage";

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
}

interface AuthSession {
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  role: AppRole | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    userType: AppRole,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedSession = localStorage.getItem("auth_session");
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        setSession(session);
        setUser(session.user ?? null);
        if (session.user) {
          fetchUserRole();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error parsing stored session:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserRole = async (token?: string) => {
    try {
      const response = await authAPI.verify();
      setRole(response.data.user.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.signIn(email, password);
      const { user, token } = response.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_session", JSON.stringify({ user }));

      setUser(user);
      setSession({ user });

      // Fetch user role
      await fetchUserRole();

      return { error: null };
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Sign in failed";
      return {
        error: errorMessage,
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    userType: AppRole,
  ) => {
    try {
      const response = await authAPI.signUp(
        email,
        password,
        fullName,
        userType,
      );
      return { error: null };
    } catch (error: unknown) {
      console.error("Sign up error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Sign up failed";
      return {
        error: errorMessage,
      };
    }
  };

  const signOut = async () => {
    try {
      await authAPI.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_session");
      setUser(null);
      setSession(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, role, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
