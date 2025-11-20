
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  onIdTokenChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


interface User extends FirebaseUser {
  hasConsented?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, name: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithLinkedIn: () => Promise<any>;
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
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password.');
      case 'auth/popup-closed-by-user':
        throw new Error('Sign-in process was cancelled.');
      case 'auth/account-exists-with-different-credential':
        throw new Error('An account already exists with the same email address but different sign-in credentials.');
      case 'auth/auth-domain-config-required':
         throw new Error('Authentication domain is not configured. Please check your Firebase project settings.');
      case 'auth/cancelled-popup-request':
         return; // Do nothing, user cancelled.
      default:
        throw new Error(error.message || 'An unexpected authentication error occurred.');
    }
  }
  throw error;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        let userData;
        if (!userDoc.exists()) {
          const newUserPayload = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            createdAt: serverTimestamp(),
            hasConsented: false,
          };
          
          setDoc(userDocRef, newUserPayload, { merge: true }).catch((serverError) => {
              const permissionError = new FirestorePermissionError({
                  path: userDocRef.path,
                  operation: 'create',
                  requestResourceData: newUserPayload,
              }, serverError);
              errorEmitter.emit('permission-error', permissionError);
          });
          userData = newUserPayload;
        } else {
          userData = userDoc.data();
        }
        
        setUser({ ...firebaseUser, ...userData } as User);

      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass).catch(handleAuthError);
  };

  const signUp = async (email: string, pass:string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, { displayName: name });
      // The onIdTokenChanged listener will handle creating the Firestore document.
      return userCredential;
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signInWithLinkedIn = async () => {
    try {
      const provider = new OAuthProvider('linkedin.com');
      return await signInWithPopup(auth, provider);
    } catch (error) {
      handleAuthError(error);
    }
  };


  const signOut = () => {
    return firebaseSignOut(auth).then(() => {
        router.push('/login');
    });
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
    signInWithGoogle,
    signInWithLinkedIn,
    signOut,
    updateUserConsent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
