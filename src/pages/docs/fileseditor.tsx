import { useTheme } from '../../contexts/ThemeContext'
import { Users, Zap, Save, GitBranch, Eye, Code, FolderOpen, RefreshCw, CheckCircle, Settings, Monitor, Keyboard, Clock, Play, Bug, Upload } from 'lucide-react'

type Props = {
  onNavigate?: (id: string) => void
}

export default function FilesEditor({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>Files & Editor</h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Master CodePark's powerful collaborative code editor and file management system. Learn how real-time editing, automatic synchronization, and intelligent features transform how teams write and collaborate on code.
        </p>
      </div>

      {/* Overview Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>The Collaborative Code Editor</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              CodePark's editor redefines collaborative coding with a browser-based environment that rivals desktop IDEs. Built from the ground up for multi-user editing, it combines the familiarity of modern code editors with revolutionary real-time collaboration features.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Every keystroke synchronizes instantly across all collaborators, files update automatically, and the system maintains perfect consistency even with network latency or concurrent edits. This creates a seamless coding experience where distance and time zones become irrelevant.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Whether you're conducting pair programming sessions, teaching coding workshops, or coordinating complex team development, the editor adapts to your workflow while maintaining the precision and reliability you expect from professional development tools.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/600x350/10B981/FFFFFF?text=CodePark+Editor+Interface"
              alt="CodePark's collaborative code editor interface"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
            <Users className="mx-auto mb-2" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-sm font-medium" style={{ color: themeColors.text }}>Real-Time Sync</h3>
            <p className="text-xs" style={{ color: themeColors.textSecondary }}>Instant collaboration</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <Zap className="mx-auto mb-2" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-sm font-medium" style={{ color: themeColors.text }}>Conflict-Free</h3>
            <p className="text-xs" style={{ color: themeColors.textSecondary }}>Automatic merging</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
            <Save className="mx-auto mb-2" style={{ color: themeColors.accent || '#8B5CF6' }} />
            <h3 className="text-sm font-medium" style={{ color: themeColors.text }}>Auto-Save</h3>
            <p className="text-xs" style={{ color: themeColors.textSecondary }}>Never lose work</p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
            <Code className="mx-auto mb-2" style={{ color: themeColors.warning || '#F59E0B' }} />
            <h3 className="text-sm font-medium" style={{ color: themeColors.text }}>50+ Languages</h3>
            <p className="text-xs" style={{ color: themeColors.textSecondary }}>Full syntax support</p>
          </div>
        </div>
      </section>

      {/* Real-Time Collaboration Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Real-Time Collaboration Features</h2>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
            <Users className="w-5 h-5" style={{ color: themeColors.primary || '#3B82F6' }} />
            Multi-User Editing Experience
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
                <Eye className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
                Visual Awareness
              </h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                See exactly where collaborators are working with colored cursors, selection highlights, and user identifiers. Follow their actions in real-time as they navigate and edit code.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
                <Zap className="w-4 h-4" style={{ color: themeColors.accent || '#8B5CF6' }} />
                Instant Synchronization
              </h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Every keystroke, cursor movement, and selection change appears instantly for all participants. No waiting, no manual refreshes, no synchronization delays.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Conflict-Free Editing</h3>
            <p style={{ color: themeColors.textSecondary }}>
              CodePark uses advanced conflict-free replicated data types (CRDTs) to ensure that concurrent edits from multiple users are merged automatically and deterministically. Even when users type at the exact same location, the system maintains consistency without requiring manual conflict resolution.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm flex items-center gap-2" style={{ color: themeColors.textSecondary }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: themeColors.success || '#10B981' }} />
                Network latency never corrupts your files. Edits are merged intelligently regardless of connection quality.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/400x250/3B82F6/FFFFFF?text=Real-Time+Collaboration"
              alt="Real-time collaborative editing demonstration"
              className="w-full max-w-sm h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>
      </section>

      {/* File Management Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Intelligent File Management</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <FolderOpen className="w-12 h-12 mb-4" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>File Tree Sidebar</h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Navigate your project structure with an intuitive file browser. Create, rename, move, and delete files and folders with immediate synchronization across all collaborators.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <RefreshCw className="w-12 h-12 mb-4" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Instant Sync</h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              File changes propagate instantly to all open editors and collaborators. No manual refresh needed - the environment stays perfectly synchronized in real-time.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <Monitor className="w-12 h-12 mb-4" style={{ color: themeColors.accent || '#8B5CF6' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Live Updates</h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              When files are renamed or deleted, all open editors update automatically. Collaborators see changes immediately, maintaining perfect consistency across the entire session.
            </p>
          </div>
        </div>
      </section>

      {/* Persistence & History Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Automatic Persistence & History</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Always-On Autosave</h3>
            <p style={{ color: themeColors.textSecondary }}>
              CodePark automatically saves your work as you type, protecting against data loss from browser crashes, network interruptions, or accidental navigation. Your code is always safe, always available.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              This automatic persistence works seamlessly in the background, ensuring that your collaborative sessions maintain perfect state consistency across all participants.
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
            <Save className="mb-3" style={{ color: themeColors.warning || '#F59E0B' }} />
            <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Manual Save (Ctrl+S)</h4>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              While autosave handles persistence, Ctrl+S creates intentional checkpoints in your session history. These markers help distinguish meaningful progress points from intermediate edits.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
            <GitBranch className="w-5 h-5" style={{ color: themeColors.warning || '#F59E0B' }} />
            Session History vs Git Version Control
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border" style={{ borderColor: themeColors.border }}>
              <thead>
                <tr style={{ background: themeColors.cardBg }}>
                  <th className="border p-3 text-left font-medium" style={{ borderColor: themeColors.border, color: themeColors.text }}>Feature</th>
                  <th className="border p-3 text-left font-medium" style={{ borderColor: themeColors.border, color: themeColors.text }}>Session History</th>
                  <th className="border p-3 text-left font-medium" style={{ borderColor: themeColors.border, color: themeColors.text }}>Git Version Control</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium" style={{ borderColor: themeColors.border, color: themeColors.text }}>Automatic</td>
                  <td className="border p-3" style={{ borderColor: themeColors.border, color: themeColors.textSecondary }}>Partial (autosave)</td>
                  <td className="border p-3" style={{ borderColor: themeColors.border, color: themeColors.textSecondary }}>❌ Manual only</td>
                </tr>
                <tr style={{ background: themeColors.cardBg }}>
                  <td className="border p-3 font-medium" style={{ borderColor: themeColors.border, color: themeColors.text }}>Manual Checkpoints</td>
                  <td className="border p-3" style={{ borderColor: themeColors.border, color: themeColors.textSecondary }}>✅ Ctrl+S saves</td>
                  <td className="border p-3" style={{ borderColor: themeColors.border, color: themeColors.textSecondary }}>✅ Git commits</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium" style={{ borderColor: themeColors.border, color: themeColors.text }}>Always Available</td>
                  <td className="border p-3" style={{ borderColor: themeColors.border, color: themeColors.textSecondary }}>✅ Built-in</td>
                  <td className="border p-3" style={{ borderColor: themeColors.border, color: themeColors.textSecondary }}>❌ Optional setup</td>
                </tr>
                <tr style={{ background: themeColors.cardBg }}>
                  <td className="border p-3 font-medium" style={{ borderColor: themeColors.border, color: themeColors.text }}>Collaboration Focus</td>
                  <td className="border p-3" style={{ borderColor: themeColors.border, color: themeColors.textSecondary }}>✅ Real-time sessions</td>
                  <td className="border p-3" style={{ borderColor: themeColors.border, color: themeColors.textSecondary }}>❌ Async workflow</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-4" style={{ color: themeColors.textSecondary }}>
            Session history provides immediate, collaborative versioning while Git offers long-term, distributed version control. Both serve different but complementary purposes.
          </p>
        </div>
      </section>

      {/* Language Support & Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Advanced Language Support</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>50+ Programming Languages</h3>
            <p style={{ color: themeColors.textSecondary }}>
              CodePark provides comprehensive syntax highlighting, intelligent indentation, and language-specific features for the most popular programming languages and formats.
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <div>• Python & JavaScript</div>
              <div>• TypeScript & Java</div>
              <div>• C/C++ & C#</div>
              <div>• HTML/CSS & PHP</div>
              <div>• Go & Rust</div>
              <div>• Ruby & Swift</div>
              <div>• JSON, YAML, Markdown</div>
              <div>• SQL & Shell scripts</div>
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <Code className="mb-3" style={{ color: themeColors.primary || '#4F46E5' }} />
            <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Intelligent Features</h4>
            <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
              <li>• Syntax highlighting & coloring</li>
              <li>• Automatic bracket matching</li>
              <li>• Smart indentation rules</li>
              <li>• Line numbers & code folding</li>
              <li>• Find & replace with regex</li>
              <li>• Multiple cursor editing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Best Practices & Tips */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Best Practices & Tips</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <CheckCircle className="mb-3" style={{ color: themeColors.success || '#10B981' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Do's</h3>
            <ul className="text-sm space-y-2" style={{ color: themeColors.textSecondary }}>
              <li>• Use Ctrl+S to mark meaningful checkpoints</li>
              <li>• Organize large projects with folders</li>
              <li>• Leverage real-time collaboration for reviews</li>
              <li>• Take advantage of multi-cursor editing</li>
              <li>• Use the file tree for efficient navigation</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <Settings className="mb-3" style={{ color: themeColors.error || '#EF4444' }} />
            <h3 className="text-lg font-medium mb-3" style={{ color: themeColors.text }}>Considerations</h3>
            <ul className="text-sm space-y-2" style={{ color: themeColors.textSecondary }}>
              <li>• Avoid editing large binary files</li>
              <li>• Be mindful of performance with huge files</li>
              <li>• Git is optional but recommended for long-term projects</li>
              <li>• Generated files may not sync optimally</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: themeColors.text }}>
            <Clock className="w-5 h-5" style={{ color: themeColors.primary || '#2563EB' }} />
            Session Persistence
          </h3>
          <p className="text-sm" style={{ color: themeColors.textSecondary }}>
            Your files and code remain perfectly preserved when you leave and rejoin sessions. While UI state like open tabs may reset, all your work stays exactly as you left it, ready for continued collaboration whenever you return.
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
              onClick={() => onNavigate?.('running-code')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
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
              <Bug className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.success || '#10B981' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Debugging</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Debug your code effectively</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('uploading-files')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.accent || '#8B5CF6' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>File Uploads</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Import your files</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('keyboard-shortcuts')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Keyboard className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.warning || '#F59E0B' }} />
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
