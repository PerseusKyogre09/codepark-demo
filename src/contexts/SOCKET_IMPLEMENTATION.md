# WebSocket Realtime Integration

This document describes the native WebSocket integration layer for real-time communication between the React frontend and the FastAPI backend.

## Overview

The realtime integration provides:
- Typed client/server event contracts in `SocketContext`
- Automatic connection lifecycle management with backoff retries
- Connection status tracking and user-facing error handling
- A transport-agnostic `RealtimeSocket` interface backed by native WebSocket

## Architecture

### `SocketProvider` Context

`SocketProvider` owns the websocket client instance and exposes connection state and actions via React Context.

Key behavior:
- Optional auto-connect on mount
- Retry with exponential backoff on unexpected disconnects
- Connection states: `disconnected`, `connecting`, `connected`, `reconnecting`, `error`
- Server error normalization and toast reporting

### Event Flow

Client emits JSON frames with `{ type, payload }` and the backend responds with matching event types.

Core categories:
- Session lifecycle (`create_session`, `join_session`, `leave_session`)
- File/project operations
- Terminal and execution streams
- Presence + role updates
- Yjs sync messages (`yjs_update`, `yjs_awareness`)

## Usage

```tsx
import { useSocket } from './contexts/SocketContext';

function Example() {
  const { socket, isConnected, connectionStatus } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const onCreated = (data: { session_id: string }) => {
      console.log('Session created:', data.session_id);
    };

    socket.on('session_created', onCreated);
    socket.emit('create_session', { user_id: 'u1', user_name: 'User' });

    return () => socket.off('session_created', onCreated);
  }, [socket, isConnected]);

  return <div>Status: {connectionStatus}</div>;
}
```

## Configuration

Use frontend env vars for API and websocket endpoints:

```dotenv
VITE_API_URL=http://localhost:5000
VITE_NATIVE_WS_BASE=ws://localhost:5000/ws/collab
```

## Notes

- Legacy Socket.IO fallback has been removed from the app runtime path.
- Realtime collaboration now runs on native WebSocket end-to-end.
