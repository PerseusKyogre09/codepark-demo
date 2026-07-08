import { useTheme } from '../../contexts/ThemeContext'
import { Users, Activity, Wifi, Play, Pause, UserCheck, Settings, AlertTriangle, CheckCircle, Terminal, Zap } from 'lucide-react'

interface Props {
  onNavigate?: (id: string) => void
}

function SessionsPresence({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>Sessions & Presence</h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Learn how collaborative sessions work in CodePark, how presence is tracked, and how session lifecycle affects collaboration, execution, and resources.
        </p>
      </div>

      {/* Overview Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Overview: The Session Lifecycle</h2>

        <p style={{ color: themeColors.textSecondary }}>
          A session represents an active, real-time collaborative instance of a project. Unlike the project itself, which is permanent, a session is ephemeral—it exists only while users are working or processes are running.
        </p>

        {/* Lifecycle Stages */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Session Start */}
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Play className="w-5 h-5" style={{ color: themeColors.success || '#10B981' }} />
              Session Start
            </h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Begins when the first user opens the project.
            </p>
            <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" style={{ color: themeColors.success }} />Collab services init</li>
              <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" style={{ color: themeColors.success }} />Editor state active</li>
            </ul>
          </div>

          {/* Active Session */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Activity className="w-5 h-5" style={{ color: themeColors.primary || '#2563EB' }} />
              Active Session
            </h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Remains active while users or processes are present.
            </p>
            <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" style={{ color: themeColors.primary }} />Realtime editing</li>
              <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" style={{ color: themeColors.primary }} />Shared terminals</li>
            </ul>
          </div>

          {/* Pause/Termination */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Pause className="w-5 h-5" style={{ color: themeColors.warning || '#F59E0B' }} />
              Pause/Cleanup
            </h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Occurs when everyone leaves and no jobs are running.
            </p>
            <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" style={{ color: themeColors.warning }} />State released</li>
              <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" style={{ color: themeColors.warning }} />Resources freed</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Presence Tracking */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Presence Tracking</h2>
        <p style={{ color: themeColors.textSecondary }}>
          Presence allows collaborators to see who is currently active in a session. This visual feedback is crucial for coordinating work and avoiding conflicts.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Users className="w-5 h-5" style={{ color: themeColors.primary || '#4F46E5' }} />
              Participant Features
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-1" style={{ color: themeColors.text }}>User List</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  The editor toolbar shows all connected users. Hover over an avatar to see their name and role.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1" style={{ color: themeColors.text }}>Cursor Tracking</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  See exactly where others are typing. Each user has a unique color for their cursor and selection.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Wifi className="w-5 h-5" style={{ color: themeColors.accent || '#8B5CF6' }} />
              Connection States
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-1" style={{ color: themeColors.text }}>Real-time Sync</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  Presence updates instantly using WebSockets. If a user disconnects, their avatar fades immediately.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1" style={{ color: themeColors.text }}>Auto-Reconnect</h4>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  CodePark handles network blips automatically, restoring your session state without manual refreshing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Processes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Background Processes</h2>

        <div className="border-l-4 border-yellow-500 pl-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-medium mb-2" style={{ color: themeColors.text }}>Keeping Sessions Alive</h3>
              <p style={{ color: themeColors.textSecondary }}>
                Normally, a session ends when the last user leaves. However, certain background activities can keep a session "alive" even without active users.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: themeColors.border }}>
              <Terminal className="w-5 h-5" style={{ color: themeColors.textSecondary }} />
              <span className="text-sm font-medium" style={{ color: themeColors.text }}>Active Terminals</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: themeColors.border }}>
              <Play className="w-5 h-5" style={{ color: themeColors.success }} />
              <span className="text-sm font-medium" style={{ color: themeColors.text }}>Running Servers</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: themeColors.border }}>
              <Zap className="w-5 h-5" style={{ color: themeColors.warning }} />
              <span className="text-sm font-medium" style={{ color: themeColors.text }}>Debug Sessions</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: themeColors.border }}>
              <Activity className="w-5 h-5" style={{ color: themeColors.primary }} />
              <span className="text-sm font-medium" style={{ color: themeColors.text }}>GUI Apps</span>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Troubleshooting</h2>

        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
            <AlertTriangle className="w-5 h-5" style={{ color: themeColors.error || '#EF4444' }} />
            Common Issues
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm mb-2" style={{ color: themeColors.text }}>Session Unexpectedly Ended</h4>
              <p className="text-sm mb-2" style={{ color: themeColors.textSecondary }}>Often caused by idle timeouts:</p>
              <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: themeColors.textSecondary }}>
                <li>All users disconnected for too long</li>
                <li>No background processes running</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2" style={{ color: themeColors.text }}>Participant Not Visible</h4>
              <p className="text-sm mb-2" style={{ color: themeColors.textSecondary }}>Check your connection:</p>
              <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: themeColors.textSecondary }}>
                <li>Are you in the same project?</li>
                <li>Is your network blocking WebSockets?</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Next Steps</h2>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
            Now that you understand sessions, learn how to manage them effectively.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate?.('realtime-editing')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <UserCheck className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Inviting Collaborators</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Add team members</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('running-code')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.success || '#10B981' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Execution & Lifecycle</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Run your code</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('execution-limits')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Settings className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.warning || '#F59E0B' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Limits & Plans</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Resource management</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SessionsPresence
