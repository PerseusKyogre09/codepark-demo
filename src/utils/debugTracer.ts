let globalRequestCounter = 0
let globalNavigationId = 0
let globalMountCounter = 0

export interface TraceContext {
  component: string
  mountId: number
}

// Global active context for the current synchronous call stack
let activeContext: TraceContext | null = null

export function getNextRequestId(): number {
  globalRequestCounter++
  return globalRequestCounter
}

export function getCurrentNavigationId(): number {
  return globalNavigationId
}

export function startNewNavigation(reason: string): number {
  globalNavigationId++
  console.log(`%c[NAV-TRACE] 🚀 Start Navigation #${globalNavigationId} (Reason: ${reason})`, 'color: #3b82f6; font-weight: bold;')
  return globalNavigationId
}

export function getNextMountId(): number {
  globalMountCounter++
  return globalMountCounter
}

export function setActiveTraceContext(context: TraceContext | null) {
  activeContext = context
}

export function getActiveTraceContext(): TraceContext | null {
  return activeContext
}

export function traceCall<T>(component: string, mountId: number, fn: () => T): T {
  const prev = activeContext
  activeContext = { component, mountId }
  try {
    return fn()
  } finally {
    activeContext = prev
  }
}
