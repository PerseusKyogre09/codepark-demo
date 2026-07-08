import { useTheme } from '../contexts/ThemeContext'
import pradeeptoImg from '../assets/team/pradeepto.png'
import varunImg from '../assets/team/varun.png'
import arushImg from '../assets/team/arush.png'
import shresthaImg from '../assets/team/shrestha.png'
import abhinavranaImg from '../assets/team/abhinavrana.png'

function AboutPage() {
  const { themeColors, settings } = useTheme()

  const pillars = [
    {
      title: 'Precision collaboration',
      body: 'Every pixel, cursor, and keystroke is tuned for high-trust teams shipping fast together.',
    },
    {
      title: 'Frictionless flow',
      body: 'No setup rituals or screen-share fatigue. Join a link and get the same clarity as coding locally.',
    },
    {
      title: 'Design-led engineering',
      body: 'We blend product craft with deep infra to keep latency under 50ms without sacrificing aesthetics.',
    },
  ]

  const founders = [
    {
      name: 'Pradeepto',
      role: 'Co-founder / Product',
      img: pradeeptoImg,
      blurb: 'Designs the flows and codes the interface you see here—shipping copy, components, and polish directly in the repo.',
    },
    {
      name: 'Varun',
      role: 'Co-founder / Engineering',
      img: varunImg,
      blurb: 'Builds the realtime core and pairs on frontend code to keep every session under 50ms with clean, reliable DX.',
    },
  ]

  const teamMembers = [
    {
      name: 'Atharva Kumar',
      role: 'Network Security Engineer',
      img: 'https://via.placeholder.com/140x256?text=Atharva+Kumar',
      blurb: 'Secures every layer of CodePark with cutting-edge network architecture and threat prevention.',
    },
    {
      name: 'Arush Anand Singh',
      role: 'Senior SDE',
      img: arushImg,
      blurb: 'Writes bulletproof backend code and optimizes infrastructure to handle realtime scale with zero compromises.',
    },
    {
      name: 'Shrestha Chatterjee',
      role: 'Documentation Lead & UI/UX Designer',
      img: shresthaImg,
      blurb: 'Crafts intuitive user experiences and ensures every feature is thoroughly documented for developer success.',
    },
    {
      name: 'Abhinav Rana',
      role: 'Senior SDE',
      img: abhinavranaImg,
      blurb: 'Drives full-stack improvements and collaborates across teams to ship features that delight users.',
    },
  ]

  return (
    <div style={{
      background: themeColors.terminalBg,
      backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 25%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 26%, transparent 27%, transparent 74%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 75%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 25%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 26%, transparent 27%, transparent 74%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 75%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 76%, transparent 77%, transparent)`,
      backgroundSize: '32px 32px',
      backgroundPosition: '0 0, 0 0',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }} className="pt-32 pb-40">
      <div className="max-w-6xl mx-auto px-4 space-y-20">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <div className="space-y-6">
            <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem' }}>
              $ about
            </p>
            <h1 style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace', fontSize: '2rem', fontWeight: '700' }}>
              <span>&gt;</span> A vision for beautiful, fearless collaboration
            </h1>
            <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.95rem', lineHeight: '1.6' }}>
              CodePark started as a late-night experiment to make pair-programming feel like sitting side-by-side—even when teams are spread across continents. Pradeepto and Varun still design and code the product themselves, powering remote-first squads who want clarity, speed, and a space that looks as good as it performs.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  background: `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.08)`,
                  border: `1px solid ${themeColors.terminalBorder}`,
                  color: themeColors.terminalSecondary,
                  fontFamily: 'Space Mono, monospace'
                }}
              >
                <span style={{ color: themeColors.terminalPrimary, marginRight: '0.5rem' }}>$</span>Built for realtime teams
              </span>
              <span
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  background: `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.08)`,
                  border: `1px solid ${themeColors.terminalBorder}`,
                  color: themeColors.terminalSecondary,
                  fontFamily: 'Space Mono, monospace'
                }}
              >
                <span style={{ color: themeColors.terminalPrimary, marginRight: '0.5rem' }}>$</span>Design-led developer UX
              </span>
            </div>
          </div>

          {/* Promise Card */}
          <div
            style={{
              border: `1px solid ${themeColors.terminalBorder}`,
              background: `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.08)`,
              borderRadius: '4px',
              padding: '2rem',
              transition: 'all 500ms cubic-bezier(0.32, 0.72, 0.36, 1)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = themeColors.terminalBorderHover
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = themeColors.terminalBorder
            }}
          >
            <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              $ promise
            </p>
            <h3 style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <span>&gt;</span> Flow together, no matter the distance.
            </h3>
            <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem', lineHeight: '1.6' }}>
              We obsess over the tiny details—the cursor trails, the latency budgets, the way themes glow—so your team can obsess over solving the real problem in front of you.
            </p>
          </div>
        </section>

        {/* Pillars Section */}
        <section>
          <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem', marginBottom: '1rem' }}>
            $ pillars
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {pillars.map((item) => (
              <div
                key={item.title}
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
                <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: '600' }}>
                  <span style={{ color: themeColors.terminalPrimary, marginRight: '0.5rem' }}>+</span>{item.title}
                </p>
                <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Founders Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                $ team
              </p>
              <h2 style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace', fontSize: '1.875rem', fontWeight: '700' }}>
                <span>&gt;</span> Meet the people behind CodePark
              </h2>
            </div>
            <span style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
              Hand-built by the founders
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {founders.map((founder) => (
              <div
                key={founder.name}
                style={{
                  border: `1px solid ${themeColors.terminalPrimary}`,
                  background: themeColors.terminalBg,
                  borderRadius: '0px',
                  overflow: 'hidden',
                  transition: 'all 500ms cubic-bezier(0.32, 0.72, 0.36, 1)',
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr',
                  fontFamily: 'Space Mono, monospace',
                  boxShadow: `0 0 20px ${themeColors.terminalBorder}, inset 0 0 20px ${themeColors.terminalBorder}`
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = `0 0 30px ${themeColors.terminalBorderHover}, inset 0 0 20px ${themeColors.terminalBorderHover}`;
                  el.style.borderColor = themeColors.terminalPrimary;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = `0 0 20px ${themeColors.terminalBorder}, inset 0 0 20px ${themeColors.terminalBorder}`;
                  el.style.borderColor = themeColors.terminalPrimary;
                }}
              >
                {/* Image on left */}
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRight: `1px solid ${themeColors.terminalPrimary}`, background: '#000' }}>
                  <img src={founder.img} alt={founder.name} className="w-full h-full object-cover" />
                </div>

                {/* Terminal content on right */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  {/* Terminal prompt line */}
                  <div style={{ fontSize: '0.7rem', lineHeight: '1.6', marginBottom: '0.25rem' }}>
                    <span style={{ color: themeColors.terminalPrimary }}>~ </span>
                    <span style={{ color: themeColors.terminalSecondary }}>fastfetch -c btw json</span>
                  </div>

                  {/* System Info - Terminal style */}
                  <div style={{ fontSize: '0.65rem', lineHeight: '1.6', color: themeColors.terminalSecondary }}>
                    <div>
                      <span style={{ color: themeColors.terminalPrimary }}>name</span>
                      <span style={{ marginLeft: '0.75rem' }}>: {founder.name}</span>
                    </div>
                    <div>
                      <span style={{ color: themeColors.terminalPrimary }}>role</span>
                      <span style={{ marginLeft: '0.75rem' }}>: {founder.role}</span>
                    </div>
                    <div>
                      <span style={{ color: themeColors.terminalPrimary }}>status</span>
                      <span style={{ marginLeft: '0.5rem' }}>: Building CodePark</span>
                    </div>
                    <div>
                      <span style={{ color: themeColors.terminalPrimary }}>uptime</span>
                      <span style={{ marginLeft: '0.75rem' }}>: &gt;99.9%</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: `1px solid ${themeColors.terminalBorder}`, margin: '0.5rem 0' }}></div>

                  {/* Description */}
                  <div style={{ flex: 1 }}>
                    <p style={{ color: themeColors.terminalSecondary, fontSize: '0.65rem', lineHeight: '1.4' }}>
                      <span style={{ color: themeColors.terminalPrimary, marginRight: '0.5rem' }}>$</span>{founder.blurb}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                style={{
                  border: `1px solid ${themeColors.terminalPrimary}`,
                  background: themeColors.terminalBg,
                  borderRadius: '0px',
                  overflow: 'hidden',
                  transition: 'all 500ms cubic-bezier(0.32, 0.72, 0.36, 1)',
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr',
                  fontFamily: 'Space Mono, monospace',
                  boxShadow: `0 0 20px ${themeColors.terminalBorder}, inset 0 0 20px ${themeColors.terminalBorder}`
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = `0 0 30px ${themeColors.terminalBorderHover}, inset 0 0 20px ${themeColors.terminalBorderHover}`;
                  el.style.borderColor = themeColors.terminalPrimary;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = `0 0 20px ${themeColors.terminalBorder}, inset 0 0 20px ${themeColors.terminalBorder}`;
                  el.style.borderColor = themeColors.terminalPrimary;
                }}
              >
                {/* Image on left */}
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRight: `1px solid ${themeColors.terminalPrimary}`, background: '#000' }}>
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>

                {/* Terminal content on right */}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  {/* Terminal prompt line */}
                  <div style={{ fontSize: '0.65rem', lineHeight: '1.4' }}>
                    <span style={{ color: themeColors.terminalPrimary }}>~ </span>
                    <span style={{ color: themeColors.terminalSecondary }}>whoami</span>
                  </div>

                  {/* System Info - Terminal style */}
                  <div style={{ fontSize: '0.6rem', lineHeight: '1.5', color: themeColors.terminalSecondary }}>
                    <div>
                      <span style={{ color: themeColors.terminalPrimary }}>name</span>
                      <span style={{ marginLeft: '0.5rem' }}>: {member.name}</span>
                    </div>
                    <div>
                      <span style={{ color: themeColors.terminalPrimary }}>role</span>
                      <span style={{ marginLeft: '0.5rem' }}>: {member.role}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: `1px solid ${themeColors.terminalBorder}`, margin: '0.4rem 0' }}></div>

                  {/* Description */}
                  <div style={{ flex: 1, minHeight: '0' }}>
                    <p style={{ color: themeColors.terminalSecondary, fontSize: '0.6rem', lineHeight: '1.3', overflow: 'hidden' }}>
                      <span style={{ color: themeColors.terminalPrimary, marginRight: '0.3rem' }}>$</span>{member.blurb}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage


