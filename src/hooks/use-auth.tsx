
"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";

// Mock user type
interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Simulate a logged-in user for demonstration purposes
  const [user, setUser] = useState<User | null>({ email: 'user@example.com' });
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
