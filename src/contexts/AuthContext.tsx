import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  linkWithPopup,
  unlink,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth'
import { apiClient } from '../services/api'
import type { AuthState, FirebaseConfig } from '../types'
import { showErrorToast, showSuccessToast, logError, AppError, ErrorType } from '../utils/errorHandling'
import { useTheme } from './ThemeContext'

interface AuthContextType extends AuthState {
  login: (provider: 'google' | 'github') => Promise<void>
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
  })
  const [auth, setAuth] = useState<Auth | null>(null)

  // Sync Firestore UI settings when user changes / loads
  useEffect(() => {
    if (authState.user?.ui_settings && Object.keys(authState.user.ui_settings).length > 0) {
      updateSettings(authState.user.ui_settings, false);
    }
  }, [authState.user?.ui_settings]);

  // Initialize Firebase on mount
  useEffect(() => {
    const initializeFirebase = async () => {
      // 5-second timeout for the initial config fetch to prevent hanging on restricted networks
      const timeoutPromise = (ms: number) => new Promise((_, reject) => 
        setTimeout(() => reject(new AppError('Auth configuration timed out', ErrorType.NETWORK)), ms)
      );

      try {
        console.log('[Auth] Fetching Firebase config...');
        // Race the config fetch against a 5s timeout
        const config: FirebaseConfig = await Promise.race([
          apiClient.getFirebaseConfig(),
          timeoutPromise(5000)
        ]) as FirebaseConfig;

        console.log('[Auth] Firebase config received, initializing...');
        const app = getApps().length > 0 ? getApp() : initializeApp(config);
        const authInstance = getAuth(app);
        
        // Set Auth instance immediately so login calls can access it
        setAuth(authInstance);

        // Apply persistence asynchronously to avoid blocking initialization in case of browser restrictions
        setPersistence(authInstance, browserLocalPersistence).catch((err) => {
          console.warn('[Auth] Failed to set local persistence:', err);
        });

        const unsubscribe = authInstance.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const idToken = await firebaseUser.getIdToken();
              const user = await apiClient.verifyToken(idToken);
              setAuthState({
                user,
                isAuthenticated: true,
                loading: false,
                isGithubLinked: firebaseUser.providerData.some(p => p.providerId === 'github.com'),
                isGoogleLinked: firebaseUser.providerData.some(p => p.providerId === 'google.com'),
                providerData: firebaseUser.providerData,
              });
            } catch (error) {
              logError(error, 'Auth State Changed');
              setAuthState({ user: null, isAuthenticated: false, loading: false });
            }
          } else {
            console.log('[Auth] No user found, proceeding as guest');
            setAuthState({ user: null, isAuthenticated: false, loading: false });
          }
        });

        return unsubscribe;
      } catch (error) {
        logError(error, 'Firebase Initialization');
        // If we timeout or fail, we STILL stop loading so the user can use the app as a guest
        setAuthState({ user: null, isAuthenticated: false, loading: false });
      }
    };

    let unsubscribe: (() => void) | undefined;
    initializeFirebase().then(unsub => {
      if (typeof unsub === 'function') {
        unsubscribe = unsub;
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = await apiClient.checkAuth()

      if (isAuthenticated && auth) {
        // Get current Firebase user
        const firebaseUser = auth.currentUser
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken()
          // Send token to backend to verify session and get full user data
          const user = await apiClient.verifyToken(idToken)

          setAuthState({
            user,
            isAuthenticated: true,
            loading: false,
            isGithubLinked: firebaseUser.providerData.some(
              (p) => p.providerId === 'github.com'
            ),
            isGoogleLinked: firebaseUser.providerData.some(
              (p) => p.providerId === 'google.com'
            ),
            providerData: firebaseUser.providerData,
          })
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
          })
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
        })
      }
    } catch (error) {
      logError(error, 'Check Auth Status')
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      })
    }
  }

  const login = async (provider: 'google' | 'github') => {
    if (!auth) {
      const error = new Error('Firebase not initialized')
      showErrorToast(error, 'Login')
      throw error
    }

    try {
      setAuthState((prev) => ({ ...prev, loading: true }))

      // Create provider instance
      const authProvider =
        provider === 'google'
          ? new GoogleAuthProvider()
          : new GithubAuthProvider()

      // Sign in with popup
      const result = await signInWithPopup(auth, authProvider)
      const firebaseUser: FirebaseUser = result.user

      // Get ID token
      const idToken = await firebaseUser.getIdToken()

      // Send token to backend
      const user = await apiClient.login(idToken)

      // If GitHub login, also extract and send GitHub token
      if (provider === 'github') {
        const credential = GithubAuthProvider.credentialFromResult(result)
        if (credential && credential.accessToken) {
          await apiClient.updateGithubToken(credential.accessToken)
        }
      }

      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        isGithubLinked: result.user.providerData.some(
          (p) => p.providerId === 'github.com'
        ),
        isGoogleLinked: result.user.providerData.some(
          (p) => p.providerId === 'google.com'
        ),
        providerData: result.user.providerData,
      })
    } catch (error) {
      logError(error, 'Login')
      showErrorToast(error, 'Login failed')
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      })
      throw error
    }
  }

  const signupWithEmail = async (email: string, password: string, username: string) => {
    if (!auth) {
      const error = new Error('Firebase not initialized')
      showErrorToast(error, 'Signup')
      throw error
    }

    try {
      setAuthState((prev) => ({ ...prev, loading: true }))

      // Create user in Firebase
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser: FirebaseUser = result.user

      // Get ID token
      const idToken = await firebaseUser.getIdToken()

      // Send token to backend -> this creates the user in backend if not exists
      let user = await apiClient.login(idToken)

      // Set the username
      await apiClient.setUsername(username)

      // Fetch updated user to ensure username is reflected
      // (The verifyToken or cached user might not have it yet if setUsername is separate)
      // Actually verifyToken or a fresh profile fetch would be good.
      // But let's assume login returns the user object, we can manually update it locally or fetch again.
      // Ideally we re-fetch profile.
      user = await apiClient.verifyToken(idToken)

      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        isGithubLinked: false,
        isGoogleLinked: false,
      })

      showSuccessToast('Account created successfully!')
    } catch (error) {
      logError(error, 'Signup')
      showErrorToast(error, 'Signup failed')
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      })
      throw error
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    if (!auth) {
      const error = new Error('Firebase not initialized')
      showErrorToast(error, 'Login')
      throw error
    }

    try {
      setAuthState((prev) => ({ ...prev, loading: true }))

      // Sign in with Firebase
      const result = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser: FirebaseUser = result.user

      // Get ID token
      const idToken = await firebaseUser.getIdToken()

      // Send token to backend
      const user = await apiClient.login(idToken)

      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        isGithubLinked: false, // Email/Password doesn't link these automatically
        isGoogleLinked: false,
      })
    } catch (error) {
      logError(error, 'Login')
      showErrorToast(error, 'Login failed')
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      })
      throw error
    }
  }

  const updateUsername = async (username: string) => {
    try {
      await apiClient.setUsername(username)
      // Update local state
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, username, handle: username } : null
      }))
      showSuccessToast('Username updated!')
    } catch (error) {
      logError(error, 'Update Username')
      showErrorToast(error, 'Failed to update username')
      throw error
    }
  }

  const updateProfile = async (name: string, bio: string) => {
    try {
      await apiClient.updateDisplayName(name)
      await apiClient.updateBio(bio)
      // Update local state
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, name, bio } : null
      }))
      showSuccessToast('Profile updated!')
    } catch (error) {
      logError(error, 'Update Profile')
      showErrorToast(error, 'Failed to update profile')
      throw error
    }
  }

  const logout = async () => {
    if (!auth) {
      const error = new Error('Firebase not initialized')
      showErrorToast(error, 'Logout')
      throw error
    }

    try {
      setAuthState((prev) => ({ ...prev, loading: true }))

      // Sign out from Firebase
      await firebaseSignOut(auth)

      // Clear backend session
      await apiClient.logout()

      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      })
    } catch (error) {
      logError(error, 'Logout')
      showErrorToast(error, 'Logout failed')
      setAuthState((prev) => ({ ...prev, loading: false }))
      throw error
    }
  }

  const checkAuth = async () => {
    await checkAuthStatus()
  }

  const linkAccount = async (provider: 'google' | 'github') => {
    if (!auth || !auth.currentUser) {
      const error = new Error('User not logged in')
      showErrorToast(error, 'Link Account')
      throw error
    }

    try {
      setAuthState((prev) => ({ ...prev, loading: true }))

      let authProvider;
      if (provider === 'github') {
        authProvider = new GithubAuthProvider()
        authProvider.addScope('repo')
      } else {
        authProvider = new GoogleAuthProvider()
      }

      // Link with popup
      const result = await linkWithPopup(auth.currentUser, authProvider)

      // If GitHub, handle token
      if (provider === 'github') {
        const credential = GithubAuthProvider.credentialFromResult(result)
        if (credential && credential.accessToken) {
          await apiClient.updateGithubToken(credential.accessToken)
        }
      }

      // Refresh user data
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        isGithubLinked: auth.currentUser?.providerData.some(p => p.providerId === 'github.com'),
        isGoogleLinked: auth.currentUser?.providerData.some(p => p.providerId === 'google.com')
      }))
      showSuccessToast('Account linked successfully!')

    } catch (error: any) {
      // Check for credential already in use or provider already linked
      if (
        error.code === 'auth/credential-already-in-use' ||
        error.code === 'auth/provider-already-linked'
      ) {
        // Recovery logic for GitHub token if it was a GitHub link attempt
        if (provider === 'github') {
          const credential = GithubAuthProvider.credentialFromError(error)
          if (credential && credential.accessToken) {
            try {
              await apiClient.updateGithubToken(credential.accessToken)
              setAuthState((prev) => ({
                ...prev,
                loading: false,
                isGithubLinked: true
              }))
              showSuccessToast('GitHub token refreshed successfully!')
              return
            } catch (updateError) {
              console.error('Failed to update token from recovered credential', updateError)
            }
          }
        } else {
          // For Google or others, just note it's linked
          showSuccessToast('Account is already linked')
          setAuthState((prev) => ({
            ...prev,
            loading: false,
            isGoogleLinked: auth.currentUser?.providerData.some(p => p.providerId === 'google.com')
          }))
          return;
        }
      }

      logError(error, 'Link Account')
      showErrorToast(error, 'Failed to link account')
      setAuthState((prev) => ({ ...prev, loading: false }))
      throw error
    }
  }

  const unlinkAccount = async (provider: 'google' | 'github') => {
    if (!auth || !auth.currentUser) {
      throw new Error('User not logged in')
    }

    const providerId = provider === 'github' ? 'github.com' : 'google.com'

    // Check if it's the only provider
    if (auth.currentUser.providerData.length <= 1) {
      throw new Error('Cannot unlink your only sign-in method. Set a password or link another account first.')
    }

    try {
      setAuthState((prev) => ({ ...prev, loading: true }))
      await unlink(auth.currentUser, providerId)

      // Update state
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        isGithubLinked: auth.currentUser?.providerData.some(p => p.providerId === 'github.com'),
        isGoogleLinked: auth.currentUser?.providerData.some(p => p.providerId === 'google.com')
      }))
      showSuccessToast(`${provider === 'github' ? 'GitHub' : 'Google'} unlinked successfully`)
    } catch (error) {
      logError(error, 'Unlink Account')
      showErrorToast(error, 'Failed to unlink account')
      setAuthState((prev) => ({ ...prev, loading: false }))
      throw error
    }
  }

  const updatePassword = async (password: string) => {
    if (!auth || !auth.currentUser) {
      throw new Error('User not logged in')
    }

    try {
      setAuthState((prev) => ({ ...prev, loading: true }))

      const hasPassword = auth.currentUser.providerData.some(p => p.providerId === 'password')

      if (hasPassword) {
        // Change existing password
        await firebaseUpdatePassword(auth.currentUser, password)
      } else {
        // Set password for the first time by linking email/password credential
        const email = auth.currentUser.email
        if (!email) throw new Error('No email associated with this account')

        const credential = EmailAuthProvider.credential(email, password)
        await linkWithCredential(auth.currentUser, credential)
      }

      setAuthState((prev) => ({ ...prev, loading: false }))
      showSuccessToast(hasPassword ? 'Password updated successfully' : 'Password set successfully')
    } catch (error) {
      logError(error, 'Update Password')
      showErrorToast(error, 'Failed to update password')
      setAuthState((prev) => ({ ...prev, loading: false }))
      throw error
    }
  }

  const reauthenticate = async (password: string) => {
    if (!auth || !auth.currentUser) throw new Error('User not logged in')
    const email = auth.currentUser.email
    if (!email) throw new Error('No email found for user')

    const credential = EmailAuthProvider.credential(email, password)
    await reauthenticateWithCredential(auth.currentUser, credential)
    showSuccessToast('Identity verified')
  }

  const reauthenticatePopup = async (provider: 'google' | 'github') => {
    if (!auth || !auth.currentUser) throw new Error('User not logged in')
    const authProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider()
    await reauthenticateWithPopup(auth.currentUser, authProvider)
    showSuccessToast('Identity verified')
  }

  const sendPasswordReset = async (email: string) => {
    if (!auth) throw new Error('Firebase not initialized')
    await sendPasswordResetEmail(auth, email)
    showSuccessToast('Reset email sent!')
  }

  const value: AuthContextType = {
    ...authState,
    login,
    signupWithEmail,
    loginWithEmail,
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

// Optional variant for components that can render outside the provider (e.g., testing or storybook)
export function useAuthOptional() {
  return useContext(AuthContext)
}
