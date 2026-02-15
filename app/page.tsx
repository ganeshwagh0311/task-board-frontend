'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function Page() {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if authenticated, otherwise to login
    if (currentUser) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">TaskFlow</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
