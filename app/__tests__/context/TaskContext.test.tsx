import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { TaskProvider, useTaskContext } from '@/app/context/TaskContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => <TaskProvider>{children}</TaskProvider>;

describe('TaskContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });
    expect(result.current.state.tasks).toBeDefined();
    expect(result.current.state.columns).toBeDefined();
  });

  it('should add a new task', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    act(() => {
      result.current.addTask('Test Task', 'Test Description', 'high');
    });

    const tasks = Object.values(result.current.state.tasks);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.some((task) => task.title === 'Test Task')).toBe(true);
  });

  it('should update a task', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    const taskId = Object.keys(result.current.state.tasks)[0];

    act(() => {
      result.current.updateTask(taskId, { title: 'Updated Title' });
    });

    expect(result.current.state.tasks[taskId].title).toBe('Updated Title');
  });

  it('should delete a task', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    const initialCount = Object.keys(result.current.state.tasks).length;
    const taskId = Object.keys(result.current.state.tasks)[0];

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(Object.keys(result.current.state.tasks).length).toBe(initialCount - 1);
    expect(result.current.state.tasks[taskId]).toBeUndefined();
  });

  it('should move a task to a different column', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    const taskId = Object.keys(result.current.state.tasks)[0];
    const originalTask = result.current.state.tasks[taskId];

    act(() => {
      result.current.moveTask(taskId, originalTask.status, 'done');
    });

    expect(result.current.state.tasks[taskId].status).toBe('done');
  });

  it('should filter tasks by priority', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    act(() => {
      result.current.setFilterPriority('high');
    });

    expect(result.current.state.filterPriority).toBe('high');
  });

  it('should filter tasks by status', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    act(() => {
      result.current.setFilterStatus('todo');
    });

    expect(result.current.state.filterStatus).toBe('todo');
  });

  it('should search tasks', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    act(() => {
      result.current.setSearchQuery('setup');
    });

    expect(result.current.state.searchQuery).toBe('setup');
  });
});
