'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
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
        throw new Error(error.message);
    }
  }
  throw error;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const mergedUser = { ...user, ...userData } as User;
          setUser(mergedUser);
          if (pathnameRequiresConsent(pathname) && !mergedUser.hasConsented) {
             router.push('/consent');
          }
        } else {
           setUser(user as User);
           if (pathnameRequiresConsent(pathname)) {
            router.push('/consent');
           }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const pathnameRequiresConsent = (path: string) => {
      const protectedRoutes = ['/jobs', '/resumes', '/applications', '/settings', '/admin'];
      return protectedRoutes.some(p => path.startsWith(p));
  }

  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass).catch(handleAuthError);
  };

  const signUp = async (email: string, pass: string, name: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const firebaseUser = userCredential.user;

        if (firebaseUser) {
            await updateProfile(firebaseUser, { displayName: name });
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: name,
                createdAt: serverTimestamp(),
                hasConsented: false,
            });
        }
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

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
