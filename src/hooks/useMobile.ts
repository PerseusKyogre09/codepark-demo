import { useState, useEffect } from 'react'

/**
 * Hook to detect mobile devices and screen sizes
 * Returns true if viewport width is below the mobile breakpoint (768px)
 */
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    // Check on mount
    checkMobile()

    // Listen for resize and orientation changes
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  return { isMobile, isTablet, orientation }
}
