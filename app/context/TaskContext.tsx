'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskStatus, TaskBoardState, TaskAction, TaskPriority } from '@/app/types/task';

const STORAGE_KEY = 'taskboard-state';

const initialState: TaskBoardState = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Setup project',
      description: 'Initialize the project structure',
      status: 'todo',
      priority: 'high',
      createdAt: new Date(),
    },
    'task-2': {
      id: 'task-2',
      title: 'Create components',
      description: 'Build React components for the board',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date(),
    },
    'task-3': {
      id: 'task-3',
      title: 'Add styling',
      description: 'Style components with Tailwind CSS',
      status: 'done',
      priority: 'medium',
      createdAt: new Date(),
    },
  },
  columns: {
    todo: { id: 'todo', title: 'To Do', taskIds: ['task-1'] },
    'in-progress': { id: 'in-progress', title: 'In Progress', taskIds: ['task-2'] },
    done: { id: 'done', title: 'Done', taskIds: ['task-3'] },
  },
  searchQuery: '',
  filterPriority: 'all',
  filterStatus: 'all',
};

function taskReducer(state: TaskBoardState, action: TaskAction): TaskBoardState {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask = action.payload;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [newTask.id]: newTask,
        },
        columns: {
          ...state.columns,
          [newTask.status]: {
            ...state.columns[newTask.status],
            taskIds: [...state.columns[newTask.status].taskIds, newTask.id],
          },
        },
      };
    }

    case 'UPDATE_TASK': {
      const updatedTask = action.payload;
      const oldTask = state.tasks[updatedTask.id];

      if (oldTask.status !== updatedTask.status) {
        // Task moved to a different column
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [updatedTask.id]: updatedTask,
          },
          columns: {
            ...state.columns,
            [oldTask.status]: {
              ...state.columns[oldTask.status],
              taskIds: state.columns[oldTask.status].taskIds.filter((id) => id !== updatedTask.id),
            },
            [updatedTask.status]: {
              ...state.columns[updatedTask.status],
              taskIds: [...state.columns[updatedTask.status].taskIds, updatedTask.id],
            },
          },
        };
      }

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [updatedTask.id]: updatedTask,
        },
      };
    }

    case 'DELETE_TASK': {
      const taskId = action.payload;
      const task = state.tasks[taskId];

      const newTasks = { ...state.tasks };
      delete newTasks[taskId];

      return {
        ...state,
        tasks: newTasks,
        columns: {
          ...state.columns,
          [task.status]: {
            ...state.columns[task.status],
            taskIds: state.columns[task.status].taskIds.filter((id) => id !== taskId),
          },
        },
      };
    }

    case 'MOVE_TASK': {
      const { taskId, sourceStatus, destStatus } = action.payload;
      const task = state.tasks[taskId];

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...task,
            status: destStatus,
          },
        },
        columns: {
          ...state.columns,
          [sourceStatus]: {
            ...state.columns[sourceStatus],
            taskIds: state.columns[sourceStatus].taskIds.filter((id) => id !== taskId),
          },
          [destStatus]: {
            ...state.columns[destStatus],
            taskIds: [...state.columns[destStatus].taskIds, taskId],
          },
        },
      };
    }

    case 'REORDER_TASKS': {
      const { status, taskIds } = action.payload;
      return {
        ...state,
        columns: {
          ...state.columns,
          [status]: {
            ...state.columns[status],
            taskIds,
          },
        },
      };
    }

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };

    case 'SET_FILTER_PRIORITY':
      return {
        ...state,
        filterPriority: action.payload,
      };

    case 'SET_FILTER_STATUS':
      return {
        ...state,
        filterStatus: action.payload,
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

interface TaskContextType {
  state: TaskBoardState;
  dispatch: React.Dispatch<TaskAction>;
  addTask: (title: string, description: string, priority: TaskPriority, dueDate?: Date) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, sourceStatus: TaskStatus, destStatus: TaskStatus) => void;
  reorderTasks: (status: TaskStatus, taskIds: string[]) => void;
  setSearchQuery: (query: string) => void;
  setFilterPriority: (priority: TaskPriority | 'all') => void;
  setFilterStatus: (status: TaskStatus | 'all') => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsedState = JSON.parse(saved);
          // Convert date strings back to Date objects
          const convertedState = {
            ...parsedState,
            tasks: Object.entries(parsedState.tasks).reduce((acc: Record<string, Task>, [key, task]: [string, any]) => {
              acc[key] = {
                ...task,
                createdAt: new Date(task.createdAt),
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              };
              return acc;
            }, {}),
          };
          dispatch({ type: 'LOAD_STATE', payload: convertedState });
        } catch (error) {
          console.error('Failed to load task state from localStorage:', error);
        }
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const addTask = (title: string, description: string, priority: TaskPriority, dueDate?: Date) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: 'todo',
      priority,
      createdAt: new Date(),
      dueDate,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const task = state.tasks[id];
    if (!task) return;
    const updatedTask: Task = { ...task, ...updates };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const moveTask = (taskId: string, sourceStatus: TaskStatus, destStatus: TaskStatus) => {
    dispatch({ type: 'MOVE_TASK', payload: { taskId, sourceStatus, destStatus } });
  };

  const reorderTasks = (status: TaskStatus, taskIds: string[]) => {
    dispatch({ type: 'REORDER_TASKS', payload: { status, taskIds } });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setFilterPriority = (priority: TaskPriority | 'all') => {
    dispatch({ type: 'SET_FILTER_PRIORITY', payload: priority });
  };

  const setFilterStatus = (status: TaskStatus | 'all') => {
    dispatch({ type: 'SET_FILTER_STATUS', payload: status });
  };

  return (
    <TaskContext.Provider
      value={{
        state,
        dispatch,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        reorderTasks,
        setSearchQuery,
        setFilterPriority,
        setFilterStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
