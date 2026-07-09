import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { CodeBlock } from './mdx/CodeBlock';
import { Callout, parseBlockquoteCallout } from './mdx/Callout';
import type { ReactNode } from 'react';
import { slugifyHeading } from '../../lib/docs/toc';

// ─── Custom component overrides ───────────────────────────────────────────────

const components: Components = {
  // Code — inline and block
  code({ node: _node, className, children, ...props }) {
    const isInline = !className;
    return (
      <CodeBlock className={className} inline={isInline} {...(props as Record<string, unknown>)}>
        {String(children)}
      </CodeBlock>
    );
  },

  // Headings — auto-anchor IDs for scroll-spy
  h1({ children }) {
    return (
      <h1 className="text-3xl font-bold text-foreground mb-6 mt-8 leading-tight scroll-mt-20">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    const text = extractText(children);
    const id = slugifyHeading(text);
    return (
      <h2 id={id} className="text-xl font-semibold text-foreground mt-10 mb-3 scroll-mt-24 group">
        <a href={`#${id}`} className="no-underline hover:text-primary transition-colors">
          {children}
        </a>
      </h2>
    );
  },
  h3({ children }) {
    const text = extractText(children);
    const id = slugifyHeading(text);
    return (
      <h3 id={id} className="text-base font-semibold text-foreground mt-7 mb-2 scroll-mt-24">
        <a href={`#${id}`} className="no-underline hover:text-primary transition-colors">
          {children}
        </a>
      </h3>
    );
  },
  h4({ children }) {
    return (
      <h4 className="text-sm font-semibold text-foreground mt-5 mb-1.5">
        {children}
      </h4>
    );
  },

  // Paragraph
  p({ children }) {
    return (
      <p className="text-[15px] text-foreground/85 leading-relaxed mb-4">
        {children}
      </p>
    );
  },

  // Links
  a({ href, children }) {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    );
  },

  // Lists
  ul({ children }) {
    return (
      <ul className="my-4 ml-4 space-y-1.5 list-disc list-outside text-[15px] text-foreground/85">
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="my-4 ml-4 space-y-1.5 list-decimal list-outside text-[15px] text-foreground/85">
        {children}
      </ol>
    );
  },
  li({ children }) {
    return <li className="leading-relaxed pl-1">{children}</li>;
  },

  // Blockquote — detect GitHub-style callouts
  blockquote({ children }) {
    const text = extractText(children);
    const parsed = parseBlockquoteCallout(text);
    if (parsed) {
      return (
        <Callout type={parsed.type}>
          <p>{parsed.content}</p>
        </Callout>
      );
    }
    return (
      <blockquote className="my-4 pl-4 border-l-2 border-primary/40 text-muted-foreground italic text-[15px]">
        {children}
      </blockquote>
    );
  },

  // Horizontal rule
  hr() {
    return <hr className="my-8 border-border" />;
  },

  // Table
  table({ children }) {
    return (
      <div className="my-5 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">{children}</table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="bg-muted">{children}</thead>;
  },
  th({ children }) {
    return (
      <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide border-b border-border">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="px-4 py-2.5 text-[13px] text-foreground/80 border-b border-border last:border-b-0">
        {children}
      </td>
    );
  },
  tr({ children }) {
    return (
      <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
    );
  },

  // Strong / em
  strong({ children }) {
    return <strong className="font-semibold text-foreground">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic text-foreground/75">{children}</em>;
  },

  // Image
  img({ src, alt }) {
    return (
      <img
        src={src}
        alt={alt}
        className="my-5 rounded-lg border border-border max-w-full"
        loading="lazy"
      />
    );
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in (children as object)) {
    return extractText((children as { props: { children: ReactNode } }).props.children);
  }
  return '';
}

// ─── Main component ───────────────────────────────────────────────────────────

interface DocMarkdownProps {
  content: string;
}

export function DocMarkdown({ content }: DocMarkdownProps) {
  return (
    <div className="doc-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
