'use client';

import React from 'react';
import { Trash2, Calendar } from 'lucide-react';
import type { Task } from '@/app/types/task';
import { useTaskContext } from '@/app/context/TaskContext';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { dispatch } = useTaskContext();

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{task.title}</h3>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-2">
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <div className="flex items-center text-xs text-gray-500 gap-1">
          <Calendar size={14} />
         {task.dueDate && new Date(task.dueDate).toLocaleDateString()}

        </div>
      )}
    </div>
  );
}
