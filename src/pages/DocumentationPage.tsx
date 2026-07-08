import { BookOpen, Rocket, ShieldCheck, TerminalSquare, Users, Wand2 } from 'lucide-react'
import { Card, MarketingLayout } from '../components/ui'
import { useTheme } from '../contexts/ThemeContext'

function DocumentationPage() {
  const { themeColors, settings } = useTheme()
  const cardStyle = { background: themeColors.cardBg, borderColor: themeColors.border }

  const quickStarts = [
    { title: 'Create an account', detail: 'Sign in, pick a team space, and set your accent color.', icon: Rocket },
    { title: 'Open your first workspace', detail: 'Spin up a project with sane defaults and telemetry off by default.', icon: TerminalSquare },
    { title: 'Invite collaborators', detail: 'Share a link with roles and editing permissions baked in.', icon: Users },
  ]

  const guides = [
    {
      title: 'Collaboration',
      points: ['Multiple cursors & selections', 'Driving & following modes', 'Chat, comments, and callouts', 'Session roles & permissions'],
    },
    {
      title: 'Workspace',
      points: ['Managing files, tabs, and panes', 'Terminal & logs', 'Running code in live sessions', 'Keyboard-first navigation'],
    },
    {
      title: 'Personalization',
      points: ['Themes, accents, and fonts', 'Layout profiles', 'Focus and presentation modes', 'Accessibility toggles'],
    },
  ]

  const assurance = [
    { title: 'Enterprise-grade security', copy: 'Encrypted WebSockets, scoped tokens, and role-aware invites keep sessions safe.', icon: ShieldCheck },
    { title: 'Design-first documentation', copy: 'Concise, scannable sections with code-first examples where they matter.', icon: BookOpen },
    { title: 'Low-latency by default', copy: 'We engineer every guide to respect the 50ms budget we hold ourselves to.', icon: Wand2 },
  ]

  return (
    <MarketingLayout maxWidth="max-w-6xl" showDarkVeil={true}>
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: themeColors.textSecondary }}>
            Documentation
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: themeColors.text }}>
              CodePark documentation
            </h1>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ border: `1px solid ${themeColors.border}`, color: themeColors.textSecondary }}
            >
              Version 1.0
            </span>
          </div>
          <p className="text-base md:text-lg max-w-3xl" style={{ color: themeColors.textSecondary }}>
            Get familiar with CodePark and learn how to code faster with realtime collaboration, crafted for teams who value both clarity and aesthetics.
          </p>
        </div>

        <Card
          variant="bordered"
          className="p-6 md:p-8 rounded-3xl grid md:grid-cols-3 gap-4"
          style={cardStyle}
        >
          {quickStarts.map((item) => (
            <div key={item.title} className="flex gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: `${settings.accentColor}1f`,
                  border: `1px solid ${themeColors.border}`,
                  color: settings.accentColor,
                }}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold" style={{ color: themeColors.text }}>
                  {item.title}
                </p>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </Card>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Card key={guide.title} variant="bordered" className="p-6 rounded-2xl space-y-3" style={cardStyle}>
            <p className="text-sm font-semibold" style={{ color: themeColors.text }}>
              {guide.title}
            </p>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              {guide.points.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span style={{ color: settings.accentColor }}>●</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {assurance.map((item) => (
          <Card key={item.title} variant="bordered" className="p-5 rounded-2xl flex gap-3" style={cardStyle}>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${settings.accentColor}1f`, color: settings.accentColor, border: `1px solid ${themeColors.border}` }}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold" style={{ color: themeColors.text }}>
                {item.title}
              </p>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                {item.copy}
              </p>
            </div>
          </Card>
        ))}
      </section>

      <Card variant="bordered" className="p-6 md:p-8 rounded-3xl" style={cardStyle}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: themeColors.textSecondary }}>
              Need more?
            </p>
            <h3 className="text-xl md:text-2xl font-semibold" style={{ color: themeColors.text }}>
              Looking for deeper integration guides?
            </h3>
            <p className="text-sm md:text-base" style={{ color: themeColors.textSecondary }}>
              Tell us what you are building and we will share tailored examples, SDK references, and best practices for your stack.
            </p>
          </div>
          <button
            className="px-5 py-3 rounded-lg text-sm font-semibold"
            style={{ background: `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}cc)`, color: '#0a0a0f' }}
          >
            Talk to us
          </button>
        </div>
      </Card>
    </MarketingLayout>
  )
}

export default DocumentationPage


