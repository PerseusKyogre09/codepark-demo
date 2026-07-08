import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { X, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react'

type DialogType = 'alert' | 'confirm' | 'prompt'

interface DialogState {
  isOpen: boolean
  type: DialogType
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  defaultValue?: string
  resolve?: (value: any) => void
}

interface DialogContextType {
  showAlert: (title: string, message: string) => Promise<void>
  showConfirm: (title: string, message: string, confirmLabel?: string, cancelLabel?: string) => Promise<boolean>
  showPrompt: (title: string, message: string, defaultValue?: string) => Promise<string | null>
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

interface DialogProviderProps {
  children: ReactNode
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
  })

  const showAlert = (title: string, message: string): Promise<void> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: 'alert',
        title,
        message,
        resolve: () => {
          setDialog({ isOpen: false, type: 'alert', title: '', message: '' })
          resolve()
        },
      })
    })
  }

  const showConfirm = (title: string, message: string, confirmLabel?: string, cancelLabel?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        confirmLabel,
        cancelLabel,
        resolve: (value: boolean) => {
          setDialog({ isOpen: false, type: 'alert', title: '', message: '' })
          resolve(value)
        },
      })
    })
  }

  const showPrompt = (title: string, message: string, defaultValue = ''): Promise<string | null> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: 'prompt',
        title,
        message,
        defaultValue,
        resolve: (value: string | null) => {
          setDialog({ isOpen: false, type: 'alert', title: '', message: '' })
          resolve(value)
        },
      })
    })
  }

  const handleClose = () => {
    if (dialog.resolve) {
      if (dialog.type === 'confirm') {
        dialog.resolve(false)
      } else if (dialog.type === 'prompt') {
        dialog.resolve(null)
      } else {
        dialog.resolve(undefined)
      }
    }
  }

  const handleConfirm = () => {
    if (dialog.resolve) {
      if (dialog.type === 'confirm') {
        dialog.resolve(true)
      } else if (dialog.type === 'prompt') {
        // Handled in submit
      } else {
        dialog.resolve(undefined)
      }
    }
  }

  const handlePromptSubmit = (value: string) => {
    if (dialog.resolve) {
      dialog.resolve(value)
    }
  }

  // Override browser dialogs - commented out as they are sync
  // useEffect(() => {
  //   const originalAlert = window.alert
  //   const originalConfirm = window.confirm
  //   const originalPrompt = window.prompt

  //   window.alert = (message: string) => {
  //     showAlert('Alert', message)
  //   }

  //   window.confirm = (message?: string) => {
  //     // Can't override sync
  //     return originalConfirm(message)
  //   }

  //   window.prompt = (message?: string, defaultValue?: string) => {
  //     return originalPrompt(message, defaultValue)
  //   }

  //   return () => {
  //     window.alert = originalAlert
  //     window.confirm = originalConfirm
  //     window.prompt = originalPrompt
  //   }
  // }, [])

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      <Dialog
        dialog={dialog}
        onClose={handleClose}
        onConfirm={handleConfirm}
        onPromptSubmit={handlePromptSubmit}
      />
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return context
}

// Dialog Component

interface DialogProps {
  dialog: DialogState
  onClose: () => void
  onConfirm: () => void
  onPromptSubmit: (value: string) => void
}

function Dialog({ dialog, onClose, onConfirm, onPromptSubmit }: DialogProps) {
  const [promptValue, setPromptValue] = useState(dialog.defaultValue || '')

  if (!dialog.isOpen) return null

  const getIcon = () => {
    switch (dialog.type) {
      case 'alert':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case 'confirm':
        return <CheckCircle className="h-6 w-6 text-blue-500" />
      case 'prompt':
        return <MessageSquare className="h-6 w-6 text-green-500" />
    }
  }

  const getButtons = () => {
    switch (dialog.type) {
      case 'alert':
        return (
          <button
            onClick={onConfirm}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            OK
          </button>
        )
      case 'confirm':
        return (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {dialog.cancelLabel || 'Cancel'}
            </button>
            <button
              onClick={onConfirm}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dialog.confirmLabel || 'Confirm'}
            </button>
          </div>
        )
      case 'prompt':
        return (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => onPromptSubmit(promptValue)}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Icon and Title */}
        <div className="mb-4 flex items-center gap-3">
          {getIcon()}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {dialog.title}
          </h2>
        </div>

        {/* Message */}
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          {dialog.message}
        </p>

        {/* Prompt Input */}
        {dialog.type === 'prompt' && (
          <input
            type="text"
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            className="mb-6 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Enter value..."
          />
        )}

        {/* Buttons */}
        <div className="flex justify-end">
          {getButtons()}
        </div>
      </div>
    </div>
  )
}