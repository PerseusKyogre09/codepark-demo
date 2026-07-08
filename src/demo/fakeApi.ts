/**
 * fakeApi.ts
 * Drop-in replacement for the production apiClient.
 * All 55+ API methods return realistic mock data with simulated latency.
 */

import type {
  User, Project, SessionInfo, Notification, Friend, FirebaseConfig,
  AchievementFamilyProgress, ProjectAccessState, ProjectAccessRequest
} from '../types'
import { demoDb, uuid } from './fakeDatabase'
import { TEMPLATE_FILES } from './fakeDatabase'

// Simulated latency helper
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Fake friends data
const FAKE_FRIENDS: Friend[] = [
  {
    uid: 'friend-001',
    username: 'alice_chen',
    handle: 'alice_chen',
    name: 'Alice Chen',
    color: '#8B5CF6',
    mode: 'online',
    status_text: 'Building something cool',
    presence: { state: 'online', activePage: '/project/ai-dashboard', activeProjectName: 'ai-dashboard' },
  },
  {
    uid: 'friend-002',
    username: 'bob_martinez',
    handle: 'bob_martinez',
    name: 'Bob Martinez',
    color: '#EC4899',
    mode: 'coding',
    status_text: 'Deep in the zone 🎵',
    presence: { state: 'online', activePage: '/dashboard', activeProjectName: null },
  },
  {
    uid: 'friend-003',
    username: 'sara_k',
    handle: 'sara_k',
    name: 'Sara Kim',
    color: '#10B981',
    mode: 'idle',
    presence: { state: 'away', lastSeenAt: Math.floor(Date.now() / 1000) - 1800 },
  },
  {
    uid: 'friend-004',
    username: 'dev_priya',
    handle: 'dev_priya',
    name: 'Priya Nair',
    color: '#F59E0B',
    mode: 'offline',
    presence: { state: 'offline', lastSeenAt: Math.floor(Date.now() / 1000) - 86400 },
  },
]

// Fake activity events
function buildFakeActivities(n: number) {
  const types = [
    { event_type: 'files_edited', details: { file_name: 'src/App.tsx' } },
    { event_type: 'projects_created', details: {} },
    { event_type: 'branch_switched', details: { branch: 'feature/auth' } },
    { event_type: 'project_run', details: { file_name: 'main.py' } },
    { event_type: 'sessions_joined', details: {} },
    { event_type: 'files_edited', details: { file_name: 'models.py' } },
    { event_type: 'deployments', details: {} },
    { event_type: 'files_edited', details: { file_name: 'routes/api.js' } },
  ]
  const now = Math.floor(Date.now() / 1000)
  return Array.from({ length: n }, (_, i) => ({
    id: uuid(),
    event_type: types[i % types.length].event_type,
    details: types[i % types.length].details,
    created_at: now - i * 3600,
  }))
}

// ─── The Fake API Client ──────────────────────────────────────────────────────

class FakeApiClient {
  // ─── Auth ──────────────────────────────────────────────────────────────────

  async getFirebaseConfig(): Promise<FirebaseConfig> {
    // Never called in demo (AuthContext is replaced)
    throw new Error('[Demo] Firebase is not used in demo mode')
  }

  async login(_idToken: string): Promise<User> {
    return demoDb.getUser()!
  }

  async verifyToken(_idToken: string): Promise<User> {
    return demoDb.getUser()!
  }

  async logout(): Promise<void> {
    await delay(150)
  }

  async checkAuth(): Promise<boolean> {
    return demoDb.getSession() !== null
  }

  async getWebsocketToken(_sessionId: string): Promise<{ token: string; expiresIn: number; user: any }> {
    return { token: 'demo-ws-token', expiresIn: 900, user: demoDb.getUser() }
  }

  async updateGithubToken(_token: string): Promise<{ success: boolean }> {
    return { success: true }
  }

  async setUsername(username: string): Promise<void> {
    const user = demoDb.getUser()
    if (user) demoDb.saveUser({ ...user, username, handle: username })
  }

  async updateDisplayName(name: string): Promise<void> {
    const user = demoDb.getUser()
    if (user) demoDb.saveUser({ ...user, name })
  }

  async updateBio(bio: string): Promise<void> {
    const user = demoDb.getUser()
    if (user) demoDb.saveUser({ ...user, bio })
  }

  async getUserProfile(_username: string): Promise<User | null> {
    return demoDb.getUser()
  }

  async searchUsers(_query: string): Promise<Array<{ uid: string; username: string; name: string; email?: string; picture?: string }>> {
    await delay(300)
    return FAKE_FRIENDS.map(f => ({
      uid: f.uid,
      username: f.username,
      name: f.name || f.username,
      email: `${f.username}@example.com`,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.uid}`,
    }))
  }

  // ─── Projects ──────────────────────────────────────────────────────────────

  async listProjects(): Promise<Project[]> {
    await delay(250)
    return demoDb.getProjects()
  }

  async createProject(): Promise<{ project_id: string; session_id: string }> {
    await delay(400)
    const id = uuid()
    const sessionId = `demo-session-${uuid()}`

    // Seed with blank React template
    const template = TEMPLATE_FILES['react']
    const files: Record<string, { content: string; version: number }> = {}
    for (const [path, content] of Object.entries(template)) {
      files[path] = { content, version: 1 }
    }
    demoDb.saveFiles(id, files)

    const project: Project = {
      id,
      name: 'Untitled Project',
      description: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      storage_type: 'workspace',
      branch: 'main',
      active_file: 'src/App.tsx',
      recent_files: ['src/App.tsx'],
      all_files: Object.keys(template),
      owner_id: demoDb.getSession() || 'demo',
      role: 'owner',
    }
    demoDb.addProject(project)

    return { project_id: id, session_id: sessionId }
  }

  async openProject(projectId: string): Promise<SessionInfo> {
    await delay(300)
    const projects = demoDb.getProjects()
    const project = projects.find(p => p.id === projectId)
    return {
      session_id: `demo-session-${uuid()}`,
      project_id: projectId,
      project_name: project?.name,
    }
  }

  async saveProject(options: any): Promise<Project> {
    await delay(250)
    const projects = demoDb.getProjects()
    const project = projects.find(p => p.id === options.session_id || p.name === options.project_name)
    if (project) {
      demoDb.updateProject(project.id, { name: options.project_name || project.name })
      return project
    }
    return projects[0]
  }

  async renameProject(projectId: string, name: string, description?: string): Promise<Project> {
    await delay(200)
    const updated = demoDb.updateProject(projectId, { name, description })
    if (!updated) throw new Error('Project not found')
    return updated
  }

  async deleteProject(projectId: string): Promise<void> {
    await delay(300)
    demoDb.deleteProject(projectId)
  }

  async duplicateProject(projectId: string): Promise<Project> {
    await delay(500)
    const projects = demoDb.getProjects()
    const original = projects.find(p => p.id === projectId)
    if (!original) throw new Error('Project not found')
    const newId = uuid()
    const files = demoDb.getFiles(projectId)
    demoDb.saveFiles(newId, files)
    const newProject: Project = {
      ...original,
      id: newId,
      name: `${original.name}-copy`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    demoDb.addProject(newProject)
    return newProject
  }

  async getProjectAccessState(_projectId: string): Promise<ProjectAccessState> {
    return {
      project_id: _projectId,
      project_name: 'Demo Project',
      is_collaborator: true,
      is_owner: true,
      request_status: 'none',
    }
  }

  async requestProjectAccess(_projectId: string, _message?: string) {
    return { success: true, status: 'pending' }
  }

  async respondToProjectAccessRequest(_p: string, _r: string, _approved: boolean) {
    return { success: true, approved: _approved }
  }

  async getProjectCollaborators(_projectId: string): Promise<any[]> {
    await delay(200)
    return FAKE_FRIENDS.slice(0, 2).map(f => ({
      uid: f.uid,
      username: f.username,
      name: f.name || f.username,
      color: f.color,
      role: 'editor',
    }))
  }

  async updateProjectCollaboratorRole(_p: string, _u: string, _role: string): Promise<{ success: boolean; error?: string | null }> {
    return { success: true }
  }

  async deleteProjectCollaborator(_p: string, _u: string) {
    return true
  }

  async getSessionParticipants(_sessionId: string): Promise<any[]> {
    return []
  }

  async getSessionSnapshot(sessionId: string) {
    // Extract project ID from session ID if embedded
    const projects = demoDb.getProjects()
    const project = projects[0]
    const files = project ? demoDb.getFiles(project.id) : {}
    return {
      session_id: sessionId,
      active_file: project?.active_file || '',
      files,
      project_id: project?.id,
      project_name: project?.name,
    }
  }

  // ─── Git ───────────────────────────────────────────────────────────────────

  async getGitStatus(_sessionId: string) {
    return {
      modified: ['src/App.tsx', 'src/components/Dashboard.tsx'],
      untracked: ['src/components/NewWidget.tsx'],
      staged: [],
      deleted: [],
      initialized: true,
      branch: 'main',
      has_commits: true,
    }
  }

  async getGitLog(_sessionId: string, _limit?: number): Promise<{ commits: any[] }> {
    const authors = ['Alice Chen', 'Bob Martinez', demoDb.getUser()?.name || 'Developer']
    const messages = [
      'feat: add real-time metrics dashboard',
      'fix: resolve memory leak in data polling',
      'refactor: extract MetricsCard into separate component',
      'chore: update dependencies',
      'docs: add API documentation',
    ]
    const commits = messages.map((message, i) => ({
      hash: Math.random().toString(16).slice(2, 10),
      author: authors[i % authors.length],
      date: new Date(Date.now() - i * 3600000 * 24).toISOString(),
      message,
      parents: i > 0 ? Math.random().toString(16).slice(2, 10) : '',
    }))
    return { commits }
  }

  async stageFiles(_sessionId: string, _files: string[]) {
    return { success: true }
  }

  async commitFiles(_sessionId: string, _message: string) {
    await delay(600)
    return { success: true, hash: Math.random().toString(16).slice(2, 10) }
  }

  async pushBranch(_sessionId: string) {
    await delay(1000)
    return { success: true }
  }

  async pullBranch(_sessionId: string) {
    await delay(800)
    return { success: true }
  }

  async getBranches(_sessionId: string) {
    const author = demoDb.getUser()?.name || 'Developer'
    return {
      branches: [
        { name: 'main', hash: 'a3f8c12', author, date: '2 hours ago', message: 'feat: add real-time metrics dashboard', is_current: true },
        { name: 'feature/auth', hash: 'b9e2d45', author, date: '5 hours ago', message: 'fix: resolve memory leak in data polling', is_current: false },
        { name: 'feature/dashboard', hash: 'c7a1f89', author, date: '1 day ago', message: 'refactor: extract MetricsCard component', is_current: false },
        { name: 'hotfix/memory-leak', hash: 'd4b6e23', author, date: '2 days ago', message: 'chore: update dependencies', is_current: false },
      ],
      current: 'main',
    }
  }

  async createBranch(_sessionId: string, _name: string) {
    return { success: true, message: `Branch '${_name}' created successfully` }
  }

  async mergeBranch(_sessionId: string, _name: string) {
    await delay(1200)
    return { success: true, message: `Branch '${_name}' merged into main` }
  }

  async getDiff(_sessionId: string, _file: string) {
    return { diff: `@@ -1,5 +1,7 @@\n import { useState } from 'react'\n+import { useEffect } from 'react'\n \n function App() {\n+  useEffect(() => { console.log('mounted') }, [])\n   return <div>Hello</div>\n }` }
  }

  async getGitDiff(sessionId: string, file: string) {
    return this.getDiff(sessionId, file)
  }

  async publishToGitHub(_sessionId: string, _name: string, _isPrivate: boolean) {
    await delay(2000)
    return { success: true, url: `https://github.com/demo/${_name}` }
  }

  async importFromGitHub(_url: string, _name: string) {
    await delay(2000)
    return await this.createProject()
  }

  async getGithubRepos() {
    return [
      { id: 1, name: 'my-react-app', full_name: 'demo/my-react-app', private: false, description: 'A React application' },
      { id: 2, name: 'api-server', full_name: 'demo/api-server', private: true, description: 'REST API backend' },
      { id: 3, name: 'portfolio', full_name: 'demo/portfolio', private: false, description: 'Personal portfolio' },
    ]
  }

  // ─── Activity & Social ─────────────────────────────────────────────────────

  async getRecentUserActivity(n: number = 10): Promise<any[]> {
    await delay(200)
    return buildFakeActivities(n)
  }


  async getUserActivity(username: string, year?: number): Promise<{ heatmap: Record<string, number>; streak: { current: number; max: number } }> {
    return this.getUserHeatmap(username)
  }

  async getUserHeatmap(username: string, filter: string = 'All Activity'): Promise<{
    heatmap: Record<string, number>;
    streak: { current: number; max: number };
  }> {
    // Generate heatmap data for the past year
    const heatmap: Record<string, number> = {}
    const now = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      if (Math.random() > 0.4) {
        heatmap[key] = Math.floor(Math.random() * 8) + 1
      }
    }
    return { heatmap, streak: { current: 12, max: 28 } }
  }

  async getMyStats() {
    return {
      projects_count: demoDb.getProjects().length,
      collaborations_count: 23,
      files_edited: 487,
      commits_made: 134,
      cached_until: new Date(Date.now() + 3600000).toISOString(),
    }
  }

  async getFriends(): Promise<Friend[]> {
    await delay(200)
    return FAKE_FRIENDS
  }

  async getFriendRequests(): Promise<any[]> {
    return []
  }

  async sendFriendRequest(_username: string): Promise<{ success: boolean; status: string; detail?: string }> {
    await delay(300)
    return { success: true, status: 'pending' }
  }

  async acceptFriendRequest(_requestId: string): Promise<{ success: boolean }> {
    return { success: true }
  }

  async rejectFriendRequest(_requestId: string): Promise<{ success: boolean }> {
    return { success: true }
  }

  async removeFriend(_userId: string): Promise<{ success: boolean }> {
    return { success: true }
  }

  async searchFriends(_query: string) {
    return this.searchUsers(_query)
  }

  // ─── Notifications ─────────────────────────────────────────────────────────

  async getNotifications(): Promise<Notification[]> {
    await delay(150)
    return demoDb.getNotifications()
  }

  async markNotificationRead(notifId: string): Promise<void> {
    const notifs = demoDb.getNotifications()
    const idx = notifs.findIndex(n => n.id === notifId)
    if (idx !== -1) {
      notifs[idx] = { ...notifs[idx], read: true }
      demoDb.saveNotifications(notifs)
    }
  }

  async markAllNotificationsRead(): Promise<void> {
    const notifs = demoDb.getNotifications().map(n => ({ ...n, read: true }))
    demoDb.saveNotifications(notifs)
  }

  async deleteNotification(notifId: string): Promise<void> {
    demoDb.saveNotifications(demoDb.getNotifications().filter(n => n.id !== notifId))
  }

  // ─── Achievements ──────────────────────────────────────────────────────────

  async getAchievements(_username?: string): Promise<AchievementFamilyProgress[]> {
    await delay(200)
    return [
      {
        family_id: 'projects',
        name: 'Project Creator',
        description: 'Create projects on CodePark',
        current_tier: 'silver',
        progress: 5,
        tiers: {
          bronze: { tier_id: 'bronze', name: 'Bronze', target: 1, completed: true, unlocked_at: Date.now() - 86400000 * 30 },
          silver: { tier_id: 'silver', name: 'Silver', target: 5, completed: true, unlocked_at: Date.now() - 86400000 * 7 },
          gold: { tier_id: 'gold', name: 'Gold', target: 20, completed: false },
          platinum: { tier_id: 'platinum', name: 'Platinum', target: 100, completed: false },
        },
      },
      {
        family_id: 'collaboration',
        name: 'Team Player',
        description: 'Collaborate with other developers',
        current_tier: 'bronze',
        progress: 23,
        tiers: {
          bronze: { tier_id: 'bronze', name: 'Bronze', target: 5, completed: true, unlocked_at: Date.now() - 86400000 * 15 },
          silver: { tier_id: 'silver', name: 'Silver', target: 25, completed: false },
          gold: { tier_id: 'gold', name: 'Gold', target: 100, completed: false },
          platinum: { tier_id: 'platinum', name: 'Platinum', target: 500, completed: false },
        },
      },
    ]
  }

  async getPinnedAchievements(_username: string) {
    return []
  }

  async pinAchievement(_id: string) {
    return { success: true }
  }

  async unpinAchievement(_id: string) {
    return { success: true }
  }

  // ─── Settings ──────────────────────────────────────────────────────────────

  async updateUISettings(settings: Record<string, any>): Promise<void> {
    const user = demoDb.getUser()
    if (user) demoDb.saveUser({ ...user, ui_settings: { ...(user.ui_settings || {}), ...settings } })
  }

  async getUISettings() {
    const user = demoDb.getUser()
    return user?.ui_settings || {}
  }

  async updatePrivacySettings(
    _presenceVisibility?: string,
    _activityVisibility?: boolean,
    _lastSeenVisibility?: string,
    _showHeatmap?: boolean,
    _showName?: boolean,
    _showEmail?: boolean,
    _profilePrivate?: boolean
  ): Promise<{ success: boolean }> {
    return { success: true }
  }

  async updateNotificationSettings(_settings: any) {
    return { success: true }
  }

  async updateStatusText(_text: string) {
    return { success: true }
  }

  async updateStatus(_mode: string, _status?: { text: string; emoji: string }): Promise<void> {
    return
  }

  async updateDisplaySettings(_visibleCards: string[], _hiddenCards: string[]): Promise<void> {
    return
  }

  // ─── Invites & Presence ────────────────────────────────────────────────────

  async sendInvite(_email: string, _projectId?: string, _sessionId?: string) {
    await delay(400)
    return { success: true }
  }

  async updatePresence(_data: any) {
    return { success: true }
  }

  async sendHeartbeat(_sessionId: string) {
    // No-op in demo
  }

  // ─── Miscellaneous ─────────────────────────────────────────────────────────

  async getProfileLayout(_username: string) {
    return { layout: [], hidden_cards: [] }
  }

  async saveProfileLayout(_layout: string[], _hidden: string[]) {
    return { success: true }
  }

  async updateProfileBackground(_projectId: string, _imageData: string) {
    return { success: true }
  }

  async deleteAccount() {
    return { success: true }
  }

  async getCollaborators(_username: string) {
    return []
  }

  async getSharedProjects(_username: string) {
    return []
  }

  async getAccessRequests(_projectId: string): Promise<ProjectAccessRequest[]> {
    return []
  }

  async getDevlogs() {
    return []
  }

  async createDevlog(_data: any) {
    return { id: uuid(), ...(_data || {}) }
  }

  async getReleases() {
    return []
  }

  async createRelease(_data: any) {
    return { id: uuid(), ...(_data || {}) }
  }

  async sendFeedback(_message: string) {
    return { success: true }
  }

  async getProSubscriptionStatus() {
    return { is_pro: true, plan: 'pro', expires_at: null }
  }

  async createCheckoutSession() {
    return { url: '#demo-checkout' }
  }

  async createPortalSession() {
    return { url: '#demo-portal' }
  }
  // ─── Git & GitHub Mocks (Missing) ──────────────────────────────────────────

  async getGitHubStatus(): Promise<{ connected: boolean; username: string; avatar_url?: string }> {
    return { connected: true, username: 'demo-user', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user' }
  }

  async getGitHubRepos(_page: number = 1, _perPage: number = 30): Promise<{ repos: any[]; page: number; per_page: number }> {
    const repos = [
      { id: 1, name: 'my-react-app', full_name: 'demo/my-react-app', private: false, description: 'A React application' },
      { id: 2, name: 'api-server', full_name: 'demo/api-server', private: true, description: 'REST API backend' },
      { id: 3, name: 'portfolio', full_name: 'demo/portfolio', private: false, description: 'Personal portfolio' },
    ]
    return { repos, page: _page, per_page: _perPage }
  }

  async disconnectGitHub() {
    return { success: true }
  }

  async importGitHubRepo(_url: string, _name?: string): Promise<{ success: boolean; project_id?: string | null; name?: string; error?: string | null }> {
    const p = await this.createProject()
    return { success: true, project_id: p.project_id, name: _name || 'imported-project' }
  }

  async getGitRemotes(_sessionId: string): Promise<{ remotes: Array<{ name: string; url: string }> }> {
    return { remotes: [{ name: 'origin', url: 'https://github.com/demo/project.git' }] }
  }

  async addGitRemote(_sessionId: string, _name: string, _url: string): Promise<{ success: boolean; message?: string | null }> {
    return { success: true }
  }

  async removeGitRemote(_sessionId: string, _name: string): Promise<{ success: boolean; message?: string | null }> {
    return { success: true }
  }

  async pushToRemote(_sessionId: string, _remote: string, _branch: string): Promise<{ success: boolean; message?: string | null }> {
    return { success: true }
  }

  async fetchFromRemote(_sessionId: string, _remote: string): Promise<{ success: boolean; message?: string | null }> {
    return { success: true }
  }

  async pullFromRemote(_sessionId: string, _remote: string, _branch: string): Promise<{ success: boolean; message?: string | null }> {
    return { success: true }
  }

  async testRemoteConnection(_sessionId: string, _remote: string): Promise<{ success: boolean; message?: string | null }> {
    return { success: true }
  }

  async gitInit(_sessionId: string): Promise<{ success: boolean; error?: string | null }> {
    return { success: true }
  }

  async gitCommit(
    _sessionId: string,
    _message: string,
    _authorName?: string,
    _authorEmail?: string,
    _files?: string[]
  ): Promise<{ success: boolean; hash: string; message?: string | null }> {
    return { success: true, hash: Math.random().toString(16).slice(2, 10) }
  }

  async gitRevert(_sessionId: string, _commitHash: string): Promise<{ success: boolean; files?: Record<string, { content: string; version: number }>; active_file?: string; error?: string | null }> {
    const projects = demoDb.getProjects()
    const project = projects[0]
    const files = project ? demoDb.getFiles(project.id) : {}
    return { success: true, files, active_file: project?.active_file || '' }
  }

  // ─── Project Settings & Collaboration Mocks (Missing) ──────────────────────

  async updateProjectSettings(_projectId: string, _settings: any): Promise<{ success: boolean; error?: string | null }> {
    return { success: true }
  }

  async uploadProjectBackground(_projectId: string, _file: any): Promise<{ success: boolean; image_url?: string | null }> {
    return { success: true, image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=60' }
  }

  async transferProject(_projectId: string, _email: string): Promise<{ success: boolean }> {
    return { success: true }
  }

  async getPendingRequests(): Promise<{ incoming: any[]; outgoing: any[] }> {
    return { incoming: [], outgoing: [] }
  }

  async declineFriendRequest(_requestId: string): Promise<{ success: boolean }> {
    return { success: true }
  }

  // ─── Context & AI Mocks (Missing) ───────────────────────────────────────────

  async getContextFileNeighborhood(_sessionId: string, _path: string): Promise<{
    filePath: string;
    moduleType: string;
    purposeSummary: string;
    imports: string[];
    importedBy: string[];
    symbols: Array<{ name: string; type: string; line: number; path?: string }>;
  }> {
    return {
      filePath: _path,
      moduleType: 'component',
      purposeSummary: 'Renders the main app shell and coordinates navigation.',
      imports: [],
      importedBy: [],
      symbols: [],
    }
  }

  async getContextProximitySort(_sessionId: string, _query: string, _activeFile?: string): Promise<Array<{
    path: string;
    relevance: 'direct' | 'neighbor' | 'unrelated';
    relationReason: string | null;
    distance: number;
  }>> {
    return []
  }

  async getContextFingerprint(_sessionId: string): Promise<{
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
    return {
      project_id: 'demo-project',
      languages: [{ name: 'TypeScript', percentage: 94.2 }, { name: 'CSS', percentage: 5.8 }],
      frameworks: {
        frontend: { name: 'React', confidence: 1.0, evidence: ['package.json'] },
        backend: { name: null, confidence: 0, evidence: [] },
        database: { name: null, confidence: 0, evidence: [] },
      },
      entrypoints: { main: 'src/main.tsx' },
      service_boundaries: [],
    }
  }

  async analyzeCode(_sessionId: string, _code: string): Promise<{ response?: string; available?: boolean; error?: string | null }> {
    return { response: 'Code looks clean! No obvious bugs detected.' }
  }

  // ─── Extra Component Compatibility Mocks ────────────────────────────────────

  async checkUsernameAvailability(_username: string): Promise<{ available: boolean }> {
    return { available: true }
  }

  async switchBranch(oldSessionId: string, branchName: string, userId: string): Promise<{ success: boolean; new_session_id: string; files: any; branch: string }> {
    const projects = demoDb.getProjects()
    const project = projects[0]
    const files = project ? demoDb.getFiles(project.id) : {}
    return {
      success: true,
      new_session_id: `demo-session-${uuid()}`,
      files,
      branch: branchName,
    }
  }

  async sendPresenceHeartbeat(
    _state: string,
    _activePage: string,
    _activeProjectId: string | null = null,
    _activeProjectName: string | null = null
  ): Promise<{ success: boolean }> {
    return { success: true }
  }

  async downloadProject(_projectId: string): Promise<Blob> {
    return new Blob(['demo project source'], { type: 'application/zip' })
  }

  async copyProject(_projectId: string): Promise<Project> {
    return this.duplicateProject(_projectId)
  }

  async getUserAchievements(_username?: string): Promise<any[]> {
    return this.getAchievements(_username)
  }

  async pinAchievements(pinnedIds: string[]): Promise<{ success: boolean; pinned_achievements: string[] }> {
    return { success: true, pinned_achievements: pinnedIds }
  }

  async triggerManualScan(_sessionId: string): Promise<{ success: boolean }> {
    return { success: true }
  }

  async saveFilestoFirebase(_sessionId: string): Promise<{ success: boolean }> {
    // No-op in demo mode
    return { success: true }
  }

  async acceptInvite(_notificationId: string): Promise<{ success: boolean; project_id?: string | null; session_id?: string | null }> {
    const projects = demoDb.getProjects()
    return { success: true, project_id: projects[0]?.id, session_id: `demo-session-${uuid()}` }
  }

  async declineInvite(_notificationId: string): Promise<{ success: boolean }> {
    return { success: true }
  }

  async updatePinnedProjects(_projectIds: string[]): Promise<void> {
    return
  }

  async getBlockedUsers(): Promise<User[]> {
    return []
  }

  async blockUser(_blockedUid: string): Promise<{ success: boolean }> {
    return { success: true }
  }

  async unblockUser(_blockedUid: string): Promise<{ success: boolean }> {
    return { success: true }
  }
}

export const apiClient = new FakeApiClient()
export const getApiBaseUrl = () => ''


