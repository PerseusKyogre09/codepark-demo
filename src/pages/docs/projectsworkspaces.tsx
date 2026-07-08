import { useTheme } from '../../contexts/ThemeContext'
import { FolderOpen, Database, Users, Settings, GitBranch, Zap, Shield, CheckCircle, Plus, Download, Code, Globe, FileText, Play, Bug } from 'lucide-react'

type Props = {
  onNavigate?: (id: string) => void
}

export default function ProjectsWorkspaces({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>Projects & Workspaces</h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Master the fundamental building blocks of CodePark's project organization system. Learn how projects and workspaces work together to create seamless, collaborative development environments that scale from personal experiments to team workflows.
        </p>
      </div>

      {/* Overview Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>The Foundation of CodePark</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              CodePark's project system is designed around two complementary concepts that work together to provide a seamless development experience. Understanding the relationship between projects and workspaces is key to unlocking CodePark's full potential for collaboration, persistence, and scalability.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Whether you're a solo developer prototyping ideas, a teacher guiding students, or a team building complex applications, the project-workspace architecture adapts to your needs while maintaining consistency and reliability across all use cases.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              This separation of concerns allows CodePark to provide both the familiarity of traditional development environments and the collaborative superpowers that make remote teamwork effortless.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/600x350/6366F1/FFFFFF?text=CodePark+Project+System"
              alt="CodePark's project and workspace architecture"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <FolderOpen className="w-12 h-12 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Projects</h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Your logical codebase unit containing source files, configuration, and collaboration settings. Projects are what you see and manage in your dashboard.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <Database className="w-12 h-12 mb-4" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Workspaces</h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              The persistent execution environment backing your project. Workspaces store files, maintain state, and provide the runtime context for your code.
            </p>
          </div>
        </div>
      </section>

      {/* Project Creation Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Creating Your Project</h2>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
            <Plus className="w-5 h-5" style={{ color: themeColors.primary || '#2563EB' }} />
            Three Ways to Start Building
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: themeColors.cardBg }}>
                <FileText style={{ color: themeColors.textSecondary }} />
              </div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Empty Project</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Start with a blank canvas. Perfect for custom setups, experimentation, or teaching from scratch.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: themeColors.cardBg }}>
                <Code style={{ color: themeColors.primary || '#2563EB' }} />
              </div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Template Project</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Jumpstart with pre-configured templates for Python, JavaScript, C++, and other languages.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: themeColors.cardBg }}>
                <Download style={{ color: themeColors.success || '#10B981' }} />
              </div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Git Import</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Import existing repositories from GitHub with full directory structure and optional Git integration.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>What Happens Behind the Scenes</h3>
            <p style={{ color: themeColors.textSecondary }}>
              When you create a project, CodePark automatically provisions a complete development environment. No manual infrastructure setup required - just start coding.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm flex items-center gap-2" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                Workspace allocation, file system initialization, collaboration setup, and runtime preparation all happen instantly.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/400x250/10B981/FFFFFF?text=Project+Creation+Process"
              alt="CodePark project creation workflow"
              className="w-full max-w-sm h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>
      </section>

      {/* File Management & Persistence */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>File Management & Persistence</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <FolderOpen className="w-12 h-12 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Complete File Control</h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Create, edit, rename, and organize files and folders with full directory tree navigation. All operations sync instantly across collaborators.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <Zap className="w-12 h-12 mb-4" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Automatic Persistence</h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              CodePark continuously saves your work in the background. No manual save buttons, no risk of data loss, just seamless development flow.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <Users className="w-12 h-12 mb-4" style={{ color: themeColors.accent || '#8B5CF6' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Real-Time Sync</h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              File changes appear instantly for all collaborators. Edit multiple files simultaneously with perfect synchronization and conflict resolution.
            </p>
          </div>
        </div>
      </section>

      {/* Project Settings & Configuration */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Project Configuration & Settings</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Runtime & Execution Control</h3>
            <p style={{ color: themeColors.textSecondary }}>
              Configure how your code runs with flexible runtime selection, resource limits, and environment variables. Choose between Docker-based execution for full compatibility or WebAssembly for faster startup times.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Resource limits prevent runaway processes while ensuring fair usage across the platform. Environment variables keep sensitive configuration separate from your code.
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <Settings className="mb-3" style={{ color: themeColors.primary || '#4F46E5' }} />
            <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Configuration Options</h4>
            <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
              <li>• Runtime selection (Docker/WebAssembly)</li>
              <li>• Memory and CPU allocation</li>
              <li>• Execution timeouts</li>
              <li>• Environment variables</li>
              <li>• Collaboration permissions</li>
            </ul>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
            <Shield className="w-5 h-5" style={{ color: themeColors.warning || '#F59E0B' }} />
            Security & Collaboration Controls
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Access Management</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Control who can view, edit, and execute code in your project. Perfect for educational environments, code reviews, and team collaboration.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Resource Protection</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Built-in safeguards prevent resource abuse while maintaining performance. Automatic process termination and fair usage policies keep the platform stable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Git Integration */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Version Control Integration</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <CheckCircle className="mb-3" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Git Optional</h3>
            <ul className="text-sm space-y-2" style={{ color: themeColors.textSecondary }}>
              <li>• Work without version control complexity</li>
              <li>• Perfect for beginners and rapid prototyping</li>
              <li>• Autosave provides basic persistence</li>
              <li>• Collaboration works seamlessly</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <GitBranch className="mb-3" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Git Enhanced</h3>
            <ul className="text-sm space-y-2" style={{ color: themeColors.textSecondary }}>
              <li>• Full Git integration when needed</li>
              <li>• Manual commit control</li>
              <li>• Separate from autosave system</li>
              <li>• Import existing repositories</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: themeColors.text }}>
            <Globe className="w-5 h-5" style={{ color: themeColors.warning || '#F59E0B' }} />
            Git Independence
          </h3>
          <p className="text-sm" style={{ color: themeColors.textSecondary }}>
            CodePark's core features work identically whether Git is enabled or not. Version control is a powerful optional layer that enhances your workflow without being required for basic development and collaboration.
          </p>
        </div>
      </section>

      {/* Best Practices & Tips */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Best Practices & Optimization</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <CheckCircle className="mb-3" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Recommended Approaches</h3>
            <ul className="text-sm space-y-2" style={{ color: themeColors.textSecondary }}>
              <li>• Use templates to accelerate project setup</li>
              <li>• Configure environment variables for sensitive data</li>
              <li>• Set appropriate resource limits for your use case</li>
              <li>• Review collaboration settings for team projects</li>
              <li>• Keep Git optional unless you need version history</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <Settings className="mb-3" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Performance Tips</h3>
            <ul className="text-sm space-y-2" style={{ color: themeColors.textSecondary }}>
              <li>• Choose appropriate runtime for your language</li>
              <li>• Monitor resource usage in project settings</li>
              <li>• Use folders to organize large codebases</li>
              <li>• Consider WebAssembly for faster startup times</li>
              <li>• Review execution logs for optimization opportunities</li>
            </ul>
          </div>
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
              onClick={() => onNavigate?.('files-editor')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Files & Editor</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Collaborative editing</div>
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
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Collaboration</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Team management</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('debugging')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Bug className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.warning || '#F59E0B' }} />
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
