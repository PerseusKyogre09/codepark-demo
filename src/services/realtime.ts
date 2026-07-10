/**
 * services/realtime.ts — DEMO VERSION
 * Re-exports fakeSocket as the drop-in RealtimeSocket implementation.
 * The production NativeWebSocketAdapter is completely removed.
 */

import { FakeRealtimeSocket, createFakeRealtimeSocket } from '../demo/fakeSocket'

export type RealtimeEventHandler<T = any> = (data: T) => void

export type RealtimeSocket = FakeRealtimeSocket

interface CreateRealtimeSocketOptions {
  baseUrl: string
  wsBaseUrl?: string
  getWsToken?: (sessionId: string) => Promise<string>
}

export const createRealtimeSocket = (_options: CreateRealtimeSocketOptions): RealtimeSocket => {
  return createFakeRealtimeSocket(_options)
}
