import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useSocket } from '../../contexts/SocketContext'
import { useSession } from '../../contexts/SessionContext'
import { useAuth } from '../../contexts/AuthContext'

interface ChatMessage {
  id: string
  user_id: string
  user_name: string
  message: string
  timestamp: string
}

interface ChatPanelProps {
  isActive?: boolean;
  onUnreadCountChange?: (count: number) => void;
}

export function ChatPanel({ isActive = false, onUnreadCountChange }: ChatPanelProps) {
  const { themeColors, settings } = useTheme()
  const { socket, isConnected } = useSocket()
  const { session } = useSession()
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Reset unread count when panel becomes active
  useEffect(() => {
    if (isActive) {
      setUnreadCount(0)
      onUnreadCountChange?.(0)
    }
  }, [isActive, onUnreadCountChange])

  // Notify parent of unread count changes
  useEffect(() => {
    onUnreadCountChange?.(unreadCount)
  }, [unreadCount, onUnreadCountChange])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load chat history when panel opens
  useEffect(() => {
    if (socket && isConnected && session) {
      socket.emit('get_chat_history', { session_id: session.id })
    }
  }, [socket, isConnected, session])

  // Listen for socket events
  useEffect(() => {
    if (!socket) return

    const handleChatMessage = (message: ChatMessage) => {
      setMessages(prev => [...prev, message])

      // Increment unread count if panel is not active
      if (!isActive) {
        setUnreadCount(prev => prev + 1)
      }
    }

    const handleChatHistory = (data: { messages: ChatMessage[] }) => {
      setMessages(data.messages)
    }

    socket.on('chat_message', handleChatMessage)
    socket.on('chat_history', handleChatHistory)

    return () => {
      socket.off('chat_message', handleChatMessage)
      socket.off('chat_history', handleChatHistory)
    }
  }, [socket])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      if (newMessage) {
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
      }
    }
  }, [newMessage])

  const handleSendMessage = async () => {
    if (!socket || !isConnected || !session || !user || !newMessage.trim()) {
      return
    }

    const message = newMessage.trim()
    setNewMessage('')
    setIsLoading(true)

    try {
      socket.emit('send_chat_message', {
        session_id: session.id,
        user_id: user.uid,
        user_name: user.name || user.email || 'Anonymous',
        message: message
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      // Re-add the message to input if failed
      setNewMessage(message)
    } finally {
      setIsLoading(false)
    }
  }



  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div
        className="px-4 py-3 border-b font-semibold text-sm flex items-center gap-2"
        style={{
          borderColor: themeColors.border,
          color: themeColors.text
        }}
      >
        <MessageCircle size={16} />
        Chat
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-sm py-8" style={{ color: themeColors.textSecondary }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className="flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{
                    background: `hsl(${message.user_name.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 360}, 70%, 50%)`,
                    color: 'white'
                  }}
                >
                  {message.user_name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className="font-medium text-sm"
                    style={{ color: themeColors.text }}
                  >
                    {message.user_name}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: themeColors.textSecondary }}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div
                  className="text-sm break-words whitespace-pre-wrap"
                  style={{ color: themeColors.text }}
                >
                  {message.message}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4" style={{ borderColor: themeColors.border }}>
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected || isLoading}
            rows={1}
            className="flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 resize-none"
            style={{
              background: themeColors.cardBg,
              borderColor: themeColors.border,
              color: themeColors.text,
              minHeight: '40px',
              maxHeight: '120px'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !newMessage.trim() || isLoading}
            className="px-3 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{
              background: settings.accentColor,
              color: 'white'
            }}
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-xs mt-2" style={{ color: themeColors.textSecondary }}>
          Press Enter to send, Shift+Enter for new line • Messages are session-only and deleted when session ends
        </div>
      </div>
    </div>
  )
}