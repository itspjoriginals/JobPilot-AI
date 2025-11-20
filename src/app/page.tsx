'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn] = useLocalStorage('isLoggedIn', false);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/jobs');
    } else {
      router.replace('/login');
    }
  }, [router, isLoggedIn]);

  return null;
}
