"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword as firebaseUpdatePassword,
  deleteUser as firebaseDeleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useToast } from "./use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";


// User profile data structure
export interface UserProfile {
  name?: string;
  headline?: string;
  summary?: string;
  linkedin?: string;
  portfolio?: string;
  photoURL?: string;
  plan?: 'free' | 'pro';
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email: boolean;
    push: boolean;
  };
  lastActivity?: {
    page: string;
    timestamp: Timestamp;
  };
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<any>;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
  reauthenticate: (password: string) => Promise<void>;
  updatePassword: (currentPass: string, newPass: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  uploadProfilePicture: (file: File, onProgress: (progress: number) => void) => Promise<string>;
  updateLastActivity: (page: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const applyTheme = (theme?: 'light' | 'dark' | 'system') => {
  if (typeof window === 'undefined') return;
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  let newTheme = theme;
  if (!newTheme || newTheme === 'system') {
    newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  root.classList.add(newTheme);
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleWelcomeMessages = useCallback((profileData: UserProfile | null) => {
    if (!profileData) return;

    const now = new Date();
    const lastActivityDate = profileData.lastActivity?.timestamp?.toDate();

    if (lastActivityDate) {
      const hoursDiff = (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60);
      if (hoursDiff > 0.16 && hoursDiff < 24) {
        toast({
          title: "Welcome back!",
          description: `You were last working on the ${profileData.lastActivity?.page.replace('/', '')} page.`,
          action: (
            <Button asChild variant="secondary" size="sm">
              <Link href={profileData.lastActivity?.page || '/'}>Jump back in</Link>
            </Button>
          )
        });
      }
    }

    if (!profileData.headline || !profileData.summary) {
      setTimeout(() => {
        toast({
          title: "Complete Your Profile",
          description: "A complete profile helps you get the most out of CareerAI.",
          action: (
            <Button asChild variant="secondary" size="sm">
              <Link href="/profile">Go to Profile</Link>
            </Button>
          )
        });
      }, 3000);
    }

  }, [toast]);

  const fetchProfile = useCallback(async (user: User) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const profileData = userDoc.data() as UserProfile;
      setProfile(profileData);
      applyTheme(profileData.theme);
      return profileData;
    }
    return null;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profileData = await fetchProfile(user);
        if (!profileData) {
          const defaultProfile: UserProfile = {
            name: user.email?.split('@')[0] || 'User',
            photoURL: user.photoURL || '',
            plan: 'free',
            theme: 'system',
            notifications: { email: true, push: false },
          };
          await setDoc(doc(db, "users", user.uid), defaultProfile);
          setProfile(defaultProfile);
          applyTheme(defaultProfile.theme);
        }
      } else {
        setProfile(null);
        applyTheme('system'); // Reset to system theme on sign out
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile?.theme) {
      applyTheme(profile.theme);
    }
  }, [profile?.theme]);


  const signUp = async (email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const userDocRef = doc(db, "users", cred.user.uid);
    const defaultProfile: UserProfile = {
      name: cred.user.email?.split('@')[0] || 'User',
      photoURL: cred.user.photoURL || '',
      plan: 'free',
      theme: 'system',
      notifications: { email: true, push: false },
    };
    await setDoc(userDocRef, defaultProfile);
    setProfile(defaultProfile);
    return cred;
  }

  const signIn = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const profileData = await fetchProfile(cred.user);
    if (profileData) {
      handleWelcomeMessages(profileData);
    }
    return cred;
  }

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error("Not authenticated");
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, profileData, { merge: true });
    setProfile(prev => ({ ...(prev || {}), ...profileData } as UserProfile));
  }

  const reauthenticate = async (password: string) => {
    if (!user || !user.email) throw new Error("User not found.");
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  };

  const updatePassword = async (currentPass: string, newPass: string) => {
    if (!user) throw new Error("Not authenticated.");
    await reauthenticate(currentPass);
    await firebaseUpdatePassword(user, newPass);
  }

  const deleteAccount = async () => {
    if (!user) throw new Error("Not authenticated.");
    await firebaseDeleteUser(user);
  };

  const uploadProfilePicture = (file: File, onProgress: (progress: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!user) return reject("Not authenticated");

      const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile({ photoURL: downloadURL });
          resolve(downloadURL);
        }
      );
    });
  };

  const updateLastActivity = async (page: string) => {
    if (!user) return;
    const activity = {
      page,
      timestamp: serverTimestamp() as Timestamp
    };
    await updateProfile({ lastActivity: activity });
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, reauthenticate, updatePassword, deleteAccount, updateProfile, uploadProfilePicture, updateLastActivity, refreshProfile }}>
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
