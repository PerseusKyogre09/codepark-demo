import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../../contexts/ThemeContext';

interface CodeBlockProps {
  children: string;
  className?: string;
  /** Inline code vs block */
  inline?: boolean;
}

export function CodeBlock({ children, className, inline }: CodeBlockProps) {
  const { settings } = useTheme();
  const isDark = settings.uiTheme === 'dark';
  const [copied, setCopied] = useState(false);

  const language = className?.replace(/^language-/, '') ?? 'text';
  const code = String(children).replace(/\n$/, '');

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded text-[0.8em] font-mono bg-muted text-foreground border border-border">
        {children}
      </code>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-5 rounded-lg overflow-hidden border border-border bg-[#1e1e1e] dark:bg-[#1e1e1e]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/80 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.8125rem',
          lineHeight: 1.7,
        }}
        PreTag="div"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
