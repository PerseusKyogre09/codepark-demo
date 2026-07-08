import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate: (section: string) => void;
}

const ResourceLimits: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>Resource Limits</h1>
      <p style={{ color: themeColors.textSecondary }}>CodePark enforces resource limits to ensure fair usage, predictable performance, and platform stability for all users.</p>
      <p style={{ color: themeColors.textSecondary }}>These limits apply to code execution, debugging, terminals, and GUI applications.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>Every execution environment in CodePark is provisioned with fixed resource quotas.</p>
      <p style={{ color: themeColors.textSecondary }}>Limits exist to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>prevent abuse</li>
        <li>isolate workloads</li>
        <li>ensure fair sharing</li>
        <li>provide consistent performance</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Limits vary by plan.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>CPU Limits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Free Tier</h4>
          <p style={{ color: themeColors.textSecondary }}>1 CPU core</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Pro Tier</h4>
          <p style={{ color: themeColors.textSecondary }}>Up to 4 CPU cores</p>
        </div>
      </div>
      <p style={{ color: themeColors.textSecondary }}>How CPU limits work:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>CPU cores are allocated per execution environment</li>
        <li>Multi-threaded programs are limited by available cores</li>
        <li>CPU-intensive workloads may run slower on Free tier</li>
        <li>If a program exceeds CPU usage limits for an extended period, execution may be throttled or terminated</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Memory (RAM) Limits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Free Tier</h4>
          <p style={{ color: themeColors.textSecondary }}>512 MB RAM</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Pro Tier</h4>
          <p style={{ color: themeColors.textSecondary }}>4 GB RAM</p>
        </div>
      </div>
      <p style={{ color: themeColors.textSecondary }}>Memory behavior:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Memory is strictly capped per execution</li>
        <li>Exceeding the limit results in immediate termination</li>
        <li>Memory is shared across runtime process, libraries, GUI frameworks, and background threads</li>
        <li>Programs with large datasets or heavy GUI frameworks should use Pro tier limits</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Storage Limits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Free Tier</h4>
          <p style={{ color: themeColors.textSecondary }}>100 MB total project storage</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Pro Tier</h4>
          <p style={{ color: themeColors.textSecondary }}>10 GB total project storage</p>
        </div>
      </div>
      <p style={{ color: themeColors.textSecondary }}>What counts toward storage:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Source files</li>
        <li>Uploaded assets (images, PDFs, datasets)</li>
        <li>Persistent configuration files</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Storage does not include:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Temporary session files</li>
        <li>Execution-only artifacts</li>
        <li>Transient logs</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Temporary files are cleaned up automatically.</p>
      <p style={{ color: themeColors.textSecondary }}>Storage behavior:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Storage limits are enforced per project</li>
        <li>Uploads exceeding limits are rejected</li>
        <li>Deleting files immediately frees storage</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Network Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Free Tier</h4>
          <p style={{ color: themeColors.textSecondary }}>Outbound network access blocked</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Pro Tier</h4>
          <p style={{ color: themeColors.textSecondary }}>Outbound network access enabled</p>
        </div>
      </div>
      <p style={{ color: themeColors.textSecondary }}>Network rules:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Outbound network access includes HTTP/HTTPS requests, API calls, package downloads, and external service communication</li>
        <li>Inbound connections are blocked by default on all plans unless explicitly supported</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Why network is restricted on Free tier:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Prevents abuse</li>
        <li>Reduces operational cost</li>
        <li>Improves security</li>
        <li>Ensures predictable behavior</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Pro tier unlocks network access for real-world application development.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Execution Time Limits</h2>
      <p style={{ color: themeColors.textSecondary }}>In addition to resource quotas:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Executions may have time limits</li>
        <li>Long-running or idle processes may be terminated</li>
        <li>Background services may require Pro tier</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Exact time limits may vary by runtime and workload type.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Resource Limits and Collaboration</h2>
      <p style={{ color: themeColors.textSecondary }}>Resource limits apply per execution environment, not per collaborator.</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Adding more collaborators does not increase limits</li>
        <li>All collaborators share the same execution resources</li>
        <li>Limits are enforced consistently across sessions</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>What Happens When Limits Are Exceeded</h2>
      <p style={{ color: themeColors.textSecondary }}>Depending on the resource:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>CPU → execution throttled or stopped</li>
        <li>RAM → immediate termination</li>
        <li>Storage → upload or save blocked</li>
        <li>Network → request denied</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Clear error messages are shown when limits are hit.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Choosing the Right Plan</h2>
      <p style={{ color: themeColors.textSecondary }}>Free Tier is best for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Learning and experimentation</li>
        <li>Interviews and assessments</li>
        <li>Lightweight scripts</li>
        <li>Small projects</li>
        <li>Teaching environments</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Pro Tier is best for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Real applications</li>
        <li>Larger datasets</li>
        <li>GUI-heavy programs</li>
        <li>API-based services</li>
        <li>Performance-sensitive workloads</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Best Practices</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Monitor memory usage in large programs</li>
        <li>Clean up unused files regularly</li>
        <li>Avoid large binary assets on Free tier</li>
        <li>Test network-dependent code on Pro tier</li>
        <li>Optimize algorithms before scaling limits</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Resource limits are enforced for fairness and stability</li>
        <li>CPU, RAM, storage, and network are capped by plan</li>
        <li>Limits apply to execution, debugging, and terminals</li>
        <li>Temporary files do not count toward storage</li>
        <li>Upgrading plans increases available resources</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Understanding resource limits helps you design programs that run reliably in CodePark.</p>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('execution-sandboxing')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Execution Sandboxing →
          </button>
          <button
            onClick={() => onNavigate('data-privacy')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Data Privacy →
          </button>
          <button
            onClick={() => onNavigate('execution-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Execution Limits →
          </button>
          <button
            onClick={() => onNavigate('free-vs-pro')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Free vs Pro →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceLimits;
