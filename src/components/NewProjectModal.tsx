import { useState, useEffect, useRef } from 'react'
import { X, FolderPlus } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (name: string) => void
}

export default function NewProjectModal({ isOpen, onClose, onConfirm }: NewProjectModalProps) {
  const { settings, themeColors } = useTheme()
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setName('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(name.trim() || 'Untitled Project')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-xl border shadow-2xl"
        style={{
          background: settings.uiTheme === 'dark' ? 'rgba(14, 14, 19, 0.98)' : 'rgba(249, 250, 251, 0.98)',
          borderColor: `${themeColors.terminalPrimary}40`,
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b" style={{ borderColor: themeColors.terminalBorder }}>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${themeColors.terminalPrimary}20` }}
            >
              <FolderPlus className="w-4 h-4" style={{ color: themeColors.terminalPrimary }} />
            </div>
            <span
              className="font-bold text-base"
              style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Grotesk' }}
            >
              New Project
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded transition-colors hover:bg-white/10"
            style={{ color: themeColors.terminalSecondary }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label
              className="block text-xs font-medium mb-2 uppercase tracking-wider"
              style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace' }}
            >
              Project Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Project"
              maxLength={80}
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all"
              style={{
                background: settings.uiTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderColor: themeColors.terminalBorder,
                color: themeColors.terminalSecondary,
                fontFamily: 'Space Mono, monospace',
              }}
            />
            <p className="mt-1 text-xs opacity-50" style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace' }}>
              Leave empty to start as "Untitled Project"
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all hover:border-opacity-100"
              style={{
                borderColor: themeColors.terminalBorder,
                color: themeColors.terminalSecondary,
                fontFamily: 'Space Mono, monospace',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{
                background: themeColors.terminalPrimary,
                color: settings.uiTheme === 'dark' ? '#004820' : '#003d16',
                fontFamily: 'Space Mono, monospace',
              }}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
