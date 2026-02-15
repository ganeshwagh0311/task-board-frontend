import { getStoredUsers, saveUser, createUser } from '@/app/utils/auth';

export const initializeDemoData = () => {
  if (typeof window === 'undefined') return;

  // Check if demo data already initialized
  const isInitialized = localStorage.getItem('demo-initialized');
  if (isInitialized) return;

  // Create demo users if they don't exist
  const users = getStoredUsers();
  const demoUserExists = users.some((u) => u.email === 'demo@example.com');

  if (!demoUserExists) {
    createUser('demo@example.com', 'password123', 'Demo User');
  }

  // Mark as initialized
  localStorage.setItem('demo-initialized', 'true');
};
