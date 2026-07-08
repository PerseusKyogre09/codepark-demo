/**
 * AuthPage.tsx — DEMO VERSION
 * Username-only login. No email, no password, no signup tab.
 * Enter any username → creates or retrieves your local demo account.
 */
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Button, Card, Input, PixelBlast } from '../components/ui'
import { ArrowRight, Loader2, User } from 'lucide-react'

export default function AuthPage() {
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // loginWithUsername is our demo-specific method
    const auth = useAuth()
    const loginWithUsername = (auth as any).loginWithUsername as (u: string) => Promise<void>
    const { isAuthenticated } = auth

    const { themeColors, settings } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (isAuthenticated) {
            const fromLocation = (location.state as any)?.from
            const from = fromLocation
                ? `${fromLocation.pathname || ''}${fromLocation.search || ''}${fromLocation.hash || ''}` || '/dashboard'
                : '/dashboard'
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, navigate, location])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!username.trim() || username.trim().length < 2) return
        setIsLoading(true)
        try {
            await loginWithUsername(username.trim())
        } catch (error) {
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
            style={{ background: themeColors.bg, color: themeColors.text }}
        >
            {/* PixelBlast Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
                <PixelBlast
                    variant="circle"
                    pixelSize={5}
                    color={settings.accentColor}
                    patternScale={3}
                    patternDensity={0.6}
                    liquid={true}
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    enableRipples={true}
                    rippleIntensityScale={1.2}
                    rippleThickness={0.15}
                    rippleSpeed={0.35}
                    speed={0.25}
                    transparent={true}
                    edgeFade={0.4}
                    className="pointer-events-auto"
                />
            </div>

            <div className="relative z-10 w-full max-w-md animate-fadeIn">
                {/* Logo + Title */}
                <div className="text-center mb-8">
                    <div className="relative mx-auto w-12 h-12 mb-4 group">
                        <div
                            className="absolute inset-0 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity"
                            style={{ background: '#7c3aed' }}
                        />
                        <img
                            src="/logo.svg"
                            alt="CodePark Logo"
                            className="relative w-12 h-12 object-contain"
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <h1 className="text-3xl font-bold">Welcome to CodePark</h1>
                    </div>
                    <p style={{ color: themeColors.textSecondary }}>
                        Enter a username to start your demo session
                    </p>
                </div>

                <Card className="p-6 md:p-8 backdrop-blur-xl border-opacity-50 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium ml-1">Username</label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                                    style={{ color: themeColors.textSecondary }}
                                />
                                <Input
                                    type="text"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoFocus
                                    className="w-full pl-9"
                                    minLength={2}
                                    maxLength={32}
                                    pattern="[a-zA-Z0-9_-]+"
                                    title="Username must be alphanumeric, can contain underscores and dashes."
                                />
                            </div>
                            <p className="text-xs ml-1" style={{ color: themeColors.textSecondary }}>
                                No account needed — just pick a name and start building
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            disabled={isLoading || username.trim().length < 2}
                            variant="primary"
                            style={{
                                background: `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}dd)`
                            }}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Enter Demo
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Demo info */}
                    <div
                        className="mt-6 rounded-lg px-4 py-3 text-sm"
                        style={{
                            background: `${settings.accentColor}12`,
                            border: `1px solid ${settings.accentColor}30`,
                            color: themeColors.textSecondary,
                        }}
                    >
                        <p className="font-medium mb-1" style={{ color: themeColors.text }}>
                            🎯 This is an interactive demo
                        </p>
                        <ul className="space-y-0.5 text-xs">
                            <li>✓ All data is saved locally in your browser</li>
                            <li>✓ Full editor, terminal, and AI experience</li>
                            <li>✓ Fake collaborators join automatically</li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    )
}
