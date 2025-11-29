import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from "firebase/analytics";

// HARDCODED CONFIGURATION
// Used to prevent startup crashes in preview environments where .env variables fail to load.
const firebaseConfig = {
  apiKey: "AIzaSyBAfxXlPDPMGTLHZGR1l_wQpercV8f9eIc",
  authDomain: "magicmomentsai.firebaseapp.com",
  projectId: "magicmomentsai",
  storageBucket: "magicmomentsai.firebasestorage.app",
  messagingSenderId: "952652085780",
  appId: "1:952652085780:web:51029d041fdf7179eb8501",
  measurementId: "G-B4HZ8LMD1N"
};

// Initialize Firebase
// We wrap this in a try-catch to ensure the file doesn't halt execution if something is weird,
// though hardcoding usually fixes the "Missing App configuration" error.
let app;
let analytics;
let auth;
let db;
let storage;
let functions;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
} catch (e) {
  console.error("Firebase Initialization Error:", e);
}

// Export services
export { auth, db, storage, functions, GoogleAuthProvider };
export default app;