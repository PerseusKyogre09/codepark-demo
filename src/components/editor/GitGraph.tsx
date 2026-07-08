import { useMemo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { RotateCcw } from 'lucide-react';
import { GitCommit } from '../icons/SvgrepoGitIcons';
import type { Commit } from '../../types';

interface GitGraphProps {
    commits: Commit[];
    onRevert: (hash: string) => void;
    isReverting: boolean;
    themeColors: any;
    formatDate: (date: string) => string;
    sessionId?: string;
}

interface GraphNode {
    commit: Commit;
    x: number;
    y: number;
    color: string;
}

interface GraphLink {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    isMerge: boolean;
}

// Fixed color palette for branches
const BRANCH_COLORS = [
    '#F94144', // Red
    '#F3722C', // Orange
    '#F8961E', // Yellow-Orange
    '#F9C74F', // Yellow
    '#90BE6D', // Green
    '#43AA8B', // Teal
    '#577590', // Blue-Grey
    '#277DA1', // Blue
    '#6D597A', // Purple
    '#B56576', // Rose
];

export function GitGraph({ commits, onRevert, isReverting, themeColors, formatDate, sessionId }: GitGraphProps & { sessionId?: string }) {
    // Constants for layout
    const X_STEP = 14; // Horizontal spacing between columns
    const Y_STEP = 40; // Slightly tighter rows
    const LEFT_PADDING = 10;
    const TOP_OFFSET = 18; // Center of the first row

    const { nodes, links } = useMemo(() => {
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];

        if (commits.length === 0) return { nodes, links };

        // Build commit index
        const commitIndex = new Map<string, number>();
        commits.forEach((commit, idx) => commitIndex.set(commit.hash, idx));

        // Find the main/primary branch by looking at refs
        const findMainBranch = (): string | null => {
            for (const commit of commits) {
                if (!commit.refs) continue;
                const refs = commit.refs.split(',').map(r => r.trim());
                
                // Priority: main > master > origin/main > origin/master > any HEAD
                const mainRef = refs.find(r => r.includes('main') && !r.includes('->'));
                if (mainRef) return 'main';
                
                const masterRef = refs.find(r => r.includes('master') && !r.includes('->'));
                if (masterRef) return 'master';
                
                const headRef = refs.find(r => r.includes('HEAD'));
                if (headRef) {
                    const match = headRef.match(/HEAD\s*->\s*(\w+)/);
                    if (match) return match[1];
                }
            }
            return null;
        };

        const mainBranch = findMainBranch();

        // Track which commits belong to the main branch
        const isOnMainBranch = new Set<string>();
        if (mainBranch) {
            // Walk backwards from commits with main branch ref
            const toProcess: string[] = [];
            
            commits.forEach(commit => {
                if (!commit.refs) return;
                const refs = commit.refs.split(',').map(r => r.trim());
                if (refs.some(r => r.includes(mainBranch))) {
                    toProcess.push(commit.hash);
                }
            });

            while (toProcess.length > 0) {
                const hash = toProcess.pop()!;
                if (isOnMainBranch.has(hash)) continue;
                
                isOnMainBranch.add(hash);
                
                const commit = commits.find(c => c.hash === hash);
                if (!commit) continue;
                
                const parents = commit.parents ? commit.parents.split(' ').filter(p => p.trim()) : [];
                // Only follow first parent for main branch lineage
                if (parents.length > 0) {
                    toProcess.push(parents[0]);
                }
            }
        }

        // Column assignment
        const commitToColumn = new Map<string, number>();
        const columnColors = new Map<number, string>();
        const activeColumns = new Set<number>();

        // Helper to get or assign column
        const getColumn = (hash: string, isMainBranch: boolean, preferredColumn?: number): number => {
            if (commitToColumn.has(hash)) {
                return commitToColumn.get(hash)!;
            }
            
            // Main branch always gets column 0
            if (isMainBranch) {
                commitToColumn.set(hash, 0);
                activeColumns.add(0);
                if (!columnColors.has(0)) {
                    columnColors.set(0, BRANCH_COLORS[0]);
                }
                return 0;
            }
            
            // Try preferred column
            if (preferredColumn !== undefined && !activeColumns.has(preferredColumn)) {
                commitToColumn.set(hash, preferredColumn);
                activeColumns.add(preferredColumn);
                if (!columnColors.has(preferredColumn)) {
                    columnColors.set(preferredColumn, BRANCH_COLORS[preferredColumn % BRANCH_COLORS.length]);
                }
                return preferredColumn;
            }
            
            // Find next available column (skip 0 if not main branch)
            let col = 1;
            while (activeColumns.has(col)) col++;
            
            commitToColumn.set(hash, col);
            activeColumns.add(col);
            if (!columnColors.has(col)) {
                columnColors.set(col, BRANCH_COLORS[col % BRANCH_COLORS.length]);
            }
            
            return col;
        };

        // First pass: assign columns
        commits.forEach((commit) => {
            const isMain = isOnMainBranch.has(commit.hash);
            const parents = commit.parents ? commit.parents.split(' ').filter(p => p.trim()) : [];
            
            // Assign column to current commit
            const colIndex = getColumn(commit.hash, isMain);
            
            if (parents.length === 0) {
                // Root commit
                activeColumns.delete(colIndex);
            } else if (parents.length === 1) {
                // Single parent - continue in same column
                const parent = parents[0];
                const parentIsMain = isOnMainBranch.has(parent);
                if (!commitToColumn.has(parent)) {
                    if (parentIsMain) {
                        commitToColumn.set(parent, 0);
                        activeColumns.add(0);
                    } else {
                        commitToColumn.set(parent, colIndex);
                    }
                }
            } else {
                // Merge commit
                const firstParent = parents[0];
                const firstParentIsMain = isOnMainBranch.has(firstParent);
                
                if (!commitToColumn.has(firstParent)) {
                    if (firstParentIsMain) {
                        commitToColumn.set(firstParent, 0);
                        activeColumns.add(0);
                    } else {
                        commitToColumn.set(firstParent, colIndex);
                    }
                }
                
                // Additional parents get their own columns
                for (let i = 1; i < parents.length; i++) {
                    const parent = parents[i];
                    const parentIsMain = isOnMainBranch.has(parent);
                    if (!commitToColumn.has(parent)) {
                        getColumn(parent, parentIsMain);
                    }
                }
            }
        });

        // Second pass: create nodes and links
        const nodePositions = new Map<string, { x: number; y: number; color: string; colIndex: number }>();

        commits.forEach((commit, index) => {
            const colIndex = commitToColumn.get(commit.hash) ?? 0;
            const color = columnColors.get(colIndex) ?? BRANCH_COLORS[0];
            const x = LEFT_PADDING + colIndex * X_STEP;
            const y = index * Y_STEP + TOP_OFFSET;

            nodePositions.set(commit.hash, { x, y, color, colIndex });
            nodes.push({ commit, x, y, color });
        });

        // Third pass: draw all links
        commits.forEach((commit) => {
            const commitPos = nodePositions.get(commit.hash);
            if (!commitPos) return;

            const parents = commit.parents ? commit.parents.split(' ').filter(p => p.trim()) : [];
            
            parents.forEach((parentHash, parentIndex) => {
                const parentPos = nodePositions.get(parentHash);
                
                if (parentPos) {
                    // Parent already rendered - draw link
                    const isMerge = parentIndex > 0;
                    
                    // Use the parent's color for merge lines, current commit's color for direct lineage
                    const lineColor = isMerge ? parentPos.color : commitPos.color;

                    links.push({
                        x1: commitPos.x,
                        y1: commitPos.y,
                        x2: parentPos.x,
                        y2: parentPos.y,
                        color: lineColor,
                        isMerge
                    });
                } else {
                    // Parent not yet rendered - draw continuation line
                    const parentCol = commitToColumn.get(parentHash);
                    if (parentCol !== undefined) {
                        const parentX = LEFT_PADDING + parentCol * X_STEP;
                        const parentColor = columnColors.get(parentCol) ?? commitPos.color;
                        
                        // For first parent, use current color. For merge parents, use their color
                        const lineColor = parentIndex === 0 ? commitPos.color : parentColor;
                        
                        links.push({
                            x1: commitPos.x,
                            y1: commitPos.y,
                            x2: parentX,
                            y2: commitPos.y + Y_STEP,
                            color: lineColor,
                            isMerge: parentIndex > 0
                        });
                    }
                }
            });
        });

        return { nodes, links };
    }, [commits]);

    // Manage expanded commit for showing details (click instead of hover)
    const [expanded, setExpanded] = useState<string | null>(null);

    // Hover and details state
    const [hovered, setHovered] = useState<string | null>(null);
    const [hoverTimer, setHoverTimer] = useState<number | null>(null);
    const [detailsCache, setDetailsCache] = useState<Record<string, any>>({});
    const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Helper to fetch commit details (cached)
    const fetchCommitDetails = async (hash: string) => {
        if (detailsCache[hash]) return detailsCache[hash];
        try {
            const params = new URLSearchParams();
            if (sessionId) params.set('session_id', sessionId);
            const resp = await fetch(`/api/git/commit/${hash}?${params.toString()}`, { credentials: 'include' });
            if (!resp.ok) return null;
            const data = await resp.json();

            // If diff is present, parse it to extract file list and simple stats
            const diff = data.diff || '';
            const files: Array<{ path: string; insertions: number; deletions: number }> = [];
            let totalIns = 0;
            let totalDel = 0;

            if (diff) {
                // Split by diff header
                const parts = diff.split('\ndiff --git');
                for (const part of parts) {
                    if (!part.trim()) continue;
                    const headerMatch = part.match(/a\/(\S+) b\/(\S+)/);
                    const path = headerMatch ? headerMatch[1] : '(unknown)';

                    let ins = 0;
                    let del = 0;
                    const lines = part.split('\n');
                    for (const l of lines) {
                        if (l.startsWith('+') && !l.startsWith('+++')) ins++;
                        if (l.startsWith('-') && !l.startsWith('---')) del++;
                    }

                    totalIns += ins;
                    totalDel += del;
                    files.push({ path, insertions: ins, deletions: del });
                }
            }

            const enriched = {
                ...data,
                files,
                stats: {
                    files_changed: files.length,
                    insertions: totalIns,
                    deletions: totalDel
                }
            };

            setDetailsCache(prev => ({ ...prev, [hash]: enriched }));
            return enriched;
        } catch (e) {
            return null;
        }
    };



    return (
        <div className="relative">
            {/* SVG Layer for Connections */}
            <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ width: '100%', height: commits.length * Y_STEP }}
            >
                {links.map((link, i) => {
                    // Bezier curve for smoother graph
                    const dy = link.y2 - link.y1;
                    const midY = link.y1 + dy / 2;
                    const path = `M ${link.x1} ${link.y1} C ${link.x1} ${midY}, ${link.x2} ${midY}, ${link.x2} ${link.y2}`;

                    return (
                        <path
                            key={i}
                            d={path}
                            stroke={link.color}
                            strokeWidth="2"
                            fill="none"
                            strokeOpacity={0.6}
                            className="transition-all duration-300"
                        />
                    );
                })}
            </svg>

            {/* Commit List Layer */}
            <div className="relative z-10">
                {nodes.map((node) => {
                    // Parse refs (e.g., "HEAD -> master, origin/master, tag: v1")
                    const refs = node.commit.refs?.split(',').map(r => r.trim()).filter(Boolean) || [];

                    return (
                        <div
                            key={node.commit.hash}
                            ref={(el) => { rowRefs.current[node.commit.hash] = el; }}
                            className={`relative pl-6 py-1 pr-2 hover:bg-white/5 rounded transition-colors group ${expanded === node.commit.hash ? 'bg-white/5' : ''}`}
                            style={{
                                marginLeft: node.x - LEFT_PADDING // Shift content right to make room for graph
                            }}
                            onClick={async () => {
                                setExpanded(prev => prev === node.commit.hash ? null : node.commit.hash);
                                void fetchCommitDetails(node.commit.hash);
                            }}
                            onMouseEnter={() => {
                                if (hoverTimer) window.clearTimeout(hoverTimer);
                                setHovered(node.commit.hash);
                                void fetchCommitDetails(node.commit.hash);
                            }}
                            onMouseLeave={() => {
                                if (hoverTimer) window.clearTimeout(hoverTimer);
                                // small delay to allow entering hover panel
                                const t = window.setTimeout(() => setHovered(null), 120);
                                setHoverTimer(t as unknown as number);
                            }}
                        >
                            {/* Graph Node Dot */}
                            <div
                                className="absolute rounded-full border border-white/20 z-10 transition-transform group-hover:scale-125"
                                style={{
                                    left: - (node.x - LEFT_PADDING) + node.x - 3.5,
                                    top: 12,
                                    width: 7,
                                    height: 7,
                                    backgroundColor: 'transparent',
                                    borderColor: node.color,
                                    borderWidth: 2
                                }}
                            />

                            <div className="flex items-center justify-between min-w-0">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {/* Compact refs badges on left (limit to 2) */}
                                    {refs.slice(0, 2).map((ref, idx) => {
                                        const isHead = ref.includes('HEAD');
                                        const cleanRef = ref.replace('HEAD -> ', '').replace('tag: ', '');
                                        return (
                                            <span
                                                key={idx}
                                                className={`px-1 py-0.5 text-[9px] rounded font-bold border truncate max-w-[90px] ${isHead
                                                    ? 'bg-accent text-white border-accent'
                                                    : 'bg-white/6 text-white/80 border-white/10'
                                                    }`}
                                                style={isHead ? { backgroundColor: themeColors.accent } : {}}
                                            >
                                                {cleanRef.length > 18 ? `${cleanRef.substring(0, 15)}...` : cleanRef}
                                            </span>
                                        );
                                    })}

                                    <span className="text-[10px] font-bold truncate opacity-90">{node.commit.message}</span>

                                    {/* small commit icon */}
                                    <GitCommit size={10} className="opacity-50 ml-1" />
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[9px] font-mono opacity-40">{node.commit.hash.substring(0, 7)}</span>
                                    <span className="text-[9px] opacity-30">{formatDate(node.commit.date)}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRevert(node.commit.hash); }}
                                        disabled={isReverting}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/8 rounded transition-all text-accent"
                                        title="Revert to this commit"
                                    >
                                        <RotateCcw size={12} className={isReverting ? 'animate-spin' : ''} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between opacity-30 text-[9px] font-medium uppercase tracking-wider pl-0.5">
                                <span className="truncate max-w-[100px]">{node.commit.author.split(' ')[0]}</span>
                            </div>

                            {/* Expanded details (click to toggle) */}
                            {expanded === node.commit.hash && (
                                <div className="mt-2 p-2 rounded border border-white/6 bg-black/5 text-sm" style={{ borderColor: themeColors.border }}>
                                    <div className="mb-1 font-bold">{node.commit.message}</div>
                                    <div className="text-xs opacity-70 flex items-center gap-2">
                                        <span className="font-medium">{node.commit.author}</span>
                                        <span className="font-mono text-[10px]">{node.commit.hash}</span>
                                    </div>
                                </div>
                            )}

                            {/* Hover details panel (shows more details and changed files) */}
                            {hovered === node.commit.hash && (() => {
                                const rowEl = rowRefs.current[node.commit.hash];
                                if (!rowEl) return null;
                                const rect = rowEl.getBoundingClientRect();

                                const panelWidth = 320;
                                let left = rect.right + 12;
                                const viewportRight = window.innerWidth - 12;
                                if (left + panelWidth > viewportRight) {
                                    left = rect.left - 12 - panelWidth;
                                }

                                let top = rect.top + window.scrollY - 8; // small offset
                                const viewportBottom = window.scrollY + window.innerHeight - 24;
                                if (top > viewportBottom - 180) top = Math.max(window.scrollY + 12, viewportBottom - 180);

                                return createPortal(
                                    <div
                                        className="w-[320px] p-3 rounded-lg shadow-lg z-50"
                                        style={{ background: themeColors.cardBg, border: `1px solid ${themeColors.border}`, position: 'fixed', left, top }}
                                        onMouseEnter={() => { if (hoverTimer) window.clearTimeout(hoverTimer); setHovered(node.commit.hash); }}
                                        onMouseLeave={() => { const t = window.setTimeout(() => setHovered(null), 120); setHoverTimer(t as unknown as number); }}
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className="flex-1">
                                                {detailsCache[node.commit.hash] ? (
                                                    <>
                                                        <div className="font-bold text-sm">{detailsCache[node.commit.hash].message}</div>
                                                        <div className="text-xs opacity-70 mt-1">{detailsCache[node.commit.hash].author} • {new Date(detailsCache[node.commit.hash].date).toLocaleString()}</div>

                                                        {detailsCache[node.commit.hash].stats && (
                                                            <div className="text-xs mt-2 opacity-80">{detailsCache[node.commit.hash].stats.files_changed} files changed, <span className="text-green-400">+{detailsCache[node.commit.hash].stats.insertions}</span>, <span className="text-red-400">-{detailsCache[node.commit.hash].stats.deletions}</span></div>
                                                        )}

                                                        {detailsCache[node.commit.hash].files && detailsCache[node.commit.hash].files.length > 0 && (
                                                            <div className="mt-2 max-h-40 overflow-auto text-xs border-t border-white/6 pt-2">
                                                                {detailsCache[node.commit.hash].files.map((f: any, i: number) => (
                                                                    <div key={i} className="flex items-center justify-between py-1">
                                                                        <div className="truncate max-w-[220px]">{f.path}</div>
                                                                        <div className="text-[11px] opacity-60 ml-2">{f.insertions ? `+${f.insertions}` : ''}{f.deletions ? ` -${f.deletions}` : ''}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="mt-3 flex items-center gap-2">
                                                            <span className="text-[12px] font-mono opacity-60">{node.commit.hash.substring(0, 7)}</span>
                                                            {detailsCache[node.commit.hash].repo && (
                                                                <a href={`https://github.com/${detailsCache[node.commit.hash].repo}/commit/${node.commit.hash}`} target="_blank" rel="noreferrer" className="text-[12px] opacity-80 hover:underline">Open on GitHub</a>
                                                            )}
                                                            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(node.commit.hash); }} className="ml-auto text-[12px] opacity-70 hover:opacity-100">Copy</button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center justify-center p-6">
                                                        <div className="animate-pulse text-xs opacity-60">Loading...</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>,
                                    document.body
                                );
                            })()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
