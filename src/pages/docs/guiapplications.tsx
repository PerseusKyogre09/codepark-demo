import { useTheme } from '../../contexts/ThemeContext'
import {
  Monitor,
  Play,
  Settings,
  Code,
  Users,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Cpu,
  HardDrive,
  Globe
} from 'lucide-react'

interface Props {
  onNavigate?: (id: string) => void
}

function GuiApplications({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>
          GUI Applications
        </h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Running desktop applications in the browser with collaborative features
        </p>
      </div>

      {/* Overview Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Monitor className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
              Virtual Desktop
            </h3>
            <p style={{ color: themeColors.textSecondary }}>
              X11-based desktop streaming directly in your browser
            </p>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Code className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
              Framework Support
            </h3>
            <p style={{ color: themeColors.textSecondary }}>
              Tkinter, PyQt, wxPython, Kivy, and more
            </p>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Users className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
              Collaborative
            </h3>
            <p style={{ color: themeColors.textSecondary }}>
              Share interactive applications with your team
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-4">
            <Zap className="w-6 h-6 mt-1" style={{ color: themeColors.primary || '#2563EB' }} />
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                Key Benefits
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <li>• Develop desktop apps without leaving the browser</li>
                <li>• Test GUI applications in a cloud environment</li>
                <li>• Collaborate on interactive interfaces in real-time</li>
                <li>• Access familiar desktop tools and workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Settings className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Runtime Environment
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• X11 display server support</li>
              <li>• GUI libraries installed</li>
              <li>• Sufficient CPU and memory</li>
              <li>• WebSocket streaming support</li>
            </ul>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Shield className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Plan Requirements
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Pro plan for optimal performance</li>
              <li>• Free plan with reduced quality</li>
              <li>• GUI-capable runtime selection</li>
              <li>• Subscription-based limitations</li>
            </ul>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 mt-1" style={{ color: themeColors.warning || '#F59E0B' }} />
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                Getting Started
              </h3>
              <p className="text-sm mb-3" style={{ color: themeColors.textSecondary }}>
                GUI applications require specific runtime environments and may have performance limitations on free plans.
              </p>
              <ul className="space-y-1 text-sm" style={{ color: themeColors.textSecondary }}>
                <li>• Choose a GUI-capable runtime when creating your project</li>
                <li>• Ensure required GUI libraries are available</li>
                <li>• Consider upgrading to Pro for better performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Frameworks Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Supported Frameworks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Code className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Python Frameworks
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• <strong>Tkinter</strong> - Standard GUI library</li>
              <li>• <strong>PyQt/PySide</strong> - Qt-based applications</li>
              <li>• <strong>wxPython</strong> - wxWidgets GUIs</li>
              <li>• <strong>Kivy</strong> - Cross-platform apps</li>
              <li>• <strong>Pygame</strong> - Game development</li>
            </ul>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Globe className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Other Languages
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• <strong>Java Swing/AWT</strong> - Desktop apps</li>
              <li>• <strong>Electron</strong> - JavaScript desktop</li>
              <li>• <strong>GTK/Qt</strong> - C/C++ frameworks</li>
              <li>• Additional frameworks available</li>
            </ul>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-4">
            <Play className="w-6 h-6 mt-1" style={{ color: themeColors.success || '#10B981' }} />
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                Getting Started
              </h3>
              <p className="text-sm mb-3" style={{ color: themeColors.textSecondary }}>
                Launch GUI applications just like regular code execution.
              </p>
              <ul className="space-y-1 text-sm" style={{ color: themeColors.textSecondary }}>
                <li>• Use a GUI-capable runtime environment</li>
                <li>• Execute your GUI code normally</li>
                <li>• Interface appears in dedicated panel</li>
                <li>• Full mouse and keyboard interaction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* GUI Collaboration Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          GUI Collaboration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Users className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Shared Interface
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• All collaborators see same GUI state</li>
              <li>• Mouse movements synchronized</li>
              <li>• Keyboard input shared</li>
              <li>• Updates appear simultaneously</li>
            </ul>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Monitor className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Interactive Teaching
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Live software demonstrations</li>
              <li>• Collaborative GUI design</li>
              <li>• Interactive tutorials</li>
              <li>• Real-time interface feedback</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg p-6 border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
            Example: Python Tkinter
          </h3>
          <div className="rounded p-4 font-mono text-sm overflow-x-auto" style={{ background: themeColors.inputBg, color: themeColors.text }}>
            <div>import tkinter as tk</div>
            <div>from tkinter import messagebox</div>
            <div></div>
            <div>def show_message():</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;messagebox.showinfo("Hello", "GUI apps work in CodePark!")</div>
            <div></div>
            <div>root = tk.Tk()</div>
            <div>root.title("CodePark GUI Demo")</div>
            <div>button = tk.Button(root, text="Click me!", command=show_message)</div>
            <div>button.pack(pady=20)</div>
            <div>root.mainloop()</div>
          </div>
        </div>
      </div>

      {/* Performance & Limitations Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text }}>
          Performance & Limitations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Zap className="w-8 h-8 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Performance Factors
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Network connection quality</li>
              <li>• Server load and resources</li>
              <li>• GUI application complexity</li>
              <li>• Subscription plan level</li>
            </ul>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <AlertTriangle className="w-8 h-8 mb-4 text-orange-500" />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Technical Limitations
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Not all frameworks supported</li>
              <li>• Limited 3D acceleration</li>
              <li>• No system tray icons</li>
              <li>• Fixed screen resolution</li>
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
                <li>• Test GUI applications locally first</li>
                <li>• Use supported frameworks for compatibility</li>
                <li>• Keep GUI code simple and efficient</li>
                <li>• Design for collaborative usage</li>
                <li>• Document GUI dependencies clearly</li>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <Monitor className="w-8 h-8 mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              GUI Not Appearing
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Check GUI-capable runtime</li>
              <li>• Verify GUI libraries installed</li>
              <li>• Ensure visible window creation</li>
              <li>• Check terminal for errors</li>
            </ul>
          </div>
          <div className="rounded-lg p-6 shadow-sm border" style={{ background: themeColors.cardBg, borderColor: themeColors.border }}>
            <HardDrive className="w-8 h-8 mb-4 text-yellow-500" />
            <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text }}>
              Performance Issues
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li>• Use simpler GUI frameworks</li>
              <li>• Reduce visual complexity</li>
              <li>• Check network connection</li>
              <li>• Consider Pro plan upgrade</li>
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
            onClick={() => onNavigate?.('realtime-editing')}
            className="rounded-lg p-4 shadow-sm border transition-colors text-left group hover:opacity-80"
            style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
          >
            <Code className="w-6 h-6 mb-2" style={{ color: themeColors.primary || '#2563EB' }} />
            <div className="font-semibold" style={{ color: themeColors.text }}>Realtime Editing</div>
            <div className="text-sm" style={{ color: themeColors.textSecondary }}>Collaborative code editing features</div>
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
            onClick={() => onNavigate?.('free-vs-pro')}
            className="rounded-lg p-4 shadow-sm border transition-colors text-left group hover:opacity-80"
            style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
          >
            <Shield className="w-6 h-6 mb-2" style={{ color: themeColors.primary || '#2563EB' }} />
            <div className="font-semibold" style={{ color: themeColors.text }}>Free vs Pro</div>
            <div className="text-sm" style={{ color: themeColors.textSecondary }}>Compare plans and features</div>
            <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuiApplications
