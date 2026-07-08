import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate?: (section: string) => void;
}

const UploadingFiles: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>Uploading Files</h1>
      <p style={{ color: themeColors.textSecondary }}>CodePark allows you to upload local files—such as images, PDFs, datasets, or configuration files—directly into your project workspace.</p>
      <p style={{ color: themeColors.textSecondary }}>Uploaded files become part of your project's filesystem and can be used immediately in code execution, debugging, and collaboration.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>File uploads in CodePark are designed to be:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>simple to use</li>
        <li>instantly available in the editor</li>
        <li>synchronized across collaborators</li>
        <li>compatible with execution and debugging</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Uploads work independently of Git and integrate seamlessly with autosave.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Supported File Types</h2>
      <p style={{ color: themeColors.textSecondary }}>You can upload most common file types, including:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>images (.png, .jpg, .svg)</li>
        <li>documents (.pdf, .txt, .md)</li>
        <li>data files (.json, .csv)</li>
        <li>configuration files (.yaml, .env)</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Binary files are supported, but large or generated artifacts should be uploaded thoughtfully.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Upload Methods</h2>
      <p style={{ color: themeColors.textSecondary }}>CodePark supports two primary ways to upload files.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Drag and Drop</h3>
      <p style={{ color: themeColors.textSecondary }}>Uploading via drag and drop</p>
      <p style={{ color: themeColors.textSecondary }}>To upload files using drag and drop:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Open your project</li>
        <li>Drag one or more files from your local computer</li>
        <li>Drop them into the file explorer panel</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>The files appear immediately in the selected directory.</p>

      <h4 className="text-base font-medium" style={{ color: themeColors.text }}>Behavior</h4>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Upload starts instantly</li>
        <li>Files appear in the file tree once complete</li>
        <li>Collaborators see the new files in real time</li>
        <li>No page refresh is required</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Drag and drop is the fastest way to add files to a project.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>File Picker</h3>
      <p style={{ color: themeColors.textSecondary }}>Uploading via file picker</p>
      <p style={{ color: themeColors.textSecondary }}>To upload using the file picker:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Right-click inside the file explorer</li>
        <li>Select "Upload File"</li>
        <li>Browse your local filesystem</li>
        <li>Select one or more files to upload</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This method is useful when precise file selection is required.</p>

      <h4 className="text-base font-medium" style={{ color: themeColors.text }}>Upload destination</h4>
      <p style={{ color: themeColors.textSecondary }}>Files are uploaded to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>the currently selected folder</li>
        <li>or the project root if no folder is selected</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>You can move or rename files after upload.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>File Persistence</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Autosave integration</h3>
      <p style={{ color: themeColors.textSecondary }}>Uploaded files are:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>persisted automatically</li>
        <li>stored alongside project files</li>
        <li>included in autosave behavior</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>There is no separate "save upload" step.</p>
      <p style={{ color: themeColors.textSecondary }}>Once uploaded, files behave like any other project file.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Temporary vs saved state</h3>
      <p style={{ color: themeColors.textSecondary }}>If you upload files and do not save the project:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>files may exist only for the active session</li>
        <li>temporary files are cleaned up if the session ends</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>When the project is saved:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>uploaded files become persistent</li>
        <li>they remain available across sessions</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This prevents unused uploads from accumulating unnecessarily.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Using Uploaded Files in Code</h2>
      <p style={{ color: themeColors.textSecondary }}>Uploaded files are immediately accessible to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>runtime execution</li>
        <li>debug sessions</li>
        <li>terminal commands</li>
        <li>GUI applications</li>
      </ul>

      <p style={{ color: themeColors.textSecondary }}>Example (Python)</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm" style={{ color: themeColors.text }}>
        <code>with open("data.csv") as f:
          print(f.read())</code>
      </pre>
      <p style={{ color: themeColors.textSecondary }}>Paths are resolved relative to the project root unless otherwise specified.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Collaboration Behavior</h2>
      <p style={{ color: themeColors.textSecondary }}>File uploads are collaborative by default.</p>
      <p style={{ color: themeColors.textSecondary }}>When a collaborator uploads a file:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>all participants see it instantly</li>
        <li>the file appears in the file explorer</li>
        <li>execution contexts update automatically</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Permissions apply:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li><span style={{ color: '#3B82F6' }}>Owners</span> and <span style={{ color: '#10B981' }}>Editors</span> can upload files</li>
        <li><span style={{ color: '#6B7280' }}>Viewers</span> cannot upload or modify files</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Uploading Files Without Git</h2>
      <p style={{ color: themeColors.textSecondary }}>Git is not required to upload files.</p>
      <p style={{ color: themeColors.textSecondary }}>If Git is disabled:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>files are stored via autosave</li>
        <li>uploads persist normally</li>
        <li>collaboration works the same way</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>If Git is enabled:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>uploaded files appear as untracked or modified</li>
        <li>you may choose to commit them manually</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Uploads do not automatically create Git commits.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>File Size & Limits</h2>
      <p style={{ color: themeColors.textSecondary }}>Uploads may be subject to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>file size limits</li>
        <li>total project storage limits</li>
        <li>plan-based restrictions</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>If an upload exceeds limits, CodePark will display a clear error message.</p>
      <p style={{ color: themeColors.textSecondary }}>Large files may impact:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>execution performance</li>
        <li>collaboration responsiveness</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Security & Validation</h2>
      <p style={{ color: themeColors.textSecondary }}>To ensure safety:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>file types are validated on upload</li>
        <li>executable permissions are restricted</li>
        <li>uploaded files are scoped to the project</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Files cannot access:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>other projects</li>
        <li>host system resources</li>
        <li>external user data</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Best Practices</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Upload only files required for your project</li>
        <li>Avoid committing large binaries to Git</li>
        <li>Organize uploads into folders (e.g. assets/, data/)</li>
        <li>Remove unused files to keep projects clean</li>
        <li>Use uploads for input data, not generated output</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Common Issues & Troubleshooting</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>File not appearing</h3>
      <p style={{ color: themeColors.textSecondary }}>Check:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>upload completed successfully</li>
        <li>correct directory was selected</li>
        <li>you have edit permissions</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>File not accessible in code</h3>
      <p style={{ color: themeColors.textSecondary }}>Ensure:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>correct relative path is used</li>
        <li>filename matches exactly (case-sensitive)</li>
        <li>runtime has access to the file</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Upload fails</h3>
      <p style={{ color: themeColors.textSecondary }}>Possible causes:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>file exceeds size limit</li>
        <li>unsupported file type</li>
        <li>network interruption</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Retry or choose a smaller file.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Files can be uploaded via drag-and-drop or file picker</li>
        <li>Uploads are instantly available in the workspace</li>
        <li>Files sync across collaborators</li>
        <li>Persistence depends on project save state</li>
        <li>Git is optional and does not auto-track uploads</li>
        <li>Uploading files makes it easy to bring real-world data into your CodePark projects</li>
      </ul>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate?.('images-pdfs')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Assets & Storage →
          </button>
          <button
            onClick={() => onNavigate?.('running-code')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Using Files in Execution →
          </button>
          <button
            onClick={() => onNavigate?.('execution-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Project Limits →
          </button>
          <button
            onClick={() => onNavigate?.('temporary-saved')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Exporting Projects →
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadingFiles;
