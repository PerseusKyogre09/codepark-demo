import type { FirebaseConfig, User, Project, SaveProjectOptions, SessionInfo, Notification, Friend, FriendRequest, AchievementFamilyProgress, ProjectAccessState } from '../types'
import { AppError, ErrorType, retryWithBackoff, logError } from '../utils/errorHandling'
import { getNextRequestId, getCurrentNavigationId, getActiveTraceContext } from '../utils/debugTracer'

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || ''
  const hostname = window.location.hostname
  
  // If we are accessing via a private network IP (RFC 1918 / Tailscale),
  // and the configured URL is a dev tunnel, we should use a relative path.
  // This allows the Vite dev server proxy to handle the request.
  // We exclude 'localhost' here to avoid potential proxy resolution issues on some systems.
  const isPrivateIp = 
    hostname === 'localhost' ||
    hostname === '127.0.0.1' || 
    hostname.startsWith('10.') || 
    hostname.startsWith('192.168.') || 
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
    hostname.startsWith('100.')
    
  if (isPrivateIp && (envUrl.includes('devtunnels.ms') || envUrl.includes('app.github.dev'))) {
    return ''
  }
  
  const result = envUrl || ''
  console.log('[API] Base URL determined:', result || '(relative)', { envUrl, isPrivateIp });
  return result
}

const API_BASE_URL = getApiBaseUrl()

class APIClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Enhanced fetch with error handling and retry logic
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    shouldRetry: boolean = true
  ): Promise<Response> {
    const requestId = getNextRequestId()
    const navigationId = getCurrentNavigationId()
    const trace = getActiveTraceContext()
    const stack = new Error().stack || ""
    
    // Determine caller from stack trace if trace context is missing
    let componentName = trace?.component || "unknown"
    let mountId = trace?.mountId || 0
    if (componentName === "unknown") {
      const match = stack.match(/at\s+([A-Z][a-zA-Z0-9]+Page|[A-Z][a-zA-Z0-9]+Shell|[A-Z][a-zA-Z0-9]+Manager|[A-Z][a-zA-Z0-9]+Provider)\b/)
      if (match && match[1]) {
        componentName = match[1]
      }
    }

    // Check if this is one of our instrumented endpoints
    const instrumentedEndpoints = [
      "/projects",
      "/activity/recent",
      "/friends",
      "/notifications",
      "/friends/requests/pending",
      "/users/presence/heartbeat"
    ]
    const isInstrumented = instrumentedEndpoints.some(ep => url.includes(ep))

    if (isInstrumented) {
      console.log(
        `%c[API-TRACE] 📥 Request #${requestId} (Nav #${navigationId})\n` +
        ` ├── Endpoint: ${url}\n` +
        ` ├── Caller: ${componentName} (Mount ID: ${mountId})\n` +
        ` └── Stack Trace:\n${stack}`,
        'color: #3b82f6;'
      )
    }

    // Inject correlation headers
    const newHeaders = {
      ...(options.headers || {}),
      'X-Debug-Request-ID': String(requestId),
      'X-Debug-Navigation-ID': String(navigationId),
      'X-Debug-Caller': `${componentName}:${mountId}`
    }

    const fetchFn = async () => {
      try {
        let requestUrl = url;
        if (url.startsWith('/') && typeof window !== 'undefined' && window.location) {
          requestUrl = `${window.location.origin}${url}`;
        }
        const response = await fetch(requestUrl, {
          ...options,
          headers: newHeaders,
          credentials: 'include',
        })

        return response
      } catch (error) {
        // Network error
        logError(error, 'API Fetch')
        throw new AppError(
          'Network error. Please check your connection.',
          ErrorType.NETWORK,
          undefined,
          error
        )
      }
    }

    if (shouldRetry) {
      return retryWithBackoff(fetchFn, {
        maxRetries: 2,
        initialDelay: 1000,
        onRetry: (attempt) => {
          if (import.meta.env.DEV) {
            console.log(`[API] Retrying request to ${url} (attempt ${attempt})`)
          }
        },
      })
    }

    return fetchFn()
  }

  /**
   * Parse error response from API
   */
  private async handleErrorResponse(response: Response, context: string): Promise<never> {
    let errorMessage = `${context} failed`
    let errorType: ErrorType = ErrorType.SERVER

    try {
      const data = await response.json()
      errorMessage = data.error || data.message || errorMessage
    } catch {
      // Response is not JSON, use status text
      errorMessage = response.statusText || errorMessage
    }

    // Determine error type based on status code
    if (response.status === 401 || response.status === 403) {
      errorType = ErrorType.AUTHENTICATION
      // Only set default message if we didn't get one from the backend
      if (errorMessage === `${context} failed`) {
        errorMessage = 'Authentication required. Please log in.'
      }
    } else if (response.status === 400) {
      errorType = ErrorType.VALIDATION
    } else if (response.status >= 500) {
      errorType = ErrorType.SERVER
      errorMessage = 'Server error. Please try again later.'
    }

    logError(errorMessage, context)
    throw new AppError(errorMessage, errorType, response.status)
  }

  /**
   * Get Firebase configuration from backend
   */
  async getFirebaseConfig(): Promise<FirebaseConfig> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/auth/firebase-config`,
      {},
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get Firebase config')
    }

    const data: unknown = await response.json()
    const requiredKeys: (keyof FirebaseConfig)[] = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId',
    ]

    if (typeof data !== 'object' || data === null) {
      throw new AppError('Invalid Firebase configuration response', ErrorType.SERVER)
    }

    for (const key of requiredKeys) {
      const value = (data as Record<string, unknown>)[key]
      if (typeof value !== 'string' || !value) {
        throw new AppError(`Missing Firebase configuration value: ${key}`, ErrorType.SERVER)
      }
    }

    return data as FirebaseConfig
  }

  /**
   * Retrieve the latest session snapshot including file contents.
   */
  async getSessionSnapshot(sessionId: string): Promise<{
    session_id: string
    active_file: string
    files: Record<string, { content: string; version: number }>
    project_id?: string
    project_name?: string
  }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/sessions/${sessionId}/code`,
      {},
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get session snapshot')
    }

    const data = await response.json()
    return {
      session_id: data.session_id,
      active_file: data.active_file,
      files: data.files ?? {},
      project_id: data.project_id,
      project_name: data.project_name,
    }
  }

  /**
   * Login with Firebase ID token
   */
  async login(idToken: string): Promise<User> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/auth/firebase/exchange`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken, storage_mode: 'firestore' }),
      },
      false
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Login')
    }

    const data = await response.json()
    return data.user
  }

  /**
   * Update GitHub access token for the current user
   */
  async updateGithubToken(token: string): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/auth/github-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ github_token: token }),
      }
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Update GitHub Token')
    }

    return response.json()
  }

  /**
   * Publish project to GitHub
   */
  async publishToGitHub(sessionId: string, name: string, isPrivate: boolean): Promise<{ success: boolean; url: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId, name, private: isPrivate }),
      }
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Publish to GitHub')
    }

    return response.json()
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/auth/logout`,
      {
        method: 'POST',
      },
      false // Don't retry logout
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Logout')
    }
  }

  /**
   * Check if user is authenticated
   */
  async checkAuth(): Promise<boolean> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/api/auth/me`, {}, false)

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      return Boolean(data.authenticated)
    } catch (error) {
      // Silently fail auth check
      logError(error, 'Check Auth')
      return false
    }
  }

  /**
   * Verify Firebase ID token with backend
   */
  async verifyToken(idToken: string): Promise<User> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/auth/firebase/exchange`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken, storage_mode: 'firestore' }),
      },
      false
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Verify token')
    }

    const data = await response.json()
    return data.user
  }

  async getWebsocketToken(sessionId: string): Promise<{ token: string; expiresIn: number; user: any }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/auth/ws-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      },
      false
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get WebSocket token')
    }

    return response.json()
  }

  async getUserActivity(username: string, year?: number): Promise<{ heatmap: Record<string, number>; streak: { current: number; max: number } }> {
    const url = year
      ? `${this.baseUrl}/api/users/${username}/activity?year=${year}`
      : `${this.baseUrl}/api/users/${username}/activity`;

    const response = await this.fetchWithRetry(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      },
      false
    );

    if (!response.ok) {
      // If activity fetch fails, return empty structure rather than crashing
      return { heatmap: {}, streak: { current: 0, max: 0 } };
    }

    const data = await response.json();

    // Support both old (just heatmap) and new (heatmap + streak) formats
    if (data.heatmap && data.streak) {
      return data;
    }

    return { heatmap: data, streak: { current: 0, max: 0 } };
  }

  /**
   * Get aggregated stats for current user
   */
  async getMyStats(): Promise<any> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/me/stats`,
      {},
      true
    );

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get user stats')
    }

    return await response.json();
  }

  /**
   * List all projects for the current user
   */
  async listProjects(): Promise<Project[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects`,
      {},
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'List projects')
    }

    const data: unknown = await response.json()
    if (!Array.isArray(data)) {
      return []
    }

    return data
      .filter((project): project is Record<string, unknown> =>
        Boolean(project) && typeof project === 'object'
      )
      .map((project): Project | null => {
        const id = project.id ?? project.project_id
        if (typeof id !== 'string') {
          return null
        }

        const storageType: Project['storage_type'] =
          project.storage_type === 'git' || project.storage_type === 'firestore'
            ? project.storage_type
            : 'workspace'

        const recentFiles = Array.isArray(project.recent_files)
          ? project.recent_files.filter((file): file is string => typeof file === 'string')
          : []

        // Normalize owner id to string if present in any shape
        const ownerRaw = project.owner_id ?? (project as any).ownerId ?? (project as any).owner
        const owner_id = typeof ownerRaw === 'string'
          ? ownerRaw
          : ownerRaw != null
            ? String(ownerRaw)
            : undefined

        // Capture collaborator role if provided by API (various possible keys)
        const roleCandidate =
          typeof (project as any).role === 'string'
            ? (project as any).role
            : typeof (project as any).permission === 'string'
              ? (project as any).permission
              : typeof (project as any).collaboration_role === 'string'
                ? (project as any).collaboration_role
                : undefined

        const allFiles = Array.isArray(project.all_files)
          ? project.all_files.filter((file): file is string => typeof file === 'string')
          : []

        const normalizeTimestamp = (v: unknown): string => {
          if (v === null || v === undefined || v === '') return ''
          if (typeof v === 'number') {
            const ms = v < 1e12 ? v * 1000 : v
            return new Date(ms).toISOString()
          }
          if (typeof v === 'string') {
            const n = Number(v)
            if (!isNaN(n) && v.trim() !== '') {
              const ms = n < 1e12 ? n * 1000 : n
              return new Date(ms).toISOString()
            }
            return v
          }
          return ''
        }

        return {
          id,
          name:
            typeof project.name === 'string' && project.name.trim()
              ? project.name
              : 'Untitled Project',
          created_at: normalizeTimestamp(project.created_at),
          updated_at: normalizeTimestamp(project.updated_at),
          active_file:
            typeof project.active_file === 'string'
              ? project.active_file
              : undefined,
          recent_files: recentFiles,
          all_files: allFiles,
          storage_type: storageType,
          git_commit_hash:
            typeof project.git_commit_hash === 'string'
              ? project.git_commit_hash
              : undefined,
          owner_id,
          role: roleCandidate as Project['role'] | undefined,
          background_image:
            typeof project.background_image === 'string'
              ? project.background_image
              : undefined,
          description:
            typeof project.description === 'string'
              ? project.description
              : undefined,
        }

      })
      .filter((project): project is Project => project !== null)
  }

  /**
   * Get project collaborators
   */
  async getProjectCollaborators(projectId: string): Promise<any[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/collaborators`,
      {},
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get project collaborators')
    }

    return response.json()
  }

  /**
   * Get active participants for a live session
   */
  async getSessionParticipants(sessionId: string): Promise<any[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/sessions/${sessionId}/participants`,
      {},
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get session participants')
    }

    return response.json()
  }

  /**
   * Update a collaborator's role
   */
  async updateProjectCollaboratorRole(projectId: string, userId: string, role: 'editor' | 'viewer'): Promise<{ success: boolean, error?: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/collaborators/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      },
      true
    )

    if (!response.ok) {
      try {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to update role' };
      } catch {
        return { success: false, error: response.statusText };
      }
    }

    return { success: true };
  }

  /**
   * Delete a persisted collaborator (owner only)
   */
  async deleteProjectCollaborator(projectId: string, userId: string): Promise<boolean> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/collaborators/${userId}`,
      {
        method: 'DELETE',
      },
      true
    )

    return response.ok
  }

  /**
   * Save a project (create new or update existing)
   * Supports autosave mode which skips git commits
   */
  async saveProject(options: SaveProjectOptions): Promise<Project> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Save project')
    }

    const data = await response.json()
    return {
      id: data.project_id,
      name: data.name,
      created_at: data.created_at,
      updated_at: data.updated_at,
      active_file: data.active_file,
      recent_files: data.recent_files,
      storage_type: data.storage_type,
      git_commit_hash: data.git_commit_hash,
      description: data.description,
    }
  }

  /**
   * Create a new project and associated session immediately.
   */
  async createProject(): Promise<{ project_id: string; session_id: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/create`,
      {
        method: 'POST',
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Create project')
    }

    return response.json()
  }

  /**
   * Open an existing project and create a new session
   */
  async openProject(projectId: string): Promise<SessionInfo> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/open`,
      {
        method: 'GET',
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Open project')
    }

    return response.json()
  }

  /**
   * Get the current user's access state for a project invite.
   */
  async getProjectAccessState(projectId: string): Promise<ProjectAccessState> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/access-state`,
      {},
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get project access state')
    }

    return response.json()
  }

  /**
   * Request access to a project.
   */
  async requestProjectAccess(projectId: string, message?: string): Promise<{ success: boolean; status: string; request_id?: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/access-requests`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message ? { message } : {}),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Request project access')
    }

    return response.json()
  }

  /**
   * Respond to a project access request.
   */
  async respondToProjectAccessRequest(projectId: string, requesterId: string, approved: boolean): Promise<{ success: boolean; approved: boolean; request_id?: string; session_id?: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/access-requests/${requesterId}/respond`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Respond to project access request')
    }

    return response.json()
  }

  /**
   * Rename an existing project
   */
  async renameProject(projectId: string, name: string, description?: string): Promise<Project> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/rename`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Rename project')
    }

    const data = await response.json()
    return {
      id: projectId,
      name: data.name,
      created_at: data.created_at ? this.normalizeTimestamp(data.created_at) : '',
      updated_at: data.updated_at ? this.normalizeTimestamp(data.updated_at) : new Date().toISOString(),
      active_file: data.active_file,
      recent_files: data.recent_files || [],
      storage_type: data.storage_type || 'firestore',
      git_commit_hash: data.git_commit_hash,
      description: data.description,
    } as Project
  }

  private normalizeTimestamp(v: unknown): string {
    if (v === null || v === undefined || v === '') return ''
    if (typeof v === 'number') {
      const ms = v < 1e12 ? v * 1000 : v
      return new Date(ms).toISOString()
    }
    if (typeof v === 'string') {
      const n = Number(v)
      if (!isNaN(n) && v.trim() !== '') {
        const ms = n < 1e12 ? n * 1000 : n
        return new Date(ms).toISOString()
      }
      return v
    }
    return ''
  }

  /**
   * Switch to a different branch session
   */
  async switchBranch(oldSessionId: string, branchName: string, userId: string): Promise<{ success: boolean; new_session_id: string; files: any; branch: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/switch-branch`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: oldSessionId, branch: branchName, user_id: userId }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Switch Branch');
    }

    return response.json();
  }

  /**
   * Get list of branches for a session
   */
  async getBranches(sessionId: string): Promise<{ branches: any[], current: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/branches?session_id=${sessionId}`,
      {
        method: 'GET',
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get branches')
    }

    return response.json()
  }


  async saveFilestoFirebase(sessionId: string): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/sessions/${sessionId}/persist`,
      { method: 'POST' },
      true
    );

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Persist files to Firebase');
    }

    return response.json();
  }

  /**
   * Create a new branch
   */
  async createBranch(sessionId: string, branchName: string, startPoint?: string): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/branch/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId, name: branchName, start_point: startPoint }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Create branch')
    }

    return response.json()
  }

  /**
   * Merge a branch
   */
  async mergeBranch(sessionId: string, branchName: string): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/branch/merge`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId, name: branchName }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Merge branch')
    }

    return response.json()
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}`,
      {
        method: 'DELETE',
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Delete project')
    }
  }

  /**
   * Upload project background image (Pro only)
   */
  async uploadProjectBackground(projectId: string, file: File): Promise<{ success: boolean; image_url: string }> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/background`,
      {
        method: 'POST',
        body: formData,
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Upload project background')
    }

    return response.json()
  }

  /**
   * Transfer project ownership to another user
   */
  async transferProject(projectId: string, targetUid: string): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/transfer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target_uid: targetUid }),
      },
      false
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Transfer project')
    }

    return response.json()
  }

  /**
   * Get Git status
   */
  async getGitStatus(sessionId: string): Promise<any> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/status?session_id=${sessionId}`,
      { credentials: 'include' },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get Git Status')
    }
    return response.json()
  }

  /**
   * Get Git Log
   */
  async getGitLog(sessionId: string, limit: number = 20): Promise<{ commits: any[] }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/log?session_id=${sessionId}&limit=${limit}`,
      { credentials: 'include' },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get Git Log')
    }
    return response.json()
  }

  /**
   * Get Git Diff
   */
  async getGitDiff(sessionId: string, filePath: string): Promise<{ diff: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/diff?session_id=${sessionId}&path=${encodeURIComponent(filePath)}`,
      { credentials: 'include' },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get Git Diff')
    }
    return response.json()
  }

  /**
   * Get Git Remotes
   */
  async getGitRemotes(sessionId: string): Promise<{ remotes: { name: string, url: string }[] }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/remotes?session_id=${sessionId}`,
      { credentials: 'include' },
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get Git Remotes')
    }
    return response.json()
  }

  /**
   * Fetch from Remote
   */
  async fetchFromRemote(sessionId: string, remote: string = 'origin'): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/fetch`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ session_id: sessionId, remote }),
      },
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Fetch from remote')
    }
    return response.json()
  }

  /**
   * Add Git Remote
   */
  async addGitRemote(sessionId: string, name: string, url: string): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/remote/add`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ session_id: sessionId, name, url }),
      },
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Add Git Remote')
    }
    return response.json()
  }

  /**
   * Remove Git Remote
   */
  async removeGitRemote(sessionId: string, name: string): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/remote/remove`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ session_id: sessionId, name }),
      },
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Remove Git Remote')
    }
    return response.json()
  }

  /**
   * Push to Remote
   */
  async pushToRemote(sessionId: string, remote: string, branch: string): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/push`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ session_id: sessionId, remote, branch }),
      },
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Push to Remote')
    }
    return response.json()
  }

  /**
   * Commit changes
   */
  async gitCommit(sessionId: string, message: string, authorName?: string, authorEmail?: string, files?: string[]): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/commit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          session_id: sessionId,
          message,
          author_name: authorName,
          author_email: authorEmail,
          files
        }),
      },
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Commit changes')
    }
    return response.json()
  }

  /**
   * Revert to commit
   */
  async gitRevert(sessionId: string, commitHash: string): Promise<{ success: boolean; files?: any, active_file?: string, error?: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/revert`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          session_id: sessionId,
          commit_hash: commitHash
        }),
      },
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Revert commit')
    }
    return response.json()
  }

  /**
   * Initialize Git Repo
   */
  async gitInit(sessionId: string): Promise<{ success: boolean; error?: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/init`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ session_id: sessionId }),
      },
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Initialize Git')
    }
    return response.json()
  }

  /**
   * Pull from Remote
   */
  async pullFromRemote(sessionId: string, remote: string, branch: string = 'main'): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/pull`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ session_id: sessionId, remote, branch }),
      },
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Pull from Remote')
    }
    return response.json()
  }

  /**
   * Test Remote Connection
   */
  async testRemoteConnection(sessionId: string, remote: string): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/git/remote/test`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ session_id: sessionId, remote }),
      },
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Test Remote Connection')
    }
    return response.json()
  }

  /**
   * Check AI Availability / Analyze Code
   * Note: The backend endpoint seems to be overloaded or checking status.
   * If passing code, it analyzes.
   */
  async analyzeCode(sessionId: string, code: string): Promise<{ response?: string; available?: boolean; error?: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/sessions/${sessionId}/ai_check`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
      },
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Analyze Code')
    }
    return response.json()
  }

  /**
   * Retrieve the ContextBase high-level project stack fingerprint
   */
  async getContextFingerprint(sessionId: string): Promise<{
    project_id: string;
    languages: Array<{ name: string; percentage: number }>;
    frameworks: {
      frontend: { name: string | null; confidence: number; evidence: string[] };
      backend: { name: string | null; confidence: number; evidence: string[] };
      database: { name: string | null; confidence: number; evidence: string[] };
    };
    entrypoints: Record<string, string>;
    service_boundaries: Array<{ name: string; root: string; type: string }>;
  }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/context/fingerprint?session_id=${encodeURIComponent(sessionId)}`,
      {},
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get Context Fingerprint')
    }
    return response.json()
  }

  /**
   * Retrieve import relationships, classification, and symbols for a path
   */
  async getContextFileNeighborhood(sessionId: string, path: string): Promise<{
    filePath: string;
    moduleType: string;
    purposeSummary: string;
    imports: string[];
    importedBy: string[];
    symbols: Array<{ name: string; type: string; line: number; path?: string }>;
  }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/context/file-neighborhood?session_id=${encodeURIComponent(sessionId)}&path=${encodeURIComponent(path)}`,
      {},
      true
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get Context File Neighborhood')
    }
    return response.json()
  }

  /**
   * Retrieve list of matching files sorted by graph distance to active file
   */
  async getContextProximitySort(
    sessionId: string,
    query: string,
    activeFile?: string
  ): Promise<Array<{
    path: string;
    relevance: 'direct' | 'neighbor' | 'unrelated';
    relationReason: string | null;
    distance: number;
  }>> {
    let url = `${this.baseUrl}/api/context/proximity-sort?session_id=${encodeURIComponent(sessionId)}&query=${encodeURIComponent(query)}`;
    if (activeFile) {
      url += `&active_file=${encodeURIComponent(activeFile)}`;
    }
    const response = await this.fetchWithRetry(url, {}, true)
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get Context Proximity Sort')
    }
    return response.json()
  }

  /**
   * Download a project as a ZIP file
   */
  async downloadProject(projectId: string): Promise<Blob> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/download`,
      {},
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Download project')
    }

    return response.blob()
  }

  /**
   * Copy/duplicate a project
   */
  async copyProject(projectId: string): Promise<Project> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/copy`,
      {
        method: 'POST',
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Copy project')
    }

    const data = await response.json()
    return {
      id: data.project_id,
      name: data.name,
      created_at: data.created_at,
      updated_at: data.updated_at,
      active_file: data.active_file,
      recent_files: data.recent_files,
      storage_type: data.storage_type,
      git_commit_hash: data.git_commit_hash,
      description: data.description,
    }
  }

  /**
   * Get public user profile by username
   */
  async getUserProfile(username: string): Promise<User> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/profile/${username}`,
      {},
      true
    )

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found')
      }
      return this.handleErrorResponse(response, 'Get user profile')
    }

    const data = await response.json()
    return data.user
  }

  /**
   * Get list of friends with presence status
   */
  async getFriends(): Promise<Friend[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/friends`,
      {},
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get friends list')
    }

    const data = await response.json()
    return data.friends || []
  }

  /**
   * Set username for current user
   */
  async setUsername(username: string): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/username`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Set username')
    }
  }

  /**
   * Check if username is available
   */
  async checkUsernameAvailability(username: string): Promise<boolean> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/check-username?username=${encodeURIComponent(username)}`,
      {},
      true
    )

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    return data.available
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(imageData: string): Promise<{ url: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/profile-picture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_data: imageData }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Upload profile picture')
    }

    return response.json()
  }

  /**
   * Update display name
   */
  async updateDisplayName(displayName: string): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/display-name`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ display_name: displayName }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Update display name')
    }
  }

  /**
   * Update bio
   */
  async updateBio(bio: string): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/bio`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Update bio')
    }
  }

  /**
   * Update pinned projects list
   */
  async updatePinnedProjects(projectIds: string[]): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/pinned-projects`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_ids: projectIds }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Update pinned projects')
    }
  }

  /**
   * Update UI settings
   */
  async updateUISettings(settings: any): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/settings/ui`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Update UI settings')
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationSettings(prefs: any[]): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/settings/notifications`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prefs }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Update notification settings')
    }
  }

  /**
   * Update user status and mode
   */
  async updateStatus(mode: string, status?: { text: string; emoji: string }): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/status`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode, status }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Update status')
    }
  }

  /**
   * Update profile display settings
   */
  async updateDisplaySettings(layout: string[], hiddenCards: string[]): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/settings/display`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ layout, hidden_cards: hiddenCards }),
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Update display settings')
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/me`,
      {
        method: 'DELETE',
      },
      true
    )

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Delete account')
    }
  }

  // ============================================================================
  // GitHub Integration
  // ============================================================================

  /**
   * Get GitHub connection status
   */
  async getGitHubStatus(): Promise<{ connected: boolean; username?: string; avatar_url?: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/github/status`,
      { method: 'GET' },
      false
    )
    if (!response.ok) {
      return { connected: false }
    }
    return response.json()
  }

  /**
   * Get user's GitHub repositories
   */
  async getGitHubRepos(page: number = 1, perPage: number = 30): Promise<{ repos: any[]; page: number; per_page: number }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/github/repos?page=${page}&per_page=${perPage}`,
      { method: 'GET' },
      false
    )
    if (!response.ok) {
      return this.handleErrorResponse(response, 'Get GitHub repos')
    }
    return response.json()
  }

  /**
   * Import a GitHub repository as a new project
   */
  async importGitHubRepo(repoUrl: string, name?: string): Promise<{ success: boolean; project_id?: string; name?: string; error?: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/github/import`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl, name })
      },
      false
    )
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      return { success: false, error: data.error || 'Import failed' }
    }
    return response.json()
  }

  /**
   * Disconnect GitHub account
   */
  async disconnectGitHub(): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/github/disconnect`,
      { method: 'DELETE' },
      false
    )
    if (!response.ok) {
      return { success: false }
    }
    return response.json()
  }
  /**
   * Send friend request to a user by username
   */
  async sendFriendRequest(username: string): Promise<{ success: boolean; status: string; detail?: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/friends/requests/${encodeURIComponent(username)}`,
      { method: 'POST' },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Send friend request')
    return response.json()
  }

  /**
   * Get list of pending incoming and outgoing friend requests
   */
  async getPendingRequests(): Promise<{ incoming: FriendRequest[]; outgoing: FriendRequest[] }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/friends/requests/pending`,
      {},
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Get pending friend requests')
    return response.json()
  }

  /**
   * Accept a friend request
   */
  async acceptFriendRequest(requestId: string): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/friends/requests/${encodeURIComponent(requestId)}/accept`,
      { method: 'POST' },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Accept friend request')
    return response.json()
  }

  /**
   * Decline a friend request
   */
  async declineFriendRequest(requestId: string): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/friends/requests/${encodeURIComponent(requestId)}/decline`,
      { method: 'POST' },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Decline friend request')
    return response.json()
  }

  /**
   * Remove a friend
   */
  async removeFriend(username: string): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/friends/${encodeURIComponent(username)}`,
      { method: 'DELETE' },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Remove friend')
    return response.json()
  }

  /**
   * Get friendship relationship status with target username
   */
  async getFriendshipRelationship(username: string): Promise<{ status: 'none' | 'friends' | 'pending_incoming' | 'pending_outgoing'; request_id?: string }> {
    try {
      const response = await this.fetchWithRetry(
        `${this.baseUrl}/api/friends/relationship/${encodeURIComponent(username)}`,
        {},
        false
      )
      if (!response.ok) return { status: 'none' }
      return response.json()
    } catch {
      return { status: 'none' }
    }
  }

  /**
   * Update user presence mode and status
   */
  async updatePresence(mode: string, statusText?: string): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/presence`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, status_text: statusText })
      },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Update presence')
    return response.json()
  }

  /**
   * Send heartbeat to update real-time presence
   */
  async sendPresenceHeartbeat(
    state: string,
    activePage: string,
    activeProjectId: string | null = null,
    activeProjectName: string | null = null
  ): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/presence/heartbeat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          active_page: activePage,
          active_project_id: activeProjectId,
          active_project_name: activeProjectName
        })
      },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Send presence heartbeat')
    return response.json()
  }

  /**
   * Update presence privacy settings
   */
  async updatePrivacySettings(
    presenceVisibility: string,
    activityVisibility: boolean,
    lastSeenVisibility: string,
    showHeatmap?: boolean,
    showName?: boolean,
    showEmail?: boolean,
    profilePrivate?: boolean
  ): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/settings/privacy`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presence_visibility: presenceVisibility,
          activity_visibility: activityVisibility,
          last_seen_visibility: lastSeenVisibility,
          show_heatmap: showHeatmap,
          show_name: showName,
          show_email: showEmail,
          profile_private: profilePrivate
        })
      },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Update privacy settings')
    return response.json()
  }

  /**
   * Fetch activity summary (counters and totals)
   */
  async getActivitySummary(): Promise<{
    stats: Record<string, number>;
    last_active: number;
    friends_count: number;
    collaborators_count: number;
    shared_projects_count: number;
    shared_sessions_count: number;
  }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/activity/summary`,
      {},
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Get activity summary')
    return response.json()
  }

  /**
   * Fetch activity heatmap with filtering
   */
  async getUserHeatmap(username: string, filter: string = 'All Activity'): Promise<{
    heatmap: Record<string, number>;
    streak: { current: number; max: number };
  }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/activity/${encodeURIComponent(username)}/heatmap?filter=${encodeURIComponent(filter)}`,
      {},
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Get activity heatmap')
    return response.json()
  }

  /**
   * Fetch recent user activity logs
   */
  async getRecentUserActivity(limit: number = 20): Promise<any[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/activity/recent?limit=${limit}`,
      {},
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Get recent activity')
    return response.json()
  }

  /**
   * Get current user's achievements
   */
  async getMyAchievements(): Promise<AchievementFamilyProgress[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/achievements`,
      {},
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Get achievements')
    return response.json()
  }

  /**
   * Get target user's achievements
   */
  async getUserAchievements(username: string): Promise<AchievementFamilyProgress[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/achievements/${encodeURIComponent(username)}`,
      {},
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Get user achievements')
    return response.json()
  }

  /**
   * Pin up to 5 completed achievements
   */
  async pinAchievements(pinnedIds: string[]): Promise<{ success: boolean; pinned_achievements: string[] }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/achievements/pinned`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pinned_ids: pinnedIds }),
      },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Pin achievements')
    return response.json()
  }


  /**
   * Accept project or session invitation
   */
  async acceptInvite(notificationId: string): Promise<{ success: boolean; project_id?: string; session_id?: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/notifications/${encodeURIComponent(notificationId)}/accept-invite`,
      { method: 'POST' },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Accept invite')
    return response.json()
  }

  /**
   * Decline project or session invitation
   */
  async declineInvite(notificationId: string): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/notifications/${encodeURIComponent(notificationId)}/decline-invite`,
      { method: 'POST' },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Decline invite')
    return response.json()
  }

  /**
   * Block a user
   */
  async blockUser(blockedUid: string): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/block/${encodeURIComponent(blockedUid)}`,
      { method: 'POST' },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Block user')
    return response.json()
  }

  /**
   * Unblock a user
   */
  async unblockUser(blockedUid: string): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/unblock/${encodeURIComponent(blockedUid)}`,
      { method: 'POST' },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Unblock user')
    return response.json()
  }

  /**
   * Fetch all notifications for the logged-in user
   */
  async getNotifications(): Promise<Notification[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/notifications`,
      {},
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Get notifications')
    return response.json()
  }

  /**
   * Mark a single notification as read
   */
  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/notifications/${encodeURIComponent(id)}/read`,
      { method: 'POST' },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Mark notification as read')
    return response.json()
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/notifications/read-all`,
      { method: 'POST' },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Mark all notifications as read')
    return response.json()
  }

  /**
   * Send a direct invite to a friend
   */
  async sendInvite(friendUid: string, projectId?: string, sessionId?: string): Promise<{ success: boolean }> {
    const payload = projectId
      ? { friend_uid: friendUid, project_id: projectId }
      : { friend_uid: friendUid, session_id: sessionId }
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/notifications/invite`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Send invite')
    return response.json()
  }

  /**
   * Get list of blocked users
   */
  async getBlockedUsers(): Promise<User[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/users/blocked`,
      {},
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Get blocked users')
    const data = await response.json()
    return data.users || []
  }

  /**
   * Search users by username, name, email, or handle
   */
  async searchUsers(query: string): Promise<Array<{ uid: string; username: string; name: string; email?: string; picture?: string }>> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/friends/search-users?q=${encodeURIComponent(query)}`,
      {},
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Search users')
    return response.json()
  }

  /**
   * Update project settings (e.g. contextBaseAutoScan)
   */
  async updateProjectSettings(projectId: string, settings: { context_base_auto_scan: boolean }): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/projects/${projectId}/settings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Update project settings')
    return response.json()
  }

  /**
   * Trigger a manual full indexing scan for the workspace
   */
  async triggerManualScan(sessionId: string): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/context/scan?session_id=${encodeURIComponent(sessionId)}`,
      {
        method: 'POST',
      },
      true
    )
    if (!response.ok) return this.handleErrorResponse(response, 'Trigger manual scan')
    return response.json()
  }
}


// Export singleton instance
export const apiClient = new APIClient()
export default apiClient
