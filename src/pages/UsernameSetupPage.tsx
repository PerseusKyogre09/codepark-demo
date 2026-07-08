import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Button, Card, Input, PixelBlast } from '../components/ui'
import { ArrowRight, Loader2, User } from 'lucide-react'

export default function UsernameSetupPage() {
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { user, updateUsername, isAuthenticated } = useAuth()
    const { themeColors, settings } = useTheme()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth')
            return
        }
        // If user already has a username, no need to be here
        if (user?.username || user?.handle) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, user, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!username.trim()) return

        setIsLoading(true)
        try {
            await updateUsername(username)
            navigate('/dashboard')
        } catch (error) {
            console.error('Username update error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
            style={{
                background: themeColors.bg,
                color: themeColors.text
            }}
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
                <div className="text-center mb-8">
                    <div
                        className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}cc)` }}
                    >
                        <User className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Choose a Username
                    </h1>
                    <p style={{ color: themeColors.textSecondary }}>
                        Complete your profile to continue
                    </p>
                </div>

                <Card className="p-6 md:p-8 backdrop-blur-xl border-opacity-50 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium ml-1">Username</label>
                            <Input
                                type="text"
                                placeholder="Choose a unique username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full"
                                minLength={3}
                                maxLength={20}
                                pattern="[a-zA-Z0-9_-]+"
                                title="Username must be alphanumeric, can contain underscores and dashes."
                                autoFocus
                            />
                            <p className="text-xs ml-1 opacity-70">
                                You can change this later in your profile settings.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            disabled={isLoading || !username.trim()}
                            variant="primary"
                            style={{
                                background: `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}dd)`
                            }}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Get Started
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}
