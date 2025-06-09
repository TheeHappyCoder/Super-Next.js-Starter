'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LoadingIndicator from './loading-indicator';
import { SiteHeader } from './site-header';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
        if (pathname === '/login') {
          router.replace('/');
        }
      } else {
        setIsAuth(false);
        if (pathname !== '/login') {
          router.replace('/login');
        }
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  // Show loading while checking auth state
  if (checkingAuth) {
    return <LoadingIndicator contained={false} />;
  }

  // Prevent flashing header + content during redirect
  if (isAuth && pathname === '/login') {
    return <LoadingIndicator contained={false} />;
  }

  if (!isAuth && pathname !== '/login') {
    return <LoadingIndicator contained={false} />;
  }

  return (
    <>
      {isAuth && <SiteHeader />}
      {children}
    </>
  );
}
