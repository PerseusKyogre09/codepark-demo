import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, Trash2, Edit2, FolderPlus, RefreshCw, FileText, Search, GitBranch, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSession } from '../../contexts/SessionContext';
import { useSocket } from '../../contexts/SocketContext';
import { getboilerplate } from '../../utils/fileBoilerplate';
import { getSVGRepoIconUrl } from '../../utils/svgRepoIcons';
import { useMobile } from '../../hooks/useMobile';
import { apiClient } from '../../services/api';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

interface CreateDialogState {
  isOpen: boolean;
  type: 'file' | 'folder';
  parentPath: string;
}

interface RenameDialogState {
  isOpen: boolean;
  path: string;
  currentName: string;
  type: 'file' | 'folder';
}

interface DeleteDialogState {
  isOpen: boolean;
  path: string;
  name: string;
  type: 'file' | 'folder';
}



// Allowed file types are now handled by the backend and viewers.
// We no longer strictly block these in the frontend, but we might warn or limit size if needed.
const blockfile: string[] = [
  // Executables (still good to block)
  '.exe', '.bin', '.dll', '.so', '.dylib', '.msi', '.deb', '.rpm', '.apk', '.ipa',
  // Large archives/disk images might still be blocked if too big, but for now we unblock common ones if needed
  // keeping potentially dangerous or huge ones blocked
  '.iso', '.img', '.vhd', '.vmdk', '.vdi',
  '.class', '.pyc', '.pyo', '.o', '.a', '.lib', '.jar', '.war', '.ear'
];



interface FileExplorerProps {
  onClose?: () => void;
}

export function FileExplorer({ onClose }: FileExplorerProps = {}) {
  const { settings, themeColors } = useTheme();
  const { session, clientIdentity, canEdit, isReadOnly, openFileInTab, currentBranch } = useSession();
  const { socket, isConnected } = useSocket();
  const { isMobile } = useMobile();

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [createDialog, setCreateDialog] = useState<CreateDialogState>({ isOpen: false, type: 'file', parentPath: '' });
  const [renameDialog, setRenameDialog] = useState<RenameDialogState>({ isOpen: false, path: '', currentName: '', type: 'file' });
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ isOpen: false, path: '', name: '', type: 'file' });

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [serviceBoundaries, setServiceBoundaries] = useState<Array<{ name: string; root: string; type: string }>>([]);

  useEffect(() => {
    if (!session?.id) return;
    let isMounted = true;
    apiClient.getContextFingerprint(session.id)
      .then(data => {
        if (isMounted) {
          setServiceBoundaries(data.service_boundaries || []);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [session?.id]);

  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Refresh files from disk (for terminal-created files)
  const handleRefresh = () => {
    if (!socket || !session || isRefreshing) return;

    setIsRefreshing(true);
    socket.emit('refresh_files', { session_id: session.id });

    // Reset after a timeout (socket response will also hide it)
    setTimeout(() => setIsRefreshing(false), 3000);
  };



  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !session) return;


    //getting loop for filecheck
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i].name.toLowerCase();         //convrrtys toi lowercase for simplicity
      if (blockfile.some(ext => fileName.endsWith(ext))) {
        alert("Sorry, You cannot upload this file..")
        return;
      }
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('session_id', session.id);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('/upload_file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  // Build file tree from session files
  const fileTree = useMemo(() => {
    if (!session?.files) return [];

    const tree: FileNode[] = [];
    const folderMap = new Map<string, FileNode>();

    // Sort paths to ensure folders are created before their contents
    const sortedPaths = Object.keys(session.files).sort();

    sortedPaths.forEach((path) => {
      const parts = path.split('/');
      const fileName = parts[parts.length - 1];

      // Create folder nodes for all parent folders
      let currentPath = '';
      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i];
        const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName;

        if (!folderMap.has(folderPath)) {
          const folderNode: FileNode = {
            name: folderName,
            path: folderPath,
            type: 'folder',
            children: [],
          };

          if (currentPath === '') {
            tree.push(folderNode);
          } else {
            const parentFolder = folderMap.get(currentPath);
            if (parentFolder && parentFolder.children) {
              parentFolder.children.push(folderNode);
            }
          }

          folderMap.set(folderPath, folderNode);
        }

        currentPath = folderPath;
      }

      // Create file node
      if (fileName !== '.gitkeep') {
        const fileNode: FileNode = {
          name: fileName,
          path: path,
          type: 'file',
        };


        if (parts.length === 1) {
          // Root level file
          tree.push(fileNode);
        } else {
          // File inside folder
          const parentPath = parts.slice(0, -1).join('/');
          const parentFolder = folderMap.get(parentPath);
          if (parentFolder && parentFolder.children) {
            parentFolder.children.push(fileNode);
          }
        }
      }
    });


    return tree;
  }, [session?.files]);

  // Filter tree based on search query
  const filteredFileTree = useMemo(() => {
    if (!searchQuery.trim()) return fileTree;
    const query = searchQuery.toLowerCase();

    const filterNode = (node: FileNode): FileNode | null => {
      if (node.type === 'file') {
        return node.name.toLowerCase().includes(query) ? node : null;
      }
      if (node.children) {
        const filteredChildren = node.children
          .map(filterNode)
          .filter((n): n is FileNode => n !== null);
        if (filteredChildren.length > 0 || node.name.toLowerCase().includes(query)) {
          return {
            ...node,
            children: filteredChildren,
          };
        }
      }
      return null;
    };

    return fileTree.map(filterNode).filter((n): n is FileNode => n !== null);
  }, [fileTree, searchQuery]);

  // Listen for file system events from realtime websocket
  useEffect(() => {
    if (!socket) return;

    const handleFileCreated = (data: { file_name: string; content?: string; creator_id?: string; should_open?: boolean }) => {
      console.log('[FileExplorer] File created:', data.file_name);

      // Auto-expand parent folders
      const parts = data.file_name.split('/');
      if (parts.length > 1) {
        const newExpanded = new Set(expanded);
        let currentPath = '';
        for (let i = 0; i < parts.length - 1; i++) {
          currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
          newExpanded.add(currentPath);
        }
        setExpanded(newExpanded);
      }
    };

    const handleFolderCreated = (data: { folder_path: string }) => {
      console.log('[FileExplorer] Folder created:', data.folder_path);

      // Auto-expand parent folders
      const parts = data.folder_path.split('/');
      if (parts.length > 1) {
        const newExpanded = new Set(expanded);
        let currentPath = '';
        for (let i = 0; i < parts.length - 1; i++) {
          currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
          newExpanded.add(currentPath);
        }
        setExpanded(newExpanded);
      }
    };

    const handleFileDeleted = (data: { file_name?: string; deleted_file?: string; new_active_file?: string }) => {
      const deletedPath = data.file_name || data.deleted_file;
      if (!deletedPath) {
        console.warn('[FileExplorer] File deleted event missing path payload:', data);
        return;
      }

      console.log('[FileExplorer] File deleted:', deletedPath);
      if (selectedPath === deletedPath) {
        setSelectedPath(null);
      }
    };

    const handleFileRenamed = (data: { old_name: string; new_name: string }) => {
      console.log('[FileExplorer] File renamed:', data.old_name, '->', data.new_name);
      if (selectedPath === data.old_name) {
        setSelectedPath(data.new_name);
      }
    };

    const handleFolderMoved = (data: { renamed_files?: Record<string, string>; source_folder?: string; new_folder_path?: string }) => {
      console.log('[FileExplorer] Folder moved:', data);

      // Update selected path if it was in the moved folder
      if (data.renamed_files && selectedPath) {
        if (selectedPath in data.renamed_files) {
          setSelectedPath(data.renamed_files[selectedPath]);
        }
      }

      // Auto-expand the new folder location
      if (data.new_folder_path) {
        const parts = data.new_folder_path.split('/');
        const newExpanded = new Set(expanded);
        let currentPath = '';
        for (let i = 0; i < parts.length; i++) {
          currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
          newExpanded.add(currentPath);
        }
        setExpanded(newExpanded);
      }
    };

    // Handle files_refreshed event to stop the spinner
    const handleFilesRefreshed = () => {
      console.log('[FileExplorer] Files refreshed');
      setIsRefreshing(false);
    };

    socket.on('file_created', handleFileCreated);
    socket.on('folder_created', handleFolderCreated);
    socket.on('file_deleted', handleFileDeleted);
    socket.on('file_renamed', handleFileRenamed);
    socket.on('folder_moved', handleFolderMoved);
    socket.on('files_refreshed', handleFilesRefreshed);

    return () => {
      socket.off('file_created', handleFileCreated);
      socket.off('folder_created', handleFolderCreated);
      socket.off('file_deleted', handleFileDeleted);
      socket.off('file_renamed', handleFileRenamed);
      socket.off('folder_moved', handleFolderMoved);
      socket.off('files_refreshed', handleFilesRefreshed);
    };
  }, [socket, expanded, selectedPath]);

  // Listen for trigger_new_file_dialog event from TopMenuBar
  useEffect(() => {
    const handleTriggerNewFile = () => {
      if (canEdit) {
        openCreateDialog('file', '');
      }
    };

    window.addEventListener('trigger_new_file_dialog', handleTriggerNewFile);
    return () => {
      window.removeEventListener('trigger_new_file_dialog', handleTriggerNewFile);
    };
  }, [canEdit]);

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const handleFileClick = (path: string) => {
    setSelectedPath(path);
    openFileInTab(path);
  };

  const openCreateDialog = (type: 'file' | 'folder', parentPath: string = '') => {
    if (!canEdit) return;
    setCreateDialog({ isOpen: true, type, parentPath });
    setInputValue('');
  };

  const closeCreateDialog = () => {
    setCreateDialog({ isOpen: false, type: 'file', parentPath: '' });
    setInputValue('');
  };

  const handleCreate = () => {
    if (!socket || !session || !inputValue.trim() || !canEdit || !clientIdentity) return;

    const name = inputValue.trim();
    const fullPath = createDialog.parentPath ? `${createDialog.parentPath}/${name}` : name;

    if (createDialog.type === 'file') {
      socket.emit('create_file', {
        session_id: session.id,
        file_name: fullPath,
        user_id: clientIdentity.id,
        file_content: getboilerplate(fullPath),
      });
    } else {
      socket.emit('create_folder', {
        session_id: session.id,
        folder_name: fullPath,
        folder_path: fullPath,
      });
    }

    closeCreateDialog();
  };

  const openRenameDialog = (path: string, currentName: string, type: 'file' | 'folder') => {
    if (!canEdit) return;
    setRenameDialog({ isOpen: true, path, currentName, type });
    setInputValue(currentName);
  };

  const closeRenameDialog = () => {
    setRenameDialog({ isOpen: false, path: '', currentName: '', type: 'file' });
    setInputValue('');
  };

  const handleRename = async () => {


    if (!socket || !session || !canEdit || !inputValue.trim() || inputValue.trim() === renameDialog.currentName) {
      closeRenameDialog();
      return;
    }

    const currentcontent = session?.files?.[renameDialog.path]?.content;
    socket.emit('content_change', {
      session_id: session.id,
      file_name: renameDialog.path,
      content: currentcontent,
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    const newName = inputValue.trim();
    const pathParts = renameDialog.path.split('/');
    pathParts[pathParts.length - 1] = newName;
    const newPath = pathParts.join('/');

    socket.emit('rename_file', {
      session_id: session.id,
      old_name: renameDialog.path,
      new_name: newPath,
    });

    closeRenameDialog();
  };

  const openDeleteDialog = (path: string, name: string, type: 'file' | 'folder') => {
    if (!canEdit) return;
    setDeleteDialog({ isOpen: true, path, name, type });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, path: '', name: '', type: 'file' });
  };

  const handleDelete = () => {
    if (!socket || !session || !canEdit) return;

    socket.emit('delete_file', {
      session_id: session.id,
      file_name: deleteDialog.path,
    });

    closeDeleteDialog();
  };

  // Return an icon component for a given filename (file extension based).
  const getFileIcon = (filename: string) => {
    const ext = (filename.split('.').pop() || '').toLowerCase();

    // Get SVGRepo icon URL
    const iconUrl = getSVGRepoIconUrl(filename);

    if (iconUrl) {
      return (
        <img
          src={iconUrl}
          alt={ext}
          style={{
            width: 18,
            height: 18,
            objectFit: 'contain',
            flexShrink: 0
          }}
          loading="lazy"
        />
      );
    }

    // Fallback for unknown file types using Lucide icons
    return <FileText size={18} style={{ color: themeColors.textSecondary, flexShrink: 0 }} />;
  };

  const renderNode = (node: FileNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expanded.has(node.path);
    const isSelected = selectedPath === node.path;

    if (node.type === 'folder') {
      const boundary = serviceBoundaries.find(b => b.name.toLowerCase() === node.name.toLowerCase() || node.path === b.root.replace(/\/$/, ''));
      let folderColor = isMobile ? undefined : settings.accentColor;
      let boundaryTag = null;
      
      if (boundary) {
        if (boundary.type === 'client') {
          folderColor = '#3b82f6';
          boundaryTag = <span className="text-[9px] font-semibold text-blue-500 bg-blue-500/10 px-1 rounded uppercase tracking-wider shrink-0 ml-1">Client</span>;
        } else if (boundary.type === 'server') {
          folderColor = '#10b981';
          boundaryTag = <span className="text-[9px] font-semibold text-green-500 bg-green-500/10 px-1 rounded uppercase tracking-wider shrink-0 ml-1">Server</span>;
        } else if (boundary.type === 'test') {
          folderColor = '#f59e0b';
          boundaryTag = <span className="text-[9px] font-semibold text-amber-500 bg-amber-500/10 px-1 rounded uppercase tracking-wider shrink-0 ml-1">Test</span>;
        }
      }

      return (
        <div key={node.path}>
          <div
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 text-sm rounded transition-colors group"
            style={{ paddingLeft: isMobile ? '4px' : `${depth * 12 + 8}px` }}
          >
            <button
              onClick={() => toggleExpand(node.path)}
              className="flex items-center gap-2 flex-1 text-left min-w-0"
              style={{ color: themeColors.text }}
            >
              {isExpanded ? (
                <ChevronDown size={14} className="flex-shrink-0 opacity-60" />
              ) : (
                <ChevronRight size={14} className="flex-shrink-0 opacity-60" />
              )}
              {isExpanded ? (
                <FolderOpen size={16} className={`flex-shrink-0 ${isMobile ? 'text-amber-500 fill-amber-500/10' : ''}`} style={{ color: folderColor }} />
              ) : (
                <Folder size={16} className={`flex-shrink-0 ${isMobile ? 'text-amber-500 fill-amber-500/10' : ''}`} style={{ color: folderColor }} />
              )}
              <span className="truncate">{node.name}</span>
              {boundaryTag}
            </button>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openCreateDialog('file', node.path)}
                disabled={!canEdit}
                className="p-1 hover:bg-white/10 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                title={canEdit ? 'New File' : 'Sign in to create files'}
              >
                <Plus size={14} style={{ color: themeColors.textSecondary }} />
              </button>
              <button
                onClick={() => openCreateDialog('folder', node.path)}
                disabled={!canEdit}
                className="p-1 hover:bg-white/10 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                title={canEdit ? 'New Folder' : 'Sign in to create folders'}
              >
                <FolderPlus size={14} style={{ color: themeColors.textSecondary }} />
              </button>
              <button
                onClick={() => openRenameDialog(node.path, node.name, 'folder')}
                disabled={!canEdit}
                className="p-1 hover:bg-white/10 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                title={canEdit ? 'Rename' : 'Sign in to rename folders'}
              >
                <Edit2 size={14} style={{ color: themeColors.textSecondary }} />
              </button>
              <button
                onClick={() => openDeleteDialog(node.path, node.name, 'folder')}
                disabled={!canEdit}
                className="p-1 hover:bg-white/10 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                title={canEdit ? 'Delete' : 'Sign in to delete folders'}
              >
                <Trash2 size={14} style={{ color: themeColors.textSecondary }} />
              </button>
            </div>
          </div>
          {isExpanded && node.children && (
            <div className={isMobile ? "ml-[16px] pl-3 border-l border-white/5" : ""}>
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    const isNodeActive = session?.active_file === node.path;
    const isConfig = ['json', 'config', 'lock', 'gitignore', 'yaml', 'yml'].some(ext => node.name.toLowerCase().includes(ext));
    const dotColor = isConfig ? 'bg-amber-500' : 'bg-blue-500';

    return (
      <div
        key={node.path}
        className={`flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 text-sm rounded transition-colors group cursor-pointer ${
          isNodeActive && isMobile ? 'bg-emerald-500/10' : ''
        }`}
        style={{
          paddingLeft: isMobile ? '20px' : `${depth * 12 + 32}px`,
          backgroundColor: isSelected && !isMobile ? 'rgba(255, 255, 255, 0.1)' : undefined,
        }}
      >
        <button
          onClick={() => handleFileClick(node.path)}
          className={`flex items-center gap-2 flex-1 text-left ${
            isNodeActive && isMobile ? 'text-emerald-500 font-semibold' : ''
          }`}
          style={{ color: isNodeActive && isMobile ? undefined : themeColors.text }}
        >
          {isMobile ? (
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0 inline-block mr-1`} />
          ) : (
            getFileIcon(node.name)
          )}
          <span>{node.name}</span>
        </button>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => openRenameDialog(node.path, node.name, 'file')}
            disabled={!canEdit}
            className="p-1 hover:bg-white/10 rounded disabled:opacity-40 disabled:cursor-not-allowed"
            title={canEdit ? 'Rename' : 'Sign in to rename files'}
          >
            <Edit2 size={14} style={{ color: themeColors.textSecondary }} />
          </button>
          <button
            onClick={() => openDeleteDialog(node.path, node.name, 'file')}
            disabled={!canEdit}
            className="p-1 hover:bg-white/10 rounded disabled:opacity-40 disabled:cursor-not-allowed"
            title={canEdit ? 'Delete' : 'Sign in to delete files'}
          >
            <Trash2 size={14} style={{ color: themeColors.textSecondary }} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto flex flex-col bg-surface" style={{ overscrollBehavior: 'none' }}>
      {isMobile ? (
        <div className="p-3 border-b flex items-center justify-between shrink-0" style={{ borderColor: themeColors.border }}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold select-none text-foreground">Explorer</span>
            {currentBranch && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border border-border/80 text-muted-foreground bg-muted/20 font-mono">
                <GitBranch size={10} />
                {currentBranch}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openCreateDialog('file', '')}
              className="p-1 hover:bg-white/10 rounded disabled:opacity-40"
              title="New File"
              disabled={!isConnected || !session || !canEdit}
            >
              <Plus size={16} style={{ color: themeColors.textSecondary }} />
            </button>
            <button
              onClick={handleRefresh}
              className="p-1 hover:bg-white/10 rounded disabled:opacity-40"
              title="Refresh files"
              disabled={!isConnected || !session || isRefreshing || !canEdit}
            >
              <RefreshCw size={15} style={{ color: themeColors.textSecondary }} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded"
                title="Close"
              >
                <X size={16} style={{ color: themeColors.textSecondary }} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="p-3 border-b flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors shrink-0"
          style={{ borderColor: themeColors.border }}
          onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
        >
          <div className="flex items-center gap-2">
            {isHeaderCollapsed ? <ChevronRight size={14} style={{ color: themeColors.textSecondary }} /> : <ChevronDown size={14} style={{ color: themeColors.textSecondary }} />}
            <h2 className="text-xs uppercase tracking-wide font-semibold select-none" style={{ color: settings.accentColor }}>
              Explorer
            </h2>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {isReadOnly && (
              <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded" style={{ background: `${settings.accentColor}22`, color: settings.accentColor }}>
                View Only
              </span>
            )}
            <button
              onClick={() => openCreateDialog('file', '')}
              className="p-1 hover:bg-white/10 rounded disabled:opacity-40 disabled:cursor-not-allowed"
              title={canEdit ? 'New File' : 'Sign in to create files'}
              disabled={!isConnected || !session || !canEdit}
            >
              <Plus size={16} style={{ color: themeColors.textSecondary }} />
            </button>
            <button
              onClick={() => openCreateDialog('folder', '')}
              className="p-1 hover:bg-white/10 rounded disabled:opacity-40 disabled:cursor-not-allowed"
              title={canEdit ? 'New Folder' : 'Sign in to create folders'}
              disabled={!isConnected || !session || !canEdit}
            >
              <FolderPlus size={16} style={{ color: themeColors.textSecondary }} />
            </button>
            {/* Disable file upload for now since backend endpoint is unfinished */}
            {/*
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1 hover:bg-white/10 rounded disabled:opacity-40 disabled:cursor-not-allowed"
              title={canEdit ? 'Upload File' : 'Sign in to upload files'}
              disabled={!isConnected || !session || !canEdit}
            >
              <Upload size={16} style={{ color: themeColors.textSecondary }} />
            </button>
            */}
            <button
              onClick={handleRefresh}
              className="p-1 hover:bg-white/10 rounded disabled:opacity-40 disabled:cursor-not-allowed"
              title={canEdit ? 'Refresh files from disk (sync terminal changes)' : 'Sign in to refresh files'}
              disabled={!isConnected || !session || isRefreshing || !canEdit}
            >
              <RefreshCw size={16} style={{ color: themeColors.textSecondary }} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              multiple
            />
          </div>
        </div>
      )}

      {isMobile && (
        <div className="px-3 py-2 border-b shrink-0" style={{ borderColor: themeColors.border }}>
          <div className="relative flex items-center">
            <Search size={13} className="absolute left-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-muted/30 border border-border/80 rounded-md focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/75"
            />
          </div>
        </div>
      )}
      {isUploading && (
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2" style={{ borderColor: settings.accentColor }}></div>
            <span className="text-xs" style={{ color: themeColors.textSecondary }}>Uploading files...</span>
          </div>
          <div className="h-1 w-full bg-gray-700 rounded overflow-hidden">
            <div className="h-full animate-pulse" style={{ backgroundColor: settings.accentColor, width: '100%' }}></div>
          </div>
        </div>
      )}
      {!isHeaderCollapsed && (
        <div className="py-2">
          {!session ? (
            <div className="p-4">
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                No session active
              </p>
            </div>
          ) : filteredFileTree.length === 0 ? (
            <div className="p-4">
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                {searchQuery ? 'No matching files found.' : 'No files yet. Create a new file to get started.'}
              </p>
            </div>
          ) : (
            filteredFileTree.map((node) => renderNode(node))
          )}
        </div>
      )}

      {/* Create Dialog */}
      {
        createDialog.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96" style={{ backgroundColor: themeColors.cardBg }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>
                Create New {createDialog.type === 'file' ? 'File' : 'Folder'}
              </h3>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') closeCreateDialog();
                }}
                placeholder={createDialog.type === 'file' ? 'filename.ext' : 'folder-name'}
                className="w-full px-3 py-2 rounded border mb-4"
                style={{
                  backgroundColor: themeColors.navBg,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                }}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeCreateDialog}
                  className="px-4 py-2 rounded hover:bg-white/10"
                  style={{ color: themeColors.textSecondary }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 rounded"
                  style={{ backgroundColor: settings.accentColor, color: '#fff' }}
                  disabled={!inputValue.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Rename Dialog */}
      {
        renameDialog.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96" style={{ backgroundColor: themeColors.cardBg }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>
                Rename {renameDialog.type === 'file' ? 'File' : 'Folder'}
              </h3>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') closeRenameDialog();
                }}
                className="w-full px-3 py-2 rounded border mb-4"
                style={{
                  backgroundColor: themeColors.navBg,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                }}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeRenameDialog}
                  className="px-4 py-2 rounded hover:bg-white/10"
                  style={{ color: themeColors.textSecondary }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  className="px-4 py-2 rounded"
                  style={{ backgroundColor: settings.accentColor, color: '#fff' }}
                  disabled={!inputValue.trim()}
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Delete Dialog */}
      {
        deleteDialog.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96" style={{ backgroundColor: themeColors.cardBg }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>
                Delete {deleteDialog.type === 'file' ? 'File' : 'Folder'}
              </h3>
              <p className="mb-4" style={{ color: themeColors.textSecondary }}>
                Are you sure you want to delete "{deleteDialog.name}"?
                {deleteDialog.type === 'folder' && ' This will delete all files inside.'}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeDeleteDialog}
                  className="px-4 py-2 rounded hover:bg-white/10"
                  style={{ color: themeColors.textSecondary }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded"
                  style={{ backgroundColor: '#ef4444', color: '#fff' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
