import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface KeyboardShortcutsProps {
  onNavigate: (sectionId: string) => void
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onNavigate }) => {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>Keyboard Shortcuts</h1>
      <p style={{ color: themeColors.textSecondary }}>Boost your productivity in the editor.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>File & Workspace</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle File Explorer (left)</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + B</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Search</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + F</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Settings</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + ,</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Git Panel (left)</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + G</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Debug Panel (left)</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + `</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Terminal</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + `</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Users Panel (right)</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + U</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Chat Panel (right)</td>
              <td className="border border-gray-200 dark-border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + C</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle AI Panel (right)</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + A</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Requests Panel (right, owner)</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + R</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>File & Workspace</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Save File</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + S</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Quick Open File</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + P</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Sidebar</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + B</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Command Palette</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>F1</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Show Editor Context Menu</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Shift + F10</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Execution & Terminal</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Run Code</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Enter</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Terminal</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + `</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Cursor & Multi-Cursor</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Add Cursor Above</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Alt + ↑</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Add Cursor Below</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Alt + ↓</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Add Cursors to Line Ends</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Shift + Alt + I</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Select All Occurrences</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + L</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Add Selection to Next Match</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + D</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Change All Occurrences</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + F2</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Cursor Undo</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + U</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Focus Next Cursor</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>(Not Assigned)</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Focus Previous Cursor</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>(Not Assigned)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Selection</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Expand Selection</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Shift + Alt + →</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Shrink Selection</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Shift + Alt + ←</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Set Selection Anchor</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + K, Ctrl + B</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Select to Bracket</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>(Not Assigned)</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Duplicate Selection</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>(Not Assigned)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Line Editing</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Copy Line Down</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Shift + Alt + ↓</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Copy Line Up</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Shift + Alt + ↑</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Move Line Down</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Alt + ↓</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Move Line Up</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Alt + ↑</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Insert Line Below</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Enter</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Insert Line Above</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + Enter</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Delete Line</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + K</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Join Lines</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>(Not Assigned)</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Sort Lines Ascending</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>(Not Assigned)</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Sort Lines Descending</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>(Not Assigned)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Comments</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Line Comment</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + /</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Add Line Comment</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + K, Ctrl + C</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Remove Line Comment</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + K, Ctrl + U</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Block Comment</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Shift + Alt + A</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Folding</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle Fold</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + K, Ctrl + L</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Fold</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + [</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Unfold</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + ]</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Fold All</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + K, Ctrl + 0</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Unfold All</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + K, Ctrl + J</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Fold Recursively</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + K, Ctrl + [</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Unfold Recursively</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + K, Ctrl + ]</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Navigation</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Go to Line / Column</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + G</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Go to Matching Bracket</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + \</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Go to Next Problem</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Alt + F8</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Go to Previous Problem</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Shift + Alt + F8</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Find & Replace</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Find</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + F</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Find Next</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Enter</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Find Previous</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Shift + Enter</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Replace</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + H</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Replace with Next Value</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + .</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Replace with Previous Value</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Shift + ,</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Indentation</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Indent Line</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + ]</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Outdent Line</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + [</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Convert Indentation to Spaces</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>(Not Assigned)</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Convert Indentation to Tabs</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>(Not Assigned)</td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Change Tab Display Size</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>(Not Assigned)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Suggestions & Editor</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr style={{ background: themeColors.cardBg }}>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Action</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" style={{ color: themeColors.text }}>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Trigger Suggest / Autocomplete</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>Ctrl + Space</td>
            </tr>
            <tr style={{ background: themeColors.cardBg }}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" style={{ color: themeColors.textSecondary }}>Toggle High Contrast Theme</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm" style={{ color: themeColors.text }}>(Not Assigned)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Notes</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>(Not Assigned) shortcuts may be added in future updates</li>
        <li>Shortcuts follow VS Code–compatible conventions where possible</li>
        <li>Platform-specific overrides (macOS) may differ</li>
      </ul>

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
            onClick={() => onNavigate('api-reference')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            API Reference →
          </button>
          <button
            onClick={() => onNavigate('files-editor')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Files & Editor →
          </button>
          <button
            onClick={() => onNavigate('running-code')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Running Code →
          </button>
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcuts
