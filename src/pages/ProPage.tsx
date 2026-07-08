import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import {
    Check,
    Zap,
    Crown,
    Users,
    Globe,
    Cpu,
    MessageSquare,
    MousePointer2,
    ArrowRight,
    Sparkles,
    Layout,
    Clock,
    Infinity,
    BarChart3,
    Headphones
} from 'lucide-react';

export default function ProPage() {
    const { themeColors, settings } = useTheme();
    const { isAuthenticated } = useAuth();
    const { isPro } = useSubscription();
    const navigate = useNavigate();

    const freeFeatures = [
        { name: 'Unlimited Projects', icon: Infinity },
        { name: 'Standard Execution', icon: Cpu },
        { name: 'Basic AI Usage', icon: Sparkles },
        { name: 'Community Support', icon: MessageSquare },
        { name: 'Up to 10 Collaborators', icon: Users },
        { name: 'Up to 10 Hosted Projects', icon: Globe },
    ];

    const proFeatures = [
        { name: 'Everything in Free', icon: Check, highlight: true },
        { name: 'Faster Execution (Pro Runtimes)', icon: Zap, highlight: true },
        { name: 'Higher AI Usage Limits', icon: Sparkles, highlight: true },
        { name: 'Priority Support (24/7)', icon: Headphones, highlight: true },
        { name: 'Full Editor Customization', icon: Layout, highlight: true },
        { name: 'Higher Memory & CPU Limits', icon: BarChart3, highlight: true },
        { name: 'Instant Container Execution', icon: Zap, highlight: true },
        { name: 'Custom Domain for Projects', icon: Globe, highlight: true },
        { name: 'Higher Uptime Guarantee', icon: Clock, highlight: true },
        { name: 'Custom Cursor & Aesthetics', icon: MousePointer2, highlight: true },
    ];

    return (
        <div
            style={{
                background: themeColors.terminalBg,
                backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 25%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 26%, transparent 27%, transparent 74%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 75%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 25%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 26%, transparent 27%, transparent 74%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 75%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 76%, transparent 77%, transparent)`,
                backgroundSize: '32px 32px',
                backgroundPosition: '0 0, 0 0',
                backgroundAttachment: 'fixed',
                minHeight: '100vh'
            }}
            className="pt-32 pb-40 relative overflow-x-hidden flex flex-col"
        >
            <div className="relative z-10 max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-20">
                    <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem' }}>
                        $ pro
                    </p>
                    <h1 style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace', fontSize: '2.5rem', fontWeight: '700', marginTop: '0.5rem', marginBottom: '1rem' }}>
                        <span>&gt;</span> Unlock Your Full Potential
                    </h1>
                    <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '1rem', maxWidth: '42rem', margin: '0 auto' }}>
                        Elevate your development experience with higher limits, faster performance, and ultimate customization.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20 items-stretch">
                    {/* Free Plan */}
                    <div
                        style={{
                            border: `1px solid ${themeColors.terminalBorder}`,
                            background: 'transparent',
                            borderRadius: '4px',
                            padding: '2rem',
                            transition: 'all 500ms cubic-bezier(0.32, 0.72, 0.36, 1)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        className={`${!isPro && isAuthenticated ? 'border-[rgba(63,255,139,0.5)]' : ''}`}
                    >
                        <div className="mb-8">
                            <h3 style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                Free
                            </h3>
                            <div style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace', fontSize: '2.25rem', fontWeight: '900', marginBottom: '1rem' }}>
                                ₹0<span style={{ color: themeColors.terminalSecondary, fontSize: '0.875rem', fontWeight: '400' }}>/month</span>
                            </div>
                            <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem' }}>
                                Perfect for hobbies and small collaborative experiments.
                            </p>
                        </div>

                        <div className="flex-grow space-y-3 mb-8">
                            {freeFeatures.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span style={{ color: themeColors.terminalSecondary, marginRight: '0.5rem' }}>+</span>
                                    <span style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem' }}>{feature.name}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            style={{
                                width: '100%',
                                borderRadius: '4px',
                                border: `1px solid ${themeColors.terminalBorder}`,
                                padding: '0.75rem',
                                background: 'transparent',
                                color: themeColors.terminalSecondary,
                                fontFamily: 'Space Mono, monospace',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: isAuthenticated && !isPro ? 'pointer' : 'default',
                                transition: 'all 500ms cubic-bezier(0.32, 0.72, 0.36, 1)',
                                opacity: isPro ? 0.5 : 1
                            }}
                            onClick={() => {
                                if (!isAuthenticated) return navigate('/auth')
                                if (!isPro) return navigate('/dashboard')
                            }}
                            disabled={isPro}
                            onMouseEnter={(e) => {
                                if (!isPro) {
                                    (e.target as HTMLElement).style.borderColor = themeColors.terminalBorderHover;
                                    (e.target as HTMLElement).style.color = themeColors.terminalPrimary;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isPro) {
                                    (e.target as HTMLElement).style.borderColor = themeColors.terminalBorder;
                                    (e.target as HTMLElement).style.color = themeColors.terminalSecondary;
                                }
                            }}
                        >
                            {(!isAuthenticated) ? 'Get Started' : (isPro ? 'Included in Pro' : 'Currently Active')}
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div
                        style={{
                            border: `1px solid ${themeColors.terminalBorderHover}`,
                            background: `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.08)`,
                            borderRadius: '4px',
                            padding: '2rem',
                            transition: 'all 500ms cubic-bezier(0.32, 0.72, 0.36, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                            <span style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', fontWeight: '600', border: `1px solid ${themeColors.terminalBorderHover}`, padding: '0.25rem 0.5rem', borderRadius: '2px' }}>
                                BEST VALUE
                            </span>
                        </div>

                        <div className="mb-8 pt-2">
                            <h3 style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                Pro
                            </h3>
                            <div style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace', fontSize: '2.25rem', fontWeight: '900', marginBottom: '1rem' }}>
                                ₹499<span style={{ color: themeColors.terminalSecondary, fontSize: '0.875rem', fontWeight: '400' }}>/month</span>
                            </div>
                            <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem' }}>
                                For serious developers who need power and personalization.
                            </p>
                        </div>

                        <div className="flex-grow space-y-3 mb-8">
                            {proFeatures.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                <span style={{ color: feature.highlight ? themeColors.terminalPrimary : themeColors.terminalSecondary, marginRight: '0.5rem' }}>+</span>
                                <span style={{ color: feature.highlight ? themeColors.terminalPrimary : themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem', fontWeight: feature.highlight ? '600' : '400' }}>
                                        {feature.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            style={{
                                width: '100%',
                                borderRadius: '4px',
                                border: `1px solid ${themeColors.terminalBorderHover}`,
                                padding: '0.75rem',
                                background: isPro ? 'transparent' : `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.15)`,
                                color: isPro ? themeColors.terminalSecondary : themeColors.terminalPrimary,
                                fontFamily: 'Space Mono, monospace',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: isPro ? 'default' : 'pointer',
                                transition: 'all 500ms cubic-bezier(0.32, 0.72, 0.36, 1)',
                                opacity: isPro ? 0.6 : 1
                            }}
                            onClick={() => isPro ? navigate('/dashboard') : navigate('/stripe')}
                            disabled={isPro}
                            onMouseEnter={(e) => {
                                if (!isPro) {
                                    const bgColor = settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129';
                                    (e.currentTarget as HTMLElement).style.background = `rgba(${bgColor}, 0.25)`;
                                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px rgba(${bgColor}, 0.3)`;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isPro) {
                                    const bgColor = settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129';
                                    (e.currentTarget as HTMLElement).style.background = `rgba(${bgColor}, 0.15)`;
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                }
                            }}
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isPro ? (
                                    <>
                                        You're Already Pro! <Crown className="w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        Upgrade Now <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Why go Pro */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            $ why-pro
                        </p>
                        <h2 style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace', fontSize: '1.875rem', fontWeight: '700' }}>
                            <span>&gt;</span> Why go Pro?
                        </h2>
                        <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            Everything you need to ship products faster.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            style={{
                                border: `1px solid ${themeColors.terminalBorder}`,
                                background: 'transparent',
                                borderRadius: '4px',
                                padding: '1.5rem',
                                transition: 'all 500ms cubic-bezier(0.32, 0.72, 0.36, 1)'
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = themeColors.terminalBorderHover
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = themeColors.terminalBorder
                            }}
                        >
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '4px', background: 'rgba(255, 189, 92, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffbd5c', marginBottom: '1rem' }}>
                                <Zap className="w-6 h-6" />
                            </div>
                            <h4 style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontWeight: '700', marginBottom: '0.5rem' }}>
                                <span style={{ color: themeColors.terminalPrimary }}>+</span> Pro Runtimes
                            </h4>
                            <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem' }}>
                                Get exclusive access to high-performance containers with dedicated CPU/RAM and no cold starts.
                            </p>
                        </div>

                        <div
                            style={{
                                border: `1px solid ${themeColors.terminalBorder}`,
                                background: 'transparent',
                                borderRadius: '4px',
                                padding: '1.5rem',
                                transition: 'all 500ms cubic-bezier(0.32, 0.72, 0.36, 1)'
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = themeColors.terminalBorderHover
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = themeColors.terminalBorder
                            }}
                        >
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '4px', background: 'rgba(0, 212, 236, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ec', marginBottom: '1rem' }}>
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h4 style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontWeight: '700', marginBottom: '0.5rem' }}>
                                <span style={{ color: themeColors.terminalPrimary }}>+</span> Unbounded AI
                            </h4>
                            <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem' }}>
                                Use our built-in coding assistant with premium models and significantly higher usage tokens daily.
                            </p>
                        </div>

                        <div
                            style={{
                                border: `1px solid ${themeColors.terminalBorder}`,
                                background: 'transparent',
                                borderRadius: '4px',
                                padding: '1.5rem',
                                transition: 'all 500ms cubic-bezier(0.32, 0.72, 0.36, 1)'
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = themeColors.terminalBorderHover
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = themeColors.terminalBorder
                            }}
                        >
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '4px', background: 'rgba(255, 107, 107, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b', marginBottom: '1rem' }}>
                                <Layout className="w-6 h-6" />
                            </div>
                            <h4 style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontWeight: '700', marginBottom: '0.5rem' }}>
                                <span style={{ color: themeColors.terminalPrimary }}>+</span> Infinite Style
                            </h4>
                            <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem' }}>
                                Customize every pixel of your IDE. Custom accents, fonts, border-radius, and unique cursor colors.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="text-center mt-20" style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', opacity: 0.4 }}>
                    <p>© 2025 CodePark. Pricing shown in INR (₹). Subscription can be cancelled at any time.</p>
                </div>
            </div>
        </div>
    );
}
