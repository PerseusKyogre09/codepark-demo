import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate: (section: string) => void;
}

const AiOverview: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>AI Overview</h1>
      <p style={{ color: themeColors.textSecondary }}>Your intelligent pair programmer in CodePark.</p>
      <p style={{ color: themeColors.textSecondary }}>CodePark includes an integrated AI assistant that helps you write, understand, debug, and improve code directly inside your workspace. The AI is designed to assist—not automate—your development workflow.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>The CodePark AI acts as an intelligent pair programmer that works alongside you inside the editor.</p>
      <p style={{ color: themeColors.textSecondary }}>It is:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>context-aware</li>
        <li>project-aware</li>
        <li>language-aware</li>
        <li>runtime-aware</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>AI assistance is optional, transparent, and always under your control.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Core AI Features</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Code Generation</h3>
      <p style={{ color: themeColors.textSecondary }}>The AI can:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>write functions, classes, and modules</li>
        <li>generate scripts or boilerplate</li>
        <li>scaffold components</li>
        <li>produce example usage or test cases</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Generated code:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>respects your project structure</li>
        <li>matches the selected language and runtime</li>
        <li>is inserted only after your confirmation</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Debugging Help</h3>
      <p style={{ color: themeColors.textSecondary }}>The AI can help debug by:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>explaining compiler and runtime errors</li>
        <li>breaking down stack traces</li>
        <li>suggesting fixes and alternatives</li>
        <li>pointing out common pitfalls</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>You can provide:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>error messages</li>
        <li>logs</li>
        <li>stack traces</li>
        <li>failing code snippets</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Responses focus on understanding first, not blind fixes.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Code Refactoring</h3>
      <p style={{ color: themeColors.textSecondary }}>The AI can refactor code to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>improve readability</li>
        <li>reduce complexity</li>
        <li>optimize performance (when appropriate)</li>
        <li>align with best practices</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Refactoring suggestions:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>preserve behavior</li>
        <li>are presented as diffs or suggestions</li>
        <li>never overwrite your code automatically</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Context Awareness</h3>
      <p style={{ color: themeColors.textSecondary }}>CodePark AI understands:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>the current file</li>
        <li>related files in the project</li>
        <li>folder structure</li>
        <li>language configuration</li>
        <li>runtime constraints</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Context access is read-only and scoped strictly to the active project.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>AI Models Available in CodePark</h2>
      <p style={{ color: themeColors.textSecondary }}>CodePark supports multiple AI model families, selected dynamically based on the task, performance needs, and user plan.</p>
      <p style={{ color: themeColors.textSecondary }}>You are not locked into a single model.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>General-Purpose Large Language Models</h3>
      <p style={{ color: themeColors.textSecondary }}>These models are used for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>reasoning-heavy tasks</li>
        <li>debugging explanations</li>
        <li>refactoring</li>
        <li>multi-file understanding</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Supported families may include:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>GPT (OpenAI)</li>
        <li>Claude (Anthropic)</li>
        <li>Gemini (Google)</li>
        <li>Grok (xAI)</li>
        <li>Qwen (Alibaba)</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Exact variants depend on availability and plan.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Open & Lightweight Models</h3>
      <p style={{ color: themeColors.textSecondary }}>These models are used for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>fast responses</li>
        <li>autocomplete-style assistance</li>
        <li>smaller transformations</li>
        <li>cost-efficient usage</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Supported families may include:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Gemma (Google)</li>
        <li>Qwen (small variants)</li>
        <li>other open-weight or optimized models</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>These prioritize latency and responsiveness over deep reasoning.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Task-Based Model Selection</h3>
      <p style={{ color: themeColors.textSecondary }}>CodePark does not expose raw model switching by default.</p>
      <p style={{ color: themeColors.textSecondary }}>Instead:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>the system selects the most appropriate model per request</li>
        <li>heavy reasoning uses stronger models</li>
        <li>lightweight edits use faster models</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This ensures:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>better performance</li>
        <li>predictable cost</li>
        <li>consistent user experience</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Parker — CodePark's Custom AI Layer</h2>
      <p style={{ color: themeColors.textSecondary }}>Parker is CodePark's custom AI intelligence layer.</p>
      <p style={{ color: themeColors.textSecondary }}>It is not a single foundation model.</p>
      <p style={{ color: themeColors.textSecondary }}>Instead, Parker acts as an orchestrator, router, and safety layer on top of multiple AI models.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>What Parker Does</h3>
      <p style={{ color: themeColors.textSecondary }}>Parker is responsible for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>selecting the best model for each task</li>
        <li>injecting CodePark-specific context</li>
        <li>enforcing permission and scope boundaries</li>
        <li>understanding editor, session, and workspace semantics</li>
        <li>formatting responses for in-editor usage</li>
        <li>preventing unsafe or destructive suggestions</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Think of Parker as the AI system that understands CodePark itself.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Why Parker Exists</h3>
      <p style={{ color: themeColors.textSecondary }}>Generic AI models do not understand:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>realtime collaboration</li>
        <li>sessions vs workspaces</li>
        <li>autosave vs Git</li>
        <li>temporary vs persistent files</li>
        <li>execution limits</li>
        <li>GUI runtimes</li>
        <li>shared terminals</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Parker bridges that gap.</p>
      <p style={{ color: themeColors.textSecondary }}>It ensures AI output is:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>accurate to your environment</li>
        <li>safe to apply</li>
        <li>consistent with how CodePark actually works</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Naming & Identity</h3>
      <p style={{ color: themeColors.textSecondary }}>Parker is intentionally:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>calm</li>
        <li>helpful</li>
        <li>non-authoritative</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>It behaves like a good teammate, not a boss.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Privacy & Data Usage</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Project content is used only to answer your request</li>
        <li>No code is trained on without explicit consent</li>
        <li>Context is limited to the active project</li>
        <li>Private projects remain private</li>
        <li>AI respects project roles and permissions</li>
        <li>AI cannot bypass access control</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>AI in Collaborative Sessions</h2>
      <p style={{ color: themeColors.textSecondary }}>In shared sessions:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>AI responses are visible only to the user who invoked them</li>
        <li>Generated code must be shared manually</li>
        <li>AI does not act on behalf of other users</li>
        <li>AI assistance does not break collaboration boundaries</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>AI Usage & Limits</h2>
      <p style={{ color: themeColors.textSecondary }}>AI usage may be subject to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>request limits</li>
        <li>context size limits</li>
        <li>model availability</li>
        <li>plan-based restrictions</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Typical plan behavior</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Free plan</h4>
          <ul className="space-y-1 text-sm" style={{ color: themeColors.textSecondary }}>
            <li>standard models</li>
            <li>limited requests</li>
            <li>basic context awareness</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2" style={{ color: themeColors.text }}>Pro plan</h4>
          <ul className="space-y-1 text-sm" style={{ color: themeColors.textSecondary }}>
            <li>faster models</li>
            <li>higher limits</li>
            <li>access to advanced reasoning models</li>
            <li>deeper project context</li>
          </ul>
        </div>
      </div>
      <p style={{ color: themeColors.textSecondary }}>Exact limits are shown in the dashboard.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Important Expectations</h2>
      <p style={{ color: themeColors.textSecondary }}>The AI:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>can make mistakes</li>
        <li>does not replace testing</li>
        <li>does not understand business intent automatically</li>
        <li>should be reviewed like a human code suggestion</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>You remain the final decision-maker.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Best Practices</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Ask specific questions</li>
        <li>Include errors or logs when debugging</li>
        <li>Review generated code before running</li>
        <li>Use AI as a learning tool</li>
        <li>Combine AI with debugging and tests</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>CodePark AI is a true pair programmer</li>
        <li>Multiple AI model families are supported</li>
        <li>Models are selected automatically per task</li>
        <li>Parker is CodePark's custom AI orchestration layer</li>
        <li>AI is helpful, optional, and controlled</li>
        <li>The goal is simple: Use the best AI model for the task — without making the developer think about models at all</li>
      </ul>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('usage-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Usage Limits →
          </button>
          <button
            onClick={() => onNavigate('best-practices')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            AI Best Practices →
          </button>
          <button
            onClick={() => onNavigate('running-code')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Code Execution →
          </button>
          <button
            onClick={() => onNavigate('debugging')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Debugging →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiOverview;
