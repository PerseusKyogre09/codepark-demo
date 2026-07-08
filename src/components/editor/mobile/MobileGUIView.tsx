import { useState, useRef, useCallback, useEffect } from 'react';
import { X, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CornerDownLeft, Space, Keyboard as KeyboardIcon } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSocket } from '../../../contexts/SocketContext';

interface MobileGUIViewProps {
    novncUrl: string;
    onClose: () => void;
    onTerminate: () => void;
    onReload: () => void;
    onIframeLoad: () => void;
    isLoading: boolean;
    loadingMessage: string;
    sessionId: string;
}

export function MobileGUIView({
    novncUrl,
    onClose,
    onTerminate,
    onReload,
    onIframeLoad,
    isLoading,
    loadingMessage,
    sessionId
}: MobileGUIViewProps) {
    const { themeColors, settings } = useTheme();
    const { socket } = useSocket();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const joystickRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
    const [isDrifting, setIsDrifting] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    // Send key events to backend via realtime websocket
    const sendKeyEvent = useCallback((key: string, action: 'keydown' | 'keyup' | 'keypress' = 'keypress') => {
        if (socket) {
            socket.emit('vnc_input', {
                session_id: sessionId,
                event_type: 'key',
                key,
                action
            });
        }
    }, [socket, sessionId]);

    // Send mouse move events to backend
    const sendMouseMove = useCallback((dx: number, dy: number) => {
        if (socket) {
            socket.emit('vnc_input', {
                session_id: sessionId,
                event_type: 'mouse',
                x: dx,
                y: dy,
                relative: true
            });
        }
    }, [socket, sessionId]);

    // Handle native keyboard input
    const handleNativeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const char = e.target.value.slice(-1); // Get last char typed
        if (char) {
            sendKeyEvent(char, 'keypress');
        }
        // Reset input value to keep capturing events
        e.target.value = '';
    }, [sendKeyEvent]);

    const handleNativeKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle special keys that don't produce a char value in onChange (like Backspace)
        if (e.key === 'Backspace') {
            sendKeyEvent('BackSpace', 'keypress');
        } else if (e.key === 'Enter') {
            sendKeyEvent('Return', 'keypress');
        }
    }, [sendKeyEvent]);

    const toggleKeyboard = useCallback(() => {
        if (isKeyboardOpen) {
            inputRef.current?.blur();
            setIsKeyboardOpen(false);
        } else {
            inputRef.current?.focus();
            setIsKeyboardOpen(true);
        }
    }, [isKeyboardOpen]);

    // Joystick logic for mouse emulation
    const handleJoystickMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (!isDrifting || !joystickRef.current) return;

        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const dx = clientX - centerX;
        const dy = clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = rect.width / 2;

        const stickX = dist > maxDist ? (dx / dist) * maxDist : dx;
        const stickY = dist > maxDist ? (dy / dist) * maxDist : dy;

        setJoystickPos({ x: stickX, y: stickY });

        // Map joystick position to relative mouse movement
        const moveX = Math.round(stickX / 5);
        const moveY = Math.round(stickY / 5);

        if (moveX !== 0 || moveY !== 0) {
            sendMouseMove(moveX, moveY);
        }
    }, [isDrifting, sendMouseMove]);

    const stopDrift = useCallback(() => {
        setIsDrifting(false);
        setJoystickPos({ x: 0, y: 0 });
    }, []);

    // Continuous movement while joystick is held
    useEffect(() => {
        if (!isDrifting) return;

        const interval = setInterval(() => {
            const moveX = Math.round(joystickPos.x / 5);
            const moveY = Math.round(joystickPos.y / 5);
            if (moveX !== 0 || moveY !== 0) {
                sendMouseMove(moveX, moveY);
            }
        }, 50); // ~20fps

        return () => clearInterval(interval);
    }, [isDrifting, joystickPos, sendMouseMove]);

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col font-sans mobile-gui-container">
            <style>{`
                /* Landscape optimizations */
                @media (orientation: landscape) {
                    .mobile-gui-container .gui-header,
                    .mobile-gui-container .gui-controls {
                        display: none !important;
                    }
                    .mobile-gui-container .gui-display {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        z-index: 10;
                    }
                    /* Add a floating toggle for controls in landscape if needed, 
                       or just assume user rotates back to portrait for controls */
                }
            `}</style>

            {/* Hidden Input for Native Keyboard */}
            <input
                ref={inputRef}
                type="text"
                className="absolute opacity-0 w-1 h-1 -z-10"
                onChange={handleNativeInput}
                onKeyDown={handleNativeKeyDown}
                onBlur={() => setIsKeyboardOpen(false)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
            />

            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b shrink-0 gui-header"
                style={{ background: themeColors.bg, borderColor: themeColors.border }}>
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-2 -ml-2 rounded-full active:bg-white/10">
                        <X size={24} style={{ color: themeColors.text }} />
                    </button>
                    <span className="font-semibold" style={{ color: themeColors.text }}>GUI Player</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleKeyboard}
                        className={`p-2 rounded-full active:bg-white/10 transition-colors ${isKeyboardOpen ? 'bg-blue-500/20 text-blue-400' : ''}`}
                    >
                        <KeyboardIcon size={20} style={{ color: isKeyboardOpen ? '#60a5fa' : themeColors.text }} />
                    </button>
                    <button onClick={onReload} className="p-2 rounded-full active:bg-white/10">
                        <RotateCcw size={20} style={{ color: themeColors.text }} />
                    </button>
                    <button onClick={onTerminate} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform">
                        Terminate
                    </button>
                </div>
            </div>

            {/* Display Area */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden gui-display">
                <iframe
                    ref={iframeRef}
                    src={novncUrl}
                    className="w-full h-full border-0"
                    title="GUI Mobile View"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-pointer-lock"
                    allow="clipboard-read; clipboard-write; fullscreen"
                    onLoad={onIframeLoad}
                />

                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 text-center px-6">
                        <div className="w-12 h-12 border-4 border-t-white border-white/20 rounded-full animate-spin mb-4" />
                        <p className="text-white font-medium">{loadingMessage}</p>
                    </div>
                )}
            </div>

            {/* Controls Section */}
            <div className="h-48 shrink-0 grid grid-cols-2 gap-4 p-4 border-t gui-controls"
                style={{ background: themeColors.bg, borderColor: themeColors.border }}>

                {/* Left: Keypad */}
                <div className="grid grid-cols-3 gap-2">
                    <button
                        className="flex items-center justify-center h-10 rounded-lg bg-white/5 active:bg-white/20 transition-colors"
                        onMouseDown={() => sendKeyEvent('Escape', 'keydown')}
                        onMouseUp={() => sendKeyEvent('Escape', 'keyup')}
                        onTouchStart={() => sendKeyEvent('Escape', 'keydown')}
                        onTouchEnd={() => sendKeyEvent('Escape', 'keyup')}>
                        <span className="text-xs font-bold">ESC</span>
                    </button>
                    <button
                        className="flex items-center justify-center h-10 rounded-lg bg-white/5 active:bg-white/20 transition-colors"
                        onMouseDown={() => sendKeyEvent('ArrowUp', 'keydown')}
                        onMouseUp={() => sendKeyEvent('ArrowUp', 'keyup')}
                        onTouchStart={() => sendKeyEvent('ArrowUp', 'keydown')}
                        onTouchEnd={() => sendKeyEvent('ArrowUp', 'keyup')}>
                        <ChevronUp size={20} />
                    </button>
                    <button
                        className="flex items-center justify-center h-10 rounded-lg bg-white/10 active:bg-white/30 text-blue-400 transition-colors"
                        onMouseDown={() => sendKeyEvent('r', 'keydown')}
                        onMouseUp={() => sendKeyEvent('r', 'keyup')}
                        onTouchStart={() => sendKeyEvent('r', 'keydown')}
                        onTouchEnd={() => sendKeyEvent('r', 'keyup')}>
                        <RotateCcw size={16} /><span className="ml-1 font-bold">R</span>
                    </button>

                    <button
                        className="flex items-center justify-center h-10 rounded-lg bg-white/5 active:bg-white/20 transition-colors"
                        onMouseDown={() => sendKeyEvent('ArrowLeft', 'keydown')}
                        onMouseUp={() => sendKeyEvent('ArrowLeft', 'keyup')}
                        onTouchStart={() => sendKeyEvent('ArrowLeft', 'keydown')}
                        onTouchEnd={() => sendKeyEvent('ArrowLeft', 'keyup')}>
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        className="flex items-center justify-center h-10 rounded-lg bg-white/5 active:bg-white/20 transition-colors"
                        onMouseDown={() => sendKeyEvent('ArrowDown', 'keydown')}
                        onMouseUp={() => sendKeyEvent('ArrowDown', 'keyup')}
                        onTouchStart={() => sendKeyEvent('ArrowDown', 'keydown')}
                        onTouchEnd={() => sendKeyEvent('ArrowDown', 'keyup')}>
                        <ChevronDown size={20} />
                    </button>
                    <button
                        className="flex items-center justify-center h-10 rounded-lg bg-white/5 active:bg-white/20 transition-colors"
                        onMouseDown={() => sendKeyEvent('ArrowRight', 'keydown')}
                        onMouseUp={() => sendKeyEvent('ArrowRight', 'keyup')}
                        onTouchStart={() => sendKeyEvent('ArrowRight', 'keydown')}
                        onTouchEnd={() => sendKeyEvent('ArrowRight', 'keyup')}>
                        <ChevronRight size={20} />
                    </button>

                    {/* Space and Enter take full width of their area if needed, or structured differently */}
                    <button
                        className="col-span-2 flex items-center justify-center h-10 rounded-lg bg-white/10 active:bg-white/30 transition-colors"
                        onMouseDown={() => sendKeyEvent(' ', 'keydown')}
                        onMouseUp={() => sendKeyEvent(' ', 'keyup')}
                        onTouchStart={() => sendKeyEvent(' ', 'keydown')}
                        onTouchEnd={() => sendKeyEvent(' ', 'keyup')}>
                        <Space size={20} /><span className="ml-2 text-xs font-bold">SPACE</span>
                    </button>
                    <button
                        className="flex items-center justify-center h-10 rounded-lg bg-green-500/20 active:bg-green-500/40 text-green-400 transition-colors"
                        onMouseDown={() => sendKeyEvent('Enter', 'keydown')}
                        onMouseUp={() => sendKeyEvent('Enter', 'keyup')}
                        onTouchStart={() => sendKeyEvent('Enter', 'keydown')}
                        onTouchEnd={() => sendKeyEvent('Enter', 'keyup')}>
                        <CornerDownLeft size={18} />
                    </button>
                </div>

                {/* Right: Joystick */}
                <div className="relative flex items-center justify-center border-l pl-4"
                    style={{ borderColor: `${themeColors.border}44` }}>
                    <div
                        ref={joystickRef}
                        className="w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center opacity-60"
                        style={{ borderColor: settings.accentColor }}
                        onTouchStart={() => setIsDrifting(true)}
                        onTouchMove={handleJoystickMove}
                        onTouchEnd={stopDrift}
                        onMouseDown={() => setIsDrifting(true)}
                        onMouseMove={handleJoystickMove}
                        onMouseUp={stopDrift}
                        onMouseLeave={stopDrift}
                    >
                        <div
                            className="w-10 h-10 rounded-full shadow-2xl transform transition-transform duration-75 pointer-events-none"
                            style={{
                                background: `radial-gradient(circle at 30% 30%, ${settings.accentColor}, ${settings.accentColor}dd)`,
                                border: '2px solid rgba(255,255,255,0.2)',
                                transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
