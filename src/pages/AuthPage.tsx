import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Button, Card, Input, PixelBlast } from '../components/ui'
import { ArrowRight, Loader2 } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { login, loginWithEmail, signupWithEmail, sendPasswordReset, isAuthenticated } = useAuth()
    const { themeColors, settings } = useTheme()
    const [showResetModal, setShowResetModal] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [isResetting, setIsResetting] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    // Redirect if already authenticated
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
        setIsLoading(true)
        try {
            if (isLogin) {
                await loginWithEmail(email, password)
            } else {
                await signupWithEmail(email, password, username)
            }
            // Navigation is handled by the useEffect above
        } catch (error) {
            console.error('Auth error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialLogin = async (provider: 'google' | 'github') => {
        try {
            await login(provider)
        } catch (error) {
            console.error('Social auth error:', error)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsResetting(true)
        try {
            await sendPasswordReset(resetEmail)
            setShowResetModal(false)
            setResetEmail('')
        } catch (error) {
            console.error('Reset error:', error)
        } finally {
            setIsResetting(false)
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
                    <div className="relative mx-auto w-12 h-12 mb-4 group">
                        <div
                            className="absolute inset-0 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity"
                            style={{ background: '#7c3aed' }}
                        />
                        <img
                            src="/logo.svg"
                            alt="CodePark Logo"
                            className="relative w-12 h-12 object-contain logo-svg-invert"
                        />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h1>
                    <p style={{ color: themeColors.textSecondary }}>
                        {isLogin
                            ? 'Enter your credentials to access your workspace'
                            : 'Join automatically to start building together'
                        }
                    </p>
                </div>

                <Card className="p-6 md:p-8 backdrop-blur-xl border-opacity-50 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium ml-1">Username</label>
                                <Input
                                    type="text"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full"
                                    minLength={3}
                                    maxLength={20}
                                    pattern="[a-zA-Z0-9_-]+"
                                    title="Username must be alphanumeric, can contain underscores and dashes."
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium ml-1">Email</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-end ml-1">
                                <label className="text-sm font-medium">Password</label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={() => setShowResetModal(true)}
                                        className="text-xs font-medium hover:underline opacity-60 hover:opacity-100 transition-opacity"
                                        style={{ color: settings.accentColor }}
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full"
                                minLength={6}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            disabled={isLoading}
                            variant="primary"
                            style={{
                                background: `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}dd)`
                            }}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    {isLogin ? 'Sign In' : 'Sign Up'}
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t" style={{ borderColor: themeColors.border }}></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="px-2" style={{ background: themeColors.cardBg, color: themeColors.textSecondary }}>
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => handleSocialLogin('github')}
                            className="w-full"
                            icon={<FontAwesomeIcon icon={faGithub} className="w-4 h-4" />}
                        >
                            GitHub
                        </Button>
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="w-full"
                            icon={<FontAwesomeIcon icon={faGoogle} className="w-4 h-4" />}
                        >
                            Google
                        </Button>
                    </div>
                </Card>

                <p className="text-center mt-6 text-sm" style={{ color: themeColors.textSecondary }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-medium hover:underline focus:outline-none"
                        style={{ color: settings.accentColor }}
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>

            {/* Password Reset Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowResetModal(false)}
                    />
                    <Card className="relative z-10 w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-2">Reset Password</h3>
                        <p className="text-sm opacity-60 mb-6">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium opacity-50 uppercase tracking-wider ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowResetModal(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isResetting || !resetEmail}
                                    className="flex-1"
                                    style={{ background: settings.accentColor }}
                                >
                                    {isResetting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Send Link'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    )
}
