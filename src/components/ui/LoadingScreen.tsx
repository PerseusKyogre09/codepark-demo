import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useAuthOptional } from '../../contexts/AuthContext';
import { useSessionOptional } from '../../contexts/SessionContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function LoadingScreen() {
    const location = useLocation();
    const auth = useAuthOptional();
    const session = useSessionOptional();
    const { themeColors, settings } = useTheme();

    const accentColor = '#2c9e58';

    // Fallbacks if providers are not mounted
    const authLoading = auth?.loading ?? false;
    const isInSession = session?.isInSession ?? false;
    const sessionError = session?.sessionError;

    // Local state for minimum load time
    const [minLoadComplete, setMinLoadComplete] = useState(false);
    const [prevPath, setPrevPath] = useState(location.pathname);

    // Reset loading state on path change
    if (prevPath !== location.pathname) {
        setPrevPath(location.pathname);
        setMinLoadComplete(false);
    }

    // Handle minimum load time
    useEffect(() => {
        if (minLoadComplete) return;
        const timer = setTimeout(() => {
            setMinLoadComplete(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, [minLoadComplete, location.pathname]);

    // Determine if we should show the loading screen
    // Only cover the actual editor sub-route, NOT the entry/waiting-room at /project/:id
    const isEditorRoute = location.pathname.includes('/project/') && location.pathname.includes('/editor')
    const hasSessionId = isEditorRoute && location.pathname.split('/').length > 2
    const isWaitingForSession = hasSessionId && !isInSession && !sessionError
    const isLoading = !minLoadComplete || authLoading || isWaitingForSession

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key={settings.uiTheme}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    style={{ 
                        background: themeColors.terminalBg,
                        backgroundImage: `linear-gradient(${settings.uiTheme === 'dark' ? 'rgba(63, 255, 139, 0.05)' : 'rgba(16, 185, 129, 0.08)'} 1px, transparent 1px), linear-gradient(90deg, ${settings.uiTheme === 'dark' ? 'rgba(63, 255, 139, 0.05)' : 'rgba(16, 185, 129, 0.08)'} 1px, transparent 1px)`,
                        backgroundSize: '32px 32px',
                        backgroundAttachment: 'fixed',
                        animation: 'moveGrid 20s linear infinite'
                    }}
                >
                    <style>{`
                        @keyframes moveGrid {
                            0% { background-position: 0 0; }
                            100% { background-position: 32px 32px; }
                        }
                    `}</style>

                    {/* Main content */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10 flex flex-col items-center gap-8"
                    >
                        {/* Geometric Scanner Core */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            {/* Outer square frame */}
                            <motion.div
                                className="absolute inset-0 border-2 rounded-xl"
                                style={{ borderColor: `${accentColor}40` }}
                                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                            
                            {/* Inner diamond frame */}
                            <motion.div
                                className="w-12 h-12 border border-dashed"
                                style={{ borderColor: accentColor }}
                                animate={{ rotate: -360, opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            
                            {/* Central pulsing core */}
                            <motion.div
                                className="absolute w-2 h-2 rounded-full"
                                style={{ 
                                    background: accentColor,
                                    boxShadow: `0 0 20px ${accentColor}`
                                }}
                                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        {/* Branding with Breathing Effect */}
                        <div className="flex flex-col items-center gap-2">
                            <motion.h1
                                className="text-3xl font-bold tracking-tighter"
                                style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Grotesk' }}
                                animate={{ textShadow: [`0 0 10px ${accentColor}00`, `0 0 20px ${accentColor}60`, `0 0 10px ${accentColor}00`] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                Code<span style={{ color: accentColor }}>Park</span>
                            </motion.h1>
                            <motion.p
                                className="text-[10px] uppercase font-mono tracking-[0.3em] opacity-40"
                                style={{ color: themeColors.terminalSecondary }}
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Initializing System
                            </motion.p>
                        </div>

                        {/* Scanner Progress Line */}
                        <div className="w-64 h-[1px] relative overflow-hidden" style={{ background: settings.uiTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(16, 185, 129, 0.2)' }}>
                            <motion.div
                                className="absolute h-full w-24"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` 
                                }}
                                animate={{ left: ['-20%', '110%'] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
