// ─── Reading Time Calculator ─────────────────────────────────────────────────

const WORDS_PER_MINUTE = 200;

/**
 * Strips markdown syntax and returns a human-readable reading time estimate.
 */
export function calculateReadingTime(content: string): string {
  // Strip markdown: headings, bold, italic, links, code, images, html
  const text = content
    .replace(/```[\s\S]*?```/g, '')   // fenced code blocks
    .replace(/`[^`]*`/g, '')          // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')  // images
    .replace(/\[.*?\]\(.*?\)/g, '$1') // links → label
    .replace(/^#+\s+/gm, '')          // headings
    .replace(/[*_~>|]/g, '')          // markdown chars
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = text.split(' ').filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return `${minutes} min read`;
}
