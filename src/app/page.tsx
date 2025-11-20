'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/jobs');
      } else {
        router.replace('/login');
      }
    }
  }, [router, user, loading]);

  // You can show a loading spinner here while checking auth state
  return <div>Loading...</div>;
}
