import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate?: (section: string) => void;
}

const TemporarySaved: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>Temporary vs Saved Files</h1>
      <p style={{ color: themeColors.textSecondary }}>This page explains how file persistence works in CodePark, including which files are temporary, which are saved permanently, and how data moves between the two.</p>
      <p style={{ color: themeColors.textSecondary }}>Understanding this distinction helps you avoid accidental data loss and design predictable workflows.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>Not all files in CodePark are treated the same.</p>
      <p style={{ color: themeColors.textSecondary }}>Broadly, files fall into two categories:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Session Assets — temporary, session-scoped files</li>
        <li>Persistent Files — saved project files and assets</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>These categories exist to balance:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>performance</li>
        <li>storage efficiency</li>
        <li>user control</li>
        <li>cost predictability</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Session Assets (Temporary Files)</h2>
      <p style={{ color: themeColors.textSecondary }}>Session assets are files created during execution or runtime activity.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Examples of session assets</h3>
      <p style={{ color: themeColors.textSecondary }}>Session assets include:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>program output files</li>
        <li>temporary logs</li>
        <li>runtime-generated data</li>
        <li>cache files</li>
        <li>intermediate build artifacts</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>These files are typically created by:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>running code</li>
        <li>debugging sessions</li>
        <li>terminal commands</li>
        <li>GUI applications</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Where session assets live</h3>
      <p style={{ color: themeColors.textSecondary }}>Session assets are stored in session memory, which is:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>scoped to the active session</li>
        <li>isolated per project</li>
        <li>optimized for fast access</li>
        <li>not guaranteed to persist</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>They exist only while the session is active.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Lifecycle of session assets</h3>
      <p style={{ color: themeColors.textSecondary }}>Session assets:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Are created during execution</li>
        <li>Remain available while the session is active</li>
        <li>Are visible in the file explorer (when applicable)</li>
        <li>Are automatically cleared when the session ends</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This cleanup happens when:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>all participants leave</li>
        <li>no background processes are running</li>
        <li>the session times out</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Promoting session assets</h3>
      <p style={{ color: themeColors.textSecondary }}>If a session-generated file is important, you can promote it to persistent storage.</p>
      <p style={{ color: themeColors.textSecondary }}>Promotion typically happens by:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>moving the file into a project directory</li>
        <li>explicitly saving or renaming it</li>
        <li>copying it into a tracked location</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Once promoted, the file becomes persistent.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Persistent Storage (Saved Files)</h2>
      <p style={{ color: themeColors.textSecondary }}>Persistent files are stored in CodePark's permanent cloud-backed storage.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>What counts as persistent</h3>
      <p style={{ color: themeColors.textSecondary }}>Persistent files include:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>source code files</li>
        <li>configuration files</li>
        <li>uploaded assets (images, PDFs, datasets)</li>
        <li>files created manually in the editor</li>
        <li>files explicitly saved from a session</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>These files persist across:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>sessions</li>
        <li>browser refreshes</li>
        <li>collaborator changes</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Autosave behavior</h3>
      <p style={{ color: themeColors.textSecondary }}>Persistent files are:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>autosaved continuously</li>
        <li>synced across collaborators</li>
        <li>restored automatically when you reopen the project</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>There is no separate "save project" step required for persistence.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Manual save checkpoints</h3>
      <p style={{ color: themeColors.textSecondary }}>Pressing Ctrl + S (or Cmd + S) creates a checkpoint, but:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>it does not change persistence behavior</li>
        <li>it does not affect temporary files</li>
        <li>it simply marks a meaningful project state</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Persistence is automatic regardless of checkpoints.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Visibility in the File Explorer</h2>
      <p style={{ color: themeColors.textSecondary }}>Not all files shown in the file explorer are guaranteed to persist.</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Files in standard project directories are persistent</li>
        <li>Files created in runtime-only locations may be temporary</li>
        <li>Session assets may disappear when the session ends</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>If a file must persist, ensure it is placed in the project's main file structure.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Interaction with Git</h2>
      <p style={{ color: themeColors.textSecondary }}>Persistence and Git are independent concepts.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Without Git</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Persistent files are stored via autosave</li>
        <li>Temporary files are cleaned up automatically</li>
        <li>No version history is maintained</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>With Git enabled</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Persistent files may be committed manually</li>
        <li>Temporary files are not committed</li>
        <li>Git does not affect file lifetime</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Git tracks history, not storage.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Why This Separation Exists</h2>
      <p style={{ color: themeColors.textSecondary }}>Separating temporary and persistent files allows CodePark to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>prevent storage bloat</li>
        <li>clean up unused data automatically</li>
        <li>keep execution fast</li>
        <li>avoid charging users for unnecessary storage</li>
        <li>make behavior predictable</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This design mirrors how local development works (/tmp vs project folders).</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Common Scenarios</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Running a script that generates output</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Output files are temporary</li>
        <li>Save or move them if needed</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Uploading an image or PDF</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>File is persistent immediately</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Downloading data during execution</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Data may be temporary unless saved explicitly</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Creating a new file in the editor</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>File is persistent by default</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Best Practices</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Treat execution output as temporary by default</li>
        <li>Promote important generated files explicitly</li>
        <li>Organize persistent files into clear folders</li>
        <li>Clean up unused session assets</li>
        <li>Don't rely on runtime files for long-term storage</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Common Pitfalls</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Assuming all visible files persist</li>
        <li>Forgetting to save generated artifacts</li>
        <li>Treating session memory as permanent storage</li>
        <li>Expecting Git to save temporary files</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Understanding the distinction avoids surprises.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Session assets are temporary and session-scoped</li>
        <li>Persistent files are autosaved and long-lived</li>
        <li>Temporary files are cleared when sessions end</li>
        <li>Important runtime files must be promoted manually</li>
        <li>Git affects history, not persistence</li>
        <li>CodePark's persistence model is designed to be safe, predictable, and efficient</li>
      </ul>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate?.('running-code')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Execution & Lifecycle →
          </button>
          <button
            onClick={() => onNavigate?.('uploading-files')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Exporting Projects →
          </button>
          <button
            onClick={() => onNavigate?.('execution-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Storage Limits →
          </button>
          <button
            onClick={() => onNavigate?.('without-git')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Git vs Autosave →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemporarySaved;
