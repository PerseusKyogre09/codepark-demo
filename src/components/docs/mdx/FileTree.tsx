import { File, Folder, FolderOpen } from 'lucide-react';

type TreeNode =
  | { type: 'file'; name: string; comment?: string }
  | { type: 'folder'; name: string; comment?: string; children?: TreeNode[] };

interface FileTreeProps {
  nodes: TreeNode[];
  _depth?: number;
}

function TreeNode({ node, depth = 0 }: { node: TreeNode; depth: number }) {
  const indent = depth * 16;

  if (node.type === 'file') {
    return (
      <div className="flex items-center gap-2 py-0.5" style={{ paddingLeft: indent }}>
        <File size={13} className="text-muted-foreground shrink-0" />
        <span className="text-[13px] font-mono text-foreground/80">{node.name}</span>
        {node.comment && (
          <span className="text-[12px] text-muted-foreground/60 italic ml-1">
            ← {node.comment}
          </span>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 py-0.5" style={{ paddingLeft: indent }}>
        {node.children?.length ? (
          <FolderOpen size={13} className="text-primary/70 shrink-0" />
        ) : (
          <Folder size={13} className="text-primary/70 shrink-0" />
        )}
        <span className="text-[13px] font-mono font-medium text-foreground">
          {node.name}/
        </span>
        {node.comment && (
          <span className="text-[12px] text-muted-foreground/60 italic ml-1">
            ← {node.comment}
          </span>
        )}
      </div>
      {node.children?.map((child, i) => (
        <TreeNode key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function FileTree({ nodes }: FileTreeProps) {
  return (
    <div className="my-5 rounded-lg border border-border bg-muted/30 px-4 py-3 overflow-x-auto">
      {nodes.map((node, i) => (
        <TreeNode key={i} node={node} depth={0} />
      ))}
    </div>
  );
}
