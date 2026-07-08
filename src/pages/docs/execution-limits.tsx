import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate: (section: string) => void;
}

const ExecutionLimits: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>Execution Limits</h1>
      <p style={{ color: themeColors.textSecondary }}>Execution limits define how long code is allowed to run in CodePark before it is automatically terminated.</p>
      <p style={{ color: themeColors.textSecondary }}>These limits ensure fair usage, platform stability, and predictable behavior for all users.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>Every execution in CodePark runs with a maximum allowed duration.</p>
      <p style={{ color: themeColors.textSecondary }}>Execution limits apply to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>program runs</li>
        <li>debug sessions</li>
        <li>terminal commands</li>
        <li>background processes</li>
        <li>GUI applications</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Limits vary by plan.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Execution Timeout</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Free Tier</h4>
          <p style={{ color: themeColors.textSecondary }}>Maximum execution time: 5 minutes</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Pro Tier</h4>
          <p style={{ color: themeColors.textSecondary }}>Maximum execution time: 60 minutes</p>
        </div>
      </div>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>What the timeout means</h3>
      <p style={{ color: themeColors.textSecondary }}>The timeout measures continuous execution time from the moment a process starts.</p>
      <p style={{ color: themeColors.textSecondary }}>If the process:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>runs continuously beyond the limit</li>
        <li>does not exit naturally</li>
        <li>remains active without terminating</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>it will be automatically stopped.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>What happens when the timeout is reached</h3>
      <p style={{ color: themeColors.textSecondary }}>When a timeout occurs:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>the process is terminated</li>
        <li>execution output stops</li>
        <li>the sandboxed environment is cleaned up</li>
        <li>a timeout message is shown in the terminal</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>No partial state is preserved unless files were explicitly saved.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>What Counts as Execution Time</h2>
      <p style={{ color: themeColors.textSecondary }}>Execution time includes:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>active CPU usage</li>
        <li>sleeping or waiting processes</li>
        <li>GUI event loops</li>
        <li>servers waiting for input</li>
        <li>background threads</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Idle processes still count toward the timeout.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Timeouts and Background Processes</h2>
      <p style={{ color: themeColors.textSecondary }}>Background processes:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>do not bypass execution limits</li>
        <li>are terminated when the timeout is reached</li>
        <li>cannot persist indefinitely</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Long-running services are intentionally restricted.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Execution Limits and Collaboration</h2>
      <p style={{ color: themeColors.textSecondary }}>Execution limits apply:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>per execution environment</li>
        <li>regardless of number of collaborators</li>
        <li>equally to all users in a session</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Adding collaborators does not extend execution time.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Common Scenarios</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Long-running scripts</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Will be terminated after the time limit</li>
        <li>Save intermediate results explicitly</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Web servers or daemons</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Not suitable for Free tier</li>
        <li>Require Pro tier and time-aware design</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>GUI applications</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Must complete or be closed before timeout</li>
        <li>Idle GUI windows still count as running</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Why Execution Limits Exist</h2>
      <p style={{ color: themeColors.textSecondary }}>Execution time limits help:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>prevent resource exhaustion</li>
        <li>stop runaway processes</li>
        <li>control infrastructure cost</li>
        <li>ensure fair usage across users</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This mirrors limits commonly found in CI systems and online sandboxes.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Best Practices</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Design scripts to complete within limits</li>
        <li>Save outputs periodically</li>
        <li>Avoid infinite loops</li>
        <li>Close GUI applications when finished</li>
        <li>Use Pro tier for long-running tasks</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>What Execution Limits Do NOT Affect</h2>
      <p style={{ color: themeColors.textSecondary }}>Execution limits do not:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>delete saved project files</li>
        <li>affect autosaved code</li>
        <li>remove uploaded assets</li>
        <li>alter Git history</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Only the running process is terminated.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Execution time is capped per run</li>
        <li>Free tier: 5 minutes</li>
        <li>Pro tier: 60 minutes</li>
        <li>Idle time still counts</li>
        <li>Background processes are not exempt</li>
        <li>Files persist if saved explicitly</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Execution limits keep CodePark fast, fair, and predictable.</p>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('resource-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Resource Limits →
          </button>
          <button
            onClick={() => onNavigate('execution-sandboxing')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Execution Sandboxing →
          </button>
          <button
            onClick={() => onNavigate('running-code')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Running Code →
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

export default ExecutionLimits;
