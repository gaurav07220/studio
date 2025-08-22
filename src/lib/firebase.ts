

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "careerai-9ab6z",
  "appId": "1:200105545013:web:bf38ba9bea4e57d4fd107c",
  "storageBucket": "careerai-9ab6z.appspot.com",
  "apiKey": "AIzaSyDHsdmiyMFgViTtc-tJYdCA-VrXewNWSZM",
  "authDomain": "careerai-9ab6z.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "200105545013"
};

// Initialize Firebase
const apps = getApps();
const app = apps?.length ? apps?.[0] : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };