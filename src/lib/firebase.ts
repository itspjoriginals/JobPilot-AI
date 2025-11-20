// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// TODO: Add your Firebase project configuration here
const firebaseConfig = {
  apiKey: "AIzaSyBcKgcrJ2WCobxZNow77nJ4BPxIpmmDMg8",
  authDomain: "named-icon-459805-j6.firebaseapp.com",
  projectId: "named-icon-459805-j6",
  storageBucket: "named-icon-459805-j6.firebasestorage.app",
  messagingSenderId: "511638271294",
  appId: "1:511638271294:web:aec8f7f1e7af3cfedf286f",
  measurementId: "G-XD6Q9EL571"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
try {
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a time.
          console.warn('Firestore persistence failed: multiple tabs open.');
        } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          console.warn('Firestore persistence not available in this browser.');
        }
      });
} catch (error) {
    console.error("Firebase persistence error:", error);
}


export { app, auth, db };