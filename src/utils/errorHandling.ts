import { toast } from 'sonner'

/**
 * Error types for categorization
 */
export const ErrorType = {
  NETWORK: 'network',
  AUTHENTICATION: 'authentication',
  VALIDATION: 'validation',
  SERVER: 'server',
  UNKNOWN: 'unknown',
} as const

export type ErrorType = typeof ErrorType[keyof typeof ErrorType]

/**
 * Custom error class with additional context
 */
export class AppError extends Error {
  type: ErrorType
  statusCode?: number
  originalError?: unknown

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode?: number,
    originalError?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

/**
 * Parse error from various sources into AppError
 */
export function parseError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error
  }

  // Standard Error
  if (error instanceof Error) {
    // Check for network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new AppError(
        'Network error. Please check your connection.',
        ErrorType.NETWORK,
        undefined,
        error
      )
    }

    // Check for authentication errors
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      return new AppError(
        'Authentication failed. Please log in again.',
        ErrorType.AUTHENTICATION,
        401,
        error
      )
    }

    return new AppError(error.message, ErrorType.UNKNOWN, undefined, error)
  }

  // String error
  if (typeof error === 'string') {
    return new AppError(error, ErrorType.UNKNOWN)
  }

  // Unknown error type
  return new AppError('An unexpected error occurred', ErrorType.UNKNOWN, undefined, error)
}

/**
 * Log error to console in development
 */
export function logError(error: unknown, context?: string) {
  if (import.meta.env.DEV) {
    const prefix = context ? `[${context}]` : '[Error]'
    console.error(prefix, error)

    // Log stack trace if available
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack)
    }
  }

  // In production, you could send to error reporting service
  // Example: Sentry.captureException(error, { tags: { context } })
}

/**
 * Display user-friendly error message using toast
 */
export function showErrorToast(error: unknown, context?: string) {
  const appError = parseError(error)
  
  // Log to console
  logError(appError, context)

  // Determine toast message
  let message = appError.message

  // Add context if provided
  if (context) {
    message = `${context}: ${message}`
  }

  // Show toast notification
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  })
}

/**
 * Display success message using toast
 */
export function showSuccessToast(message: string) {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  })
}

/**
 * Display info message using toast
 */
export function showInfoToast(message: string) {
  toast.info(message, {
    duration: 3000,
    position: 'top-right',
  })
}

/**
 * Display warning message using toast
 */
export function showWarningToast(message: string) {
  toast.warning(message, {
    duration: 4000,
    position: 'top-right',
  })
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    backoffMultiplier?: number
    onRetry?: (attempt: number, error: unknown) => void
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    onRetry,
  } = options

  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * Math.pow(backoffMultiplier, attempt), maxDelay)

      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, error)
      }

      // Log retry attempt in development
      if (import.meta.env.DEV) {
        console.log(`[Retry] Attempt ${attempt + 1}/${maxRetries} failed, retrying in ${delay}ms...`)
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // All retries failed
  throw lastError
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.type === ErrorType.NETWORK
  }

  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError')
    )
  }

  return false
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.type === ErrorType.AUTHENTICATION
  }

  if (error instanceof Error) {
    return (
      error.message.includes('auth') ||
      error.message.includes('unauthorized') ||
      error.message.includes('401')
    )
  }

  return false
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  const appError = parseError(error)

  switch (appError.type) {
    case ErrorType.NETWORK:
      return 'Unable to connect to the server. Please check your internet connection and try again.'
    case ErrorType.AUTHENTICATION:
      return 'Your session has expired. Please log in again.'
    case ErrorType.VALIDATION:
      return appError.message || 'Please check your input and try again.'
    case ErrorType.SERVER:
      return 'The server encountered an error. Please try again later.'
    default:
      return appError.message || 'An unexpected error occurred. Please try again.'
  }
}
