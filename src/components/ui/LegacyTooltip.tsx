import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export const Tooltip = ({ 
  content, 
  children, 
  position = 'top',
  delay = 200 
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)
  const triggerRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // We'll compute fixed viewport coordinates for precise alignment
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    if (!isVisible) return

    const update = () => {
      const trigger = triggerRef.current
      const tooltipEl = tooltipRef.current
      if (!trigger || !tooltipEl) return

      const rect = trigger.getBoundingClientRect()
      const tipRect = tooltipEl.getBoundingClientRect()
      const offset = 8
      let top = 0
      let left = 0

      if (position === 'top') {
        top = rect.top - tipRect.height - offset
        left = rect.left + rect.width / 2 - tipRect.width / 2
      } else if (position === 'bottom') {
        top = rect.bottom + offset
        left = rect.left + rect.width / 2 - tipRect.width / 2
      } else if (position === 'left') {
        top = rect.top + rect.height / 2 - tipRect.height / 2
        left = rect.left - tipRect.width - offset
      } else {
        top = rect.top + rect.height / 2 - tipRect.height / 2
        left = rect.right + offset
      }

      // Keep tooltip inside the viewport with small padding
      const pad = 8
      const vw = document.documentElement.clientWidth
      const vh = document.documentElement.clientHeight
      left = Math.min(Math.max(left, pad), vw - tipRect.width - pad)
      top = Math.min(Math.max(top, pad), vh - tipRect.height - pad)

      setCoords({ top, left })
    }

    // Update immediately and on scroll/resize
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [isVisible, position])

  return (
    <div 
      ref={triggerRef}
      className="relative inline-block w-max"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        // Render tooltip at fixed viewport coordinates for robustness
        <div
          ref={tooltipRef}
          style={coords ? { position: 'fixed', top: coords.top, left: coords.left } : { position: 'fixed', opacity: 0 }}
          className={`
            z-50 px-3 py-2 text-sm rounded-lg
            bg-gray-900 text-white border border-white/10
            shadow-xl backdrop-blur-sm
            animate-fadeIn pointer-events-none
            whitespace-nowrap
          `}
        >
          {content}
          <div
            className={`
              absolute w-2 h-2 bg-gray-900 border-white/10 rotate-45
              ${position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2 border-b border-r' : ''}
              ${position === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2 border-t border-l' : ''}
              ${position === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2 border-r border-t' : ''}
              ${position === 'right' ? 'left-[-6px] top-1/2 -translate-y-1/2 border-l border-b' : ''}
            `}
          />
        </div>
      )}
    </div>
  )
}
