import { useEffect, useState, useRef, useCallback } from 'react';
import { X, Maximize2, Minimize2, GripHorizontal, RefreshCcw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDialog } from '../../contexts/DialogContext';
import { useMobile } from '../../hooks/useMobile';
import { MobileGUIView } from './mobile/MobileGUIView';
import { motion, useDragControls } from 'motion/react';

interface GUIPreviewProps {
  guiSessionId: string;
  novncUrl: string;
  framework: string;
  onClose: () => void;
  onTerminate: () => void;
}

export function GUIPreview({
  guiSessionId,
  novncUrl,
  framework,
  onClose,
  onTerminate,
}: GUIPreviewProps) {
  const { settings, themeColors } = useTheme();
  const { showConfirm } = useDialog();
  const { isMobile } = useMobile();
  const editorTheme = settings.editorTheme;
  const [isMaximized, setIsMaximized] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing VNC connection...');
  const [showIframe, setShowIframe] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Resizing state
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate unique tab ID for this browser tab
  const [tabId] = useState(() => Math.random().toString(36).substring(7));

  // Heartbeat: Ping server every 10 seconds to keep session alive
  useEffect(() => {
    const pingServer = async () => {
      try {
        await fetch(`/api/gui/sessions/${guiSessionId}/heartbeat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tab_id: tabId }),
        });
      } catch (error) {
        console.error('Heartbeat failed:', error);
      }
    };

    // Initial ping
    pingServer();

    // Set up interval to ping every 10 seconds
    const heartbeatInterval = setInterval(pingServer, 10000);

    // Cleanup on unmount (tab close)
    return () => {
      clearInterval(heartbeatInterval);
      console.log('💔 Heartbeat stopped - tab closing');
    };
  }, [guiSessionId, tabId]);

  const bgColor = editorTheme === 'dark' ? '#1e1e1e' :
    editorTheme === 'light' ? '#ffffff' :
      editorTheme === 'forest' ? '#1a2f1a' :
        editorTheme === 'ocean' ? '#0a1929' :
          editorTheme === 'sunset' ? '#1f0d2e' :
            editorTheme === 'midnight' ? '#0f0f1e' :
              editorTheme === 'cyberpunk' ? '#0d0626' :
                '#2a1a2a';

  const handleReload = () => {
    setIsLoading(true);
    setLoadingMessage('Reinitializing VNC connection...');
    setIframeKey(prev => prev + 1);
  };

  const handleTerminate = async () => {
    const confirmed = await showConfirm(
      'Terminate GUI Session',
      'Are you sure you want to terminate this GUI session? This will stop the application.'
    );

    if (confirmed) {
      onTerminate();
    }
  };

  const handleOpenInNewTab = () => {
    window.open(novncUrl, '_blank', 'noopener,noreferrer');
  };

  // Handle loading state progression
  useEffect(() => {
    const timers: number[] = [];

    // Progressive loading messages
    timers.push(window.setTimeout(() => setLoadingMessage('Starting VNC server...'), 5000));
    timers.push(window.setTimeout(() => setLoadingMessage('Establishing connection...'), 3000));
    timers.push(window.setTimeout(() => setLoadingMessage('Almost ready...'), 7000));

    // Force hide loading after 10 seconds (fallback)
    timers.push(window.setTimeout(() => {
      setIsLoading(false);
    }, 10000));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [iframeKey]); // Reset when iframe reloads

  // Handle iframe load event
  const handleIframeLoad = () => {
    // Small delay to ensure VNC is fully rendered
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    loadTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Clean up iframe load timeout on unmount
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  // Delay iframe loading to give VNC server time to start
  useEffect(() => {
    // Wait 3 seconds before loading iframe to ensure VNC is ready
    const delayTimer = window.setTimeout(() => {
      setShowIframe(true);
    }, 8000);

    return () => {
      clearTimeout(delayTimer);
    };
  }, [iframeKey]);

  // Auto-retry mechanism if VNC fails to connect
  useEffect(() => {
    if (!showIframe || !isLoading) return;

    const MAX_RETRIES = 5;
    const RETRY_DELAY = 2000; // 2 seconds

    // If still loading after initial delay, try reloading iframe
    const retryTimer = window.setTimeout(() => {
      if (isLoading && retryCount < MAX_RETRIES) {
        console.log(`VNC retry attempt ${retryCount + 1}/${MAX_RETRIES}`);
        setRetryCount(prev => prev + 1);
        setIframeKey(prev => prev + 1);
        setShowIframe(false);
        setLoadingMessage(`Retrying connection... (${retryCount + 1}/${MAX_RETRIES})`);
      }
    }, RETRY_DELAY + 3000); // Wait for initial 3s delay + 2s before retry

    return () => {
      clearTimeout(retryTimer);
    };
  }, [showIframe, isLoading, retryCount]);

  // Handle resizing logic
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    // Disable iframe pointer events during resize
    const iframe = document.getElementById(`gui-iframe-${guiSessionId}`);
    if (iframe) iframe.style.pointerEvents = 'none';
  }, [guiSessionId]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate new size based on mouse position relative to container top-left
        // limiting min size to 300x200
        const newWidth = Math.max(300, e.clientX - rect.left);
        const newHeight = Math.max(200, e.clientY - rect.top);
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Re-enable iframe pointer events
      const iframe = document.getElementById(`gui-iframe-${guiSessionId}`);
      if (iframe) iframe.style.pointerEvents = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, guiSessionId]);


  if (isMobile) {
    return (
      <MobileGUIView
        novncUrl={`${novncUrl}?autoconnect=true&resize=scale&reconnect=true&reconnect_delay=1000`}
        onClose={onClose}
        onTerminate={handleTerminate}
        onReload={handleReload}
        onIframeLoad={handleIframeLoad}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        sessionId={guiSessionId}
      />
    );
  }

  // Pointer events logic:
  // When dragging or resizing, we disable pointer events on the iframe so it doesn't swallow mouse events.
  const pointerEventsStyle = isDragging || isResizing ? 'none' : 'auto';

  return (
    <motion.div
      drag={!isMaximized}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      initial={{
        x: window.innerWidth / 2 - 400,
        y: window.innerHeight / 2 - 300,
        opacity: 0,
        scale: 0.9
      }}
      animate={{
        x: isMaximized ? 0 : undefined,
        y: isMaximized ? 0 : undefined,
        width: isMaximized ? '100vw' : size.width,
        height: isMaximized ? '100vh' : size.height,
        opacity: 1,
        scale: 1
      }}
      ref={containerRef as any}
      className={`fixed z-[9999] flex flex-col rounded-lg shadow-2xl border overflow-hidden ${isMaximized ? 'inset-0' : ''}`}
      style={{
        background: bgColor,
        borderColor: themeColors.border,
        // If maximized, we force fixed position at 0,0 via motion animate
      }}
    >
      {/* Header - Draggable Area */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b cursor-grab active:cursor-grabbing select-none"
        style={{ borderColor: themeColors.border }}
        onPointerDown={(e) => {
          if (!isMaximized) dragControls.start(e);
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-1 rounded opacity-50">
            <GripHorizontal size={16} />
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{
              background: `${settings.accentColor}22`,
              color: settings.accentColor,
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: settings.accentColor }}></span>
            GUI Session
          </div>
          <span className="text-sm" style={{ color: themeColors.textSecondary }}>
            {framework} • {guiSessionId.slice(0, 8)}
          </span>
        </div>

        <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={handleOpenInNewTab}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: themeColors.text }}
            title="Open viewer in new tab"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 8h8v8" />
              <path d="M4 20h16" />
              <path d="M4 4h6" />
              <path d="M4 4v6" />
              <path d="M20 4h-6" />
              <path d="M20 4v6" />
            </svg>
          </button>

          <button
            onClick={handleReload}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: themeColors.text }}
            title="Reload viewer"
          >
            <RefreshCcw size={18} />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: themeColors.text }}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            onClick={handleTerminate}
            className="px-3 py-1.5 text-sm rounded-lg font-medium transition-all hover:opacity-90 text-white"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
          >
            Terminate
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: themeColors.text }}
            title="Close (session continues running)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* noVNC Viewer */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {showIframe && (
          <iframe
            id={`gui-iframe-${guiSessionId}`}
            key={iframeKey}
            src={`${novncUrl}?autoconnect=true&resize=scale&reconnect=true&reconnect_delay=1000`}
            className="w-full h-full border-0 select-none"
            style={{ pointerEvents: pointerEventsStyle as any }}
            title="GUI Preview"
            sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-pointer-lock"
            allow="clipboard-read; clipboard-write; fullscreen"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{
              background: bgColor,
              zIndex: 10
            }}
          >
            {/* Animated Spinner */}
            <div className="relative mb-6">
              <div
                className="w-16 h-16 rounded-full border-4 border-opacity-20"
                style={{ borderColor: settings.accentColor }}
              />
              <div
                className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: settings.accentColor }}
              />
            </div>

            {/* Loading Message */}
            <div className="text-center space-y-2">
              <p
                className="text-lg font-medium"
                style={{ color: themeColors.text }}
              >
                {loadingMessage}
              </p>
              <p
                className="text-sm opacity-70"
                style={{ color: themeColors.textSecondary }}
              >
                Setting up your GUI session
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: settings.accentColor,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Resize Handle */}
      <div
        className="h-6 relative border-t flex items-center justify-between px-2"
        style={{
          background: bgColor,
          borderColor: themeColors.border,
        }}
      >
        <span className="text-[10px] opacity-50" style={{ color: themeColors.textSecondary }}>
          {Math.round(isMaximized ? window.innerWidth : size.width)} x {Math.round(isMaximized ? window.innerHeight : size.height)}
        </span>

        {/* Resize Handle (only when not maximized) */}
        {!isMaximized && (
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center hover:bg-white/10 rounded-tl"
            onMouseDown={handleResizeStart}
            style={{ color: themeColors.textSecondary }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 22L12 22L22 12V22Z" />
            </svg>
          </div>
        )}
      </div>
    </motion.div >
  );
}

