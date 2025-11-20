
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect will run whenever the loading or user state changes.
    if (!loading) {
      // Once loading is complete, decide where to route the user.
      if (user) {
        router.replace('/jobs');
      } else {
        router.replace('/login');
      }
    }
  }, [loading, user, router]);

  // Always render a loading indicator while the useEffect hook decides the route.
  // This ensures a consistent output on server and client, preventing hydration errors.
  return <div>Loading...</div>;
}
