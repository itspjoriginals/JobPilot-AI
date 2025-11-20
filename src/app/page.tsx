
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait until loading is complete
    }

    if (user) {
      if (user.hasConsented) {
        router.replace('/jobs');
      } else {
        router.replace('/consent');
      }
    } else {
      router.replace('/login');
    }
  }, [loading, user, router]);

  // Render a loading state to prevent screen flicker and hydration errors
  return (
    <div className="flex h-screen items-center justify-center">
      <div>Loading...</div>
    </div>
  );
}
