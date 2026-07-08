// User and Authentication
export interface User {
  uid: string;
  handle?: string;
  name?: string;
  email?: string;
  picture?: string;
  color?: string;
  bio?: string;
  username?: string;
  created_at?: string;
  mode?: 'online' | 'idle' | 'dnd' | 'coding' | 'offline';
  subscription?: 'free' | 'pro';
  status?: {
    emoji: string;
    text: string;
  };
  achievements?: {
    id: string;
    name: string;
    description: string;
    icon: string;
    date: string;
  }[];
  pinned_achievements?: string[];
  pinned_projects?: string[];
  privacy_settings?: {
    presence_visibility?: string;
    activity_visibility?: boolean;
    last_seen_visibility?: string;
    show_heatmap?: boolean;
    show_name?: boolean;
    show_email?: boolean;
    profile_private?: boolean;
  };
  ui_settings?: Record<string, any>;
  notification_settings?: Array<Record<string, any>>;
  streak?: {
    current: number;
    max: number;
    last_activity_date: string;
  };
  profile_layout?: string[]; // IDs of cards in order
  hidden_cards?: string[]; // IDs of hidden cards
  providerData?: { providerId: string }[];
  friends_count?: number;
  collaborators_count?: number;
  shared_projects_count?: number;
  shared_sessions_count?: number;
}


export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isGithubLinked?: boolean;
  isGoogleLinked?: boolean;
  providerData?: { providerId: string }[];
}

// Project Management
export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  active_file?: string;
  recent_files?: string[];
  storage_type: 'git' | 'workspace' | 'firestore';
  git_commit_hash?: string;
  all_files?: string[];
  owner_id?: string;
  // Role relative to current user when returned by API (owner/editor/viewer)
  role?: 'owner' | 'editor' | 'viewer';
  background_image?: string;
  description?: string;
  branch?: string;
  context_base_auto_scan?: boolean;
}

// Editor Session
export interface Session {
  id: string;
  project_id?: string;
  project_name?: string;
  description?: string;
  branch?: string;
  workspace_epoch?: number;
  last_saved_at?: string;
  yjs_updates?: string[];
  yjs_content_initialized?: boolean;
  files: FileMap;
  active_file: string;
  users: CollaboratorUser[];
  owner_id?: string;
  is_locked?: boolean;
  // List of open tabs in the session UI (managed client-side and optionally persisted by server)
  opened_files?: string[];
}

export interface AccessRequest {
  user_id: string;
  user_name: string;
  handle?: string;
  timestamp: string;
}

export interface FileMap {
  [path: string]: FileData;
}

export interface FileData {
  content: string;
  version: number;
  language?: string;
}

/**
 * Canonical Developer Identity — who the developer IS.
 *
 * Contains only stable, person-level attributes that persist across sessions and projects.
 * Does NOT include what they're doing (PresenceState) or what they're allowed to do (ProjectMembership).
 *
 * Identity flows through the system in one direction:
 *
 *   DeveloperIdentity  (SessionContext.clientIdentity)
 *     │
 *     ├─▶ socket emit  →  create_session / join_session / update_user
 *     │
 *     ├─▶ AwarenessUserState  →  Yjs awareness  →  remote cursor CSS / labels
 *     │
 *     └─▶ CollaboratorUser  →  session.users[]  →  UsersPanel / TopMenuBar / MobileEditorShell
 *
 * Rule: every identity surface must derive from this model, never from independent state.
 */
export interface DeveloperIdentity {
  /** Stable unique ID: Firebase UID for authenticated users, 'guest-<uuid>' for guests */
  id: string;
  /** @handle (e.g. @perseuskyogre) — authenticated users only */
  handle?: string;
  /** Display name shown in all UI surfaces */
  name: string;
  /** true for unauthenticated guests; false for authenticated Firebase users */
  isGuest: boolean;
  /** Collaborator color — used for cursor caret, label, avatar background, selection highlight */
  color?: string;
  /** Profile picture URL — populated from Firebase Auth for authenticated users */
  avatar?: string;
  // NOTE: role is intentionally absent — it belongs to ProjectMembership, not identity
}

/**
 * What the developer is doing right now in a session — ephemeral, high-frequency state.
 *
 * Distinct from DeveloperIdentity: presence is session-scoped and changes constantly.
 * Distinct from ProjectMembership: presence has nothing to do with permissions.
 *
 * Currently used fields (already implemented in CollaboratorUser / session.users[]):
 *   cursor  — live position via cursor_update socket events
 *
 * Future fields (do NOT add yet — extend here when ready):
 *   // currentFile?: string;     — which file they're editing (via user_switched_file)
 *   // selection?: Selection;    — text selection range
 *   // following?: string;       — user ID being followed (pair programming / follow mode)
 *   // idle?: boolean;           — inactivity indicator
 */
export interface PresenceState {
  /** Live cursor position within the editor — updated via cursor_update socket events */
  cursor?: CursorPosition;
}

/**
 * What the developer is allowed to do in a specific project — authorization, not identity.
 *
 * Distinct from DeveloperIdentity: the same developer can have different roles across projects.
 * Distinct from PresenceState: membership is long-lived, not ephemeral.
 *
 * Currently implemented as CollaboratorUser.role (a flat field on the session snapshot).
 * Promote to a structured type here when fine-grained permission checks are needed (RBAC).
 *
 * Future fields (do NOT add yet):
 *   // permissions?: { canWrite: boolean; canInvite: boolean; canManage: boolean };
 *   // joinedAt?: string;
 */
export interface ProjectMembership {
  /** The developer's role in this specific project */
  role: 'owner' | 'editor' | 'viewer';
}

/**
 * The identity subset broadcast to peers via Yjs awareness.
 * Intentionally minimal — this is sent on every awareness change (cursor moves, etc.).
 *
 * Contains only DeveloperIdentity fields needed to render remote cursors.
 * Does NOT include PresenceState or ProjectMembership — those travel via dedicated socket events.
 *
 * Why avatar is included: renders a profile photo in future cursor tooltips
 *   without requiring a separate network round-trip per collaborator.
 */
export interface AwarenessUserState {
  /** Display name rendered in cursor label */
  name: string;
  /** Collaborator color — cursor caret, label background, selection highlight */
  color: string;
  /** Profile picture URL (optional — future: avatar-in-cursor tooltip) */
  avatar?: string;
}

/**
 * A developer's live, denormalized state within an active collaborative session.
 *
 * This is intentionally a flat composite — not a pure identity model.
 * It combines fields from three distinct conceptual domains into one array element
 * for efficient consumption by session.users[] and all real-time UI.
 *
 * Field domains:
 *   DeveloperIdentity  —  id, handle, name, color, avatar, isGuest
 *   ProjectMembership  —  role
 *   PresenceState      —  cursor
 *
 * Populated from socket events:
 *   - session_created / session_joined  →  initial users[]
 *   - user_joined  →  remote user arrives
 *   - user_updated  →  name or color change (e.g. guest → auth)
 *   - cursor_update  →  live cursor position
 *
 * Consumed by: UsersPanel, TopMenuBar, MobileEditorShell avatars.
 */
export interface CollaboratorUser {
  // ── DeveloperIdentity fields ──
  id: string;
  handle?: string;
  name: string;
  /** Always assigned in a session — never undefined in collaborative context */
  color: string;
  /** Profile picture URL — @see DeveloperIdentity.avatar */
  avatar?: string;
  /** Whether this user joined as an unauthenticated guest — @see DeveloperIdentity.isGuest */
  isGuest?: boolean;
  /**
   * @deprecated Use `isGuest` instead (isAuthenticated === !isGuest).
   * Retained for backward compatibility with server payloads.
   */
  isAuthenticated?: boolean;

  // ── ProjectMembership fields ──
  /** The developer's role in this session's project — @see ProjectMembership.role */
  role?: 'owner' | 'editor' | 'viewer';

  // ── PresenceState fields ──
  /** Live cursor position — updated via cursor_update socket events — @see PresenceState.cursor */
  cursor?: CursorPosition;
}

export interface CursorPosition {
  line: number;
  column: number;
  filename: string;
}

// Operational Transformation
export interface Operation {
  type: 'insert' | 'delete';
  position: number;
  content?: string;
  length?: number;
  user_id: string;
  version: number;
}

// Git Integration
export interface GitStatus {
  modified: string[];
  untracked: string[];
  staged: string[];
  deleted: string[];
  initialized?: boolean;
  branch?: string;
  has_commits?: boolean;
}

export interface Commit {
  hash: string;
  author: string;
  date: string;
  message: string;
  parents?: string;
  refs?: string;
}

// User Settings
export interface UserSettings {
  uiTheme: 'dark' | 'light';
  editorTheme: 'dark' | 'light' | 'forest' | 'ocean' | 'sunset' | 'midnight' | 'cyberpunk' | 'rose' | 'forest-light' | 'ocean-light' | 'sunny-light' | 'beach-light' | 'anime-light' | 'rose-light';
  accentColor: string;
  collaboratorColor: string;
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  compactMode: boolean;
  editorFont: 'cascadia' | 'fira' | 'jetbrains' | 'space' | 'ibm' | 'consolas';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative' | 'interval';
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  streakTrackingEnabled?: boolean;
  contextBaseAutoScan?: boolean;
}

// Terminal
export interface TerminalSession {
  id: string;
  output: string[];
  isRunning: boolean;
}

// GUI Execution
export interface GUISession {
  id: string;
  novnc_port: number;
  framework: string;
  status: 'starting' | 'running' | 'stopped';
}

// Firebase Configuration
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// API Request/Response Types
export interface SaveProjectOptions {
  session_id: string;
  project_name?: string;
  save_as?: boolean;
  autosave?: boolean;
}

export interface SessionInfo {
  session_id: string;
  project_id?: string;
  project_name?: string;
}

export interface ProjectAccessState {
  project_id: string;
  project_name: string;
  owner_id?: string | null;
  owner_name?: string | null;
  owner_picture?: string | null;
  is_collaborator: boolean;
  is_owner: boolean;
  request_status: 'none' | 'pending' | 'approved' | 'rejected';
}

export interface ProjectAccessRequest {
  request_id: string;
  project_id: string;
  project_name: string;
  owner_id?: string | null;
  requester_id: string;
  requester_name: string;
  requester_email?: string | null;
  requester_picture?: string | null;
  message?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  session_id?: string | null;
  created_at?: number;
  updated_at?: number;
}

// Debug Types
export interface Breakpoint {
  id: string;
  file: string;
  line: number;
  condition?: string;
  enabled: boolean;
}

export interface StackFrame {
  id: number;
  name: string;
  file: string;
  line: number;
  column: number;
}

export interface Variable {
  name: string;
  value: string;
  type: string;
  expandable?: boolean;
  variablesReference?: number;
}

export interface DebugState {
  isActive: boolean;
  isPaused: boolean;
  currentFile?: string;
  currentLine?: number;
  stackFrames: StackFrame[];
  variables: { [scope: string]: Variable[] };
  breakpoints: Breakpoint[];
}

export interface DebugCommand {
  command: 'start' | 'stop' | 'step_over' | 'step_into' | 'step_out' | 'continue' | 'pause';
  session_id: string;
  breakpoints?: Breakpoint[];
}

export interface DebugEvaluation {
  expression: string;
  frame_id?: number;
  session_id: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  text: string;
  title?: string;
  description?: string;
  created_at: number;
  read: boolean;
  read_status?: boolean;
  actor_id?: string;
  target_id?: string;
}

export interface Friend {
  uid: string;
  username: string;
  handle: string;
  name?: string;
  picture?: string;
  color?: string;
  mode?: 'online' | 'idle' | 'dnd' | 'coding' | 'offline';
  status_text?: string;
  presence?: {
    state: 'online' | 'away' | 'offline';
    lastSeenAt?: number | null;
    activePage?: string;
    activeProjectId?: string | null;
    activeProjectName?: string | null;
  };
}

export interface FriendRequest {
  id: string;
  created_at: number;
  sender?: {
    uid: string;
    username: string;
    handle: string;
    name?: string;
    picture?: string;
    color?: string;
  };
  receiver?: {
    uid: string;
    username: string;
    handle: string;
    name?: string;
    picture?: string;
    color?: string;
  };
}

export interface Collaborator {
  uid: string;
  shared_sessions_count: number;
  shared_projects_count: number;
  last_collaborated_at: number;
  sessions: string[];
  projects: string[];
  username?: string;
  handle?: string;
  name?: string;
  picture?: string;
  color?: string;
}

export interface TierProgress {
  tier_id: 'bronze' | 'silver' | 'gold' | 'platinum';
  name: string;
  target: number;
  unlocked_at?: number;
  completed: boolean;
}

export interface AchievementFamilyProgress {
  family_id: string;
  name: string;
  description: string;
  current_tier: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  tiers: {
    bronze: TierProgress;
    silver: TierProgress;
    gold: TierProgress;
    platinum: TierProgress;
  };
}

export interface ActivityStats {
  heatmap: Record<string, number>;
  streak: {
    current: number;
    max: number;
  };
}
