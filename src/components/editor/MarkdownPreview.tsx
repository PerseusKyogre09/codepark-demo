import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X, FileText, Copy } from 'lucide-react';
import { useState, useCallback } from 'react';

// Small copy button used in code blocks
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const doCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            // ignore
        }
    }, [text]);

    return (
        <button onClick={doCopy} title={copied ? 'Copied' : 'Copy code'} className="flex items-center gap-2 text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors" style={{ color: copied ? '#16a34a' : '#586069' }}>
            <Copy size={14} />
            <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
    );
}


export const MarkdownPreview = ({ content, onClose }: { content: string; onClose: () => void }) => (
    <div className="markdown-container border border-gray-200 rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
        <div className="header flex justify-between items-center p-3 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e6e6e6' }}>
            <span className="font-bold text-gray-900 flex items-center gap-2"><FileText size={16} /> Markdown Preview</span>
            <button onClick={onClose} title="Close Preview" className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition-colors flex items-center gap-2"><X size={14} /> Close</button>
        </div>
        <div className="p-6 overflow-auto max-h-[500px]" style={{ color: '#111827', lineHeight: '1.7', backgroundColor: '#ffffff', overscrollBehavior: 'none' }}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0366d6', marginBottom: '1rem', borderBottom: '1px solid #e6e6e6', paddingBottom: '0.5rem' }}>{children}</h1>,
                    h2: ({ children }) => <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22863a', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{children}</h2>,
                    h3: ({ children }) => <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#6f42c1', marginTop: '1rem', marginBottom: '0.5rem' }}>{children}</h3>,
                    h4: ({ children }) => <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#e36209', marginTop: '0.75rem', marginBottom: '0.5rem' }}>{children}</h4>,
                    p: ({ children }) => <p style={{ marginBottom: '1rem' }}>{children}</p>,
                    ul: ({ children }) => <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'disc' }}>{children}</ul>,
                    ol: ({ children }) => <ol style={{ marginLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'decimal' }}>{children}</ol>,
                    li: ({ children }) => <li style={{ marginBottom: '0.25rem' }}>{children}</li>,
                    a: ({ href, children }) => <a href={href} style={{ color: '#60a5fa', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{children}</a>,
                    blockquote: ({ children }) => <blockquote style={{ borderLeft: '4px solid #8b5cf6', paddingLeft: '1rem', marginLeft: '0', marginBottom: '1rem', color: '#a0a0a0', fontStyle: 'italic' }}>{children}</blockquote>,
                    hr: () => <hr style={{ border: 'none', borderTop: '1px solid #e6e6e6', margin: '1.5rem 0' }} />,
                    strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#111827' }}>{children}</strong>,
                    em: ({ children }) => <em style={{ fontStyle: 'italic', color: '#c4b5fd' }}>{children}</em>,
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';

                        // Inline code
                        if (inline || !match) {
                            return (
                                <code style={{ backgroundColor: '#f6f8fa', color: '#24292e', padding: '0.2rem 0.4rem', borderRadius: '6px', fontSize: '0.9em', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace', border: '1px solid #e1e4e8' }} {...props}>
                                    {children}
                                </code>
                            );
                        }

                        // Block code -> render with a GitHub-like container + copy button in light mode
                        const codeString = String(children).replace(/\n$/, '');
                        return (
                            <div style={{ margin: '1rem 0', borderRadius: 8, overflow: 'hidden', border: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0.6rem', background: '#fafbfc', borderBottom: '1px solid #e1e4e8', color: '#586069', fontSize: '0.75rem', fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
                                    <div style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>{language}</div>
                                    <CopyButton text={codeString} />
                                </div>
                                <div style={{ padding: '0.75rem 1rem' }}>
                                    <SyntaxHighlighter
                                        style={oneLight}
                                        language={language}
                                        PreTag="div"
                                        customStyle={{ background: 'transparent', margin: 0, padding: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace', fontSize: '0.95rem' }}
                                        {...props}
                                    >
                                        {codeString}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        );
                    },
                    table: ({ children }) => <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>{children}</table>,
                    th: ({ children }) => <th style={{ border: '1px solid #e1e4e8', padding: '0.5rem', backgroundColor: '#f6f8fa', fontWeight: '600' }}>{children}</th>,
                    td: ({ children }) => <td style={{ border: '1px solid #e1e4e8', padding: '0.5rem' }}>{children}</td>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    </div>
);