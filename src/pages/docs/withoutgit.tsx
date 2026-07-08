import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate?: (section: string) => void;
}

const WithoutGit: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>Using CodePark without Git</h1>
      <p style={{ color: themeColors.textSecondary }}>CodePark is designed to work fully without Git. You can create projects, write code, collaborate, run, and debug applications without ever initializing a repository.</p>
      <p style={{ color: themeColors.textSecondary }}>This page explains how Git-less projects work, how files are stored, and when this mode is most useful.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>Git is a powerful tool, but it is not always necessary.</p>
      <p style={{ color: themeColors.textSecondary }}>In CodePark:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Git is optional</li>
        <li>Projects work perfectly without version control</li>
        <li>Files are saved automatically and securely</li>
        <li>Collaboration behaves the same with or without Git</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This allows you to focus on writing code without worrying about commits, branches, or repositories.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Local-only Mode (Git-less Projects)</h2>
      <p style={{ color: themeColors.textSecondary }}>When you create a Basic project without enabling Git, CodePark runs in local-only mode.</p>
      <p style={{ color: themeColors.textSecondary }}>"Local-only" refers to the project's execution and versioning model, not your physical machine.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>How local-only mode works</h3>
      <p style={{ color: themeColors.textSecondary }}>In local-only mode:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Files are stored in CodePark's secure cloud-backed workspace</li>
        <li>Changes are autosaved continuously</li>
        <li>No .git directory is created</li>
        <li>No commits or branches exist</li>
        <li>No repository metadata is required</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>From the user's perspective, it behaves like a lightweight online editor with execution support.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>What is still available</h3>
      <p style={{ color: themeColors.textSecondary }}>Even without Git, you can:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>create, edit, rename, and delete files</li>
        <li>collaborate in real time</li>
        <li>run and debug code</li>
        <li>use terminals</li>
        <li>upload project assets</li>
        <li>invite collaborators</li>
        <li>share sessions</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Nothing core is removed.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Persistence Without Git</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Autosave</h3>
      <p style={{ color: themeColors.textSecondary }}>All file changes are:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>saved automatically</li>
        <li>synchronized across collaborators</li>
        <li>persisted across sessions</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>There is no need to manually save files to avoid data loss.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Manual checkpoints (Ctrl + S)</h3>
      <p style={{ color: themeColors.textSecondary }}>Pressing Ctrl + S (or Cmd + S) creates a session checkpoint.</p>
      <p style={{ color: themeColors.textSecondary }}>Checkpoints:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>mark intentional states of the project</li>
        <li>help distinguish stable points from intermediate edits</li>
        <li>exist independently of Git</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This provides lightweight versioning without the complexity of Git.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Session history vs Git history</h3>
      <table className="w-full border-collapse border rounded-lg overflow-hidden" style={{ borderColor: themeColors.border }}>
        <thead>
          <tr style={{ background: themeColors.cardBg }}>
            <th className="py-3 px-4 text-left font-bold border-b" style={{ color: themeColors.text, borderColor: themeColors.border }}>Feature</th>
            <th className="py-3 px-4 text-left font-bold border-b" style={{ color: themeColors.text, borderColor: themeColors.border }}>Session History</th>
            <th className="py-3 px-4 text-left font-bold border-b" style={{ color: themeColors.text, borderColor: themeColors.border }}>Git</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ background: themeColors.bg }}>
            <td className="py-3 px-4 border-b font-medium" style={{ color: themeColors.text, borderColor: themeColors.border }}>Always available</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>✅ Yes</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>❌ No</td>
          </tr>
          <tr style={{ background: themeColors.cardBg }}>
            <td className="py-3 px-4 border-b font-medium" style={{ color: themeColors.text, borderColor: themeColors.border }}>Requires setup</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>❌ No</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>✅ Yes</td>
          </tr>
          <tr style={{ background: themeColors.bg }}>
            <td className="py-3 px-4 border-b font-medium" style={{ color: themeColors.text, borderColor: themeColors.border }}>Branching</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>❌ No</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>✅ Yes</td>
          </tr>
          <tr style={{ background: themeColors.cardBg }}>
            <td className="py-3 px-4 border-b font-medium" style={{ color: themeColors.text, borderColor: themeColors.border }}>Long-term history</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>⚠️ Limited</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>✅ Yes</td>
          </tr>
          <tr style={{ background: themeColors.bg }}>
            <td className="py-3 px-4 font-medium" style={{ color: themeColors.text }}>Collaboration support</td>
            <td className="py-3 px-4" style={{ color: themeColors.textSecondary }}>✅ Yes</td>
            <td className="py-3 px-4" style={{ color: themeColors.textSecondary }}>✅ Yes</td>
          </tr>
        </tbody>
      </table>
      <p style={{ color: themeColors.textSecondary }}>Session history is meant for short-term progress, not long-term archival.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>When to Go Git-less</h2>
      <p style={{ color: themeColors.textSecondary }}>Git-less projects are ideal for:</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Coding interviews</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>minimal setup</li>
        <li>no repository management</li>
        <li>focus on problem-solving</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Classroom exercises</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>students don't need Git knowledge</li>
        <li>instructors can observe live</li>
        <li>easy onboarding</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Prototyping & experiments</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>quick idea validation</li>
        <li>throwaway code</li>
        <li>rapid iteration</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Pair programming sessions</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>instant collaboration</li>
        <li>no repository friction</li>
        <li>shared execution state</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>If you don't need long-term history, Git-less mode is often the fastest option.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>When You Might Want Git</h2>
      <p style={{ color: themeColors.textSecondary }}>While Git is optional, there are cases where it becomes useful:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>long-term projects</li>
        <li>tracking changes over time</li>
        <li>branching and experimentation</li>
        <li>syncing with GitHub or GitLab</li>
        <li>preparing production-ready code</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>The good news: you can add Git later.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Enabling Git Later</h2>
      <p style={{ color: themeColors.textSecondary }}>Git can be enabled at any time.</p>
      <p style={{ color: themeColors.textSecondary }}>When you initialize Git:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>your existing files remain unchanged</li>
        <li>version history starts from that point</li>
        <li>autosave continues to work as before</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Git does not replace autosave — it complements it.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Collaboration Without Git</h2>
      <p style={{ color: themeColors.textSecondary }}>Realtime collaboration works identically with or without Git.</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>edits sync instantly</li>
        <li>cursors and selections are shared</li>
        <li>execution output is synchronized</li>
        <li>permissions are enforced the same way</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Git affects history, not collaboration.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Limitations of Git-less Mode</h2>
      <p style={{ color: themeColors.textSecondary }}>Without Git:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>there is no branching</li>
        <li>long-term rollback is limited</li>
        <li>history may be truncated over time</li>
        <li>external repository sync is unavailable</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>For many workflows, these limitations are acceptable or even desirable.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Best Practices</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Use Git-less mode for short-lived work</li>
        <li>Use manual checkpoints for meaningful milestones</li>
        <li>Enable Git only when history matters</li>
        <li>Don't force Git on beginners or interviewees</li>
        <li>Treat Git as a tool, not a requirement</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Git is optional in CodePark</li>
        <li>Git-less projects work fully and reliably</li>
        <li>Files are autosaved and persisted securely</li>
        <li>Session checkpoints provide lightweight history</li>
        <li>Git can be enabled later without disruption</li>
        <li>CodePark lets you choose the right level of complexity for your workflow</li>
      </ul>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate?.('git-basics')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Git Basics in CodePark →
          </button>
          <button
            onClick={() => onNavigate?.('sessions-presence')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Session History →
          </button>
          <button
            onClick={() => onNavigate?.('uploading-files')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Exporting Projects →
          </button>
          <button
            onClick={() => onNavigate?.('realtime-editing')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Collaboration Best Practices →
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithoutGit;
