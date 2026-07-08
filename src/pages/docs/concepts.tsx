import { useTheme } from '../../contexts/ThemeContext'
import { FolderOpen, Users, Play, Database, Zap, Shield, Layers, CheckCircle, Settings, Terminal } from 'lucide-react'

type Props = {
  onNavigate?: (id: string) => void
}

export default function Concepts({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>Core Concepts</h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Master the fundamental building blocks that make CodePark work. Understanding these three core concepts will transform how you think about collaborative development.
        </p>
      </div>

      {/* Overview Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>The Three Pillars of CodePark</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              CodePark's architecture is built around three fundamental concepts that work together to create a seamless collaborative development experience. Each concept has a clear, single responsibility that ensures the platform remains predictable, secure, and scalable.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              When you understand how Workspaces, Sessions, and Runtimes interact, every aspect of CodePark becomes intuitive. These concepts provide the foundation for everything from simple pair programming to complex team workflows spanning weeks or months.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              This separation of concerns is what makes CodePark different from traditional development environments - it allows collaboration and execution to scale independently while maintaining strong security boundaries.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/600x300/6366F1/FFFFFF?text=CodePark+Architecture"
              alt="CodePark's three core concepts architecture"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen style={{ color: themeColors.primary || '#2563EB' }} />
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Workspaces</h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Your persistent project environment containing files, configuration, and settings.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users style={{ color: themeColors.success || '#10B981' }} />
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Sessions</h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Live collaborative editing instances where multiple developers work together in real-time.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play style={{ color: themeColors.accent || '#8B5CF6' }} />
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Runtimes</h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Isolated execution environments where your code runs safely and consistently.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
            <CheckCircle className="w-5 h-5" style={{ color: themeColors.success || '#10B981' }} />
            Why This Architecture Matters
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Clean Separation</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Each concept has a single, well-defined responsibility, making the system predictable and maintainable.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Strong Isolation</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Projects, collaboration, and execution are completely isolated from each other for security and reliability.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Independent Scaling</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                You can have many collaborators on a project without affecting execution performance, and vice versa.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Predictable Behavior</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Understanding these concepts means you always know what will happen when you perform an action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workspaces Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Workspaces: Your Persistent Project Environment</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              A workspace is the fundamental unit of work in CodePark. It represents a complete project environment that persists across sessions and contains everything needed to develop, test, and deploy your application.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Think of a workspace as a sophisticated project folder that lives in the cloud. It includes your source code, configuration files, environment settings, and project metadata. Unlike traditional cloud IDEs, workspaces in CodePark are designed to feel completely familiar to developers who work with local project directories.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              The key insight is that workspaces persist independently of who is using them or when. You can close a session, restart your browser, or take a week-long break - your workspace remains exactly as you left it, ready for you or your collaborators to pick up where you left off.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/600x350/3B82F6/FFFFFF?text=Workspace+Structure"
              alt="CodePark workspace containing project files and configuration"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Database className="w-5 h-5" style={{ color: themeColors.primary || '#2563EB' }} />
              What Lives in a Workspace
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Source Code & Files</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Your complete project structure including source files, documentation, and assets.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Configuration Files</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Language-specific configs, build scripts, and project settings.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Environment Variables</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Project-specific environment configuration and secrets.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Version Control Metadata</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Git history, branches, and repository information (when applicable).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Shield className="w-5 h-5" style={{ color: themeColors.error || '#EF4444' }} />
              Workspace Isolation & Security
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Complete File Isolation</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Files from one workspace are completely inaccessible to other workspaces.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Scoped Execution</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Code execution is contained within the workspace's runtime environment.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Private Environment Variables</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Environment configuration is workspace-specific and secure.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Safe Collaboration</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Multiple users can work together without risking other projects.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.text }}>Workspace Lifecycle</h3>
          <p style={{ color: themeColors.textSecondary }}>
            Workspaces follow a predictable lifecycle that supports the full development workflow. They can be created from templates for common project types, imported from existing Git repositories, or started completely from scratch. Once created, workspaces persist until explicitly deleted, maintaining your work across sessions, collaborators, and time.
          </p>
        </div>
      </section>

      {/* Sessions Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Sessions: Real-Time Collaborative Editing</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              A session represents an active collaborative editing instance within a workspace. When you open a workspace, you're joining or creating a session where your actions are synchronized with other collaborators in real-time.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Sessions are ephemeral - they exist only while people are actively working. However, the workspace itself persists, so you can always return to your project later. This separation allows CodePark to be efficient with resources while maintaining the persistence you need for long-term development.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              The collaborative experience is seamless: every keystroke, cursor movement, and file change is instantly visible to all participants. Multiple cursors show exactly where each person is working, and presence indicators let you know who's active in the session.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/600x350/10B981/FFFFFF?text=Collaborative+Session"
              alt="Multiple developers collaborating in a CodePark session"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
            <Zap className="w-5 h-5" style={{ color: themeColors.success || '#10B981' }} />
            Live Collaboration Features
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Instant Synchronization</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Every edit, from single characters to large file operations, propagates to all collaborators immediately.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Multiple Cursors</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                See exactly where each collaborator is working with color-coded cursors and selections.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Presence Indicators</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Know who's active in the session and what they're currently working on.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Conflict-Free Editing</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Advanced algorithms prevent edit conflicts and ensure everyone sees the same content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Runtimes Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Runtimes: Safe and Consistent Code Execution</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              Runtimes are the isolated execution environments where your code actually runs. Each time you execute code in CodePark, it happens within a fresh, clean runtime environment that ensures consistent, secure, and predictable results.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Unlike traditional development where "it works on my machine" is a common problem, CodePark's runtimes guarantee that your code will execute identically every time. This eliminates environment-related bugs and makes collaboration reliable.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Runtimes can use different technologies - containers, WebAssembly, or other sandboxing approaches - depending on your project type and requirements. The key is that they're completely isolated from each other and from the collaboration layer.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/600x350/8B5CF6/FFFFFF?text=Isolated+Runtime"
              alt="Code executing in an isolated runtime environment"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Terminal className="w-5 h-5" style={{ color: themeColors.accent || '#8B5CF6' }} />
              Runtime Characteristics
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Clean State</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Every execution starts with a fresh environment, eliminating state-related bugs.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Complete Isolation</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Runtimes are completely separated from each other and the collaboration layer.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Predictable Results</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  The same code will always produce the same output in the same runtime.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Resource Limits</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  CPU, memory, and network access are strictly controlled for fairness and security.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Settings className="w-5 h-5" style={{ color: themeColors.warning || '#F59E0B' }} />
              Runtime Technologies
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Container Runtimes</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Full Linux containers for complex applications with system dependencies.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>WebAssembly</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Fast, secure execution for compiled languages and performance-critical code.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Language-Specific</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Optimized environments for Python, JavaScript, Java, C/C++, and other languages.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Custom Configurations</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Tailored runtimes for specific project requirements and frameworks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How They Work Together */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>How the Three Concepts Work Together</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              Understanding how workspaces, sessions, and runtimes interact is the key to mastering CodePark. Each concept has a clear role, and they work together in a predictable sequence that supports the entire development workflow.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              The beauty of this architecture is that each layer can scale independently. You can have dozens of collaborators working in a session without affecting runtime performance, and you can run code repeatedly without disrupting the collaborative experience.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/500x300/F59E0B/FFFFFF?text=Concept+Interaction"
              alt="How workspaces, sessions, and runtimes interact"
              className="w-full max-w-sm h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-purple-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
            <Layers className="w-5 h-5" style={{ color: themeColors.primary || '#2563EB' }} />
            The Complete Development Flow
          </h3>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-blue-800 dark:text-blue-200">1</span>
              </div>
              <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Create Workspace</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>Set up your persistent project environment</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-green-800 dark:text-green-200">2</span>
              </div>
              <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Start Session</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>Open collaborative editing environment</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-purple-800 dark:text-purple-200">3</span>
              </div>
              <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Execute Code</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>Run code in isolated runtime environment</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-orange-800 dark:text-orange-200">4</span>
              </div>
              <h4 className="font-medium mb-1" style={{ color: themeColors.text }}>Share Results</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>Output streams back to all collaborators</p>
            </div>
          </div>

          <p style={{ color: themeColors.textSecondary }}>
            This layered approach ensures that collaboration, persistence, and execution remain completely independent. You can restart sessions without losing work, rerun code without affecting collaboration, and scale each aspect according to your needs.
          </p>
        </div>
      </section>

      {/* Why This Design Matters */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Why This Architecture Matters</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.text }}>Scalability Benefits</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Collaboration scales independently of execution performance
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Projects persist without requiring long-running processes
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Multiple execution strategies supported simultaneously
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.text }}>Security & Reliability</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.error || '#EF4444' }} />
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Strong security boundaries between projects and users
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.error || '#EF4444' }} />
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Isolated execution prevents interference between projects
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.error || '#EF4444' }} />
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Predictable behavior eliminates environment-related surprises
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.text }}>Predictable Behavior</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Session Independence</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Restarting a session never destroys your workspace or work
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Clean Execution</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Every code run starts from a clean, predictable state
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Consistent Results</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                All collaborators always see identical code execution results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Mastering CodePark: The Complete Picture</h2>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
          <p className="text-lg mb-6" style={{ color: themeColors.textSecondary }}>
            Once you understand these three core concepts, CodePark becomes completely intuitive. Every feature and behavior follows logically from this foundation.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <FolderOpen style={{ color: themeColors.primary || '#2563EB' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Workspaces</h3>
              <p style={{ color: themeColors.textSecondary }}>
                Store your project files, configuration, and environment persistently in the cloud.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users style={{ color: themeColors.success || '#10B981' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Sessions</h3>
              <p style={{ color: themeColors.textSecondary }}>
                Enable real-time collaborative editing where multiple developers work together seamlessly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Play style={{ color: themeColors.accent || '#8B5CF6' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Runtimes</h3>
              <p style={{ color: themeColors.textSecondary }}>
                Execute your code in isolated, consistent environments that guarantee predictable results.
              </p>
            </div>
          </div>

          <p className="mt-6" style={{ color: themeColors.textSecondary }}>
            This separation of concerns is what makes CodePark powerful yet simple. Each concept has a single responsibility, and they work together to create a development experience that's both collaborative and reliable. Once you understand these building blocks, you'll be able to leverage CodePark's full potential for any development scenario.
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              onClick={() => onNavigate?.('debugging')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Terminal className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.warning || '#F59E0B' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Debugging</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Debug your code effectively</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
