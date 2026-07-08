import { useTheme } from '../../contexts/ThemeContext'
import {
  Terminal,
  Monitor,
  Play,
  Settings,
  Code,
  Users,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  AlertTriangle,
  FileText,
  Cpu,
  HardDrive
} from 'lucide-react'

interface Props {
  onNavigate?: (id: string) => void
}

function Terminals({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>
          Terminals
        </h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Full shell access with collaborative features and persistent sessions
        </p>
      </div>

      {/* Overview Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Terminal className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
              Interactive Shell
            </h3>
            <p style={{ color: themeColors.textSecondary }}>
              Full command-line access with your preferred shell environment
            </p>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Users className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
              Collaborative Sessions
            </h3>
            <p style={{ color: themeColors.textSecondary }}>
              All collaborators see the same terminal output and can contribute
            </p>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <HardDrive className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
              Shared Filesystem
            </h3>
            <p style={{ color: themeColors.textSecondary }}>
              Terminal commands affect the same files visible in your editor
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-4">
            <Zap className="w-6 h-6 mt-1" style={{ color: themeColors.primary || '#2563EB' }} />
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                Key Features
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <li>• Persistent sessions that survive page refreshes</li>
                <li>• Multiple terminal tabs for complex workflows</li>
                <li>• Environment isolation with secure execution</li>
                <li>• Real-time synchronization across all collaborators</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Shell Access Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Shell Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Terminal className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Available Shells
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Bash (primary shell)</li>
              <li>• Sh (fallback shell)</li>
              <li>• Zsh (if available)</li>
              <li>• Fish (if available)</li>
            </ul>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Code className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Command Examples
            </h3>
            <div className="rounded p-3 font-mono text-xs" style={{ background: themeColors.inputBg, color: themeColors.text }}>
              <div>$ python --version</div>
              <div>$ pip install requests</div>
              <div>$ npm install</div>
              <div>$ git status</div>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 mt-1" style={{ color: themeColors.warning || '#F59E0B' }} />
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                Getting Started
              </h3>
              <p className="text-sm mb-3" style={{ color: themeColors.textSecondary }}>
                Open a terminal from the Terminal panel in your project workspace. It starts in the project root directory.
              </p>
              <ul className="space-y-1 text-sm" style={{ color: themeColors.textSecondary }}>
                <li>• Navigate to the Terminal panel</li>
                <li>• Create or activate a terminal instance</li>
                <li>• Start running commands immediately</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Filesystem Behavior Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Filesystem Behavior
        </h2>
        <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
          <div className="flex items-start space-x-4">
            <HardDrive className="w-8 h-8 mt-1" style={{ color: themeColors.primary || '#2563EB' }} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
                Shared Filesystem
              </h3>
              <p className="mb-4" style={{ color: themeColors.textSecondary }}>
                The terminal operates on the same filesystem used by the editor, code execution, and debugging sessions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg" style={{ background: themeColors.cardBg }}>
                  <FileText className="w-6 h-6 mx-auto mb-2" style={{ color: themeColors.primary || '#2563EB' }} />
                  <div className="text-sm font-medium" style={{ color: themeColors.text }}>Editor Files</div>
                  <div className="text-xs" style={{ color: themeColors.textSecondary }}>Visible in terminal</div>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ background: themeColors.cardBg }}>
                  <Play className="w-6 h-6 mx-auto mb-2" style={{ color: themeColors.success || '#10B981' }} />
                  <div className="text-sm font-medium" style={{ color: themeColors.text }}>Code Execution</div>
                  <div className="text-xs" style={{ color: themeColors.textSecondary }}>Same environment</div>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ background: themeColors.cardBg }}>
                  <Settings className="w-6 h-6 mx-auto mb-2" style={{ color: themeColors.accent || '#8B5CF6' }} />
                  <div className="text-sm font-medium" style={{ color: themeColors.text }}>Debug Sessions</div>
                  <div className="text-xs" style={{ color: themeColors.textSecondary }}>Shared state</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-4">
            <CheckCircle className="w-6 h-6 mt-1" style={{ color: themeColors.primary || '#2563EB' }} />
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                Real-time Synchronization
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <li>• File changes in terminal appear immediately in editor</li>
                <li>• Editor saves are reflected in terminal filesystem</li>
                <li>• All collaborators see the same file state</li>
                <li>• Temporary files and build outputs are accessible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Terminal Collaboration Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Terminal Collaboration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Users className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Shared Sessions
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• All keystrokes are visible to collaborators</li>
              <li>• Command output streams to everyone</li>
              <li>• Shared command history</li>
              <li>• No private terminals in shared sessions</li>
            </ul>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Monitor className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Collaborative Workflows
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Pair programming sessions</li>
              <li>• Live debugging demonstrations</li>
              <li>• Interactive teaching</li>
              <li>• Code walkthroughs</li>
            </ul>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 mt-1" style={{ color: themeColors.warning || '#F59E0B' }} />
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                Coordination Tips
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <li>• Avoid typing conflicting commands simultaneously</li>
                <li>• Coordinate actions through chat or voice</li>
                <li>• Announce long-running commands in advance</li>
                <li>• Use clear communication to prevent confusion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Environment & Security Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Environment & Security
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Settings className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Environment Consistency
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Same runtime as code execution</li>
              <li>• Installed dependencies available</li>
              <li>• Environment variables respected</li>
              <li>• Runtime configuration consistent</li>
            </ul>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Shield className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Security & Isolation
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Sandboxed execution environment</li>
              <li>• No host system access</li>
              <li>• Restricted system permissions</li>
              <li>• CPU and memory limits enforced</li>
            </ul>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 mt-1" style={{ color: themeColors.error || '#EF4444' }} />
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                Limitations & Restrictions
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <li>• Execution time limits may apply</li>
                <li>• Memory constraints enforced</li>
                <li>• Network access may be restricted</li>
                <li>• Privileged commands disabled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison & Best Practices Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Terminals vs Code Execution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Terminal className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Terminal Best For
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>✅ Interactive shell commands</li>
              <li>✅ Persistent state across runs</li>
              <li>✅ Dependency installation</li>
              <li>✅ File system exploration</li>
              <li>✅ Build tool execution</li>
            </ul>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Play className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Run/Debug Best For
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>❌ Non-interactive execution</li>
              <li>❌ Fresh environment each run</li>
              <li>✅ Structured program execution</li>
              <li>✅ Breakpoint debugging</li>
              <li>✅ Performance profiling</li>
            </ul>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-4">
            <CheckCircle className="w-6 h-6 mt-1" style={{ color: themeColors.success || '#10B981' }} />
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                Best Practices
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <li>• Use terminal for setup, installation, and exploration</li>
                <li>• Keep long-running commands coordinated in shared sessions</li>
                <li>• Prefer editor edits for source files over terminal commands</li>
                <li>• Check runtime compatibility before running commands</li>
                <li>• Monitor resource usage for memory-intensive operations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Troubleshooting
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <AlertTriangle className="w-8 h-8 mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Commands Fail
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Check runtime compatibility</li>
              <li>• Verify available permissions</li>
              <li>• Monitor memory/execution limits</li>
              <li>• Ensure correct syntax</li>
            </ul>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <FileText className="w-8 h-8 mb-4 text-orange-500" />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Files Not Appearing
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Create files in project directory</li>
              <li>• Wait for filesystem refresh</li>
              <li>• Check file permissions</li>
              <li>• Verify disk space</li>
            </ul>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Clock className="w-8 h-8 mb-4 text-yellow-500" />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Terminal Unresponsive
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Check for blocked commands</li>
              <li>• Monitor excessive output</li>
              <li>• Verify resource limits</li>
              <li>• Restart terminal if needed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Continue Learning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate?.('uploading-files')}
            className="rounded-lg p-4 shadow-sm border transition-colors text-left group hover:opacity-80"
            style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
          >
            <FileText className="w-6 h-6 mb-2" style={{ color: themeColors.primary || '#2563EB' }} />
            <div className="font-semibold" style={{ color: themeColors.text }}>File Management</div>
            <div className="text-sm" style={{ color: themeColors.textSecondary }}>Upload and manage project assets</div>
            <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
          </button>
          <button
            onClick={() => onNavigate?.('execution-limits')}
            className="rounded-lg p-4 shadow-sm border transition-colors text-left group hover:opacity-80"
            style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
          >
            <Cpu className="w-6 h-6 mb-2" style={{ color: themeColors.primary || '#2563EB' }} />
            <div className="font-semibold" style={{ color: themeColors.text }}>Runtimes & Limits</div>
            <div className="text-sm" style={{ color: themeColors.textSecondary }}>Execution environments and constraints</div>
            <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
          </button>
          <button
            onClick={() => onNavigate?.('roles-permissions')}
            className="rounded-lg p-4 shadow-sm border transition-colors text-left group hover:opacity-80"
            style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
          >
            <Users className="w-6 h-6 mb-2" style={{ color: themeColors.primary || '#2563EB' }} />
            <div className="font-semibold" style={{ color: themeColors.text }}>Collaboration</div>
            <div className="text-sm" style={{ color: themeColors.textSecondary }}>Roles, permissions, and team workflows</div>
            <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
          </button>
          <button
            onClick={() => onNavigate?.('gui-applications')}
            className="rounded-lg p-4 shadow-sm border transition-colors text-left group hover:opacity-80"
            style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
          >
            <Monitor className="w-6 h-6 mb-2" style={{ color: themeColors.primary || '#2563EB' }} />
            <div className="font-semibold" style={{ color: themeColors.text }}>GUI Applications</div>
            <div className="text-sm" style={{ color: themeColors.textSecondary }}>Running desktop apps in the browser</div>
            <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Terminals
