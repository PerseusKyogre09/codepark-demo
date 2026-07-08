import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate: (section: string) => void;
}

const DataPrivacy: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>Data Privacy</h1>
      <p style={{ color: themeColors.textSecondary }}>This page explains how CodePark handles your data, including encryption, ownership, and how your code is used (and not used).</p>
      <p style={{ color: themeColors.textSecondary }}>Data privacy is a core principle of CodePark's design.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>CodePark is built for developers, teams, and organizations that care about:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>intellectual property protection</li>
        <li>data confidentiality</li>
        <li>secure collaboration</li>
        <li>transparent data handling</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Your code is your property. CodePark exists to run and collaborate on it—not to claim or repurpose it.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Encryption</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Data in Transit</h3>
      <p style={{ color: themeColors.textSecondary }}>All data transmitted between your browser and CodePark servers is encrypted using TLS 1.3.</p>
      <p style={{ color: themeColors.textSecondary }}>This includes:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>editor traffic</li>
        <li>realtime collaboration data</li>
        <li>file uploads and downloads</li>
        <li>terminal input/output</li>
        <li>execution logs</li>
        <li>AI requests and responses</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>TLS encryption protects against:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>man-in-the-middle attacks</li>
        <li>eavesdropping</li>
        <li>data tampering</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Data at Rest</h3>
      <p style={{ color: themeColors.textSecondary }}>All data stored by CodePark is encrypted at rest using AES-256 encryption.</p>
      <p style={{ color: themeColors.textSecondary }}>This applies to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>project files</li>
        <li>uploaded assets</li>
        <li>configuration data</li>
        <li>session metadata</li>
        <li>backups (where applicable)</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Encryption at rest ensures data remains protected even in the unlikely event of infrastructure compromise.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Code Ownership</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Your Code Is Yours</h3>
      <p style={{ color: themeColors.textSecondary }}>You retain 100% ownership of all code, assets, and data that you:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>write</li>
        <li>upload</li>
        <li>generate</li>
        <li>collaborate on</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>CodePark does not claim any ownership, license, or rights over your private projects.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>No Training on Private Code</h3>
      <p style={{ color: themeColors.textSecondary }}>CodePark does not use your private code or project data to train AI models.</p>
      <p style={{ color: themeColors.textSecondary }}>Specifically:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>private projects are excluded from training</li>
        <li>AI requests are processed only to generate responses</li>
        <li>code context is not retained beyond the request lifecycle</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Your intellectual property remains private.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>AI & Data Usage</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Context usage</h3>
      <p style={{ color: themeColors.textSecondary }}>When you use AI features:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>relevant project context may be sent to AI models</li>
        <li>context is limited to what is necessary for the request</li>
        <li>access is read-only</li>
        <li>context is scoped to your project</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>AI models do not gain persistent access to your data.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Model providers</h3>
      <p style={{ color: themeColors.textSecondary }}>CodePark may route AI requests to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>third-party model providers</li>
        <li>open or proprietary AI models</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>All providers are required to adhere to strict data handling and confidentiality requirements.</p>
      <p style={{ color: themeColors.textSecondary }}>No provider is permitted to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>store your private code</li>
        <li>reuse it for training</li>
        <li>share it externally</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Access Control & Isolation</h2>
      <p style={{ color: themeColors.textSecondary }}>Data access is restricted by:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>project roles (Owner, Editor, Viewer)</li>
        <li>authentication and authorization checks</li>
        <li>execution sandbox boundaries</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Users can only access:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>projects they are explicitly invited to</li>
        <li>files permitted by their role</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>There is no cross-project data access.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Collaboration & Visibility</h2>
      <p style={{ color: themeColors.textSecondary }}>In collaborative sessions:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>only invited participants can see your code</li>
        <li>presence and activity are visible only within the session</li>
        <li>execution output is shared only with collaborators</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>No project content is publicly visible by default.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Data Retention</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Project data</h3>
      <p style={{ color: themeColors.textSecondary }}>Project data is retained as long as:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>the project exists</li>
        <li>the account remains active</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Deleting a project permanently removes:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>source files</li>
        <li>assets</li>
        <li>configuration data</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Temporary data</h3>
      <p style={{ color: themeColors.textSecondary }}>Temporary data such as:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>session assets</li>
        <li>execution artifacts</li>
        <li>runtime logs</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>is automatically cleaned up when sessions end.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>What CodePark Does NOT Do</h2>
      <p style={{ color: themeColors.textSecondary }}>To be explicit, CodePark does not:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>sell your code or data</li>
        <li>analyze private code for marketing</li>
        <li>train AI models on private projects</li>
        <li>expose data to other users</li>
        <li>inspect your code beyond what is required for execution and collaboration</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Transparency matters.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Compliance & Best Practices</h2>
      <p style={{ color: themeColors.textSecondary }}>CodePark follows industry best practices for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>encryption</li>
        <li>access control</li>
        <li>isolation</li>
        <li>data minimization</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Formal compliance certifications may vary by deployment stage and region.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Shared Responsibility</h2>
      <p style={{ color: themeColors.textSecondary }}>While CodePark secures the platform, users are responsible for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>not hardcoding secrets into source files</li>
        <li>managing collaborator access responsibly</li>
        <li>following secure coding practices</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Security works best when shared.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>All data is encrypted in transit (TLS 1.3)</li>
        <li>All data is encrypted at rest (AES-256)</li>
        <li>You retain full ownership of your code</li>
        <li>Private code is never used to train AI models</li>
        <li>Access is role-based and project-scoped</li>
        <li>Temporary data is cleaned up automatically</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>CodePark is designed to respect your privacy and protect your intellectual property by default.</p>

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
            onClick={() => onNavigate('resource-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Resource Limits →
          </button>
          <button
            onClick={() => onNavigate('ai-safety')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            AI Safety & Privacy →
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

export default DataPrivacy;
