export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type ActivityType = 'task_created' | 'task_updated' | 'task_deleted' | 'task_moved' | 'user_login' | 'user_logout' | 'user_signup';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  dueDate?: Date;
  userId: string;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  taskId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Column {
  id: TaskStatus;
  title: string;
  taskIds: string[];
}

export interface TaskBoardState {
  tasks: Record<string, Task>;
  columns: Record<TaskStatus, Column>;
  searchQuery: string;
  filterPriority: TaskPriority | 'all';
  filterStatus: TaskStatus | 'all';
}

export type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { taskId: string; sourceStatus: TaskStatus; destStatus: TaskStatus } }
  | { type: 'REORDER_TASKS'; payload: { status: TaskStatus; taskIds: string[] } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER_PRIORITY'; payload: TaskPriority | 'all' }
  | { type: 'SET_FILTER_STATUS'; payload: TaskStatus | 'all' }
  | { type: 'LOAD_STATE'; payload: TaskBoardState }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'ADD_ACTIVITY_LOG'; payload: ActivityLog };
