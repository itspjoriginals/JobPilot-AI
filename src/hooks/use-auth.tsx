'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  onIdTokenChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';

interface User extends FirebaseUser {
  hasConsented?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean; // This will represent the initial auth state check
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, name: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateUserConsent: (uid: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const handleAuthError = (error: any) => {
  if (error.code) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('This email address is already in use by another account.');
      case 'auth/invalid-email':
        throw new Error('The email address is not valid.');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password accounts are not enabled. Please enable it in your Firebase console.');
      case 'auth/weak-password':
        throw new Error('The password is too weak. It must be at least 6 characters long.');
      default:
        throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
  throw error;
};

const unprotectedRoutes = ['/login', '/signup'];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Represents the initial auth check
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef).catch(e => {
            // This can happen if offline, but we can proceed with basic user info
            console.error("Firebase getDoc error:", e);
            return null;
        });

        if (userDoc && userDoc.exists()) {
          setUser({ ...firebaseUser, ...userDoc.data() } as User);
        } else {
          // Fallback if doc doesn't exist yet (e.g., during signup race condition)
          setUser(firebaseUser as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      return; // Don't do anything while loading
    }

    const isUserLoggedIn = !!user;
    const isAuthRoute = unprotectedRoutes.includes(pathname);
    const requiresConsent = user && !user.hasConsented;

    if (isUserLoggedIn) {
        if (requiresConsent) {
            if (pathname !== '/consent') {
                router.push('/consent');
            }
        } else if (isAuthRoute) {
            router.push('/jobs');
        }
    } else { // User is not logged in
        if (!isAuthRoute && pathname !== '/consent') {
             router.push('/login');
        }
    }

  }, [user, loading, pathname, router]);

  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass).catch(handleAuthError);
  };

  const signUp = async (email: string, pass: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
        createdAt: serverTimestamp(),
        hasConsented: false,
      });

      return userCredential;
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const updateUserConsent = async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { hasConsented: true });
    setUser(prevUser => prevUser ? { ...prevUser, hasConsented: true } : null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserConsent,
  };
  
  // Render children only after initial auth check is complete
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
