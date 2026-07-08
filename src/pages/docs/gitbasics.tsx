import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate?: (section: string) => void;
}

const GitBasics: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>Git Basics</h1>
      <p style={{ color: themeColors.textSecondary }}>CodePark integrates Git directly into the editor UI, allowing you to manage version history without leaving your workspace.</p>
      <p style={{ color: themeColors.textSecondary }}>Git is optional in CodePark. You can use it when you need structured history, branching, or external synchronization.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>Git in CodePark is designed to be:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>explicit (you control when history is created)</li>
        <li>non-intrusive (it does not replace autosave)</li>
        <li>familiar (standard Git concepts and commands)</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>If you've used Git locally, the workflow will feel familiar. If you haven't, CodePark keeps Git usage minimal and approachable.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Git vs Autosave (Important Distinction)</h2>
      <p style={{ color: themeColors.textSecondary }}>Before using Git, it's important to understand how it differs from autosave.</p>
      <table className="w-full border-collapse border rounded-lg overflow-hidden" style={{ borderColor: themeColors.border }}>
        <thead>
          <tr style={{ background: themeColors.cardBg }}>
            <th className="py-3 px-4 text-left font-bold border-b" style={{ color: themeColors.text, borderColor: themeColors.border }}>Feature</th>
            <th className="py-3 px-4 text-left font-bold border-b" style={{ color: themeColors.text, borderColor: themeColors.border }}>Autosave</th>
            <th className="py-3 px-4 text-left font-bold border-b" style={{ color: themeColors.text, borderColor: themeColors.border }}>Git</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ background: themeColors.bg }}>
            <td className="py-3 px-4 border-b font-medium" style={{ color: themeColors.text, borderColor: themeColors.border }}>Always enabled</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>✅ Yes</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>❌ No</td>
          </tr>
          <tr style={{ background: themeColors.cardBg }}>
            <td className="py-3 px-4 border-b font-medium" style={{ color: themeColors.text, borderColor: themeColors.border }}>Saves every change</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>✅ Yes</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>❌ No</td>
          </tr>
          <tr style={{ background: themeColors.bg }}>
            <td className="py-3 px-4 border-b font-medium" style={{ color: themeColors.text, borderColor: themeColors.border }}>Requires messages</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>❌ No</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>✅ Yes</td>
          </tr>
          <tr style={{ background: themeColors.cardBg }}>
            <td className="py-3 px-4 border-b font-medium" style={{ color: themeColors.text, borderColor: themeColors.border }}>Creates long-term history</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>❌ Limited</td>
            <td className="py-3 px-4 border-b" style={{ color: themeColors.textSecondary, borderColor: themeColors.border }}>✅ Yes</td>
          </tr>
          <tr style={{ background: themeColors.bg }}>
            <td className="py-3 px-4 font-medium" style={{ color: themeColors.text }}>Supports branching</td>
            <td className="py-3 px-4" style={{ color: themeColors.textSecondary }}>❌ No</td>
            <td className="py-3 px-4" style={{ color: themeColors.textSecondary }}>✅ Yes</td>
          </tr>
        </tbody>
      </table>
      <p style={{ color: themeColors.textSecondary }}>Autosave protects your work. Git records intentional milestones. They work together, not against each other.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Enabling Git in a Project</h2>
      <p style={{ color: themeColors.textSecondary }}>Git is not enabled by default.</p>
      <p style={{ color: themeColors.textSecondary }}>To enable Git:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Open a project</li>
        <li>Open the Git panel in the sidebar</li>
        <li>Initialize Git for the project</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Once enabled:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>a repository is created for the workspace</li>
        <li>existing files remain unchanged</li>
        <li>version history starts from that point forward</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>You can enable Git at any time.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Common Git Operations</h2>
      <p style={{ color: themeColors.textSecondary }}>CodePark supports the most common Git workflows directly in the UI.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Commit</h3>
      <p style={{ color: themeColors.textSecondary }}>A commit captures a snapshot of your project at a specific point in time.</p>

      <h4 className="text-base font-medium" style={{ color: themeColors.text }}>Creating a commit</h4>
      <p style={{ color: themeColors.textSecondary }}>To commit changes:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Open the Git panel</li>
        <li>Review modified files</li>
        <li>Enter a descriptive commit message</li>
        <li>Click Commit</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Only committed changes become part of Git history.</p>

      <h4 className="text-base font-medium" style={{ color: themeColors.text }}>Commit messages</h4>
      <p style={{ color: themeColors.textSecondary }}>Good commit messages:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>describe what changed</li>
        <li>are short but meaningful</li>
        <li>focus on intent, not implementation details</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Examples:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Add input validation</li>
        <li>Fix null pointer crash</li>
        <li>Refactor API handler</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Push & Pull</h3>
      <p style={{ color: themeColors.textSecondary }}>Git allows synchronization with a remote repository (such as GitHub).</p>

      <h4 className="text-base font-medium" style={{ color: themeColors.text }}>Push</h4>
      <p style={{ color: themeColors.textSecondary }}>Push uploads your local commits to the remote repository.</p>
      <p style={{ color: themeColors.textSecondary }}>Use push when:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>you want to back up commits</li>
        <li>collaborating via GitHub</li>
        <li>sharing code externally</li>
      </ul>

      <h4 className="text-base font-medium" style={{ color: themeColors.text }}>Pull</h4>
      <p style={{ color: themeColors.textSecondary }}>Pull fetches and applies changes from the remote repository.</p>
      <p style={{ color: themeColors.textSecondary }}>Use pull when:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>teammates push new commits</li>
        <li>you want to sync your workspace</li>
        <li>working across multiple environments</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Pulling updates your workspace files automatically.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Revert</h3>
      <p style={{ color: themeColors.textSecondary }}>Revert allows you to undo changes by restoring a previous commit.</p>

      <h4 className="text-base font-medium" style={{ color: themeColors.text }}>How revert works</h4>
      <p style={{ color: themeColors.textSecondary }}>When you revert:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>CodePark resets files to a selected commit state</li>
        <li>the revert itself becomes a new commit</li>
        <li>history remains intact</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This is safer than deleting commits and avoids rewriting history.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Viewing Git History</h2>
      <p style={{ color: themeColors.textSecondary }}>The Git panel displays:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>commit history</li>
        <li>commit messages</li>
        <li>timestamps</li>
        <li>author information</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>You can:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>browse previous commits</li>
        <li>compare changes</li>
        <li>select commits to revert</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>History is project-specific and independent of autosave checkpoints.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Git and Collaboration</h2>
      <p style={{ color: themeColors.textSecondary }}>Git history is shared across collaborators, but:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>commits must be created manually</li>
        <li>only users with edit permissions can commit</li>
        <li>realtime editing works independently of Git</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Multiple users can collaborate live, then commit together intentionally.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Working Without a Remote Repository</h2>
      <p style={{ color: themeColors.textSecondary }}>You can use Git without connecting to GitHub or any remote.</p>
      <p style={{ color: themeColors.textSecondary }}>In this case:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Git history exists only inside CodePark</li>
        <li>commits are stored locally in the workspace</li>
        <li>push/pull is disabled</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This is useful for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>structured local history</li>
        <li>learning Git</li>
        <li>offline-style workflows</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>When to Use Git in CodePark</h2>
      <p style={{ color: themeColors.textSecondary }}>Git is recommended when:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>working on long-term projects</li>
        <li>needing rollback across days or weeks</li>
        <li>collaborating asynchronously</li>
        <li>preparing code for production</li>
        <li>syncing with GitHub or GitLab</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Git is optional for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>interviews</li>
        <li>classroom exercises</li>
        <li>short experiments</li>
        <li>live demos</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Limitations & Notes</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Autosave does not create Git commits</li>
        <li>Git history may be limited based on plan</li>
        <li>Binary assets are not recommended for Git</li>
        <li>Force-push and destructive operations may be restricted</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>These constraints keep Git safe and predictable in collaborative environments.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Best Practices</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Commit only meaningful changes</li>
        <li>Write clear commit messages</li>
        <li>Use autosave for experimentation</li>
        <li>Use Git for milestones</li>
        <li>Avoid committing generated files</li>
        <li>Pull before starting new work</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Git is optional but powerful in CodePark</li>
        <li>Autosave and Git serve different purposes</li>
        <li>Commits capture intentional snapshots</li>
        <li>Push and pull synchronize with remotes</li>
        <li>Revert safely restores previous states</li>
        <li>Git in CodePark gives you structure without friction</li>
      </ul>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate?.('github-sync')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            GitHub Integration →
          </button>
          <button
            onClick={() => onNavigate?.('without-git')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            When to Skip Git →
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

export default GitBasics;
