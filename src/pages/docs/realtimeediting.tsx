import { useTheme } from '../../contexts/ThemeContext'
import { Zap, Users, RefreshCw, Eye, Network, Shield, Terminal, Activity } from 'lucide-react'

interface Props {
  onNavigate?: (id: string) => void
}

function RealtimeEditing({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>Realtime Editing</h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Realtime editing allows multiple users to work on the same files simultaneously while staying perfectly in sync.
          CodePark's collaboration model is designed to be reliable, low-latency, and conflict-free.
        </p>
      </div>

      {/* Overview Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 mr-2" style={{ color: themeColors.primary || '#2563EB' }} />
            <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>True Real-time Collaboration</h3>
          </div>
          <p className="mb-4" style={{ color: themeColors.textSecondary }}>
            With realtime editing, multiple users can type simultaneously. Changes propagate instantly, no merge conflicts occur, and the document remains consistent for everyone.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2" style={{ color: themeColors.text }}>Ideal For:</h4>
              <ul className="space-y-1 text-sm" style={{ color: themeColors.textSecondary }}>
                <li className="flex items-center"><Users className="w-3 h-3 mr-2" /> Pair programming</li>
                <li className="flex items-center"><Users className="w-3 h-3 mr-2" /> Mob programming</li>
                <li className="flex items-center"><Users className="w-3 h-3 mr-2" /> Remote team collaboration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2" style={{ color: themeColors.text }}>Used In:</h4>
              <ul className="space-y-1 text-sm" style={{ color: themeColors.textSecondary }}>
                <li className="flex items-center"><Eye className="w-3 h-3 mr-2" /> Live code reviews</li>
                <li className="flex items-center"><Users className="w-3 h-3 mr-2" /> Teaching and mentoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>How It Works</h2>
        <p style={{ color: themeColors.textSecondary }}>
          CodePark uses Conflict-free Replicated Data Types (CRDTs) to synchronize edits across all participants.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-l-4 border-indigo-500 pl-6 py-2">
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>CRDT Synchronization</h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Each participant edits their local view. Changes are broadcast as operations, and all clients apply them to converge to the exact same state without locks or central merging.
            </p>
            <ul className="space-y-1 text-sm" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><Shield className="w-3 h-3 mr-2" style={{ color: themeColors.success }} /> No overwrite conflicts</li>
              <li className="flex items-center"><Shield className="w-3 h-3 mr-2" style={{ color: themeColors.success }} /> Resilient to latency</li>
            </ul>
          </div>

          <div className="border-l-4 border-purple-500 pl-6 py-2">
            <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Yjs Integration</h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              We use Yjs for efficient, low-overhead synchronization. It guarantees automatic conflict resolution and fast local updates.
            </p>
            <ul className="space-y-1 text-sm" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><Zap className="w-3 h-3 mr-2" style={{ color: themeColors.warning }} /> High performance</li>
              <li className="flex items-center"><Zap className="w-3 h-3 mr-2" style={{ color: themeColors.warning }} /> Low network usage</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Behavior & Cursors */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Editing Experience</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Zap className="w-5 h-5" style={{ color: themeColors.success || '#10B981' }} />
              Instant Feedback
            </h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Changes apply locally immediately. You never wait for the server to acknowledge your keystrokes.
            </p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: themeColors.text }}>
              <RefreshCw className="w-5 h-5" style={{ color: themeColors.warning || '#F59E0B' }} />
              Live Updates
            </h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Remote edits appear in real-time. Cursors and selections from other users are shown securely.
            </p>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Users className="w-5 h-5" style={{ color: themeColors.accent || '#EC4899' }} />
              Cursor Tracking
            </h3>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Each user gets a unique color and label. You can see exactly who is editing what line.
            </p>
          </div>
        </div>
      </section>

      {/* Network Resilience */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Network Resilience</h2>

        <div className="rounded-lg border p-6" style={{ borderColor: themeColors.border }}>
          <div className="flex items-start gap-4">
            <Network className="w-6 h-6 mt-1" style={{ color: themeColors.primary }} />
            <div>
              <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.text }}>Offline & Reconnection Tolerance</h3>
              <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
                If you lose connection temporarily, you can keep typing. Edits are queued locally. When connection restores:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm" style={{ color: themeColors.textSecondary }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Queued edits sync automatically
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Changes merge without conflicts
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  No manual recovery needed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Realtime Editing vs. Git</h2>
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
          <table className="w-full text-sm text-left">
            <thead style={{ background: themeColors.cardBg }}>
              <tr>
                <th className="px-6 py-3 font-semibold" style={{ color: themeColors.text }}>Feature</th>
                <th className="px-6 py-3 font-semibold" style={{ color: themeColors.primary }}>Realtime Editing</th>
                <th className="px-6 py-3 font-semibold" style={{ color: themeColors.textSecondary }}>Git Version Control</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: themeColors.border }}>
              {[
                { feature: 'Live collaboration', realtime: '✅ Yes', git: '❌ No' },
                { feature: 'Conflict-free typing', realtime: '✅ Yes', git: '❌ No' },
                { feature: 'History & Rollback', realtime: '❌ Limited', git: '✅ Yes' },
                { feature: 'Offline long-term', realtime: '❌ Limited', git: '✅ Yes' },
              ].map((row, index) => (
                <tr key={row.feature} style={{ background: index % 2 === 0 ? 'transparent' : themeColors.cardBg }}>
                  <td className="px-6 py-3 font-medium" style={{ color: themeColors.text }}>{row.feature}</td>
                  <td className="px-6 py-3" style={{ color: themeColors.textSecondary }}>{row.realtime}</td>
                  <td className="px-6 py-3" style={{ color: themeColors.textSecondary }}>{row.git}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm" style={{ color: themeColors.textSecondary }}>
          Use realtime editing for "now". Use Git for "history".
        </p>
      </section>

      {/* Next Steps */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Next Steps</h2>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
            Explore how collaboration ties into roles and other tools.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate?.('roles-permissions')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Users className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Roles & Permissions</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Who can edit?</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('sessions-presence')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Activity className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.success || '#10B981' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Sessions & Presence</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Collaboration lifecycle</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('terminals')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Terminal className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.accent || '#8B5CF6' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Terminals</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Collaborate on shell</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RealtimeEditing
