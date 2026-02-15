'use client';

import React from 'react';
import { Column } from './Column';
import { useTaskContext } from '@/app/context/TaskContext';

export function TaskBoard() {
  const { state } = useTaskContext();

  const tasks = Object.values(state.tasks);

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div className="flex gap-6 min-w-max">
      <Column title="To Do" tasks={todoTasks} />
      <Column title="In Progress" tasks={inProgressTasks} />
      <Column title="Done" tasks={doneTasks} />
    </div>
  );
}
