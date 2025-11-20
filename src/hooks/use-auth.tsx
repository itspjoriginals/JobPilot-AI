
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
  loading: boolean;
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
const consentRoute = '/consent';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user doc to get consent status
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ ...firebaseUser, ...userDoc.data() } as User);
          } else {
            // User exists in auth, but not in firestore yet (could happen during signup race condition)
            setUser(firebaseUser as User);
          }
        } catch (error) {
          console.error("Failed to get user document:", error);
          setUser(firebaseUser as User); // Fallback to auth user object
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
      return; 
    }

    const isAuthRoute = unprotectedRoutes.includes(pathname);
    const isOnConsentRoute = pathname === consentRoute;

    if (user) {
      const hasConsented = (user as any).hasConsented;
      
      if (hasConsented === false && !isOnConsentRoute) {
        router.push(consentRoute);
      } else if (hasConsented === true && (isAuthRoute || isOnConsentRoute)) {
        router.push('/jobs');
      }
    } else { 
      if (!isAuthRoute && !isOnConsentRoute) {
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
      // Manually set the user state after signup to include the new firestore data
      setUser({ ...firebaseUser, hasConsented: false } as User);

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
  
  if (loading) {
    // Render a simple loading indicator on the server and initial client render
    // to prevent content flash and hydration issues.
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
