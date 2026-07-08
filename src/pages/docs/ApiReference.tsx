import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface ApiReferenceProps {
  onNavigate: (sectionId: string) => void
}

const ApiReference: React.FC<ApiReferenceProps> = ({ onNavigate }) => {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>API Reference</h1>
      <p style={{ color: themeColors.textSecondary }}>Programmatic access to CodePark features.</p>

      <div className="p-8 border-2 border-dashed rounded-2xl flex items-center justify-center" style={{ borderColor: themeColors.border, color: themeColors.textSecondary }}>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p>API documentation is currently being developed.</p>
          <p className="text-sm mt-2">Check back later for REST API endpoints, SDKs, and integration guides.</p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('error-codes')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Error Codes →
          </button>
          <button
            onClick={() => onNavigate('keyboard-shortcuts')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Keyboard Shortcuts →
          </button>
          <button
            onClick={() => onNavigate('execution-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Execution Limits →
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApiReference
