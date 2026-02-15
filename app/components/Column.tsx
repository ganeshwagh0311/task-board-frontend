import React from 'react';
import { TaskCard } from './TaskCard';
import type { Task } from '@/app/types/task';

interface ColumnProps {
  title: string;
  tasks: Task[];
}

export function Column({ title, tasks }: ColumnProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-4 min-w-[300px]">
      <h2 className="font-semibold mb-4">{title}</h2>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
