import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { SessionProvider, useSession } from './SessionContext';
import React from 'react';

// Mock realtime socket
const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  connected: true,
  id: 'mock-socket-id',
};

// Mock the SocketContext module
vi.mock('./SocketContext', () => ({
  useSocket: () => ({
    socket: mockSocket,
    isConnected: true,
    connectionError: null,
    connectionStatus: 'connected',
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
  SocketProvider: ({ children }: { children: React.ReactNode }) => children,
}));

let mockUser: any = {
  uid: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
};
let mockIsAuthenticated = true;
let mockAuthLoading = false;

// Mock the AuthContext module
vi.mock('./AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: mockIsAuthenticated,
    loading: mockAuthLoading,
    login: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn(),
  }),
  useAuthOptional: () => ({
    user: mockUser,
    isAuthenticated: mockIsAuthenticated,
    loading: mockAuthLoading,
    login: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the ThemeContext module
vi.mock('./ThemeContext', () => ({
  useTheme: () => ({
    settings: {
      collaboratorColor: '#FF5733',
    },
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the useSubscription hook
vi.mock('../hooks/useSubscription', () => ({
  useSubscription: () => ({
    isPro: false,
  }),
}));

// Mock the useProjects hook
vi.mock('../hooks/useProjects', () => ({
  useProjects: () => ({
    listProjects: vi.fn(),
  }),
}));

// Mock react-router-dom hooks
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/project/test-project-id/editor' }),
}));

// Mock navigator.clipboard
const mockClipboard = {
  writeText: vi.fn(),
};

Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
});

// Mock window.location
delete (window as any).location;
window.location = {
  origin: 'http://localhost:3000',
  href: 'http://localhost:3000/project/test-project-id/editor',
} as any;

// Create wrapper with SessionProvider
const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(SessionProvider, null, children);
};

describe('SessionContext - Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClipboard.writeText.mockResolvedValue(undefined);
    mockUser = {
      uid: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
    };
    mockIsAuthenticated = true;
    mockAuthLoading = false;
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  // Generators for property-based testing
  const sessionIdGenerator = () =>
    fc.string({ minLength: 8, maxLength: 64 }).filter((s) => s.trim().length > 0);

  const colorGenerator = () =>
    fc.oneof(
      fc.constant('#FF5733'),
      fc.constant('#33FF57'),
      fc.constant('#3357FF'),
      fc.constant('#F333FF'),
      fc.constant('#FF33F3')
    );

  const collaboratorUserGenerator = () =>
    fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 1, maxLength: 50 }),
      color: colorGenerator(),
    });

  const fileMapGenerator = () =>
    fc.dictionary(
      fc.string({ minLength: 1, maxLength: 50 }).map((s) => s.replace(/[^a-zA-Z0-9._-]/g, '')),
      fc.record({
        content: fc.string(),
        version: fc.nat(),
        language: fc.option(fc.constantFrom('javascript', 'python', 'typescript', 'html'), {
          nil: undefined,
        }),
      })
    );

  // Property 1: Session ID generation produces unique identifiers
  it('should generate unique session IDs for different session creation requests', async () => {
    await fc.assert(
      fc.asyncProperty(sessionIdGenerator(), async (sessionId) => {
        mockSocket.on.mockClear();
        const wrapper = createWrapper();
        const { result, unmount } = renderHook(() => useSession(), { wrapper });

        const sessionCreatedHandler = mockSocket.on.mock.calls.find(
          (c) => c[0] === 'session_created'
        )?.[1];

        // Create session
        let sessionPromise: Promise<string | null>;
        act(() => {
          sessionPromise = result.current.createSession();
        });

        // Simulate session_created response with unique ID
        if (sessionCreatedHandler) {
          await act(async () => {
            sessionCreatedHandler({
              session_id: sessionId,
              project_id: 'test-project-id',
              content: '',
              version: 0,
              files: {},
              active_file: '',
              user_id: 'test-user-id',
              color: '#FF5733',
            });
          });
        }

        const createdSessionId = await sessionPromise!;

        // Property: Session ID should be non-null and match the generated ID
        expect(createdSessionId).toBe(sessionId);
        expect(createdSessionId).not.toBeNull();
        expect(typeof createdSessionId).toBe('string');
        expect(createdSessionId!.length).toBeGreaterThan(0);

        unmount();
      }),
      { numRuns: 20 }
    );
  });

  // Property 2: Session link generation produces valid URLs
  it('should generate valid shareable URLs for any session', async () => {
    await fc.assert(
      fc.asyncProperty(
        sessionIdGenerator(),
        fileMapGenerator(),
        async (sessionId, files) => {
          mockSocket.on.mockClear();
          const wrapper = createWrapper();
          const { result, unmount } = renderHook(() => useSession(), { wrapper });

          const sessionCreatedHandler = mockSocket.on.mock.calls.find(
            (c) => c[0] === 'session_created'
          )?.[1];

          // Create session
          let sessionPromise: Promise<string | null>;
          act(() => {
            sessionPromise = result.current.createSession();
          });

          // Simulate session creation
          if (sessionCreatedHandler) {
            await act(async () => {
              sessionCreatedHandler({
                session_id: sessionId,
                project_id: 'test-project-id',
                content: '',
                version: 0,
                files,
                active_file: '',
                user_id: 'test-user-id',
                color: '#FF5733',
              });
            });
          }

          await sessionPromise!;
          await waitFor(() => {
            expect(result.current.session).not.toBeNull();
          });

          // Get session link
          const link = result.current.getSessionLink();

          // Property: Link should be a valid URL for the permanent project entry point
          expect(link).not.toBeNull();
          expect(link).toContain(window.location.origin);
          expect(link).toBe(`http://localhost:3000/project/test-project-id`);

          unmount();
        }
      ),
      { numRuns: 20 }
    );
  });

  // Property 3: Clipboard copy functionality works for any session link
  it('should successfully copy any valid session link to clipboard', async () => {
    await fc.assert(
      fc.asyncProperty(sessionIdGenerator(), async (sessionId) => {
        mockSocket.on.mockClear();
        const wrapper = createWrapper();
        const { result, unmount } = renderHook(() => useSession(), { wrapper });

        const sessionCreatedHandler = mockSocket.on.mock.calls.find(
          (c) => c[0] === 'session_created'
        )?.[1];

        // Create session
        let sessionPromise: Promise<string | null>;
        act(() => {
          sessionPromise = result.current.createSession();
        });

        // Simulate session creation
        if (sessionCreatedHandler) {
          await act(async () => {
            sessionCreatedHandler({
              session_id: sessionId,
              project_id: 'test-project-id',
              content: '',
              version: 0,
              files: {},
              active_file: '',
              user_id: 'test-user-id',
              color: '#FF5733',
            });
          });
        }

        await sessionPromise!;
        await waitFor(() => {
          expect(result.current.session).not.toBeNull();
        });

        // Copy session link
        let copyResult: boolean;
        await act(async () => {
          copyResult = await result.current.copySessionLink();
        });

        // Property: Copy should succeed and clipboard should contain the link
        expect(copyResult!).toBe(true);
        expect(mockClipboard.writeText).toHaveBeenCalledWith(
          `http://localhost:3000/project/test-project-id`
        );

        unmount();
      }),
      { numRuns: 20 }
    );
  });

  // Property 4: Users can join sessions using valid session IDs
  it('should allow any user to join a session with a valid session ID', async () => {
    await fc.assert(
      fc.asyncProperty(
        sessionIdGenerator(),
        fc.array(collaboratorUserGenerator(), { minLength: 0, maxLength: 5 }),
        fileMapGenerator(),
        async (sessionId, existingUsers, files) => {
          mockSocket.on.mockClear();
          const wrapper = createWrapper();
          const { result, unmount } = renderHook(() => useSession(), { wrapper });

          const sessionJoinedHandler = mockSocket.on.mock.calls.find(
            (c) => c[0] === 'session_joined'
          )?.[1];

          // Join session
          let joinPromise: Promise<string | null>;
          act(() => {
            joinPromise = result.current.joinSession(sessionId);
          });

          // Simulate successful join
          if (sessionJoinedHandler) {
            await act(async () => {
              sessionJoinedHandler({
                session_id: sessionId,
                project_id: 'test-project-id',
                content: '',
                version: 0,
                files,
                active_file: '',
                users: existingUsers,
                user_id: 'test-user-id',
                color: '#33FF57',
              });
            });
          }

          const joinResult = await joinPromise!;
          await waitFor(() => {
            expect(result.current.session).not.toBeNull();
          });

          // Property: Join should succeed and session should be established
          expect(joinResult).not.toBeNull();
          expect(result.current.isInSession).toBe(true);
          expect(result.current.session?.id).toBe(sessionId);

          unmount();
        }
      ),
      { numRuns: 20 }
    );
  });

  // Property 5: Session state synchronization - all users see the same files
  it('should synchronize file state across all users in a session', async () => {
    await fc.assert(
      fc.asyncProperty(
        sessionIdGenerator(),
        fileMapGenerator(),
        async (sessionId, files) => {
          mockSocket.on.mockClear();
          const wrapper = createWrapper();
          const { result, unmount } = renderHook(() => useSession(), { wrapper });

          const sessionCreatedHandler = mockSocket.on.mock.calls.find(
            (c) => c[0] === 'session_created'
          )?.[1];

          // Create session
          let sessionPromise: Promise<string | null>;
          act(() => {
            sessionPromise = result.current.createSession();
          });

          // Simulate session creation with files
          if (sessionCreatedHandler) {
            await act(async () => {
              sessionCreatedHandler({
                session_id: sessionId,
                project_id: 'test-project-id',
                content: '',
                version: 0,
                files,
                active_file: Object.keys(files)[0] || '',
                user_id: 'test-user-id',
                color: '#FF5733',
              });
            });
          }

          await sessionPromise!;
          await waitFor(() => {
            expect(result.current.session?.files).toEqual(files);
          });

          unmount();
        }
      ),
      { numRuns: 20 }
    );
  });

  // Property 6: User presence updates when users join
  it('should update presence indicators when users join the session', async () => {
    await fc.assert(
      fc.asyncProperty(
        sessionIdGenerator(),
        collaboratorUserGenerator(),
        async (sessionId, newUser) => {
          mockSocket.on.mockClear();
          const wrapper = createWrapper();
          const { result, unmount } = renderHook(() => useSession(), { wrapper });

          const sessionCreatedHandler = mockSocket.on.mock.calls.find(
            (c) => c[0] === 'session_created'
          )?.[1];
          const userJoinedHandler = mockSocket.on.mock.calls.find(
            (c) => c[0] === 'user_joined'
          )?.[1];

          // Create session
          let sessionPromise: Promise<string | null>;
          act(() => {
            sessionPromise = result.current.createSession();
          });

          // Simulate session creation
          if (sessionCreatedHandler) {
            await act(async () => {
              sessionCreatedHandler({
                session_id: sessionId,
                project_id: 'test-project-id',
                content: '',
                version: 0,
                files: {},
                active_file: '',
                user_id: 'test-user-id',
                color: '#FF5733',
              });
            });
          }

          await sessionPromise!;
          await waitFor(() => {
            expect(result.current.session).not.toBeNull();
          });

          const initialUserCount = result.current.session?.users.length || 0;

          // Simulate another user joining
          if (userJoinedHandler) {
            await act(async () => {
              userJoinedHandler({
                user_id: newUser.id,
                user_name: newUser.name,
                color: newUser.color,
              });
            });
          }

          // Property: User list should be updated with the new user
          await waitFor(() => {
            expect(result.current.session?.users.length).toBe(initialUserCount + 1);
            expect(result.current.session?.users.some((u) => u.id === newUser.id)).toBe(true);
          });

          unmount();
        }
      ),
      { numRuns: 20 }
    );
  });

  // Property 7: Invalid session IDs are rejected
  it('should reject join attempts with invalid session IDs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('', '   ', '\t', '\n'),
        async (invalidSessionId) => {
          mockSocket.on.mockClear();
          const wrapper = createWrapper();
          const { result, unmount } = renderHook(() => useSession(), { wrapper });

          // Attempt to join with invalid session ID
          let joinResult: string | null;
          await act(async () => {
            joinResult = await result.current.joinSession(invalidSessionId);
          });

          // Property: Join should fail for invalid session IDs
          expect(joinResult!).toBeNull();
          expect(result.current.isInSession).toBe(false);
          expect(result.current.sessionError).not.toBeNull();

          unmount();
        }
      ),
      { numRuns: 20 }
    );
  });

  it('updates the local collaborator entry when the current user signs in while in session', async () => {
    mockSocket.on.mockClear();
    const wrapper = createWrapper();
    // Start with unauthenticated state
    mockUser = null;
    mockIsAuthenticated = false;
    mockAuthLoading = false;

    const { result, rerender, unmount } = renderHook(() => useSession(), { wrapper });

    const sessionJoinedHandler = mockSocket.on.mock.calls.find(
      (c) => c[0] === 'session_joined'
    )?.[1];

    // Simulate guest identity in localStorage
    localStorage.setItem('codeed_guest_id', 'guest-aaaa');
    localStorage.setItem('codeed_guest_name', 'Guest AAAA');

    let joinPromise: Promise<string | null>;
    act(() => {
      joinPromise = result.current.joinSession('session-abc');
    });

    // Simulate session_joined payload
    if (sessionJoinedHandler) {
      await act(async () => {
        sessionJoinedHandler({
          session_id: 'session-abc',
          project_id: 'test-project-id',
          content: '',
          version: 0,
          files: {},
          active_file: '',
          users: [{ id: 'guest-aaaa', name: 'Guest AAAA', color: '#abc' }],
          user_id: 'guest-aaaa',
          color: '#abc',
        });
      });
    }

    await joinPromise!;
    await waitFor(() => {
      expect(result.current.session?.users.some((u) => u.id === 'guest-aaaa')).toBe(true);
    });

    // Now simulate sign-in by changing mockUser and rerender
    mockUser = { uid: 'user-123', name: 'Signed In', email: 'signed@example.com' };
    mockIsAuthenticated = true;
    await act(async () => {
      rerender();
    });

    // Wait and assert that the local session user list has been updated to the new user id/name
    await waitFor(() => {
      expect(result.current.session?.users.some((u) => u.id === 'user-123')).toBe(true);
      expect(result.current.session?.users.some((u) => u.name === 'Signed In')).toBe(true);
      expect(result.current.session?.users.some((u) => u.id === 'guest-aaaa')).toBe(false);
    });

    unmount();
  });
});
