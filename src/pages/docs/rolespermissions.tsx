import { useTheme } from '../../contexts/ThemeContext'
import { Crown, Edit, Eye, Shield, Users, CheckCircle, XCircle, ChevronRight, Lock, Activity } from 'lucide-react'

interface Props {
  onNavigate?: (id: string) => void
}

function RolesPermissions({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>Roles & Permissions</h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Roles and permissions define who can access a project and what actions they are allowed to perform.
          They are designed to support everything from solo projects to large collaborative teams.
        </p>
      </div>

      {/* Overview Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Overview: Access Control Model</h2>

        <p style={{ color: themeColors.textSecondary }}>
          Every collaborator in a project is assigned exactly one role. These roles determine what actions a user can perform, what data they can access, and how much control they have over the project. The system is designed to be simple yet flexible enough for most development scenarios.
        </p>

        {/* Roles Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Owner Card */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Crown className="w-5 h-5" style={{ color: themeColors.primary || '#2563EB' }} />
              Owner
            </h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Full administrative control over the project. Can manage settings, delete the project, and control access.
            </p>
            <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: themeColors.textSecondary }}>Perfect For</div>
            <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
              <li>• Project creators</li>
              <li>• Team leads</li>
              <li>• Instructors</li>
            </ul>
          </div>

          {/* Editor Card */}
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Edit className="w-5 h-5" style={{ color: themeColors.success || '#10B981' }} />
              Editor
            </h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Active contributor with full development capabilities. Can edit code, run commands, and debug.
            </p>
            <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: themeColors.textSecondary }}>Perfect For</div>
            <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
              <li>• Developers</li>
              <li>• Active contributors</li>
              <li>• Students</li>
            </ul>
          </div>

          {/* Viewer Card */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Eye className="w-5 h-5" style={{ color: themeColors.accent || '#8B5CF6' }} />
              Viewer
            </h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Read-only access for joining sessions. Can see code and output but cannot make changes.
            </p>
            <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: themeColors.textSecondary }}>Perfect For</div>
            <ul className="text-sm space-y-1" style={{ color: themeColors.textSecondary }}>
              <li>• Reviewers</li>
              <li>• Interviewers</li>
              <li>• Guests</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Detailed Permissions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Detailed Capabilities</h2>

        {/* Owner Permissions */}
        <div className="border-l-4 border-blue-500 pl-6 space-y-2">
          <h3 className="text-xl font-medium" style={{ color: themeColors.text }}>Owner Permissions</h3>
          <p style={{ color: themeColors.textSecondary }}>
            Owners have unrestricted access. They are responsible for the project's lifecycle, billing (if applicable), and team management.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />Read and write all files</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />Run and debug code</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />Manage project settings</li>
            </ul>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />Invite/remove collaborators</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />Delete the project</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />Full access to terminals</li>
            </ul>
          </div>
        </div>

        {/* Editor Permissions */}
        <div className="border-l-4 border-green-500 pl-6 space-y-2">
          <h3 className="text-xl font-medium" style={{ color: themeColors.text }}>Editor Permissions</h3>
          <p style={{ color: themeColors.textSecondary }}>
            Editors can do almost everything needed for daily development work. They cannot perform destructive actions on the project itself.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />Read and write project files</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />Run and debug code</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />Upload project assets</li>
            </ul>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><XCircle className="w-4 h-4 mr-2" style={{ color: themeColors.error }} />Cannot delete the project</li>
              <li className="flex items-center"><XCircle className="w-4 h-4 mr-2" style={{ color: themeColors.error }} />Cannot manage billing</li>
              <li className="flex items-center"><XCircle className="w-4 h-4 mr-2" style={{ color: themeColors.error }} />Cannot remove the Owner</li>
            </ul>
          </div>
        </div>

        {/* Viewer Permissions */}
        <div className="border-l-4 border-purple-500 pl-6 space-y-2">
          <h3 className="text-xl font-medium" style={{ color: themeColors.text }}>Viewer Permissions</h3>
          <p style={{ color: themeColors.textSecondary }}>
            Viewers are observers. This role is safe for showing code to others without risking accidental edits or execution.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />View files and structure</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />Observe real-time edits</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} />Follow cursor activity</li>
            </ul>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><XCircle className="w-4 h-4 mr-2" style={{ color: themeColors.error }} />Cannot edit files</li>
              <li className="flex items-center"><XCircle className="w-4 h-4 mr-2" style={{ color: themeColors.error }} />Cannot run code or commands</li>
              <li className="flex items-center"><XCircle className="w-4 h-4 mr-2" style={{ color: themeColors.error }} />Cannot change settings</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Permission Matrix */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Permission Matrix</h2>
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead style={{ background: themeColors.cardBg }}>
                <tr>
                  <th className="px-6 py-3 font-semibold" style={{ color: themeColors.text }}>Action</th>
                  <th className="px-6 py-3 font-semibold text-center" style={{ color: themeColors.primary }}>Owner</th>
                  <th className="px-6 py-3 font-semibold text-center" style={{ color: themeColors.success }}>Editor</th>
                  <th className="px-6 py-3 font-semibold text-center" style={{ color: themeColors.textSecondary }}>Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: themeColors.border }}>
                {[
                  { action: 'View files', owner: true, editor: true, viewer: true },
                  { action: 'Edit files', owner: true, editor: true, viewer: false },
                  { action: 'Run & Debug', owner: true, editor: true, viewer: false },
                  { action: 'Use Terminal', owner: true, editor: true, viewer: false },
                  { action: 'Manage Collaborators', owner: true, editor: false, viewer: false },
                  { action: 'Project Settings', owner: true, editor: false, viewer: false },
                  { action: 'Delete Project', owner: true, editor: false, viewer: false },
                ].map((row, index) => (
                  <tr key={row.action} className="border-b last:border-0" style={{ borderColor: themeColors.border, background: index % 2 === 0 ? 'transparent' : themeColors.cardBg }}>
                    <td className="px-6 py-3 border-r" style={{ borderColor: themeColors.border, color: themeColors.textSecondary }}>{row.action}</td>
                    <td className="px-6 py-3 text-center border-r" style={{ borderColor: themeColors.border }}>
                      {row.owner ? <CheckCircle className="w-4 h-4 mx-auto" style={{ color: themeColors.success }} /> : <XCircle className="w-4 h-4 mx-auto" style={{ color: themeColors.textSecondary }} opacity={0.3} />}
                    </td>
                    <td className="px-6 py-3 text-center border-r" style={{ borderColor: themeColors.border }}>
                      {row.editor ? <CheckCircle className="w-4 h-4 mx-auto" style={{ color: themeColors.success }} /> : <XCircle className="w-4 h-4 mx-auto" style={{ color: themeColors.textSecondary }} opacity={0.3} />}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {row.viewer ? <CheckCircle className="w-4 h-4 mx-auto" style={{ color: themeColors.success }} /> : <XCircle className="w-4 h-4 mx-auto" style={{ color: themeColors.textSecondary }} opacity={0.3} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Role Assignment */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Managing Roles</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Users className="w-5 h-5" style={{ color: themeColors.warning || '#F59E0B' }} />
              Assigning & Changing Roles
            </h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Roles are assigned when you invite a collaborator via their email or username. Owners can also change the role of any existing collaborator at any time from the share menu.
            </p>
            <ul className="text-sm space-y-2" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Role changes take effect immediately, updating permissions in real-time.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>The interface automatically adapts to show/hide features based on the new role.</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Lock className="w-5 h-5" style={{ color: themeColors.error || '#EF4444' }} />
              Security First
            </h3>
            <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
              Permissions are enforced strictly on the backend. Even if a user could modify the UI, the server will reject any unauthorized actions.
            </p>
            <ul className="text-sm space-y-2" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Follows the principle of least privilege.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Audit logs track who did what and when.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Next Steps</h2>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
            Learn more about how CodePark handles collaboration and security.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate?.('sessions-presence')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Activity className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Sessions & Presence</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Real-time collaboration</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('execution-limits')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Shield className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.success || '#10B981' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Security & Limits</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Resource constraints</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('quick-start')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.accent || '#8B5CF6' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Quick Start</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Start a new project</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RolesPermissions
