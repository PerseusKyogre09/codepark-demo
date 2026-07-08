import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface ErrorCodesProps {
  onNavigate: (sectionId: string) => void
}

const ErrorCodes: React.FC<ErrorCodesProps> = ({ onNavigate }) => {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>Error Codes</h1>
      <p style={{ color: themeColors.textSecondary }}>Common issues and how to fix them.</p>
      <p style={{ color: themeColors.textSecondary }}>CodePark surfaces clear, human-readable error codes to help you quickly understand what went wrong and how to resolve it.</p>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E401 — Unauthorized</p>
        <p className="text-sm text-red-700 dark:text-red-300">Your session has expired or the authentication token is invalid.</p>
      </div>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Why this happens</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Your login session timed out</li>
        <li>You signed out in another tab or device</li>
        <li>Your token was revoked or refreshed</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>How to fix</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Refresh the page</li>
        <li>Sign in again to renew credentials</li>
        <li>If the issue persists, log out completely and sign back in</li>
      </ul>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E403 — Forbidden</p>
        <p className="text-sm text-red-700 dark:text-red-300">You don't have permission to perform this action.</p>
      </div>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Why this happens</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>You are a Viewer attempting a write action</li>
        <li>You are accessing a project you were removed from</li>
        <li>The action requires Owner or Editor permissions</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>How to fix</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Ask the project owner to update your role</li>
        <li>Verify you're working in the correct project</li>
        <li>Rejoin the project using a valid invite link</li>
      </ul>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E404 — Resource Not Found</p>
        <p className="text-sm text-red-700 dark:text-red-300">The requested project, file, session, or resource could not be found.</p>
      </div>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Why this happens</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>The project was deleted</li>
        <li>The file was renamed or removed</li>
        <li>The session has ended</li>
        <li>The URL is invalid or outdated</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>How to fix</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Reload the project dashboard</li>
        <li>Verify the resource still exists</li>
        <li>Ask a collaborator to resend the session link</li>
      </ul>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E408 — Request Timeout</p>
        <p className="text-sm text-red-700 dark:text-red-300">The request took too long to complete and was aborted.</p>
      </div>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Why this happens</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Temporary network instability</li>
        <li>High server load</li>
        <li>Large file operations or slow responses</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>How to fix</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Retry the action after a few seconds</li>
        <li>Check your network connection</li>
        <li>Reduce request size if applicable</li>
      </ul>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E429 — Too Many Requests</p>
        <p className="text-sm text-red-700 dark:text-red-300">You have hit a rate limit.</p>
      </div>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Why this happens</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Too many API requests in a short time</li>
        <li>AI request quota exceeded</li>
        <li>Automated or repeated actions</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>How to fix</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Wait for the cooldown period to reset</li>
        <li>Reduce request frequency</li>
        <li>Upgrade your plan if limits are consistently reached</li>
      </ul>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E500 — Internal Server Error</p>
        <p className="text-sm text-red-700 dark:text-red-300">Something went wrong on CodePark's side.</p>
      </div>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Why this happens</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Unexpected backend failure</li>
        <li>Temporary infrastructure issue</li>
        <li>Unhandled edge case</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>How to fix</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Retry the action</li>
        <li>Refresh the page</li>
        <li>If the issue persists, contact support with details</li>
      </ul>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E503 — Service Unavailable</p>
        <p className="text-sm text-red-700 dark:text-red-300">The execution engine is currently unavailable.</p>
      </div>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Why this happens</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>High system load</li>
        <li>Ongoing maintenance</li>
        <li>Temporary infrastructure scaling</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>How to fix</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Wait a few seconds and try again</li>
        <li>Avoid retrying rapidly</li>
        <li>Check the status page (if available)</li>
      </ul>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E504 — Execution Timeout</p>
        <p className="text-sm text-red-700 dark:text-red-300">Your program exceeded the maximum allowed execution time.</p>
      </div>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Why this happens</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Infinite loops</li>
        <li>Long-running processes</li>
        <li>Background services running past limits</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>How to fix</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Optimize your code</li>
        <li>Add exit conditions</li>
        <li>Upgrade to Pro for longer execution time</li>
        <li>Save intermediate results explicitly</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Execution-Specific Errors</h2>
      <p style={{ color: themeColors.textSecondary }}>These errors occur during runtime execution.</p>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E601 — Memory Limit Exceeded</p>
        <p className="text-sm text-red-700 dark:text-red-300">Your program used more RAM than allowed</p>
      </div>
      <p style={{ color: themeColors.textSecondary }}>Optimize memory usage or reduce dataset size</p>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E602 — CPU Limit Exceeded</p>
        <p className="text-sm text-red-700 dark:text-red-300">Your program consumed excessive CPU</p>
      </div>
      <p style={{ color: themeColors.textSecondary }}>Optimize loops or algorithms</p>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E603 — Network Access Blocked</p>
        <p className="text-sm text-red-700 dark:text-red-300">Outbound network is disabled on your plan</p>
      </div>
      <p style={{ color: themeColors.textSecondary }}>Upgrade to Pro for network access</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>AI-Specific Errors</h2>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E701 — AI Quota Exceeded</p>
        <p className="text-sm text-red-700 dark:text-red-300">Daily AI request limit reached</p>
      </div>
      <p style={{ color: themeColors.textSecondary }}>Wait for reset or upgrade plan</p>

      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">E702 — AI Model Unavailable</p>
        <p className="text-sm text-red-700 dark:text-red-300">Selected model temporarily unavailable</p>
      </div>
      <p style={{ color: themeColors.textSecondary }}>Retry later or allow automatic model selection</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Best Practices to Avoid Errors</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Save work frequently</li>
        <li>Watch resource usage for heavy programs</li>
        <li>Avoid infinite loops</li>
        <li>Use appropriate plan for workload</li>
        <li>Check permissions before actions</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>When to Contact Support</h2>
      <p style={{ color: themeColors.textSecondary }}>Reach out to support if:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Errors persist after retries</li>
        <li>You encounter repeated E500 or E503 errors</li>
        <li>Data appears missing or inconsistent</li>
        <li>You suspect a platform bug</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Include:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>error code</li>
        <li>timestamp</li>
        <li>project name</li>
        <li>steps to reproduce</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Error codes are designed to be actionable</li>
        <li>Most issues resolve with a retry or refresh</li>
        <li>Resource and execution limits are enforced intentionally</li>
        <li>Clear messages help diagnose issues quickly</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>CodePark aims to fail loudly, clearly, and safely — never silently.</p>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('api-reference')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            API Reference →
          </button>
          <button
            onClick={() => onNavigate('execution-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Execution Limits →
          </button>
          <button
            onClick={() => onNavigate('resource-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Resource Limits →
          </button>
          <button
            onClick={() => onNavigate('keyboard-shortcuts')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Keyboard Shortcuts →
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorCodes
