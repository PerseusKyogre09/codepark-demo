import { useTheme } from '../../contexts/ThemeContext'
import { Circle, Eye, Play, Users, Lightbulb, AlertTriangle, CheckCircle, Target, Code, Monitor, Zap, Settings, Layers, Terminal } from 'lucide-react'

type Props = {
  onNavigate?: (id: string) => void
}

export default function Debugging({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>Debugging in CodePark</h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Master the art of debugging with CodePark's powerful integrated debugger. Set breakpoints, inspect variables, step through code, and collaborate in real-time to squash bugs efficiently and effectively.
        </p>
      </div>

      {/* Breakpoints Overview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Mastering Breakpoints</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              Breakpoints are your primary tool for controlling program execution during debugging. Click the margin next to line numbers to pause execution and inspect your code's behavior at critical moments.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              CodePark's breakpoint system supports everything from simple line breakpoints to complex conditional breakpoints that only trigger under specific circumstances.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/500x350/DC2626/FFFFFF?text=CodePark+Breakpoints"
              alt="CodePark breakpoint system"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <Target className="w-12 h-12 mb-4" style={{ color: themeColors.error || '#EF4444' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Standard Breakpoints</h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Click the gutter next to any line number to set a breakpoint. Red dots indicate active breakpoints that will pause execution.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <Circle className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Click gutter to set/remove</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
                <span>Persist across sessions</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
                <span>Visible to all collaborators</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
            <Settings className="w-12 h-12 mb-4" style={{ color: themeColors.warning || '#F59E0B' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Conditional Breakpoints</h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Right-click breakpoints to add conditions that control when they trigger, making debugging more precise and efficient.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Variable value conditions</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Hit count thresholds</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Expression evaluations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Variable Inspection */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Inspecting Variables & State</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <Monitor className="mb-3" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Debug Console</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <Eye className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.primary || '#2563EB' }} />
                <span><strong>Variable inspection:</strong> Type variable names to see current values</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <Code className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span><strong>Expression evaluation:</strong> Execute code in current context</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <Layers className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.accent || '#8B5CF6' }} />
                <span><strong>Object exploration:</strong> Navigate complex data structures</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.warning || '#F59E0B' }} />
                <span><strong>Function testing:</strong> Call functions with different parameters</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <Eye className="mb-3" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Variable Watch</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Right-click variables to add to watch</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Watch complex expressions like <code>len(my_list)</code></span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Values update automatically during debugging</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-800/30 rounded-lg">
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Watch expressions help you monitor how variables change as you step through your code, making it easier to spot unexpected behavior.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Debug Controls */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Debug Execution Controls</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
            <Play className="w-8 h-8 mb-3" style={{ color: themeColors.primary || '#4F46E5' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Execution Controls</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: themeColors.text }}>Continue</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: themeColors.inputBg, color: themeColors.text }}>F5</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: themeColors.text }}>Step Over</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: themeColors.inputBg, color: themeColors.text }}>F10</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: themeColors.text }}>Step Into</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: themeColors.inputBg, color: themeColors.text }}>F11</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: themeColors.text }}>Step Out</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: themeColors.inputBg, color: themeColors.text }}>Shift+F11</kbd>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <Layers className="mb-3" style={{ color: themeColors.accent || '#8B5CF6' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Call Stack Navigation</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.accent || '#8B5CF6' }} />
                <span>Click any frame to jump to that location</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.accent || '#8B5CF6' }} />
                <span>See function names, files, and line numbers</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.accent || '#8B5CF6' }} />
                <span>Navigate up and down the call hierarchy</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.accent || '#8B5CF6' }} />
                <span>Inspect variables at different stack levels</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://placehold.co/600x250/6366F1/FFFFFF?text=Debug+Controls+Overview"
            alt="CodePark debug controls"
            className="w-full max-w-lg h-auto rounded-lg shadow-lg border"
            style={{ borderColor: themeColors.border }}
          />
        </div>
      </section>

      {/* Collaborative Debugging */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Collaborative Debugging</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <Users className="mb-3" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Shared Debug Sessions</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>All collaborators see the same debug state</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Breakpoints are visible to everyone</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Variable values are shared in real-time</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Debug console output is broadcast to all participants</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <Monitor className="mb-3" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Remote Debugging</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Debug code running on remote servers</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Attach to running processes</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Debug containerized applications</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Secure remote debugging protocols</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
          <Lightbulb className="mb-3" style={{ color: themeColors.warning || '#F59E0B' }} />
          <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Pair Programming Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6" style={{ color: themeColors.warning || '#F59E0B' }} />
              </div>
              <h4 className="font-medium text-sm mb-1" style={{ color: themeColors.text }}>Driver/Navigator</h4>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>One person controls debugging while others guide</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6" style={{ color: themeColors.warning || '#F59E0B' }} />
              </div>
              <h4 className="font-medium text-sm mb-1" style={{ color: themeColors.text }}>Turn Taking</h4>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>Seamlessly switch control between participants</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6" style={{ color: themeColors.warning || '#F59E0B' }} />
              </div>
              <h4 className="font-medium text-sm mb-1" style={{ color: themeColors.text }}>Instant Feedback</h4>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>Real-time suggestions and observations</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://placehold.co/600x300/10B981/FFFFFF?text=Collaborative+Debugging"
            alt="CodePark collaborative debugging"
            className="w-full max-w-lg h-auto rounded-lg shadow-lg border"
            style={{ borderColor: themeColors.border }}
          />
        </div>
      </section>

      {/* Debugging Tips */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Debugging Tips & Best Practices</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg">
            <Lightbulb className="mb-3" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Effective Debugging Strategies</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Start with simple breakpoints to understand program flow</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Use conditional breakpoints to avoid stopping on irrelevant code</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Add watch expressions for variables that change frequently</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Step through code line by line when behavior is unexpected</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <AlertTriangle className="mb-3" style={{ color: themeColors.error || '#EF4444' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Common Issues & Solutions</h3>
            <div className="space-y-3">
              <div className="text-sm" style={{ color: themeColors.textSecondary }}>
                <strong style={{ color: themeColors.text }}>Breakpoints not hitting?</strong>
                <br />
                <span className="text-xs">Check if code is actually executed</span>
              </div>
              <div className="text-sm" style={{ color: themeColors.textSecondary }}>
                <strong style={{ color: themeColors.text }}>Variables showing unexpected values?</strong>
                <br />
                <span className="text-xs">Check for variable shadowing</span>
              </div>
              <div className="text-sm" style={{ color: themeColors.textSecondary }}>
                <strong style={{ color: themeColors.text }}>Debug console not responding?</strong>
                <br />
                <span className="text-xs">Ensure debugger is properly attached</span>
              </div>
              <div className="text-sm" style={{ color: themeColors.textSecondary }}>
                <strong style={{ color: themeColors.text }}>Performance issues?</strong>
                <br />
                <span className="text-xs">Remove unused breakpoints</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <Zap className="mb-3" style={{ color: themeColors.primary || '#2563EB' }} />
          <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Advanced Debugging Techniques</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: themeColors.cardBg }}>
                <Target className="w-6 h-6" style={{ color: themeColors.primary || '#2563EB' }} />
              </div>
              <h4 className="font-medium text-sm mb-1" style={{ color: themeColors.text }}>Conditional Breakpoints</h4>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>Break only when specific conditions are met</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Code className="w-6 h-6" style={{ color: themeColors.accent || '#8B5CF6' }} />
              </div>
              <h4 className="font-medium text-sm mb-1" style={{ color: themeColors.text }}>Expression Evaluation</h4>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>Test code snippets in debug context</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Monitor className="w-6 h-6" style={{ color: themeColors.success || '#10B981' }} />
              </div>
              <h4 className="font-medium text-sm mb-1" style={{ color: themeColors.text }}>Memory Inspection</h4>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>Analyze memory usage and leaks</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://placehold.co/600x250/F59E0B/FFFFFF?text=Debugging+Tips+and+Best+Practices"
            alt="CodePark debugging tips"
            className="w-full max-w-lg h-auto rounded-lg shadow-lg border"
            style={{ borderColor: themeColors.border }}
          />
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
              onClick={() => onNavigate?.('terminals')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Terminal className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Terminals</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Command line interface</div>
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
              onClick={() => onNavigate?.('execution-limits')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Settings className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.accent || '#8B5CF6' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Execution Limits</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Resource management</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('keyboard-shortcuts')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.warning || '#F59E0B' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Keyboard Shortcuts</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Boost productivity</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
