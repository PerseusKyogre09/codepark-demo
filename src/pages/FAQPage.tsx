import { useTheme } from '../contexts/ThemeContext'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

function FAQPage() {
  const { themeColors, settings } = useTheme()
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'What languages does CodePark support?',
      a: 'CodePark supports multiple popular languages including Python, JavaScript, C/C++, and more. Language support continues to expand as we improve the platform.',
    },
    {
      q: 'Can I run and debug code inside CodePark?',
      a: 'Yes. You can run and debug code directly in CodePark without installing anything locally. Each run happens in a secure, isolated environment.',
    },
    {
      q: 'Does CodePark support GUI applications?',
      a: 'Yes. CodePark supports certain desktop-style GUI applications (such as Tkinter or Pygame) through a browser-based preview system.',
    },
    {
      q: 'Can I use CodePark solo, without collaborators?',
      a: 'Absolutely. CodePark works just as well for solo development as it does for teams.',
    },
    {
      q: 'How many people can collaborate at once?',
      a: 'Free plans support up to 10 collaborators per project. Pro plans support larger teams and advanced collaboration features.',
    },
    {
      q: 'Can I control who can edit my code?',
      a: 'Yes. Project owners can control access levels, including who can view, edit, or run code.',
    },
    {
      q: 'What happens if someone disconnects during a session?',
      a: 'Your code remains safe. Sessions automatically recover, and collaborators can rejoin without losing progress.',
    },
    {
      q: 'Are my projects saved automatically?',
      a: 'Yes. CodePark automatically saves your work as you code, so you never lose progress.',
    },
    {
      q: 'Can I upload images or PDFs to my project?',
      a: 'Yes. You can upload assets such as images and PDFs and use them inside your projects.',
    },
    {
      q: 'What happens to unsaved or temporary files?',
      a: 'Temporary files are session-based and automatically cleaned up if a project is not saved.',
    },
    {
      q: 'Can I export my project?',
      a: 'Yes. You can download your project files or connect to external version control services when needed.',
    },
    {
      q: 'Do I need to use Git to use CodePark?',
      a: 'No. Git is completely optional. You can use CodePark without ever touching version control.',
    },
    {
      q: 'Can I connect my project to GitHub?',
      a: 'Yes. CodePark allows you to sync projects with GitHub for advanced version control workflows.',
    },
    {
      q: 'What happens if I don\'t use Git?',
      a: 'Nothing changes. Your project still saves, runs, and collaborates normally without Git.',
    },
    {
      q: 'Is my code private?',
      a: 'Yes. Your projects are private by default and only accessible to people you invite.',
    },
    {
      q: 'How is my code executed safely?',
      a: 'All code runs inside isolated environments with strict resource limits to ensure security and stability.',
    },
    {
      q: 'Can CodePark access my private code?',
      a: 'No. Your code is not shared or made public unless you explicitly choose to do so.',
    },
    {
      q: 'Why might my code take a moment to start running?',
      a: 'CodePark prepares a fresh, isolated environment for each run to ensure safety and consistency. Pro plans offer faster startup times.',
    },
    {
      q: 'Are there execution limits?',
      a: 'Yes. Free plans have reasonable limits to ensure fair usage. Pro plans provide higher limits for intensive workflows.',
    },
    {
      q: 'What\'s included in the free plan?',
      a: 'The free plan includes unlimited projects, real-time collaboration, standard execution, and basic AI features.',
    },
    {
      q: 'What do I get with Pro?',
      a: 'Pro plans unlock faster execution, advanced debugging tools, higher AI usage, extended collaboration, and customization options.',
    },
    {
      q: 'Can I upgrade or downgrade anytime?',
      a: 'Yes. You can change your plan at any time, and upgrades take effect immediately.',
    },
    {
      q: 'How does AI assistance work?',
      a: 'AI helps explain code, diagnose errors, and improve productivity directly inside the editor.',
    },
    {
      q: 'Is my code used to train AI models?',
      a: 'No. Your code is not used to train models without your explicit permission.',
    },
    {
      q: 'Does CodePark work on mobile devices?',
      a: 'CodePark works best on desktop browsers. Limited functionality may be available on tablets.',
    },
    {
      q: 'Which browsers are supported?',
      a: 'CodePark supports all modern browsers including Chrome, Edge, Firefox, and Safari.',
    },
    {
      q: 'Is CodePark suitable for beginners?',
      a: 'Yes. CodePark is designed to be approachable for beginners while remaining powerful for advanced users.',
    },
    {
      q: 'How can I get help if I\'m stuck?',
      a: 'Free users can access community support, while Pro users receive priority assistance.',
    },
    {
      q: 'Is CodePark production-ready?',
      a: 'CodePark is actively developed and continuously improved. While perfect for learning, collaboration, and prototyping, production hosting features continue to evolve.',
    },
  ]

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: themeColors.terminalBg,
        backgroundImage: 
          `linear-gradient(rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-32 pb-40">
        <header className="mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', letterSpacing: '0.15em' }}>
            $ support
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace', fontSize: '3rem', fontWeight: 700 }}>
            <span style={{ color: themeColors.terminalSecondary }}>&gt;</span> Frequently Asked Questions
          </h1>
          <p className="text-base md:text-lg max-w-3xl leading-relaxed" style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '13px' }}>
            Everything you need to know about using CodePark with your team. Can't find an answer? Reach out and we'll help you set things up.
          </p>
        </header>

        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = activeIndex === index
            return (
              <div
                key={item.q}
                className={`rounded border transition-all duration-500 ease-out overflow-hidden`}
                style={{
                  background: isOpen ? `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.08)` : `rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.02)`,
                  borderColor: isOpen ? themeColors.terminalBorderHover : themeColors.terminalBorder,
                  boxShadow: isOpen ? `0 0 20px rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.1)` : 'none'
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev === index ? null : index))}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-all duration-300 focus-visible:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                >
                  <span
                    className="text-base md:text-lg tracking-tight transition-colors duration-300 flex-1"
                    style={{ 
                      color: isOpen ? themeColors.terminalPrimary : themeColors.terminalSecondary,
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  >
                    <span style={{ color: themeColors.terminalSecondary, marginRight: '0.5rem' }}>+</span>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-500 ease-out`}
                    style={{ color: isOpen ? themeColors.terminalPrimary : themeColors.terminalSecondary, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
                <div
                  id={`faq-panel-${index}`}
                  className="transition-all duration-500 ease-out overflow-hidden"
                  style={{
                    maxHeight: isOpen ? '500px' : '0px',
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <div
                    className="px-6 pb-5 pt-2 border-t text-sm leading-relaxed md:text-base"
                    style={{ 
                      color: themeColors.terminalSecondary, 
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '13px',
                      borderColor: themeColors.terminalBorder,
                      lineHeight: '1.7'
                    }}
                  >
                    $ {item.a}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FAQPage


