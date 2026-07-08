export interface ShortcutActions {
  toggleTerminal: () => void
  save: () => void
  toggleFileExplorer: () => void
  toggleSearch: () => void
  toggleSettings: () => void
  toggleDebugPanel: () => void
  toggleGitPanel: () => void
  toggleUsersPanel: () => void
  toggleChatPanel: () => void
  toggleAIPanel: () => void
  toggleRequestsPanel: () => void
  newFile: () => void
  closeTab: () => void
  nextTab: () => void
  prevTab: () => void
  focusEditor: () => void
  toggleFullscreen: () => void
}

export interface KeyboardShortcut {
  key: string
  code?: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean // Cmd on Mac, Windows key on Windows
  action: keyof ShortcutActions
  description: string
  category: 'editor' | 'navigation' | 'file' | 'view'
}

export const defaultShortcuts: KeyboardShortcut[] = [
  // Editor shortcuts (work globally)
  {
    key: 's',
    ctrl: true,
    action: 'save',
    description: 'Save the current file',
    category: 'editor'
  },
  {
    key: '`',
    code: 'Backquote',
    ctrl: true,
    action: 'toggleTerminal',
    description: 'Toggle terminal visibility',
    category: 'view'
  },

  // Navigation shortcuts
  {
    key: 'b',
    ctrl: true,
    shift: true,
    action: 'toggleFileExplorer',
    description: 'Toggle file explorer',
    category: 'navigation'
  },
  {
    key: 'g',
    code: 'KeyG',
    ctrl: true,
    shift: true,
    action: 'toggleGitPanel',
    description: 'Toggle git panel',
    category: 'navigation'
  },
  {
    key: '`',
    code: 'Backquote',
    ctrl: true,
    shift: true,
    action: 'toggleDebugPanel',
    description: 'Toggle debug panel',
    category: 'navigation'
  },
  {
    key: 'u',
    code: 'KeyU',
    ctrl: true,
    shift: true,
    action: 'toggleUsersPanel',
    description: 'Toggle users panel',
    category: 'navigation'
  },
  {
    key: 'c',
    code: 'KeyC',
    ctrl: true,
    shift: true,
    action: 'toggleChatPanel',
    description: 'Toggle chat panel',
    category: 'navigation'
  },
  {
    key: 'a',
    code: 'KeyA',
    ctrl: true,
    shift: true,
    action: 'toggleAIPanel',
    description: 'Toggle AI panel',
    category: 'navigation'
  },
  {
    key: 'r',
    code: 'KeyR',
    ctrl: true,
    shift: true,
    action: 'toggleRequestsPanel',
    description: 'Toggle requests panel',
    category: 'navigation'
  },
  {
    key: 'f',
    ctrl: true,
    action: 'toggleSearch',
    description: 'Toggle search',
    category: 'navigation'
  },
  {
    key: ',',
    ctrl: true,
    action: 'toggleSettings',
    description: 'Open settings',
    category: 'navigation'
  },

  // File shortcuts
  {
    key: 'n',
    ctrl: true,
    action: 'newFile',
    description: 'Create new file',
    category: 'file'
  },
  {
    key: 'w',
    ctrl: true,
    action: 'closeTab',
    description: 'Close current tab',
    category: 'file'
  },

  // Tab navigation
  {
    key: 'Tab',
    ctrl: true,
    action: 'nextTab',
    description: 'Next tab',
    category: 'navigation'
  },
  {
    key: 'Tab',
    ctrl: true,
    shift: true,
    action: 'prevTab',
    description: 'Previous tab',
    category: 'navigation'
  },

  // Focus shortcuts
  {
    key: 'l',
    ctrl: true,
    action: 'focusEditor',
    description: 'Focus editor',
    category: 'navigation'
  },

  // View shortcuts
  {
    key: 'Enter',
    ctrl: true,
    shift: true,
    action: 'toggleFullscreen',
    description: 'Toggle fullscreen',
    category: 'view'
  }
]

export const createKeyboardHandler = (actions: ShortcutActions) => {
  return (event: KeyboardEvent) => {
    // Check if we're in a Monaco editor
    const target = event.target as HTMLElement
    const isInMonaco = target?.closest('.monaco-editor')

    // Find matching shortcut
    const shortcut = defaultShortcuts.find(s => {
      const keyMatch = s.code ? s.code === event.code : (s.key || '').toLowerCase() === (event.key || '').toLowerCase()
      return keyMatch &&
        !!s.ctrl === event.ctrlKey &&
        !!s.alt === event.altKey &&
        !!s.shift === event.shiftKey &&
        !!s.meta === event.metaKey
    })

    if (shortcut) {
      // Skip shortcuts when typing in inputs/textareas (except when in Monaco)
      if (!isInMonaco && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
        const activeElement = document.activeElement as HTMLElement
        if (activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.contentEditable === 'true'
        )) {
          return
        }
      }

      // Allow all shortcuts to work, including in Monaco editor
      event.preventDefault()
      event.stopPropagation()
      actions[shortcut.action]()
    }
  }
}

// Monaco-specific shortcut overrides
export const getMonacoKeybindings = (monaco: any) => {
  return [
    // Disable Monaco's built-in Ctrl+S (save)
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      command: null
    },
    // Disable Monaco's built-in Ctrl+` (toggle terminal)
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backquote,
      command: null
    },
    // Reserve Ctrl+Shift+U for users panel
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyU,
      command: null
    },
    // Reserve Ctrl+Shift+C for chat panel
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyC,
      command: null
    },
    // Reserve Ctrl+Shift+A for AI panel
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyA,
      command: null
    },
    // Reserve Ctrl+Shift+R for requests panel
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyR,
      command: null
    },
    // Disable Monaco's built-in handling for Ctrl+Shift+G so we can use it for git panel
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyG,
      command: null
    },
    // Disable Monaco's built-in handling for Ctrl+Shift+` so we can use it for debug panel
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Backquote,
      command: null
    },
    // Disable Monaco's built-in Ctrl+B (toggle sidebar)
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB,
      command: null
    },
    // Disable Monaco's built-in Ctrl+Shift+B to reserve it for our explorer toggle
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyB,
      command: null
    },
    // Disable Monaco's built-in Ctrl+F (find)
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF,
      command: null
    },
    // Disable Monaco's built-in Ctrl+, (settings)
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Comma,
      command: null
    },
    // Disable Monaco's built-in Ctrl+N (new file)
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyN,
      command: null
    },
    // Disable Monaco's built-in Ctrl+W (close tab)
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyW,
      command: null
    },
    // Disable Monaco's built-in Ctrl+Tab (next tab)
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Tab,
      command: null
    },
    // Disable Monaco's built-in Ctrl+Shift+Tab (prev tab)
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Tab,
      command: null
    },
    // Disable Monaco's built-in F11 (fullscreen)
    {
      keybinding: monaco.KeyCode.F11,
      command: null
    }
  ]
}