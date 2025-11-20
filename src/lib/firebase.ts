// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";

// TODO: Add your Firebase project configuration here
const firebaseConfig = {
  apiKey: "AIzaSyCeu5_r53uiYRQTbyP9C00qXjOU--n3yZY",
  authDomain: "jobpilot-ai-c18f7.firebaseapp.com",
  projectId: "jobpilot-ai-c18f7",
  storageBucket: "jobpilot-ai-c18f7.firebasestorage.app",
  messagingSenderId: "363879421956",
  appId: "1:363879421956:web:38192e34f523649b643d51",
  measurementId: "G-1V1WRJFHM1"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Initialize Firestore with offline persistence.
// The `memoryLocalCache` is a fallback for environments where IndexedDB is not available.
const db = initializeFirestore(app, {
  cache: memoryLocalCache(),
});

export { app, auth, db };
