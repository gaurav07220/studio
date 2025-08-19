
"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  onAuthStateChanged,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// User profile data structure
export interface UserProfile {
    name?: string;
    headline?: string;
    summary?: string;
    linkedin?: string;
    portfolio?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<any>;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
            // fetch user profile
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setProfile(userDoc.data() as UserProfile);
            } else {
                // If no profile, create a default one
                 const defaultProfile = { name: user.email?.split('@')[0] || 'User' };
                 await setDoc(doc(db, "users", user.uid), defaultProfile);
                 setProfile(defaultProfile);
            }
        } else {
            setProfile(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const signUp = async (email: string, pass: string) => {
      return createUserWithEmailAndPassword(auth, email, pass);
  }

  const signIn = async (email: string, pass: string) => {
      return signInWithEmailAndPassword(auth, email, pass);
  }

  const signOut = async () => {
      await firebaseSignOut(auth);
  };
  
  const updateProfile = async (profileData: UserProfile) => {
    if (!user) throw new Error("Not authenticated");
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, profileData, { merge: true });
    setProfile(prev => ({...prev, ...profileData}));
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile }}>
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
