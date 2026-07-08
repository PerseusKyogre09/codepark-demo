import React, { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  level?: 'root' | 'page' | 'component'
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component to catch and handle React errors
 * Can be used at different levels: root, page, or component
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error)
      console.error('[ErrorBoundary] Error info:', errorInfo)
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you could send to error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI based on level
      const { level = 'component' } = this.props
      const error = this.state.error

      if (level === 'root') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="max-w-md w-full text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
              <p className="text-gray-400 mb-6">
                The application encountered an unexpected error. Please refresh the page to continue.
              </p>
              {import.meta.env.DEV && error && (
                <div className="text-left bg-gray-800 p-4 rounded-lg mb-4 overflow-auto max-h-48" style={{ overscrollBehavior: 'none' }}>
                  <p className="text-sm text-red-400 font-mono">{error.message}</p>
                  {error.stack && (
                    <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  )}
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      }

      if (level === 'page') {
        return (
          <div className="flex items-center justify-center min-h-[400px] p-4">
            <div className="max-w-md w-full text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Page Error</h2>
              <p className="text-gray-400 mb-4">
                This page encountered an error. Try refreshing or going back.
              </p>
              {import.meta.env.DEV && error && (
                <div className="text-left bg-gray-800 p-3 rounded-lg mb-4 overflow-auto max-h-32" style={{ overscrollBehavior: 'none' }}>
                  <p className="text-sm text-red-400 font-mono">{error.message}</p>
                </div>
              )}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )
      }

      // Component level
      return (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-400 mb-1">Component Error</h3>
              <p className="text-sm text-gray-400">
                This component failed to render. {import.meta.env.DEV && error && `Error: ${error.message}`}
              </p>
              <button
                onClick={this.handleReset}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
