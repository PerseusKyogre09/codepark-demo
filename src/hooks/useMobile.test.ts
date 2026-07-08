import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMobile } from './useMobile'

describe('useMobile', () => {
  let originalInnerWidth: number
  let originalInnerHeight: number

  beforeEach(() => {
    // Save original values
    originalInnerWidth = window.innerWidth
    originalInnerHeight = window.innerHeight
  })

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    })
  })

  it('should detect mobile device when width < 768px', () => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    })

    const { result } = renderHook(() => useMobile())

    expect(result.current.isMobile).toBe(true)
    expect(result.current.isTablet).toBe(false)
  })

  it('should detect tablet device when width between 768px and 1024px', () => {
    // Set tablet viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 600,
    })

    const { result } = renderHook(() => useMobile())

    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(true)
  })

  it('should detect desktop device when width >= 1024px', () => {
    // Set desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    })

    const { result } = renderHook(() => useMobile())

    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(false)
  })

  it('should detect portrait orientation', () => {
    // Set portrait viewport (height > width)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    })

    const { result } = renderHook(() => useMobile())

    expect(result.current.orientation).toBe('portrait')
  })

  it('should detect landscape orientation', () => {
    // Set landscape viewport (width > height)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 667,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 375,
    })

    const { result } = renderHook(() => useMobile())

    expect(result.current.orientation).toBe('landscape')
  })

  it('should update on window resize', () => {
    // Start with mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    const { result } = renderHook(() => useMobile())

    expect(result.current.isMobile).toBe(true)

    // Resize to desktop
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      })
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current.isMobile).toBe(false)
  })

  it('should update on orientation change', () => {
    // Start with portrait
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    })

    const { result } = renderHook(() => useMobile())

    expect(result.current.orientation).toBe('portrait')

    // Change to landscape
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 667,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 375,
      })
      window.dispatchEvent(new Event('orientationchange'))
    })

    expect(result.current.orientation).toBe('landscape')
  })

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useMobile())

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })
})
