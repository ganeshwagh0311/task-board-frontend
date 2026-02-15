import { User } from '@/app/types/task'

// Utility functions for authentication
// In a real app, these would use proper password hashing (bcrypt)

export const hashPassword = (password: string): string => {
  // Simple hash for demo purposes - DO NOT use in production
  return Buffer.from(password).toString('base64')
}

export const verifyPassword = (password: string, hash: string): boolean => {
  // Simple verification for demo purposes - DO NOT use in production
  return Buffer.from(hash, 'base64').toString() === password
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return []
  const users = localStorage.getItem('users')
  return users ? JSON.parse(users) : []
}

export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return
  const users = getStoredUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem('users', JSON.stringify(users))
}

export const getUserByEmail = (email: string): User | undefined => {
  const users = getStoredUsers()
  return users.find((u) => u.email === email)
}

export const createUser = (email: string, password: string, name: string): User => {
  const user: User = {
    id: `user_${Date.now()}`,
    email,
    password: hashPassword(password),
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  saveUser(user)
  return user
}

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('currentUser')
  return userStr ? JSON.parse(userStr) : null
}

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
  } else {
    localStorage.removeItem('currentUser')
  }
}

export const logout = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('currentUser')
}
