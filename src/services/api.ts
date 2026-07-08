/**
 * services/api.ts — DEMO VERSION
 * Re-exports fakeApi as the drop-in apiClient.
 * The 2135-line production APIClient is completely removed.
 */

export { apiClient, getApiBaseUrl } from '../demo/fakeApi'
export { apiClient as default } from '../demo/fakeApi'
