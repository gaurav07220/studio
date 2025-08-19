
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
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  uploadProfilePicture: (file: File, onProgress: (progress: number) => void) => Promise<string>;
  updateLastActivity: (page: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleWelcomeMessages = useCallback((profileData: UserProfile | null) => {
    if (!profileData) return;

    const now = new Date();
    const lastActivityDate = profileData.lastActivity?.timestamp?.toDate();

    // Welcome back message
    if (lastActivityDate) {
        const hoursDiff = (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60);
        // If last activity was between 10 mins and 24 hours ago
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
    
    // Profile completion message
    if (!profileData.headline || !profileData.summary) {
        // Add a delay to avoid showing both toasts at once
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


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const profileData = userDoc.data() as UserProfile;
                setProfile(profileData);
                handleWelcomeMessages(profileData);
            } else {
                 const defaultProfile: UserProfile = { 
                    name: user.email?.split('@')[0] || 'User',
                    photoURL: user.photoURL || ''
                 };
                 await setDoc(userDocRef, defaultProfile);
                 setProfile(defaultProfile);
                 handleWelcomeMessages(defaultProfile);
            }
        } else {
            setProfile(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [handleWelcomeMessages]);


  const signUp = async (email: string, pass: string) => {
      return createUserWithEmailAndPassword(auth, email, pass);
  }

  const signIn = async (email: string, pass: string) => {
      return signInWithEmailAndPassword(auth, email, pass);
  }

  const signOut = async () => {
      await firebaseSignOut(auth);
  };
  
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error("Not authenticated");
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, profileData, { merge: true });
    setProfile(prev => ({...(prev || {}), ...profileData}));
  }

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
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile, uploadProfilePicture, updateLastActivity }}>
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
