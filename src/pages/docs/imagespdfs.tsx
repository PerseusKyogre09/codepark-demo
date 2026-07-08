import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate?: (section: string) => void;
}

const ImagesPdfs: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>Images & PDFs</h1>
      <p style={{ color: themeColors.textSecondary }}>CodePark provides built-in support for viewing and working with rich media files such as images and PDFs directly inside the editor.</p>
      <p style={{ color: themeColors.textSecondary }}>These files integrate seamlessly with projects, collaboration, execution, and debugging workflows.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>Images and PDFs are treated as project assets in CodePark.</p>
      <p style={{ color: themeColors.textSecondary }}>They can be:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>uploaded to a project</li>
        <li>previewed directly in the editor</li>
        <li>accessed by code at runtime</li>
        <li>shared with collaborators in real time</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>No external viewers or downloads are required.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Supported File Types</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Images</h3>
      <p style={{ color: themeColors.textSecondary }}>CodePark supports previewing common image formats, including:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>PNG (.png)</li>
        <li>JPEG (.jpg, .jpeg)</li>
        <li>SVG (.svg)</li>
        <li>GIF (.gif, where supported)</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Documents</h3>
      <p style={{ color: themeColors.textSecondary }}>For documents, CodePark currently supports:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>PDF (.pdf)</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Other document formats can be uploaded but may not have built-in previews.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Previewing Media Files</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Opening media files</h3>
      <p style={{ color: themeColors.textSecondary }}>To preview an image or PDF:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Upload the file to your project</li>
        <li>Click the file in the file explorer</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>The file opens in a dedicated preview tab, similar to how code files open in editor tabs.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Preview tabs</h3>
      <p style={{ color: themeColors.textSecondary }}>Media preview tabs:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>live alongside code editor tabs</li>
        <li>do not block editing</li>
        <li>can be opened and closed freely</li>
        <li>sync across collaborators</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>You can switch between code and media without leaving the editor.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Image previews</h3>
      <p style={{ color: themeColors.textSecondary }}>Image previews:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>render at native resolution (within viewport limits)</li>
        <li>preserve aspect ratio</li>
        <li>support zooming or scrolling (where applicable)</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>SVG files render as vector graphics and scale cleanly.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>PDF previews</h3>
      <p style={{ color: themeColors.textSecondary }}>PDF previews:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>render page-by-page inside the editor</li>
        <li>support scrolling through pages</li>
        <li>allow zooming for readability</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>PDF rendering is optimized for viewing, not editing.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Collaboration Behavior</h2>
      <p style={{ color: themeColors.textSecondary }}>Media previews are collaborative.</p>
      <p style={{ color: themeColors.textSecondary }}>When a collaborator:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>opens an image or PDF</li>
        <li>uploads or replaces a media file</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Other collaborators:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>see the updated file immediately</li>
        <li>can open the same preview tab</li>
        <li>view identical content</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Permissions apply:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li><span style={{ color: '#3B82F6' }}>Owners</span> and <span style={{ color: '#10B981' }}>Editors</span> can upload or replace media</li>
        <li><span style={{ color: '#6B7280' }}>Viewers</span> can preview media but cannot modify it</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Using Images & PDFs in Code</h2>
      <p style={{ color: themeColors.textSecondary }}>Uploaded media files are accessible to code execution just like any other project file.</p>
      <p style={{ color: themeColors.textSecondary }}>Example (Python – image access)</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm" style={{ color: themeColors.text }}>
        <code>from PIL import Image

          img = Image.open("assets/image.png")
          img.show()</code>
      </pre>
      <p style={{ color: themeColors.textSecondary }}>Example (PDF processing)</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm" style={{ color: themeColors.text }}>
        <code>with open("docs/report.pdf", "rb") as f:
          data = f.read()</code>
      </pre>
      <p style={{ color: themeColors.textSecondary }}>Paths are resolved relative to the project root unless specified otherwise.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Media Files and Execution</h2>
      <p style={{ color: themeColors.textSecondary }}>Media files:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>are mounted into execution environments</li>
        <li>are available during Run and Debug sessions</li>
        <li>can be read or processed by programs</li>
        <li>are accessible from terminals and GUI apps</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This makes CodePark suitable for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>data analysis</li>
        <li>report processing</li>
        <li>image manipulation</li>
        <li>document-driven workflows</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Persistence & Storage Behavior</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Autosave integration</h3>
      <p style={{ color: themeColors.textSecondary }}>Once uploaded:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>images and PDFs are saved automatically</li>
        <li>changes persist across sessions</li>
        <li>files sync across collaborators</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>There is no special save step for media files.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Temporary vs saved assets</h3>
      <p style={{ color: themeColors.textSecondary }}>If media files are uploaded but the project is not saved:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>they may be treated as temporary</li>
        <li>they may be cleaned up when the session ends</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>When the project is saved:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>media files become persistent</li>
        <li>they remain available long-term</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This prevents unused uploads from accumulating.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Images & PDFs with Git</h2>
      <p style={{ color: themeColors.textSecondary }}>Git is optional in CodePark.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Without Git</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>media files persist via autosave</li>
        <li>previews and execution work normally</li>
        <li>no version history is recorded</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>With Git enabled</h3>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>uploaded media files appear as untracked or modified files</li>
        <li>you may choose to commit them manually</li>
        <li>binary files are stored as-is in Git</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>For large or frequently changing media files, committing to Git may not be recommended.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Performance Considerations</h2>
      <p style={{ color: themeColors.textSecondary }}>While previews are optimized, keep in mind:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>very large images may take longer to load</li>
        <li>large PDFs may impact preview performance</li>
        <li>excessive binary assets can affect project size</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>For best performance:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>compress images when possible</li>
        <li>upload only necessary assets</li>
        <li>avoid committing generated media files</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Limitations</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Media files are view-only in the editor</li>
        <li>PDFs cannot be annotated or edited</li>
        <li>Binary diffs are not shown in Git</li>
        <li>Extremely large files may be restricted by plan limits</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>These limitations ensure predictable performance and collaboration.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Best Practices</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Store media files in dedicated folders (e.g. assets/, docs/)</li>
        <li>Use consistent naming conventions</li>
        <li>Avoid overwriting important assets accidentally</li>
        <li>Keep Git commits focused on code when possible</li>
        <li>Clean up unused media to reduce project size</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>CodePark supports built-in previews for images and PDFs</li>
        <li>Media files open in dedicated editor tabs</li>
        <li>Previews sync across collaborators</li>
        <li>Assets are available to execution and debugging</li>
        <li>Git integration is optional and manual</li>
        <li>Images and PDFs integrate naturally into CodePark projects, making it easy to work with real-world data alongside code</li>
      </ul>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate?.('uploading-files')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Assets & Storage →
          </button>
          <button
            onClick={() => onNavigate?.('running-code')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Using Media in Code →
          </button>
          <button
            onClick={() => onNavigate?.('execution-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            File Upload Limits →
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

export default ImagesPdfs;
