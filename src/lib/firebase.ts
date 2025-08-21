
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
let app;
const apps = getApps();
if (apps.length > 0) {
  app = apps[0];
} else {
  app = initializeApp(firebaseConfig);
}

const auth = app ? getAuth(app) : undefined;
const db = app ? getFirestore(app) : undefined;
const storage = app ? getStorage(app) : undefined;

export { app, auth, db, storage };
