'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

const PUBLIC_ADMIN_ROUTES = ['/admin/login'];

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isPublic = PUBLIC_ADMIN_ROUTES.includes(pathname || '');
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isAdminLoggedIn') === 'true';

    if (!isPublic && !isLoggedIn) {
      router.replace('/admin/login');
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready && !PUBLIC_ADMIN_ROUTES.includes(pathname || '')) {
    return null;
  }

  return <>{children}</>;
}
