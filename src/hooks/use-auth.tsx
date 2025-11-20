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
import { useRouter } from 'next/navigation';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const mergedUser = { ...user, ...userData } as User;
          setUser(mergedUser);
          if (pathnameRequiresConsent(window.location.pathname) && !mergedUser.hasConsented) {
             router.push('/consent');
          }
        } else {
           // This case can happen if the user was created in auth but the firestore doc creation failed.
           setUser(user as User);
           if (pathnameRequiresConsent(window.location.pathname)) {
            router.push('/consent');
           }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const pathnameRequiresConsent = (pathname: string) => {
      const protectedRoutes = ['/jobs', '/resumes', '/applications', '/settings', '/admin'];
      return protectedRoutes.some(p => pathname.startsWith(p));
  }

  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string, name: string) => {
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
