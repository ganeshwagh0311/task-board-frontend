'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Navbar } from '@/app/components/Navbar';
import { ActivityLog } from '@/app/components/ActivityLog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ActivityPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  // Redirect to login if not authenticated
  if (!currentUser) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="grid gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Log</h1>
            <p className="text-gray-600">
              Track all your activities including task creation, updates, and account actions
            </p>
          </div>

          <ActivityLog showClearButton={true} />
        </div>
      </main>
    </div>
  );
}
