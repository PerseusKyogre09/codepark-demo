import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate?: (section: string) => void;
}

const GitHubSync: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>GitHub Sync</h1>
      <p style={{ color: themeColors.textSecondary }}>GitHub Sync allows you to connect CodePark projects with GitHub repositories, enabling seamless synchronization between your workspace and GitHub.</p>
      <p style={{ color: themeColors.textSecondary }}>This integration is designed to fit naturally into existing Git workflows without forcing you to change how you work.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>With GitHub Sync, you can:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>import repositories from GitHub into CodePark</li>
        <li>push commits from CodePark to GitHub</li>
        <li>pull updates from GitHub into your workspace</li>
        <li>collaborate using both real-time editing and Git-based workflows</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>GitHub Sync builds on top of CodePark's optional Git support and does not replace autosave or collaboration features.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Authentication & Authorization</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>OAuth-based access</h3>
      <p style={{ color: themeColors.textSecondary }}>CodePark uses GitHub OAuth to authenticate and authorize access to repositories.</p>
      <p style={{ color: themeColors.textSecondary }}>When you connect GitHub:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>you are redirected to GitHub for authorization</li>
        <li>CodePark never sees your GitHub password</li>
        <li>permissions are scoped and revocable</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>You remain in full control of access at all times.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Repository access</h3>
      <p style={{ color: themeColors.textSecondary }}>Once authorized, CodePark can access:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>public repositories</li>
        <li>private repositories (with explicit permission)</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>You can revoke access at any time from your GitHub account settings.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Linking a Repository</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Importing from GitHub</h3>
      <p style={{ color: themeColors.textSecondary }}>To link a repository:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Open the Git panel</li>
        <li>Choose Connect to GitHub</li>
        <li>Authenticate via GitHub OAuth</li>
        <li>Select a repository to import</li>
        <li>Choose a branch (default is typically main)</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>The repository is cloned into your CodePark workspace.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>What happens after import</h3>
      <p style={{ color: themeColors.textSecondary }}>After importing:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>files appear in the editor immediately</li>
        <li>Git history is preserved</li>
        <li>autosave continues to work as usual</li>
        <li>collaboration is enabled on top of the repository</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>The workspace behaves like a standard Git clone with additional collaboration features.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Synchronizing Changes</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Push</h3>
      <p style={{ color: themeColors.textSecondary }}>When you push from CodePark:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>committed changes are uploaded to GitHub</li>
        <li>the remote branch is updated</li>
        <li>GitHub reflects the changes instantly</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Push operations require:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>a clean working tree</li>
        <li>proper permissions on the repository</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Pull</h3>
      <p style={{ color: themeColors.textSecondary }}>When you pull from GitHub:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>remote changes are fetched</li>
        <li>updates are applied to your workspace</li>
        <li>files update immediately in the editor</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>If conflicts occur, CodePark surfaces them clearly for resolution.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Realtime Collaboration + GitHub</h2>
      <p style={{ color: themeColors.textSecondary }}>Realtime editing and GitHub Sync work independently but cooperatively.</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Realtime editing synchronizes current file state</li>
        <li>Git records intentional history</li>
        <li>GitHub stores the authoritative remote copy</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Multiple collaborators can edit together, then commit and push as a group.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Branching & Workflow</h2>
      <p style={{ color: themeColors.textSecondary }}>GitHub Sync supports standard Git workflows, including:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>working on the default branch</li>
        <li>pulling remote updates</li>
        <li>pushing local commits</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Advanced workflows such as:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>multiple branches</li>
        <li>rebasing</li>
        <li>pull requests</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>are supported incrementally as features mature.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Pull Requests (Coming Soon)</h2>
      <p style={{ color: themeColors.textSecondary }}>CodePark plans to support GitHub Pull Requests directly in the editor.</p>
      <p style={{ color: themeColors.textSecondary }}>Planned capabilities include:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>creating pull requests</li>
        <li>reviewing diffs</li>
        <li>commenting on changes</li>
        <li>resolving feedback</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Until then, pull requests can be created and reviewed directly on GitHub.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Security Considerations</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>GitHub credentials are never stored in plaintext</li>
        <li>OAuth tokens are scoped and revocable</li>
        <li>Repository access is limited to authorized projects</li>
        <li>All Git operations are executed in isolated environments</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>CodePark does not modify repositories without explicit user action.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Limitations & Notes</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>GitHub Sync requires Git to be enabled in the project</li>
        <li>Push/pull operations may be limited by plan</li>
        <li>Large repositories may take longer to import</li>
        <li>Binary assets are not recommended for Git tracking</li>
        <li>Destructive operations (force-push) may be restricted</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>These limitations help keep collaboration safe and predictable.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Best Practices</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Pull before starting new work</li>
        <li>Commit meaningful changes before pushing</li>
        <li>Use GitHub for long-term collaboration</li>
        <li>Use realtime editing for active sessions</li>
        <li>Avoid committing generated or temporary files</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>GitHub Sync connects CodePark projects to GitHub repositories</li>
        <li>OAuth ensures secure, revocable access</li>
        <li>Push and pull keep CodePark and GitHub in sync</li>
        <li>Realtime collaboration works alongside Git</li>
        <li>Pull Request support is planned</li>
        <li>GitHub Sync lets you combine live collaboration with industry-standard version control</li>
      </ul>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate?.('git-basics')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Git Basics →
          </button>
          <button
            onClick={() => onNavigate?.('realtime-editing')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Branching & Merging →
          </button>
          <button
            onClick={() => onNavigate?.('debugging')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Conflict Resolution →
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
        </div>
      </div>
    </div>
  );
};

export default GitHubSync;
