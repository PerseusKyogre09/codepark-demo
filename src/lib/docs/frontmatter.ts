// ─── Frontmatter Parser ──────────────────────────────────────────────────────
// Parses YAML frontmatter from raw markdown strings.
// No external dependencies — keeps the bundle lean.

import type { DocFrontmatter } from './types';

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n?/;

/**
 * Splits raw markdown into frontmatter data + the remaining content body.
 */
export function parseFrontmatter(raw: string): {
  data: DocFrontmatter;
  content: string;
} {
  const match = raw.match(FRONTMATTER_RE);

  if (!match) {
    return { data: { title: '', description: '' }, content: raw };
  }

  const yamlBlock = match[1];
  const content = raw.slice(match[0].length);
  const data = parseYaml(yamlBlock);

  return { data: data as unknown as DocFrontmatter, content };
}

// ─── Minimal YAML parser ─────────────────────────────────────────────────────

function parseYaml(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = yaml.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      i++;
      continue;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) { i++; continue; }

    const key = line.slice(0, colonIdx).trim();
    const rest = line.slice(colonIdx + 1).trim();

    if (rest === '' || rest === '|' || rest === '>') {
      // Might be a block scalar or array — peek next lines
      const subLines: string[] = [];
      i++;
      while (i < lines.length && (lines[i].startsWith('  ') || lines[i].startsWith('\t'))) {
        const item = lines[i].trim();
        if (item.startsWith('- ')) {
          subLines.push(item.slice(2));
        } else {
          subLines.push(item);
        }
        i++;
      }
      if (subLines.length > 0) {
        result[key] = subLines.length === 1 ? subLines[0] : subLines;
      }
    } else {
      result[key] = parseValue(rest);
      i++;
    }
  }

  return result;
}

function parseValue(value: string): unknown {
  // Strip inline comments
  const v = value.split(' #')[0].trim();

  // Quoted string
  if ((v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }

  // Boolean
  if (v === 'true') return true;
  if (v === 'false') return false;

  // Null
  if (v === 'null' || v === '~') return null;

  // Number
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);

  // Inline array
  if (v.startsWith('[') && v.endsWith(']')) {
    return v.slice(1, -1)
      .split(',')
      .map(s => parseValue(s.trim()))
      .filter(Boolean);
  }

  // Plain string (including dates like 2026-07-10)
  return v;
}
