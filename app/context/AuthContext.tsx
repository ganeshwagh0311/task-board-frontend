'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ActivityLog, ActivityType } from '@/app/types/task';
import { getCurrentUser, setCurrentUser as saveCurrentUser } from '@/app/utils/auth';
import { initializeDemoData } from '@/app/utils/initializeDemo';
import { v4 as uuidv4 } from 'uuid';

const ACTIVITY_LOG_KEY = 'activity-logs';

interface AuthContextType {
  currentUser: User | null;
  activityLogs: ActivityLog[];
  setCurrentUser: (user: User | null) => void;
  addActivityLog: (type: ActivityType, description: string, taskId?: string, metadata?: Record<string, any>) => void;
  clearActivityLogs: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user and activity logs from localStorage on mount
  useEffect(() => {
    // Initialize demo data on first load
    initializeDemoData();

    const user = getCurrentUser();
    setCurrentUserState(user);

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ACTIVITY_LOG_KEY);
      if (saved) {
        try {
          const logs = JSON.parse(saved).map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          }));
          setActivityLogs(logs);
        } catch (error) {
          console.error('Failed to load activity logs:', error);
        }
      }
    }

    setIsLoaded(true);
  }, []);

  // Save activity logs to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(activityLogs));
    }
  }, [activityLogs, isLoaded]);

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    saveCurrentUser(user);

    if (user) {
      addActivityLog('user_login', `${user.name} logged in`, undefined, { email: user.email });
    } else {
      addActivityLog('user_logout', 'User logged out');
    }
  };

  const addActivityLog = (
    type: ActivityType,
    description: string,
    taskId?: string,
    metadata?: Record<string, any>
  ) => {
    if (!currentUser && type !== 'user_signup' && type !== 'user_login') return;

    const log: ActivityLog = {
      id: uuidv4(),
      userId: currentUser?.id || 'anonymous',
      type,
      description,
      taskId,
      timestamp: new Date(),
      metadata,
    };

    setActivityLogs((prev) => [log, ...prev]);
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACTIVITY_LOG_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activityLogs,
        setCurrentUser,
        addActivityLog,
        clearActivityLogs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
