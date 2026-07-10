import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { Toaster } from 'sonner'
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import { SessionProvider } from './contexts/SessionContext'
import { DialogProvider } from './contexts/DialogContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import MarketingFooter from './components/ui/MarketingFooter'
import { MarketingNav } from './components/cp/MarketingNav'
import LoadingScreen from './components/ui/LoadingScreen'

import { AppShell } from './components/cp/AppShell'
import { Outlet } from 'react-router-dom'
import { useSession } from './contexts/SessionContext'
import { usePresence } from './hooks/usePresence'
import { RealtimeProvider } from './utils/RealtimeProvider'

if (typeof window !== 'undefined') {
  (window as any)._RealtimeProviderRef = RealtimeProvider;
}

function PresenceManager() {
  const { session } = useSession()
  usePresence(session?.project_id || null, session?.project_name || null)
  return null
}

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const EditorPage = lazy(() => import('./pages/EditorPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const ReleaseNotesPage = lazy(() => import('./pages/ReleaseNotesPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const DocsPage = lazy(() => import('./pages/DocsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const UsernameSetupPage = lazy(() => import('./pages/UsernameSetupPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const ProPage = lazy(() => import('./pages/ProPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const ThemeTestPage = lazy(() => import('./pages/ThemeTestPage'))
const SocketTestPage = lazy(() => import('./pages/SocketTestPage'))
const ErrorTestPage = lazy(() => import('./pages/ErrorTestPage'))
const StripePage = lazy(() => import('./pages/StripePage'))
const GuestEditorPage = lazy(() => import('./pages/GuestEditorPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ProjectListPage = lazy(() => import('./pages/ProjectListPage'))
const ProjectCreatePage = lazy(() => import('./pages/ProjectCreatePage'))
const ProjectEntryPage = lazy(() => import('./pages/ProjectEntryPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))
const FriendsPage = lazy(() => import('./pages/FriendsPage'))
const EmptyStatesPage = lazy(() => import('./pages/EmptyStatesPage'))
const LoadingStatesPage = lazy(() => import('./pages/LoadingStatesPage'))
const ErrorStatesPage = lazy(() => import('./pages/ErrorStatesPage'))

const UserDevlogsPage = lazy(() => import('./pages/UserDevlogsPage'))
const UserReleasesPage = lazy(() => import('./pages/UserReleasesPage'))

function DashboardLayout() {
  return (
    <div className="h-screen overflow-hidden">
      <AppShell>
        <Outlet />
      </AppShell>
    </div>
  )
}

function FooterWrapper() {
  const location = useLocation()
  const excludePaths = [
    '/dashboard', '/project', '/playground', '/projects', '/profile', 
    '/settings', '/notifications', '/friends', '/achievements',
    '/empty-states', '/loading-states', '/error-states'
  ]

  // Check if current path starts with any excluded path
  const shouldHide = excludePaths.some(path => location.pathname.startsWith(path))

  if (shouldHide) return null

  return <MarketingFooter />
}

function NavbarWrapper() {
  const location = useLocation()
  const excludePaths = [
    '/dashboard', '/project', '/playground', '/projects', '/profile', 
    '/settings', '/notifications', '/friends', '/achievements',
    '/empty-states', '/loading-states', '/error-states'
  ]

  // Check if current path starts with any excluded path
  const shouldHide = excludePaths.some(path => location.pathname.startsWith(path))

  if (shouldHide) return null

  return <MarketingNav />
}

function GlobalScrollFix() {
  const { themeColors, settings } = useTheme()

  useEffect(() => {
    // This fixes the "overscroll" white background issue
    document.documentElement.style.background = themeColors.bg
    document.body.style.background = themeColors.bg
    document.documentElement.style.backgroundColor = themeColors.bgColor
    document.body.style.backgroundColor = themeColors.bgColor

    // Apply strict dark mode class for Tailwind and CSS variables
    if (settings.uiTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [themeColors.bg, themeColors.bgColor, settings.uiTheme])

  return null
}

function App() {
  return (
    <ErrorBoundary level="root">
      <BrowserRouter>
        <ThemeProvider>
          <DialogProvider>
            <AuthProvider>
              <SocketProvider autoConnect={true}>
                <SessionProvider>
                  <PresenceManager />
                  <GlobalScrollFix />
                  <LoadingScreen />
                  <NavbarWrapper />
                  <Suspense fallback={null}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/pro" element={<ProPage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/stripe" element={<StripePage />} />
                      <Route path="/docs/*" element={<DocsPage />} />
                      <Route path="/changelog/*" element={<ReleaseNotesPage />} />

                      {/* Test routes */}
                      <Route path="/theme-test" element={<ThemeTestPage />} />
                      <Route path="/socket-test" element={<SocketTestPage />} />
                      <Route path="/error-test" element={<ErrorTestPage />} />

                      {/* Auth routes */}
                      <Route path="/auth" element={<AuthPage />} />
                      <Route
                        path="/complete-profile"
                        element={
                          <ProtectedRoute requireUsername={false}>
                            <UsernameSetupPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Dashboard Layout pages - wrapped in AppShell */}
                      <Route element={<DashboardLayout />}>
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <DashboardPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile/:username?"
                          element={
                            <ErrorBoundary level="page">
                              <ProfilePage />
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <SettingsPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/dashboard/projects"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <ProjectListPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/projects/create"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <ProjectCreatePage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/notifications"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <NotificationsPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/achievements/:username?"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <AchievementsPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/friends"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <FriendsPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/empty-states"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <EmptyStatesPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/loading-states"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <LoadingStatesPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/error-states"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <ErrorStatesPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/dashboard/docs/*"
                          element={
                            <ErrorBoundary level="page">
                              <DocsPage />
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/dashboard/devlogs"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <UserDevlogsPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/dashboard/releases"
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary level="page">
                                <UserReleasesPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          }
                        />
                      </Route>

                      {/* Non-AppShell Pages */}
                      <Route
                        path="/project/:projectId"
                        element={
                          <ProtectedRoute>
                            <ErrorBoundary level="page">
                              <ProjectEntryPage />
                            </ErrorBoundary>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/project/:projectId/editor"
                        element={
                          <ErrorBoundary level="page">
                            <EditorPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route path="/playground" element={<Suspense fallback={<LoadingScreen />}><GuestEditorPage /></Suspense>} />


                      {/* 404 Not Found */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                  <FooterWrapper />

                  {/* Toast notifications */}
                  <Toaster
                    position="top-right"
                    expand={false}
                    richColors
                    closeButton
                  />
                </SessionProvider>
              </SocketProvider>
            </AuthProvider>
          </DialogProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
