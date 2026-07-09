import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Crown, Terminal, Power } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

export function MarketingNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [terminalMenuOpen, setTerminalMenuOpen] = useState(false)
    const terminalMenuRef = useRef<HTMLDivElement>(null)
    const { isAuthenticated, logout } = useAuth()
    const { settings, updateSettings, themeColors } = useTheme()
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (terminalMenuRef.current && !terminalMenuRef.current.contains(event.target as Node)) {
                setTerminalMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const toggleTheme = () => {
        updateSettings({ uiTheme: settings.uiTheme === 'dark' ? 'light' : 'dark' })
    }

    return (
        <nav
            className="fixed top-0 w-full z-50 px-6 py-6"
            style={{
                background: themeColors.terminalBg
            }}
        >
            <style>{`
                .glitch-border-nav {
                    position: relative;
                    border: 1px solid ${themeColors.terminalPrimary};
                    box-shadow: 0 0 10px ${themeColors.terminalBorder};
                }
                .glitch-border-nav::before {
                    content: '';
                    position: absolute;
                    top: -2px; left: -2px; right: -2px; bottom: -2px;
                    border: 1px solid ${themeColors.terminalPrimary};
                    opacity: 0;
                    transition: opacity 0.1s;
                }
                .glitch-border-nav:hover::before {
                    opacity: 1;
                    animation: glitch-anim-nav 0.2s infinite;
                }
                @keyframes glitch-anim-nav {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 1px); }
                    40% { transform: translate(-2px, -1px); }
                    60% { transform: translate(2px, 1px); }
                    80% { transform: translate(2px, -1px); }
                    100% { transform: translate(0); }
                }
            `}</style>
            
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Brand Logo */}
                <button
                    className="font-black tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/')}
                >
                    <img src="/logo.png" alt="CodePark" className="h-10 w-10 object-contain" />
                    <span style={{
                        color: themeColors.terminalPrimary,
                        fontFamily: 'Space Grotesk',
                        fontSize: '24px'
                    }}>
                        CodePark
                    </span>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <button 
                        onClick={() => navigate('/docs')}
                        className="font-label text-xs uppercase tracking-[0.2em] transition-colors hover:text-primary"
                        style={{
                            color: themeColors.terminalSecondary,
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px'
                        }}
                    >
                        /docs
                    </button>
                    <button 
                        onClick={() => navigate('/faq')}
                        className="font-label text-xs uppercase tracking-[0.2em] transition-colors hover:text-primary"
                        style={{
                            color: themeColors.terminalSecondary,
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px'
                        }}
                    >
                        /faq
                    </button>
                    <button 
                        onClick={() => navigate('/changelog')}
                        className="font-label text-xs uppercase tracking-[0.2em] transition-colors hover:text-primary"
                        style={{
                            color: themeColors.terminalSecondary,
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px'
                        }}
                    >
                        /changelog
                    </button>
                    <button 
                        onClick={() => navigate('/pro')}
                        className="font-label text-xs uppercase tracking-[0.2em] transition-colors hover:text-primary flex items-center gap-1"
                        style={{
                            color: themeColors.terminalPrimary,
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px'
                        }}
                    >
                        <Crown className="w-3 h-3" /> /pro
                    </button>
                </div>

                {/* Right Section - Theme Toggle & CTA */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg transition-all"
                        title={`Switch to ${settings.uiTheme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        <FontAwesomeIcon
                            icon={settings.uiTheme === 'dark' ? faSun : faMoon}
                            className="w-5 h-5 transition-all duration-300"
                            style={{ color: themeColors.terminalSecondary }}
                        />
                    </button>

                    {/* Terminal/Login Menu Button - Desktop */}
                    <div className="relative hidden md:block" ref={terminalMenuRef}>
                        <button
                            onClick={() => {
                                if (!isAuthenticated) {
                                    navigate('/auth')
                                } else {
                                    setTerminalMenuOpen(!terminalMenuOpen)
                                }
                            }}
                            className="p-2 rounded-lg transition-all hover:opacity-80"
                            title={isAuthenticated ? "Terminal menu" : "Login"}
                        >
                            {isAuthenticated ? (
                                <Terminal className="w-5 h-5" style={{ color: themeColors.terminalPrimary }} />
                            ) : (
                                <Power className="w-5 h-5" style={{ color: themeColors.terminalPrimary }} />
                            )}
                        </button>
                        
                        {/* Dropdown Menu - Terminal Style - Only shown when logged in */}
                        {terminalMenuOpen && isAuthenticated && (
                            <div
                                className="absolute right-0 mt-2 w-56 rounded-lg z-50 overflow-hidden"
                                style={{
                                    border: `1px solid ${themeColors.terminalPrimary}`,
                                    boxShadow: `0 0 20px ${themeColors.terminalBorder}, inset 0 0 10px ${themeColors.terminalBorder}`,
                                    background: 'rgba(14, 14, 19, 0.95)',
                                    backdropFilter: 'blur(12px)',
                                    fontFamily: 'JetBrains Mono'
                                }}
                            >
                                {/* Terminal Header */}
                                <div
                                    className="px-4 py-2 flex items-center gap-2 border-b"
                                    style={{
                                        borderColor: themeColors.terminalBorder,
                                        background: `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.08)`
                                    }}
                                >
                                    <span className="text-xs" style={{ color: themeColors.terminalPrimary }}>
                                        terminal
                                    </span>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            navigate('/dashboard')
                                            setTerminalMenuOpen(false)
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm transition-all"
                                        style={{ color: '#00d4ec' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.1)`
                                            e.currentTarget.style.borderLeft = `2px solid ${themeColors.terminalPrimary}`
                                            e.currentTarget.style.paddingLeft = '14px'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent'
                                            e.currentTarget.style.borderLeft = 'none'
                                            e.currentTarget.style.paddingLeft = '16px'
                                        }}
                                    >
                                        &gt; Dashboard
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/profile')
                                            setTerminalMenuOpen(false)
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm transition-all"
                                        style={{ color: themeColors.terminalPrimary }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.1)`
                                            e.currentTarget.style.borderLeft = `2px solid ${themeColors.terminalPrimary}`
                                            e.currentTarget.style.paddingLeft = '14px'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent'
                                            e.currentTarget.style.borderLeft = 'none'
                                            e.currentTarget.style.paddingLeft = '16px'
                                        }}
                                    >
                                        &gt; Profile
                                    </button>
                                    <div
                                        style={{
                                            height: '1px',
                                            background: 'rgba(63, 255, 139, 0.1)',
                                            margin: '4px 0'
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setTerminalMenuOpen(false)
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm transition-all"
                                        style={{ color: '#ff6b6b' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)'
                                            e.currentTarget.style.borderLeft = '2px solid #ff6b6b'
                                            e.currentTarget.style.paddingLeft = '14px'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent'
                                            e.currentTarget.style.borderLeft = 'none'
                                            e.currentTarget.style.paddingLeft = '16px'
                                        }}
                                    >
                                        &gt; Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6" style={{ color: '#f8f5fd' }}>
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-6 space-y-4 pb-6" style={{
                    borderTop: `1px solid ${themeColors.terminalBorder}`,
                    paddingTop: '24px'
                }}>
                    <button 
                        onClick={() => { navigate('/docs'); setMobileMenuOpen(false) }}
                        className="block w-full text-left px-4 py-2 transition-colors"
                        style={{ color: themeColors.terminalSecondary, fontFamily: 'JetBrains Mono' }}
                    >
                        /docs
                    </button>
                    <button 
                        onClick={() => { navigate('/faq'); setMobileMenuOpen(false) }}
                        className="block w-full text-left px-4 py-2 transition-colors"
                        style={{ color: themeColors.terminalSecondary, fontFamily: 'JetBrains Mono' }}
                    >
                        /faq
                    </button>
                    <button 
                        onClick={() => { navigate('/changelog'); setMobileMenuOpen(false) }}
                        className="block w-full text-left px-4 py-2 transition-colors"
                        style={{ color: themeColors.terminalSecondary, fontFamily: 'JetBrains Mono' }}
                    >
                        /changelog
                    </button>
                    <button
                        onClick={() => { navigate('/pro'); setMobileMenuOpen(false) }}
                        className="block w-full text-left px-4 py-2 text-sm uppercase tracking-widest transition-all font-bold flex items-center gap-2"
                        style={{
                            color: themeColors.terminalPrimary,
                            fontFamily: 'JetBrains Mono'
                        }}
                    >
                        <Crown className="w-4 h-4" /> /pro
                    </button>
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={() => setTerminalMenuOpen(!terminalMenuOpen)}
                                className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 mt-4"
                                style={{ color: themeColors.terminalPrimary, fontFamily: 'JetBrains Mono' }}
                            >
                                <Terminal className="w-4 h-4" /> &gt; terminal
                            </button>
                            {terminalMenuOpen && (
                                <div
                                    className="mt-2 rounded-lg overflow-hidden"
                                    style={{
                                        border: `1px solid ${themeColors.terminalPrimary}`,
                                        background: `rgba(${settings.uiTheme === 'dark' ? '14, 14, 19' : '249, 250, 251'}, 0.9)`,
                                        fontFamily: 'JetBrains Mono'
                                    }}
                                >
                                    <div
                                        className="px-4 py-2 flex items-center gap-2 border-b text-xs"
                                        style={{
                                            borderColor: `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.2)`,
                                            background: `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.08)`,
                                            color: themeColors.terminalPrimary
                                        }}
                                    >
                                        terminal
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate('/dashboard')
                                            setMobileMenuOpen(false)
                                            setTerminalMenuOpen(false)
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm transition-colors"
                                        style={{ color: themeColors.terminalPrimary, fontFamily: 'JetBrains Mono' }}
                                    >
                                        &gt; Dashboard
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/profile')
                                            setMobileMenuOpen(false)
                                            setTerminalMenuOpen(false)
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm transition-colors"
                                        style={{ color: '#00d4ec', fontFamily: 'JetBrains Mono' }}
                                    >
                                        &gt; Profile
                                    </button>
                                    <div
                                        style={{
                                            height: '1px',
                                            background: 'rgba(63, 255, 139, 0.1)',
                                            margin: '4px 0'
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setMobileMenuOpen(false)
                                            setTerminalMenuOpen(false)
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm transition-colors"
                                        style={{ color: '#ff6b6b', fontFamily: 'JetBrains Mono' }}
                                    >
                                        &gt; Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <button
                            onClick={() => { navigate('/auth'); setMobileMenuOpen(false) }}
                            className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 mt-4"
                            style={{ color: themeColors.terminalPrimary, fontFamily: 'JetBrains Mono' }}
                        >
                            <Power className="w-4 h-4" /> &gt; login
                        </button>
                    )}
                </div>
            )}
        </nav>
    )
}

export default MarketingNavbar
