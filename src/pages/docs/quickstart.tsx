import { useTheme } from '../../contexts/ThemeContext'
import { UserPlus, FolderOpen, Users, Play, CheckCircle, Settings, Code, Terminal, Share2, Zap } from 'lucide-react'

type Props = {
  onNavigate?: (id: string) => void
}

export default function QuickStart({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>Quick Start Guide</h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Get started with CodePark in minutes, not hours. This comprehensive guide walks you through every step of setting up your first collaborative coding session.
        </p>
      </div>

      {/* Overview Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Getting Started: Zero to CodePark in 5 Minutes</h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              CodePark eliminates the traditional barriers to collaborative coding. Instead of spending hours configuring development environments, installing dependencies, and troubleshooting setup issues, you can be coding together in a fully-featured IDE within minutes.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              This guide covers everything from account creation to running your first collaborative session. Whether you're a solo developer exploring CodePark or a team lead setting up your first shared workspace, you'll have everything you need to get productive immediately.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              The entire process requires nothing more than a modern web browser and an internet connection. No downloads, no installations, no configuration headaches.
            </p>
          </div>
          <div className="flex justify-start">
            <img
              src="https://placehold.co/600x300/10B981/FFFFFF?text=Getting+Started+with+CodePark"
              alt="Getting started with CodePark overview"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
            <CheckCircle className="w-5 h-5" style={{ color: themeColors.success || '#10B981' }} />
            What You'll Accomplish
          </h3>
          <p style={{ color: themeColors.textSecondary }}>
            By the end of this guide, you'll have created a fully functional CodePark workspace where you and your team can write, run, and debug code together in real-time. You'll understand how to invite collaborators, manage permissions, and leverage CodePark's powerful execution environment.
          </p>
        </div>
      </section>

      {/* Prerequisites Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Prerequisites: What You Need to Get Started</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              CodePark is designed to be as accessible as possible, requiring minimal setup from users. The platform handles all the heavy lifting of environment configuration, dependency management, and infrastructure provisioning.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Your role is simply to bring your code and your creativity. Everything else - from compilers and interpreters to package managers and build tools - is provided automatically by CodePark's cloud infrastructure.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
                <Settings className="w-4 h-4" style={{ color: themeColors.primary || '#2563EB' }} />
                Browser Requirements
              </h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Any modern browser with WebSocket support: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
                <Zap className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
                Internet Connection
              </h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                A stable broadband connection for real-time collaboration and code execution.
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
                <Code className="w-4 h-4" style={{ color: themeColors.accent || '#8B5CF6' }} />
                GitHub Account (Optional)
              </h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Recommended for importing existing projects and streamlined authentication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 1: Account Creation */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Step 1: Creating Your CodePark Account</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              Your CodePark account serves as your identity across all collaborative sessions. It enables secure authentication, persistent project storage, and seamless collaboration with team members.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              The account creation process is streamlined to get you coding as quickly as possible, with multiple authentication options to suit different preferences and security requirements.
            </p>
          </div>
          <div className="flex justify-start">
            <img
              src="https://placehold.co/500x300/3B82F6/FFFFFF?text=Account+Creation+Form"
              alt="CodePark account creation interface"
              className="w-full max-w-sm h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <UserPlus className="w-5 h-5" style={{ color: themeColors.primary || '#2563EB' }} />
              Authentication Options
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>GitHub OAuth (Recommended)</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Sign up instantly using your GitHub account. Perfect for developers who already use GitHub for version control.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Email & Password</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Traditional signup with email verification. Ideal for teams preferring dedicated CodePark accounts.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Settings className="w-5 h-5" style={{ color: themeColors.success || '#10B981' }} />
              Profile Setup
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Display Name</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Choose how you'll appear to collaborators in shared sessions.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Avatar (Optional)</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Upload a profile picture or use your GitHub avatar for easy recognition.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Theme Preferences</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Set your preferred color scheme and editor appearance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Creating a Project */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Step 2: Setting Up Your First Project</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              Projects in CodePark are complete development workspaces that include your code files, execution environment, and collaboration settings. Each project is isolated and self-contained, ensuring that work on one project never interferes with another.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              CodePark offers multiple ways to start a project, from templates designed for specific languages and frameworks to importing existing repositories. This flexibility means you can begin coding immediately, regardless of your project's complexity or requirements.
            </p>
          </div>
          <div className="flex justify-start">
            <img
              src="https://placehold.co/600x400/8B5CF6/FFFFFF?text=New+Project+Creation"
              alt="CodePark new project creation interface"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <FolderOpen className="w-4 h-4" style={{ color: themeColors.primary || '#2563EB' }} />
              Template Projects
            </h4>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Start with pre-configured setups for Python, JavaScript, C/C++, Java, and more. Includes sample code and proper project structure.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Code className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
              Import from Git
            </h4>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Clone any public GitHub repository directly into CodePark. Perfect for working with existing projects or learning from open source.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Terminal className="w-4 h-4" style={{ color: themeColors.accent || '#8B5CF6' }} />
              Empty Project
            </h4>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Start with a blank workspace and build exactly what you need. Full control over languages, frameworks, and project structure.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.text }}>What Happens Behind the Scenes</h3>
          <p style={{ color: themeColors.textSecondary }}>
            When you create a project, CodePark automatically provisions a complete development environment. This includes setting up the appropriate runtime, installing language-specific tools, configuring the file system, and preparing the collaborative session infrastructure. You get instant access to a fully functional workspace without any manual configuration.
          </p>
        </div>
      </section>

      {/* Step 3: Inviting Collaborators */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Step 3: Inviting Team Members to Collaborate</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              CodePark's real-time collaboration features transform how teams work together. Instead of emailing code snippets or struggling with screen sharing, team members can work on the same codebase simultaneously, seeing each other's changes as they happen.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              The invitation process is deliberately simple - share a link and collaborators can join immediately. No complex permission systems or setup required for basic collaborative coding sessions.
            </p>
          </div>
          <div className="flex justify-start">
            <img
              src="https://placehold.co/600x350/F59E0B/FFFFFF?text=Collaboration+Invite"
              alt="CodePark collaboration invitation interface"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Share2 className="w-5 h-5" style={{ color: themeColors.warning || '#F59E0B' }} />
              How to Invite Collaborators
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-orange-800 dark:text-orange-200">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Open Your Project</h4>
                  <p className="text-sm" style={{ color: themeColors.textSecondary }}>Navigate to your project workspace in CodePark.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-orange-800 dark:text-orange-200">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Copy Invite Link</h4>
                  <p className="text-sm" style={{ color: themeColors.textSecondary }}>Use the share button to get the session URL.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-orange-800 dark:text-orange-200">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Share with Team</h4>
                  <p className="text-sm" style={{ color: themeColors.textSecondary }}>Send the link via email, chat, or any messaging platform.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Users className="w-5 h-5" style={{ color: themeColors.primary || '#2563EB' }} />
              Real-Time Collaboration Features
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Live Editing</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>See changes from all collaborators instantly as they're typed.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Multiple Cursors</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>Each person's cursor is visible with their name and color.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Shared Execution</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>Everyone sees the same code output and debugging results.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Voice & Video (Optional)</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>Integrated communication tools for remote teams.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Writing and Running Code */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Step 4: Writing and Executing Your Code</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              CodePark provides a complete development environment that feels familiar to developers while adding powerful collaborative features. The editor supports syntax highlighting, intelligent code completion, and debugging tools for multiple programming languages.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Code execution happens in isolated cloud environments, ensuring that your code runs consistently regardless of your local machine. This eliminates "works on my machine" problems and makes collaboration seamless.
            </p>
          </div>
          <div className="flex justify-start">
            <img
              src="https://placehold.co/600x350/10B981/FFFFFF?text=Code+Editor+Interface"
              alt="CodePark code editor with execution panel"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Code className="w-5 h-5" style={{ color: themeColors.success || '#10B981' }} />
              Working with Files
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>File Explorer</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>Navigate your project structure with the built-in file tree.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Auto-Save</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>Changes are saved automatically - no manual save required.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Multiple Files</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>Open and edit multiple files simultaneously with tabs.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Syntax Highlighting</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>Full syntax highlighting for 50+ programming languages.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Play className="w-5 h-5" style={{ color: themeColors.primary || '#2563EB' }} />
              Running Your Code
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-200">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Select Your File</h4>
                  <p className="text-sm" style={{ color: themeColors.textSecondary }}>Choose the file you want to execute from the file tree.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-200">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Click Run or Use Shortcut</h4>
                  <p className="text-sm" style={{ color: themeColors.textSecondary }}>Execute with the run button or keyboard shortcuts (Ctrl+Enter).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-200">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>View Live Output</h4>
                  <p className="text-sm" style={{ color: themeColors.textSecondary }}>Watch execution results stream in real-time to all collaborators.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
            <Terminal className="w-5 h-5" style={{ color: themeColors.accent || '#8B5CF6' }} />
            Isolated Execution Environment
          </h3>
          <p style={{ color: themeColors.textSecondary }}>
            Each code execution runs in a fresh, isolated container with its own filesystem and memory space. This ensures that runs are consistent, secure, and don't interfere with each other. Your code gets a clean environment every time, eliminating state-related bugs and making debugging predictable.
          </p>
        </div>
      </section>

      {/* Next Steps */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Congratulations! What's Next?</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              You've now completed the essential CodePark workflow: account creation, project setup, team collaboration, and code execution. This foundation gives you everything needed for productive collaborative development sessions.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              CodePark scales seamlessly from these basics to advanced features like debugging, version control integration, deployment, and team management. Explore the documentation links below to discover how to leverage CodePark's full potential for your development workflow.
            </p>
          </div>
          <div className="flex justify-start">
            <img
              src="https://placehold.co/500x300/6366F1/FFFFFF?text=Ready+to+Explore"
              alt="CodePark ready for advanced features"
              className="w-full max-w-sm h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Troubleshooting Common Issues</h2>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
            <Settings className="w-5 h-5" style={{ color: themeColors.warning || '#F59E0B' }} />
            Quick Fixes for Common Problems
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Connection Issues</h4>
              <p className="text-sm mb-2" style={{ color: themeColors.textSecondary }}>If collaboration features aren't working:</p>
              <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
                <li>• Refresh the page to reconnect the session</li>
                <li>• Check your internet connection stability</li>
                <li>• Ensure your browser supports WebSockets</li>
                <li>• Try a different browser if issues persist</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Code Execution Problems</h4>
              <p className="text-sm mb-2" style={{ color: themeColors.textSecondary }}>If your code won't run:</p>
              <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
                <li>• Check the execution output panel for error messages</li>
                <li>• Verify your code syntax and dependencies</li>
                <li>• Ensure you're using a supported language/runtime</li>
                <li>• Try running a simple "Hello World" example first</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-left">
          <p style={{ color: themeColors.textSecondary }}>
            For additional help, visit our FAQ section or reach out to the CodePark community support channels.
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Summary: Your CodePark Foundation</h2>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg">
          <p className="text-lg mb-4" style={{ color: themeColors.textSecondary }}>
            The CodePark Quick Start is intentionally streamlined to get you productive as quickly as possible:
          </p>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <UserPlus className="w-6 h-6" style={{ color: themeColors.primary || '#2563EB' }} />
              </div>
              <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Sign Up</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>Create your account in seconds</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <FolderOpen className="w-6 h-6" style={{ color: themeColors.success || '#10B981' }} />
              </div>
              <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Create Project</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>Set up your workspace instantly</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6" style={{ color: themeColors.accent || '#8B5CF6' }} />
              </div>
              <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Invite Team</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>Share the collaboration link</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Play className="w-6 h-6" style={{ color: themeColors.warning || '#F59E0B' }} />
              </div>
              <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Start Coding</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>Execute code together in real-time</p>
            </div>
          </div>

          <p style={{ color: themeColors.textSecondary }}>
            From this solid foundation, CodePark scales effortlessly with your needs — from quick prototyping sessions to complex collaborative development projects spanning weeks or months. The same simple principles that got you started will carry you through advanced use cases and team workflows.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Next Steps</h2>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
            Continue exploring CodePark's features to enhance your development workflow.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate?.('projects-workspaces')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <FolderOpen className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Projects & Workspaces</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Workspace management</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('running-code')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.success || '#10B981' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Running Code</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Execute your programs</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('debugging')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Terminal className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.accent || '#8B5CF6' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Debugging</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Debug your code effectively</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('roles-permissions')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Users className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.accent || '#8B5CF6' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Collaboration & Roles</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Team management</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('without-git')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Code className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.error || '#EF4444' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Using without Git</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Non-Git workflows</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
