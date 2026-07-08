import { useTheme } from '../../contexts/ThemeContext'
import { Play, Cloud, Zap, Terminal, Cpu, HardDrive, Wifi, Package, Clock, AlertTriangle, CheckCircle, Settings, Code, Monitor, Bug, Shield, Layers } from 'lucide-react'

type Props = {
  onNavigate?: (id: string) => void
}

export default function RunningCode({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>Running Code in CodePark</h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Execute your code with confidence using CodePark's powerful execution environments. From instant browser-based testing to full cloud containers, run everything from simple scripts to complex applications with real-time output and comprehensive debugging tools.
        </p>
      </div>

      {/* Execution Environments Overview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Choose Your Execution Environment</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              CodePark offers two powerful execution environments designed for different use cases. Whether you need instant feedback for quick testing or full cloud capabilities for complex applications, there's a runtime that fits your workflow perfectly.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Both environments integrate seamlessly with your collaborative workspace, ensuring that code execution works identically whether you're working solo or with a team of developers.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/500x350/3B82F6/FFFFFF?text=CodePark+Runtimes"
              alt="CodePark execution environments"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <Cloud className="w-12 h-12 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Cloud Containers</h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Full-featured Docker containers with dedicated resources, persistent storage, and complete network access for professional development.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <HardDrive className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
                <span>1GB+ RAM, dedicated CPU</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <Wifi className="w-4 h-4" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Full internet connectivity</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <Package className="w-4 h-4" style={{ color: themeColors.accent || '#8B5CF6' }} />
                <span>Pre-installed development tools</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <Zap className="w-12 h-12 mb-4" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>WebAssembly Runtimes</h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Browser-based execution with instant startup times, perfect for quick testing, prototyping, and lightweight scripting.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <Clock className="w-4 h-4" style={{ color: themeColors.warning || '#F59E0B' }} />
                <span>Starts in milliseconds</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <Code className="w-4 h-4" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Python & JavaScript support</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <Monitor className="w-4 h-4" style={{ color: themeColors.accent || '#8B5CF6' }} />
                <span>Direct browser execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Running Your Code */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Execute with Confidence</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
              <Play className="w-8 h-8 mb-3" style={{ color: themeColors.primary || '#4F46E5' }} />
              <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Keyboard Shortcuts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: themeColors.text }}>Execute File</span>
                  <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: themeColors.inputBg, color: themeColors.text }}>Ctrl + Enter</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: themeColors.text }}>Custom Args</span>
                  <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: themeColors.inputBg, color: themeColors.text }}>Ctrl + Shift + Enter</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: themeColors.text }}>Debug Mode</span>
                  <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: themeColors.inputBg, color: themeColors.text }}>F5</kbd>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <Settings className="mb-3" style={{ color: themeColors.success || '#10B981' }} />
              <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Execution Flow</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: themeColors.text }}>Code Analysis</div>
                    <div className="text-xs" style={{ color: themeColors.textSecondary }}>Syntax checking and dependency detection</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: themeColors.text }}>Environment Setup</div>
                    <div className="text-xs" style={{ color: themeColors.textSecondary }}>Runtime preparation and resource allocation</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: themeColors.text }}>Live Execution</div>
                    <div className="text-xs" style={{ color: themeColors.textSecondary }}>Code runs with real-time output streaming</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src="https://placehold.co/450x350/10B981/FFFFFF?text=Code+Execution+Flow"
              alt="CodePark execution process"
              className="w-full max-w-sm h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>
      </section>

      {/* Output Handling */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Real-Time Output & Interaction</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <Terminal className="mb-3" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Terminal Output</h3>
            <ul className="text-sm space-y-2" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span>Standard output (white)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Error messages (red)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>System messages (yellow)</span>
              </li>
            </ul>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
                <span>Real-time streaming</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
                <span>Scrollable history</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
                <span>Export & copy options</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <Monitor className="mb-3" style={{ color: themeColors.accent || '#8B5CF6' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Interactive Programs</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
                <span>Full input handling support</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
                <span>Signal support (Ctrl+C)</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
                <span>Background process management</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Interactive programs work seamlessly through CodePark's integrated terminal, supporting user input, interrupts, and long-running processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting & Limits */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Troubleshooting & Execution Limits</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <AlertTriangle className="mb-3" style={{ color: themeColors.error || '#EF4444' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Common Issues & Solutions</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-red-400 pl-3">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Import Errors</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Check package installation in your environment</div>
              </div>
              <div className="border-l-4 border-orange-400 pl-3">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Timeout Errors</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Long-running programs may hit 5-minute limit</div>
              </div>
              <div className="border-l-4 border-yellow-400 pl-3">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Memory Issues</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Large datasets may exceed 1GB RAM limit</div>
              </div>
              <div className="border-l-4 border-purple-400 pl-3">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Network Errors</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Wasm runtimes cannot access external services</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
            <Shield className="mb-3" style={{ color: themeColors.textSecondary }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Execution Limits</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg" style={{ background: themeColors.cardBg }}>
                <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: themeColors.primary || '#2563EB' }} />
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>5 Minutes</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Time Limit</div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: themeColors.cardBg }}>
                <Cpu className="w-6 h-6 mx-auto mb-2" style={{ color: themeColors.success || '#10B981' }} />
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>1GB RAM</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Memory Limit</div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: themeColors.cardBg }}>
                <HardDrive className="w-6 h-6 mx-auto mb-2" style={{ color: themeColors.accent || '#8B5CF6' }} />
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>10MB</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Output Limit</div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: themeColors.cardBg }}>
                <Layers className="w-6 h-6 mx-auto mb-2" style={{ color: themeColors.warning || '#F59E0B' }} />
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>3 Runs</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Concurrent</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Best Practices for Code Execution</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <Zap className="mb-3" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Performance Optimization</h3>
            <ul className="text-sm space-y-2" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Use Wasm runtimes for quick testing and lightweight scripts</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Reserve cloud containers for heavy computation and API calls</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                <span>Install packages once and reuse across executions</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <Bug className="mb-3" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Effective Debugging</h3>
            <ul className="text-sm space-y-2" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Check terminal output for detailed error messages</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Use print statements for debugging intermediate values</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeColors.primary || '#2563EB' }} />
                <span>Test code in small pieces before running complex programs</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: themeColors.text }}>
            <Settings className="w-5 h-5" style={{ color: themeColors.warning || '#F59E0B' }} />
            Environment Selection Guide
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Choose Cloud Containers When:</h4>
              <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
                <li>• Making external API calls</li>
                <li>• Installing custom packages</li>
                <li>• Running complex computations</li>
                <li>• Processing large datasets</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Choose Wasm Runtimes When:</h4>
              <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
                <li>• Quick prototyping and testing</li>
                <li>• Learning and experimentation</li>
                <li>• Simple scripts and algorithms</li>
                <li>• No external dependencies needed</li>
              </ul>
            </div>
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
              onClick={() => onNavigate?.('debugging')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Bug className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Debugging</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Debug your code effectively</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('terminals')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Terminal className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.success || '#10B981' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Terminals</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Command line interface</div>
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
              onClick={() => onNavigate?.('resource-limits')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Monitor className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.warning || '#F59E0B' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Resource Limits</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>System constraints</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
