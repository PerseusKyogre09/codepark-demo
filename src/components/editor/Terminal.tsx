import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { X, Minimize2, Trash2 } from 'lucide-react';
import { useTheme, editorThemes } from '../../contexts/ThemeContext';
import { useSocket } from '../../contexts/SocketContext';
import { useSession } from '../../contexts/SessionContext';

interface TerminalProps {
  onClose: () => void;
  height?: string;
}

/**
 * Terminal Component
 * 
 * Responsibilities:
 * - Subscribes to the backend PTY container output and translates input back.
 * - Handles interactive bash command execution in collaborative sessions.
 * - Manages xterm instance rendering, fit/re-flow, link interception, and cleanup on unmount.
 */

export function Terminal({ onClose, height = '30vh' }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const socketRef = useRef<ReturnType<typeof useSocket>['socket']>(null);
  const isConnectedRef = useRef(false);
  const sessionIdRef = useRef<string | undefined>(undefined);
  const lastJoinKeyRef = useRef<string | null>(null);
  const inputSequenceRef = useRef<number>(0);
  const lastInputFrameRef = useRef<{ data: string; at: number } | null>(null);

  const { settings, themeColors } = useTheme();
  const { socket, isConnected } = useSocket();
  const { session } = useSession();
  const editorTheme = settings.editorTheme;
  const editorColors = editorThemes[editorTheme] || editorThemes.dark;

  useEffect(() => {
    socketRef.current = socket;
    isConnectedRef.current = isConnected;
    sessionIdRef.current = session?.id;
  }, [socket, isConnected, session?.id]);

  // Initialize xterm on mount
  useEffect(() => {
    if (!terminalRef.current) return;

    // cleanup previous instance if any (React StrictMode double mount)
    if (xtermRef.current) {
      xtermRef.current.dispose();
    }
    const term = new XTerm({
      cursorBlink: true,
      scrollOnUserInput: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      scrollback: 5000,
      theme: {
        background: editorColors.bgColor || '#1e1e1e',
        foreground: editorColors.text || '#d4d4d4',
        cursor: settings.accentColor,
        selectionBackground: settings.accentColor + '40',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5',
      },
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();

    // Custom link handler to intercept local development server links and rewrite them
    // to CodePark's preview proxy, matching VS Code/Codespaces UX.
    const handleLinkClick = (_event: MouseEvent, uri: string) => {
      const match = uri.match(/^https?:\/\/(localhost|127\.0\.0\.1|172\.\d+\.\d+\.\d+):(3000|5173|8000|8080)(.*)/i);
      if (match && sessionIdRef.current) {
        const port = match[2];
        let path = match[3] || '';
        if (path && !path.startsWith('/')) {
          path = '/' + path;
        }
        const proxiedUrl = `/api/sessions/${sessionIdRef.current}/preview/${port}${path}`;
        window.open(proxiedUrl, '_blank');
      } else {
        // Fallback for standard external links
        window.open(uri, '_blank');
      }
    };

    const webLinksAddon = new WebLinksAddon(handleLinkClick);

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Handle user input
    const inputDisposable = term.onData((data) => {
      const activeSocket = socketRef.current;
      const connected = isConnectedRef.current;
      const activeSessionId = sessionIdRef.current;
      if (!activeSocket || !connected || !activeSessionId || !data) {
        return;
      }

      const now = Date.now();
      const previous = lastInputFrameRef.current;
      if (previous && previous.data === data && (now - previous.at) < 35) {
        return;
      }
      lastInputFrameRef.current = { data, at: now };

      const seq = ++inputSequenceRef.current;

      // Send keystroke to the PTY for interactive execution
      activeSocket.emit('terminal_input', {
        input: data,
        session_id: activeSessionId,
        seq: seq,
      });
    });

    // Synchronize XTerm layout adjustments with the PTY process
    const resizeDisposable = term.onResize((size) => {
      const activeSocket = socketRef.current;
      const connected = isConnectedRef.current;
      const activeSessionId = sessionIdRef.current;
      if (activeSocket && connected && activeSessionId) {
        activeSocket.emit('terminal_resize', {
          cols: size.cols,
          rows: size.rows,
          session_id: activeSessionId,
        });
      }
    });

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    // Initial greeting
    term.writeln('\x1b[1;35m  CodePark Collaborative Terminal v2.0\x1b[0m');
    term.writeln('\x1b[90m  Type standard bash commands. \x1b[0m\r\n');

    // Delayed fit to ensure container size is ready
    setTimeout(() => {
      fitAddon.fit();
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      inputDisposable.dispose();
      resizeDisposable.dispose();
      term.dispose();
      xtermRef.current = null;
    };
  }, []); // Run once on mount

  // Sync theme changes
  useEffect(() => {
    if (xtermRef.current) {
      xtermRef.current.options.theme = {
        background: editorColors.bgColor || '#1e1e1e',
        foreground: editorColors.text || '#d4d4d4',
        cursor: settings.accentColor,
        selectionBackground: settings.accentColor + '40',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5',
      };
    }
  }, [editorColors, settings.accentColor]);

  // Handle socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleOutput = (data: { chunk: string; stream: string; seq?: number }) => {
      if (xtermRef.current) {
        xtermRef.current.write(data.chunk);
      }
    };

    const handleHistory = (data: { history: string }) => {
      if (data.history && xtermRef.current) {
        xtermRef.current.write(data.history);
      }
    };

    const handleError = (data: { message: string }) => {
      if (xtermRef.current) {
        xtermRef.current.writeln(`\x1b[1;31mError: ${data.message}\x1b[0m`);
      }
    };

    socket.on('terminal_output', handleOutput);
    socket.on('terminal_history', handleHistory);
    socket.on('terminal_error', handleError);

    return () => {
      socket.off('terminal_output', handleOutput);
      socket.off('terminal_history', handleHistory);
      socket.off('terminal_error', handleError);
    };
  }, [socket]);

  // Handle joining terminal session
  useEffect(() => {
    if (!socket || !isConnected || !session?.id) return;
    const joinKey = `${socket.id || 'noid'}:${session.id}`;
    if (lastJoinKeyRef.current !== joinKey) {
      lastJoinKeyRef.current = joinKey;
      socket.emit('terminal_join', { session_id: session.id });
    }
  }, [socket, isConnected, session?.id]);

  // Handle resize observer for container size changes
  useEffect(() => {
    if (!terminalRef.current || !fitAddonRef.current) return;

    const observer = new ResizeObserver(() => {
      // Wrap in requestAnimationFrame to avoid "ResizeObserver loop limit exceeded"
      requestAnimationFrame(() => {
        fitAddonRef.current?.fit();
      });
    });
    observer.observe(terminalRef.current);

    return () => observer.disconnect();
  }, [height]);


  const handleClear = () => {
    xtermRef.current?.clear();
  };

  return (
    <div
      className="border-t flex flex-col"
      style={{
        height: '100%',
        minHeight: '150px',
        backgroundColor: editorColors.bgColor || '#1e1e1e',
        borderColor: editorColors.border || themeColors.border
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{
          background: editorColors.navBg || 'rgba(0,0,0,0.1)',
          borderColor: editorColors.border || themeColors.border
        }}
        onDoubleClick={() => onClose()} // Double click header to close
      >
        <span className="text-xs uppercase tracking-widest font-bold opacity-80" style={{ color: settings.accentColor }}>Terminal</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            style={{ color: editorColors.textSecondary || themeColors.textSecondary }}
            title="Clear terminal"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            style={{ color: editorColors.textSecondary || themeColors.textSecondary }}
            title="Minimize terminal"
          >
            <Minimize2 size={14} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            style={{ color: editorColors.textSecondary || themeColors.textSecondary }}
            title="Close terminal"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative" style={{ backgroundColor: editorColors.bgColor || '#1e1e1e' }}>
        <div
          ref={terminalRef}
          className="absolute inset-0 pl-2"
        />
      </div>
    </div>
  );
}
