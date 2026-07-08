import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate: (section: string) => void;
}

const BestPractices: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>AI Best Practices</h1>
      <p style={{ color: themeColors.textSecondary }}>Best practices for using the CodePark AI assistant effectively and responsibly.</p>
      <p style={{ color: themeColors.textSecondary }}>Following these guidelines will help you get higher-quality results while staying in control of your codebase.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>The CodePark AI is a powerful tool, but like any tool, it works best when used thoughtfully.</p>
      <p style={{ color: themeColors.textSecondary }}>These practices will help you:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>get better AI responses</li>
        <li>stay in control of your code</li>
        <li>use your AI quota efficiently</li>
        <li>learn while you work</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Be Specific and Contextual</h2>
      <p style={{ color: themeColors.textSecondary }}>The AI works best when you provide clear, specific information about what you want.</p>
      <p style={{ color: themeColors.textSecondary }}>Include:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>programming language</li>
        <li>specific task or goal</li>
        <li>constraints (performance, readability, safety)</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Example</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2 text-red-500" style={{ color: '#ef4444' }}>❌ Bad prompt</h4>
          <p style={{ color: themeColors.textSecondary }}>"Fix this bug"</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, background: themeColors.cardBg }}>
          <h4 className="font-bold mb-2 text-green-500" style={{ color: '#22c55e' }}>✅ Good prompt</h4>
          <p style={{ color: themeColors.textSecondary }}>"There's a KeyError in user_service.py when accessing user['email']. Can you explain why this happens and suggest a safe fix?"</p>
        </div>
      </div>
      <p style={{ color: themeColors.textSecondary }}>Specific prompts lead to faster, more accurate responses.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Provide Errors and Context</h2>
      <p style={{ color: themeColors.textSecondary }}>When debugging, always include:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>full error messages</li>
        <li>stack traces</li>
        <li>relevant code snippets</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>The AI is much more effective when it can see what actually failed.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Reference Project Structure</h2>
      <p style={{ color: themeColors.textSecondary }}>Because CodePark AI understands project structure, you can reference:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>folders</li>
        <li>related files</li>
        <li>existing modules</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Example:</p>
      <p style={{ color: themeColors.textSecondary }} className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">"Refactor api/routes.py but keep it compatible with middleware/auth.py."</p>
      <p style={{ color: themeColors.textSecondary }}>This helps the AI avoid assumptions and hallucinations.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Review AI-Generated Code Carefully</h2>
      <p style={{ color: themeColors.textSecondary }}>AI-generated code should always be reviewed before running or committing.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Why this matters</h3>
      <p style={{ color: themeColors.textSecondary }}>AI may:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>misunderstand business logic</li>
        <li>suggest insecure patterns</li>
        <li>miss edge cases</li>
        <li>generate code that compiles but behaves incorrectly</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>You are responsible for correctness and security.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>What to check</h3>
      <p style={{ color: themeColors.textSecondary }}>Before using AI-generated code, verify:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>logic correctness</li>
        <li>security implications</li>
        <li>performance impact</li>
        <li>compatibility with your runtime</li>
        <li>alignment with project style</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>If something looks unclear, ask the AI to explain it.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Use AI for the Right Tasks</h2>
      <p style={{ color: themeColors.textSecondary }}>The AI is especially good at:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>explaining errors</li>
        <li>generating boilerplate</li>
        <li>refactoring for clarity</li>
        <li>suggesting alternatives</li>
        <li>learning new APIs or patterns</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>The AI is not ideal for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>final architectural decisions</li>
        <li>production security reviews</li>
        <li>guessing undocumented business rules</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Use it where it adds leverage.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Iterate, Don't One-Shot</h2>
      <p style={{ color: themeColors.textSecondary }}>You don't need a perfect prompt on the first try.</p>
      <p style={{ color: themeColors.textSecondary }}>A good workflow:</p>
      <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Ask a focused question</li>
        <li>Review the response</li>
        <li>Refine or clarify</li>
        <li>Apply selectively</li>
      </ol>
      <p style={{ color: themeColors.textSecondary }}>Treat AI interaction as a conversation, not a command.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Combine AI with Debugging Tools</h2>
      <p style={{ color: themeColors.textSecondary }}>AI works best when combined with:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>breakpoints</li>
        <li>logs</li>
        <li>stack traces</li>
        <li>terminal output</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Use the debugger to observe behavior, then ask the AI why it's happening.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Manage Your AI Usage Wisely</h2>
      <p style={{ color: themeColors.textSecondary }}>Since AI requests are limited:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>avoid repeating similar prompts</li>
        <li>ask multi-part but focused questions</li>
        <li>reuse explanations instead of re-asking</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Efficient prompts stretch your quota further.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Collaboration Considerations</h2>
      <p style={{ color: themeColors.textSecondary }}>In shared sessions:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>AI responses are private by default</li>
        <li>share generated code intentionally</li>
        <li>explain AI suggestions to teammates</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This keeps collaboration transparent and avoids confusion.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Common Mistakes to Avoid</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Blindly running AI-generated code</li>
        <li>Asking vague or context-free questions</li>
        <li>Using AI as a substitute for testing</li>
        <li>Assuming AI understands business intent</li>
        <li>Overusing AI for trivial changes</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>AI is a tool, not a crutch.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Be specific and contextual in prompts</li>
        <li>Include errors and file references</li>
        <li>Always review generated code</li>
        <li>Use AI where it adds the most value</li>
        <li>Combine AI with debugging and testing</li>
        <li>Stay in control of decisions</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Used well, the CodePark AI can significantly speed up development—without sacrificing understanding or quality.</p>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('ai-prompting')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            AI Prompting Guide →
          </button>
          <button
            onClick={() => onNavigate('ai-debugging')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            AI in Debugging →
          </button>
          <button
            onClick={() => onNavigate('ai-safety')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            AI Safety & Guardrails →
          </button>
          <button
            onClick={() => onNavigate('free-vs-pro')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Free vs Pro AI Features →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BestPractices;
