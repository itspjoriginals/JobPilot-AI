'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// This is a client-side component that should be mounted at the root of the app.
// It listens for custom 'permission-error' events and throws them, which Next.js
// will catch and display in its development error overlay. This provides a much
// better debugging experience for Firestore Security Rules.
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Throw the error so that the Next.js error overlay picks it up.
      // This provides immediate, detailed feedback in the browser during development.
      throw error;
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // This component does not render anything to the DOM.
  return null;
}
