'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Trash2,
  Plus,
  Edit,
  LogIn,
  LogOut,
  UserPlus,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { ActivityType } from '@/app/types/task';

interface ActivityLogProps {
  limit?: number;
  showClearButton?: boolean;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'task_created':
      return <Plus className="w-4 h-4 text-blue-600" />;
    case 'task_updated':
      return <Edit className="w-4 h-4 text-yellow-600" />;
    case 'task_deleted':
      return <Trash2 className="w-4 h-4 text-red-600" />;
    case 'task_moved':
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case 'user_login':
      return <LogIn className="w-4 h-4 text-indigo-600" />;
    case 'user_logout':
      return <LogOut className="w-4 h-4 text-gray-600" />;
    case 'user_signup':
      return <UserPlus className="w-4 h-4 text-green-600" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-600" />;
  }
};

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case 'task_created':
      return 'bg-blue-50';
    case 'task_updated':
      return 'bg-yellow-50';
    case 'task_deleted':
      return 'bg-red-50';
    case 'task_moved':
      return 'bg-green-50';
    case 'user_login':
      return 'bg-indigo-50';
    case 'user_logout':
      return 'bg-gray-50';
    case 'user_signup':
      return 'bg-green-50';
    default:
      return 'bg-gray-50';
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(date).toLocaleDateString();
};

export function ActivityLog({ limit, showClearButton = false }: ActivityLogProps) {
  const { activityLogs, clearActivityLogs } = useAuth();

  const displayLogs = limit ? activityLogs.slice(0, limit) : activityLogs;

  if (displayLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>No activities yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-600 text-center">Activities will appear here as you interact with tasks</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>{displayLogs.length} activities</CardDescription>
        </div>
        {showClearButton && displayLogs.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearActivityLogs}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayLogs.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 p-3 rounded-lg ${getActivityColor(activity.type)} border border-gray-200`}
            >
              <div className="mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
