/**
 * fakeAuth.ts
 * Username-only demo authentication.
 * Entering any username creates or retrieves that user account from localStorage.
 */

import type { User } from '../types'
import { demoDb, uuid, DEMO_COLORS } from './fakeDatabase'

function randomColor(): string {
  return DEMO_COLORS[Math.floor(Math.random() * DEMO_COLORS.length)]
}

function buildDemoUser(username: string): User {
  const stored = demoDb.getUser()
  // Reuse stored user if same username
  if (stored && stored.username === username) return stored

  const user: User = {
    uid: `demo-${uuid()}`,
    username,
    handle: username,
    name: username.charAt(0).toUpperCase() + username.slice(1).replace(/[_-]/g, ' '),
    email: `${username}@demo.codepark.io`,
    color: randomColor(),
    bio: 'Building things with CodePark 🚀',
    mode: 'online',
    subscription: 'pro',
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    achievements: [
      {
        id: 'first_project',
        name: 'First Project',
        description: 'Created your first project',
        icon: '🚀',
        date: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: 'collaborator',
        name: 'Team Player',
        description: 'Collaborated with 3+ developers',
        icon: '🤝',
        date: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
      {
        id: 'first_deploy',
        name: 'Ship It!',
        description: 'Deployed your first project',
        icon: '⚡',
        date: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
    ],
    streak: {
      current: 12,
      max: 28,
      last_activity_date: new Date().toISOString().split('T')[0],
    },
    friends_count: 8,
    collaborators_count: 4,
    shared_projects_count: 5,
    shared_sessions_count: 23,
  }

  demoDb.saveUser(user)
  return user
}

export function isDemoAuthenticated(): boolean {
  return demoDb.getSession() !== null
}

export function getDemoUser(): User | null {
  const session = demoDb.getSession()
  if (!session) return null
  return demoDb.getUser()
}

export async function demoLogin(username: string): Promise<User> {
  // Fake loading delay for realism
  await new Promise(resolve => setTimeout(resolve, 500))

  const trimmed = username.trim().toLowerCase().replace(/\s+/g, '_')
  if (!trimmed || trimmed.length < 2) {
    throw new Error('Username must be at least 2 characters')
  }

  const user = buildDemoUser(trimmed)
  demoDb.setSession(trimmed)

  // Seed demo data for this user
  demoDb.seedProjects(trimmed)
  demoDb.seedNotifications()

  return user
}

export async function demoLogout(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200))
  demoDb.clearSession()
}

export async function demoUpdateProfile(name: string, bio: string): Promise<void> {
  const user = demoDb.getUser()
  if (!user) throw new Error('Not authenticated')
  demoDb.saveUser({ ...user, name, bio })
}

export async function demoUpdateUsername(username: string): Promise<void> {
  const user = demoDb.getUser()
  if (!user) throw new Error('Not authenticated')
  const trimmed = username.trim().toLowerCase()
  demoDb.saveUser({ ...user, username: trimmed, handle: trimmed })
  demoDb.setSession(trimmed)
}
