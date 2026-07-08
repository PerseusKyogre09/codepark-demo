import { useState } from 'react'
import { 
  showErrorToast, 
  showSuccessToast, 
  showWarningToast, 
  showInfoToast,
  AppError,
  ErrorType 
} from '../utils/errorHandling'
import { ErrorBoundary } from '../components/ErrorBoundary'

// Component that throws an error for testing
function ErrorThrowingComponent(): never {
  throw new Error('This is a test error from a component')
}

export default function ErrorTestPage() {
  const [showErrorComponent, setShowErrorComponent] = useState(false)

  const testToasts = () => {
    showSuccessToast('This is a success message!')
    setTimeout(() => showInfoToast('This is an info message'), 500)
    setTimeout(() => showWarningToast('This is a warning message'), 1000)
    setTimeout(() => showErrorToast('This is an error message'), 1500)
  }

  const testNetworkError = () => {
    const error = new AppError(
      'Failed to connect to server',
      ErrorType.NETWORK
    )
    showErrorToast(error, 'Network Test')
  }

  const testAuthError = () => {
    const error = new AppError(
      'Your session has expired',
      ErrorType.AUTHENTICATION,
      401
    )
    showErrorToast(error, 'Auth Test')
  }

  const testValidationError = () => {
    const error = new AppError(
      'Invalid input provided',
      ErrorType.VALIDATION,
      400
    )
    showErrorToast(error, 'Validation Test')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Error Handling Test Page</h1>
        
        <div className="space-y-6">
          {/* Toast Notifications */}
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Toast Notifications</h2>
            <button
              onClick={testToasts}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Test All Toast Types
            </button>
          </section>

          {/* Error Types */}
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Error Types</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={testNetworkError}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Network Error
              </button>
              <button
                onClick={testAuthError}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                Auth Error
              </button>
              <button
                onClick={testValidationError}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              >
                Validation Error
              </button>
            </div>
          </section>

          {/* Error Boundary */}
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Error Boundary (Component Level)</h2>
            <button
              onClick={() => setShowErrorComponent(!showErrorComponent)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors mb-4"
            >
              {showErrorComponent ? 'Hide' : 'Show'} Error Component
            </button>
            
            {showErrorComponent && (
              <ErrorBoundary level="component">
                <ErrorThrowingComponent />
              </ErrorBoundary>
            )}
          </section>

          {/* Documentation */}
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Documentation</h2>
            <p className="text-gray-400 mb-4">
              This page demonstrates the comprehensive error handling system implemented in the application.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Toast notifications for user feedback</li>
              <li>Error boundaries for component error catching</li>
              <li>Typed error handling with AppError class</li>
              <li>Automatic retry logic with exponential backoff</li>
              <li>Network error detection and handling</li>
              <li>Error logging in development mode</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
