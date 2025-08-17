
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "careerai-9ab6z",
  appId: "1:200105545013:web:bf38ba9bea4e57d4fd107c",
  storageBucket: "careerai-9ab6z.firebasestorage.app",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "careerai-9ab6z.firebaseapp.com",
  messagingSenderId: "200105545013",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
