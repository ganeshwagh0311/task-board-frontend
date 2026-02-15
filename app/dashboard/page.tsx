'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useTaskContext } from '@/app/context/TaskContext';
import { Navbar } from '@/app/components/Navbar';
import { TaskBoard } from '@/app/components/TaskBoard';
import { FilterBar } from '@/app/components/FilterBar';
import { Modal } from '@/app/components/Modal';
import { TaskForm } from '@/app/components/TaskForm';
import { ActivityLog } from '@/app/components/ActivityLog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { state } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ✅ Redirect safely using useEffect
  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
    } else {
      setIsCheckingAuth(false);
    }
  }, [currentUser, router]);

  // ⛔ While checking auth, don't render UI
  if (isCheckingAuth) {
    return null;
  }

  // Calculate statistics
  const totalTasks = Object.keys(state.tasks).length;
  const completedTasks = Object.values(state.tasks).filter((t) => t.status === 'done').length;
  const inProgressTasks = Object.values(state.tasks).filter((t) => t.status === 'in-progress').length;
  const todoTasks = Object.values(state.tasks).filter((t) => t.status === 'todo').length;

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{' '}
            <span className="text-blue-600">{currentUser?.name}</span>!
          </h1>
          <p className="text-gray-600">
            Here's your task overview and progress
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {totalTasks}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All your tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                To Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {todoTasks}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tasks pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inProgressTasks}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Currently working on
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Done
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedTasks}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {completionPercentage}% completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tasks" className="mb-8">
          <TabsList>
            <TabsTrigger value="tasks">Task Board</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <FilterBar onAddTaskClick={() => setIsModalOpen(true)} />
            <div className="overflow-x-auto">
              <TaskBoard />
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLog limit={10} />
          </TabsContent>
        </Tabs>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Task"
        >
          <TaskForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      </main>
    </div>
  );
}
