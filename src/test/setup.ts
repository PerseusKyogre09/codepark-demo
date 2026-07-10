import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Fix for libraries like xterm requiring 'self' or 'window' properties globally
if (typeof globalThis !== 'undefined' && typeof (globalThis as any).self === 'undefined') {
  (globalThis as any).self = globalThis;
}

// Mock localStorage if missing or throw-prone in test environments
if (typeof window !== 'undefined') {
  const store: Record<string, string> = {};
  const mockStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { for (const k of Object.keys(store)) { delete store[k]; } }
  };
  
  try {
    delete (window as any).localStorage;
  } catch (e) {}
  try {
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true
    });
  } catch (e) {
    (window as any).localStorage = mockStorage;
  }
  
  (globalThis as any).localStorage = mockStorage;
}

// Mock matchMedia for xterm ScreenDprMonitor
if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
    writable: true,
    configurable: true
  });
}

// Mock ResizeObserver for layout resize logic
if (typeof window !== 'undefined' && typeof window.ResizeObserver === 'undefined') {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, 'ResizeObserver', {
    value: MockResizeObserver,
    writable: true,
    configurable: true
  });
  (globalThis as any).ResizeObserver = MockResizeObserver;
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});
