import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle, XCircle, Shield, Sparkles, Server, Folder, Cpu } from 'lucide-react';

interface Props {
  onNavigate: (section: string) => void;
}

const FreeVsPro = ({ onNavigate }: Props) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>Free vs Pro</h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Choosing the right CodePark plan depends on how deeply you collaborate, how much you execute, and how often you rely on AI assistance.
        </p>
      </div>

      {/* Plan Overview Cards */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border-2" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>Free Plan</h2>
          <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>Perfect for learning and small projects.</p>
          <div className="text-3xl font-bold mb-6" style={{ color: themeColors.text }}>₹0<span className="text-base font-normal opacity-70"> / month</span></div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-sm" style={{ color: themeColors.text }}>
              <CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} /> Unlimited Projects
            </li>
            <li className="flex items-center text-sm" style={{ color: themeColors.text }}>
              <CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} /> 50 AI Requests / day
            </li>
            <li className="flex items-center text-sm" style={{ color: themeColors.text }}>
              <CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.success }} /> Standard Execution
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-lg border-2 relative overflow-hidden" style={{ borderColor: themeColors.primary, background: themeColors.cardBg }}>
          <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg" style={{ background: themeColors.primary }}>MOST POPULAR</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.primary }}>Pro Plan</h2>
          <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>For serious developers and teams.</p>
          <div className="text-3xl font-bold mb-6" style={{ color: themeColors.text }}>₹499<span className="text-base font-normal opacity-70"> / month</span></div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-sm" style={{ color: themeColors.text }}>
              <CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.primary }} /> Everything in Free
            </li>
            <li className="flex items-center text-sm" style={{ color: themeColors.text }}>
              <CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.primary }} /> 250 AI Requests / day
            </li>
            <li className="flex items-center text-sm" style={{ color: themeColors.text }}>
              <CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.primary }} /> High-Perf Execution (4vCPU)
            </li>
            <li className="flex items-center text-sm" style={{ color: themeColors.text }}>
              <CheckCircle className="w-4 h-4 mr-2" style={{ color: themeColors.primary }} /> Persistent Storage (10GB)
            </li>
          </ul>
        </div>
      </section>

      {/* Comparisons */}
      {[
        {
          title: "Plan Comparison Overview",
          icon: <Folder className="w-6 h-6" style={{ color: themeColors.primary }} />,
          headers: ["Feature", "Free", "Pro"],
          rows: [
            ["Active Projects", "Unlimited", "Unlimited"],
            ["Collaborators", "5 / project", "Unlimited"],
            ["Realtime Collab", true, true],
            ["Permissions", "Basic", "Full Control"],
            ["Sessions", "Standard", "Priority"],
          ]
        },
        {
          title: "Execution & Performance",
          icon: <Cpu className="w-6 h-6" style={{ color: themeColors.primary }} />,
          headers: ["Feature", "Free", "Pro"],
          rows: [
            ["CPU", "1 Core", "2 Cores"],
            ["RAM", "1 GB", "4 GB"],
            ["Execution Time", "Limited", "Extended"],
            ["Concurrent Runs", "1", "Multiple"],
            ["GUI Apps (X11)", true, true],
            ["GUI Audio Output", false, true],
          ]
        },
        {
          title: "Storage & Files",
          icon: <Folder className="w-6 h-6" style={{ color: themeColors.primary }} />,
          headers: ["Feature", "Free", "Pro"],
          rows: [
            ["Persistent Storage", "100 MB", "5 GB"],
            ["File Uploads", true, true],
            ["Images & PDF Previews", true, true],
            ["Session Assets", "Temporary", "Temporary"],
            ["Export Projects", "Limited", "Full"],
          ]
        },
        {
          title: "Network & External Access",
          icon: <Shield className="w-6 h-6" style={{ color: themeColors.primary }} />,
          headers: ["Feature", "Free", "Pro"],
          rows: [
            ["Outbound Network Access", false, true],
            ["API Calls", false, true],
            ["Package Installation", "Limited", true],
            ["Hosted App Previews", false, true],
            ["Custom Domains", false, true],
            ["Audit Logs", false, true],
            ["Private Packages", false, true],
          ]
        },
        {
          title: "AI Assistance",
          icon: <Sparkles className="w-6 h-6" style={{ color: themeColors.primary }} />,
          headers: ["Feature", "Free", "Pro"],
          rows: [
            ["AI Requests / Day", "50", "250"],
            ["Standard Models", true, true],
            ["Advanced Models", false, true],
            ["Parker AI Orchestration", true, true],
            ["Project-wide Context", "Limited", "Full"],
            ["AI Debugging Help", true, true],
            ["AI Refactoring", true, true],
          ]
        },
        {
          title: "Git & Version Control",
          icon: <Folder className="w-6 h-6" style={{ color: themeColors.primary }} />,
          headers: ["Feature", "Free", "Pro"],
          rows: [
            ["Git-less Projects", true, true],
            ["Local Git History", true, true],
            ["GitHub Sync", "Limited", true],
            ["Push / Pull", false, true],
            ["Pull Requests (In-Editor)", false, "Planned"],
          ]
        },
        {
          title: "Collaboration & Teaching",
          icon: <Shield className="w-6 h-6" style={{ color: themeColors.primary }} />,
          headers: ["Feature", "Free", "Pro"],
          rows: [
            ["Live Cursor Tracking", true, true],
            ["Shared Terminals", true, true],
            ["Shared Debug Sessions", "Limited", true],
            ["Instructor-style Sessions", false, false],
            ["Viewer-heavy Sessions", false, false],
          ]
        },
        {
          title: "Security & Privacy",
          icon: <Shield className="w-6 h-6" style={{ color: themeColors.primary }} />,
          headers: ["Feature", "Free", "Pro"],
          rows: [
            ["Docker Sandboxing", true, true],
            ["Wasm Sandboxing", true, true],
            ["TLS 1.3 (In Transit)", true, true],
            ["AES-256 (At Rest)", true, true],
            ["Private Code Ownership", true, true],
            ["AI Training on Private Code", "Never", "Never"],
          ]
        },
        {
          title: "Support & Reliability",
          icon: <Server className="w-6 h-6" style={{ color: themeColors.primary }} />,
          headers: ["Feature", "Free", "Pro"],
          rows: [
            ["Community Support", true, true],
            ["Priority Support", false, true],
            ["Execution Priority", "Standard", "High"],
            ["Platform Stability SLA", "Best-effort", "Priority"],
          ]
        }
      ].map((section, idx) => (
        <section key={idx} className="space-y-4">
          <div className="flex items-center gap-2">
            {section.icon}
            <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>{section.title}</h2>
          </div>
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
            <table className="w-full text-sm text-left">
              <thead style={{ background: themeColors.cardBg }}>
                <tr>
                  {section.headers.map((h, i) => (
                    <th key={i} className={`px-6 py-3 font-semibold ${i > 0 ? 'text-center' : ''}`} style={{ color: themeColors.text }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: themeColors.border }}>
                {section.rows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'transparent' : themeColors.cardBg }}>
                    <td className="px-6 py-3 font-medium" style={{ color: themeColors.text }}>{row[0]}</td>
                    <td className="px-6 py-3 text-center" style={{ color: themeColors.textSecondary }}>
                      {typeof row[1] === 'boolean' ? (
                        row[1] ? <CheckCircle className="w-5 h-5 mx-auto" style={{ color: themeColors.success }} /> : <XCircle className="w-5 h-5 mx-auto" style={{ color: themeColors.error }} />
                      ) : row[1]}
                    </td>
                    <td className="px-6 py-3 text-center font-medium" style={{ color: themeColors.text }}>
                      {typeof row[2] === 'boolean' ? (
                        row[2] ? <CheckCircle className="w-5 h-5 mx-auto" style={{ color: themeColors.success }} /> : <XCircle className="w-5 h-5 mx-auto" style={{ color: themeColors.error }} />
                      ) : row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {/* Summary */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: themeColors.text }}>Which plan is right for you?</h2>
        <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
          <div>
            <h3 className="font-bold mb-2" style={{ color: themeColors.text }}>Choose Free if you are:</h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 opacity-70" /> Learning to code</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 opacity-70" /> Doing coding interviews</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 opacity-70" /> Building small web prototypes</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2" style={{ color: themeColors.primary }}>Choose Pro if you are:</h3>
            <ul className="space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Building complex full-stack apps</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Need X11/GUI support</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Need heavy AI assistance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Next Steps</h2>
        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
            Dive deeper into specific limits.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('resource-limits')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Cpu className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Resource Limits</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>CPU, RAM & Disk</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('execution-limits')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Server className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.success || '#10B981' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Execution Limits</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Timeout & Concurrency</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('usage-limits')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.accent || '#8B5CF6' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>AI Usage Policy</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Fair use guidelines</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FreeVsPro;
