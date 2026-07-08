import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { useAuth } from '../contexts/AuthContext';

const SocketTestPage: React.FC = () => {
  const { socket, isConnected, connectionStatus } = useSocket();
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = (msg: string) => {
    setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for connection events
    socket.on('connected', (data) => {
      addMessage(`✓ Connected: ${data.message}`);
    });

    socket.on('error', (data) => {
      addMessage(`✗ Error: ${data.message}`);
    });

    // Listen for session events
    socket.on('session_created', (data) => {
      addMessage(`✓ Session created: ${data.session_id}`);
      setSessionId(data.session_id);
    });

    socket.on('session_joined', (data) => {
      addMessage(`✓ Joined session: ${data.session_id}`);
      setSessionId(data.session_id);
    });

    socket.on('user_joined', (data) => {
      addMessage(`👤 User joined: ${data.user_name} (${data.user_id})`);
    });

    socket.on('user_left', (data) => {
      addMessage(`👤 User left: ${data.user_id}`);
    });

    // Cleanup
    return () => {
      socket.off('connected');
      socket.off('error');
      socket.off('session_created');
      socket.off('session_joined');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [socket]);

  const handleCreateSession = () => {
    if (!socket || !isConnected) {
      addMessage('✗ Cannot create session: Not connected');
      return;
    }

    if (!user) {
      addMessage('✗ Cannot create session: Not authenticated');
      return;
    }

    addMessage('→ Creating session...');
    socket.emit('create_session', {
      user_id: user.uid,
      user_name: user.name || user.email || 'Anonymous',
    });
  };

  const handleJoinSession = () => {
    if (!socket || !isConnected) {
      addMessage('✗ Cannot join session: Not connected');
      return;
    }

    if (!user) {
      addMessage('✗ Cannot join session: Not authenticated');
      return;
    }

    const testSessionId = prompt('Enter session ID to join:');
    if (!testSessionId) return;

    addMessage(`→ Joining session ${testSessionId}...`);
    socket.emit('join_session', {
      session_id: testSessionId,
      user_id: user.uid,
      user_name: user.name || user.email || 'Anonymous',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              WebSocket Test Page
            </h1>
            <ConnectionStatus showText={true} />
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {connectionStatus}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Session ID</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sessionId || 'None'}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateSession}
                disabled={!isConnected || !user}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Session
              </button>
              <button
                onClick={handleJoinSession}
                disabled={!isConnected || !user}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Join Session
              </button>
            </div>

            {!user && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ You need to be authenticated to create or join sessions. Please log in first.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Event Log
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm" style={{ overscrollBehavior: 'none' }}>
              {messages.length === 0 ? (
                <div className="text-gray-500">No events yet...</div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="text-gray-300 mb-1">
                    {msg}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocketTestPage;
