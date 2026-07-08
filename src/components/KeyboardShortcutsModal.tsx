import { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { defaultShortcuts, type KeyboardShortcut } from '../utils/keyboardShortcuts';
import { useTheme } from '../contexts/ThemeContext';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const { themeColors } = useTheme();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const parts = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.meta) parts.push('Cmd');
    parts.push(shortcut.key === ' ' ? 'Space' : shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  const shortcutsByCategory = defaultShortcuts.reduce((acc: Record<string, KeyboardShortcut[]>, shortcut: KeyboardShortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-4xl max-h-[80vh] rounded-xl shadow-2xl overflow-hidden"
        style={{
          background: themeColors.cardBg,
          border: `1px solid ${themeColors.border}`
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: themeColors.border }}>
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6" style={{ color: themeColors.textSecondary }} />
            <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: themeColors.textSecondary }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-8">
            {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => (
              <div key={category}>
                <h3 className="text-lg font-medium mb-4 capitalize" style={{ color: themeColors.text }}>
                  {category} Shortcuts
                </h3>
                <div className="grid gap-3">
                  {(shortcuts as KeyboardShortcut[]).map((shortcut: KeyboardShortcut, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{
                        background: themeColors.bg,
                        borderColor: themeColors.border
                      }}
                    >
                      <span className="text-sm" style={{ color: themeColors.text }}>
                        {shortcut.description}
                      </span>
                      <kbd
                        className="px-2 py-1 text-xs font-mono rounded border bg-black/10"
                        style={{
                          color: themeColors.textSecondary,
                          borderColor: themeColors.border
                        }}
                      >
                        {formatShortcut(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: themeColors.border }}>
            <div className="text-sm" style={{ color: themeColors.textSecondary }}>
              <p className="mb-2">
                <strong>Tip:</strong> All shortcuts work in the code editor and throughout the application.
                Shortcuts are disabled only when typing in input fields or text areas outside the editor.
              </p>
              <p>
                Press <kbd className="px-1 py-0.5 text-xs font-mono rounded bg-black/10">Esc</kbd> to close this dialog.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}