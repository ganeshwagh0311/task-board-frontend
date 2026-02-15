'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Navbar } from '@/app/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser, clearActivityLogs } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Redirect to login if not authenticated
  if (!currentUser) {
    router.push('/auth/login');
    return null;
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      return;
    }

    const updatedUser = {
      ...currentUser,
      name: name.trim(),
      updatedAt: new Date(),
    };

    setCurrentUser(updatedUser);
    setEditMode(false);
    setSuccessMessage('Profile updated successfully!');

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleDeleteAccount = async () => {
    // In a real app, this would call an API to delete the user
    setCurrentUser(null);
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {successMessage && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <p className="mt-1 px-3 py-2 bg-gray-100 rounded-lg text-gray-600 text-sm">
                    {currentUser.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!editMode}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  {!editMode ? (
                    <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                  ) : (
                    <>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Manage your activity history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Clear all your activity logs. This action cannot be undone.
              </p>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={clearActivityLogs}
              >
                Clear Activity Log
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              {!showDeleteConfirm ? (
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900">Delete Account?</h3>
                      <p className="text-sm text-red-700 mt-1">
                        This will permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                    >
                      Yes, Delete My Account
                    </Button>
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About TaskFlow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Version:</strong> 1.0.0
                </p>
                <p>
                  <strong>Last Updated:</strong> February 2025
                </p>
                <p className="pt-2">
                  TaskFlow is a modern task management application designed to help you organize and track your work
                  efficiently.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
