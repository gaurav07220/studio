
"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Mock user type
interface User {
  email: string;
  points: number;
  achievements: {
    id: string;
    name: string;
    type: 'Certificate' | 'Badge';
  }[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  addPoints: (points: number) => void;
  addAchievement: (achievement: { id: string; name: string; type: 'Certificate' | 'Badge' }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock starting user. In a real app this would come from a database.
const defaultUser: User = {
  email: 'alex.doe@example.com',
  points: 1250,
  achievements: [],
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setUser(null);
  };
  
  const addPoints = (points: number) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      return { ...currentUser, points: currentUser.points + points };
    });
  }

  const addAchievement = (achievement: { id: string; name: string; type: 'Certificate' | 'Badge' }) => {
     setUser(currentUser => {
      if (!currentUser) return null;
      // Avoid adding duplicate achievements
      if (currentUser.achievements.some(a => a.id === achievement.id)) {
        return currentUser;
      }
      return { ...currentUser, achievements: [...currentUser.achievements, achievement] };
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, addPoints, addAchievement }}>
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
