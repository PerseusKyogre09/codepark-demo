/**
 * AuthContext.tsx — DEMO VERSION
 * Username-only authentication. No Firebase, no backend tokens.
 * All methods delegate to fakeAuth.ts which uses localStorage.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { AuthState } from '../types'
import {
  isDemoAuthenticated,
  getDemoUser,
  demoLogin,
  demoLogout,
  demoUpdateProfile,
  demoUpdateUsername,
} from '../demo/fakeAuth'
import { showErrorToast, showSuccessToast } from '../utils/errorHandling'
import { useTheme } from './ThemeContext'
import { apiClient } from '../services/api'

interface AuthContextType extends AuthState {
  login: (provider: 'google' | 'github') => Promise<void>
  loginWithUsername: (username: string) => Promise<void>
  signupWithEmail: (email: string, password: string, username: string) => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  linkAccount: (provider: 'google' | 'github') => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  updateUsername: (username: string) => Promise<void>
  updateProfile: (name: string, bio: string) => Promise<void>
  unlinkAccount: (provider: 'google' | 'github') => Promise<void>
  updatePassword: (password: string) => Promise<void>
  reauthenticate: (password: string) => Promise<void>
  reauthenticatePopup: (provider: 'google' | 'github') => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { updateSettings } = useTheme()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    isGithubLinked: false,
    isGoogleLinked: false,
  })

  // Sync UI settings when user loads
  useEffect(() => {
    if (authState.user?.ui_settings && Object.keys(authState.user.ui_settings).length > 0) {
      updateSettings(authState.user.ui_settings, false)
    }
  }, [authState.user?.ui_settings])

  // On mount: restore session from localStorage
  useEffect(() => {
    const restoreSession = async () => {
      if (isDemoAuthenticated()) {
        const user = getDemoUser()
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            loading: false,
            isGithubLinked: false,
            isGoogleLinked: false,
          })
          return
        }
      }
      setAuthState({ user: null, isAuthenticated: false, loading: false })
    }

    restoreSession()
  }, [])

  // ─── Username login (demo-specific entry point) ───────────────────────────────

  const loginWithUsername = useCallback(async (username: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      const user = await demoLogin(username)
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        isGithubLinked: false,
        isGoogleLinked: false,
      })
      showSuccessToast(`Welcome, ${user.name}! 👋`)
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Login failed', 'Login failed')
      setAuthState({ user: null, isAuthenticated: false, loading: false })
      throw error
    }
  }, [])

  // ─── Stubs for social login (redirect to username login on demo) ──────────────

  const login = useCallback(async (_provider: 'google' | 'github') => {
    // In demo mode, social login isn't real — route to username login flow
    showErrorToast('Social login is not available in demo mode. Use the username field.', 'Demo mode')
  }, [])

  const loginWithEmail = useCallback(async (_email: string, _password: string) => {
    // Demo: extract username from email prefix and use that
    const username = _email.split('@')[0]
    await loginWithUsername(username)
  }, [loginWithUsername])

  const signupWithEmail = useCallback(async (_email: string, _password: string, username: string) => {
    await loginWithUsername(username)
  }, [loginWithUsername])

  // ─── Profile updates ──────────────────────────────────────────────────────────

  const updateUsername = useCallback(async (username: string) => {
    try {
      await demoUpdateUsername(username)
      await apiClient.setUsername(username)
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, username, handle: username } : null,
      }))
      showSuccessToast('Username updated!')
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Update failed', 'Failed to update username')
      throw error
    }
  }, [])

  const updateProfile = useCallback(async (name: string, bio: string) => {
    try {
      await demoUpdateProfile(name, bio)
      await apiClient.updateDisplayName(name)
      await apiClient.updateBio(bio)
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, name, bio } : null,
      }))
      showSuccessToast('Profile updated!')
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Update failed', 'Failed to update profile')
      throw error
    }
  }, [])

  // ─── Logout ───────────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      await demoLogout()
      await apiClient.logout()
      setAuthState({ user: null, isAuthenticated: false, loading: false })
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Logout failed', 'Logout failed')
      setAuthState(prev => ({ ...prev, loading: false }))
      throw error
    }
  }, [])

  // ─── No-op stubs (keep interface compatible) ──────────────────────────────────

  const checkAuth = useCallback(async () => {
    if (isDemoAuthenticated()) {
      const user = getDemoUser()
      if (user) {
        setAuthState(prev => ({ ...prev, user, isAuthenticated: true }))
      }
    }
  }, [])

  const linkAccount = useCallback(async (_provider: 'google' | 'github') => {
    showSuccessToast('Account linked! (demo)')
  }, [])

  const unlinkAccount = useCallback(async (_provider: 'google' | 'github') => {
    showSuccessToast('Account unlinked! (demo)')
  }, [])

  const updatePassword = useCallback(async (_password: string) => {
    showSuccessToast('Password updated! (demo)')
  }, [])

  const reauthenticate = useCallback(async (_password: string) => {
    showSuccessToast('Identity verified (demo)')
  }, [])

  const reauthenticatePopup = useCallback(async (_provider: 'google' | 'github') => {
    showSuccessToast('Identity verified (demo)')
  }, [])

  const sendPasswordReset = useCallback(async (_email: string) => {
    showSuccessToast('Reset email sent! (demo)')
  }, [])

  const value: AuthContextType = {
    ...authState,
    login,
    loginWithUsername,
    loginWithEmail,
    signupWithEmail,
    updateUsername,
    updateProfile,
    logout,
    checkAuth,
    linkAccount,
    unlinkAccount,
    updatePassword,
    reauthenticate,
    reauthenticatePopup,
    sendPasswordReset,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useAuthOptional() {
  return useContext(AuthContext)
}
