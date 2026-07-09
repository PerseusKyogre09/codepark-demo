import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface TerminalBlockProps {
  children: string;
  prompt?: string;
}

export function TerminalBlock({ children, prompt = '$' }: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-lg overflow-hidden border border-border bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2 text-[11px] text-white/40">
          <Terminal size={12} />
          <span>Terminal</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors"
          aria-label="Copy command"
        >
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3 font-mono text-[0.8125rem] leading-relaxed">
        {String(children)
          .split('\n')
          .map((line, i) => (
            <div key={i} className="flex gap-2">
              {!line.startsWith('#') && (
                <span className="text-green-400 select-none">{prompt}</span>
              )}
              <span
                className={
                  line.startsWith('#')
                    ? 'text-white/30 italic'
                    : 'text-white/90'
                }
              >
                {line}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
