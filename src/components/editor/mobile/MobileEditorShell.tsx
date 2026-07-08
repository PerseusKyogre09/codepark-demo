import { Suspense, useState, useEffect, type ReactNode } from 'react';
import { Play, Square, Sun, Moon, ChevronLeft, GitBranch, Check, Keyboard, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { useAuth } from '../../../contexts/AuthContext';
import FileTabs from '../FileTabs';
import { CodeEditor } from '../CodeEditor';
import { ImageViewer } from '../ImageViewer';
import { PDFViewer } from '../PDFViewer';
import { Terminal } from '../Terminal';

function Drawer({ open, onClose, side = 'left', children }: { open: boolean; onClose: () => void; side?: 'left' | 'right'; children: React.ReactNode }) {
  return (
    <div className={`fixed inset-0 z-50 flex ${side === 'right' ? 'justify-end' : ''} ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`relative flex flex-col border-border bg-surface h-full shadow-2xl transition-transform duration-200 ease-out ${side === 'right' ? 'border-l' : 'border-r'} ${open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full'}`}
        style={{ width: 'min(300px, 88vw)' }}>
        {/* Floating close button on mobile drawer */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 z-[100] size-6 rounded-full bg-muted/65 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-sm"
          title="Close Panel"
        >
          <X size={12} />
        </button>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  if (!name) return 'U';
  const cleanName = name.trim();
  const parts = cleanName.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return cleanName.substring(0, Math.min(cleanName.length, 2)).toUpperCase();
}

interface MobileHeaderProps {
  collaborators: any[];
  onRunCode?: () => void;
  onStopExecution?: () => void;
  isExecuting?: boolean;
  activeFile?: string;
  isReadOnly?: boolean;
  onRequestSignIn?: () => void;
  onInviteClick?: () => void;
}

export function MobileHeader({
  collaborators,
  onRunCode,
  onStopExecution,
  isExecuting = false,
  activeFile,
  isReadOnly = false,
  onRequestSignIn,
}: MobileHeaderProps) {
  const navigate = useNavigate();
  const { settings, updateSettings } = useTheme();
  const { user } = useAuth();
  const { isInSession, clientIdentity } = useSession();

  const theme = settings.uiTheme;
  const toggleTheme = () => {
    updateSettings({ uiTheme: theme === 'dark' ? 'light' : 'dark' });
  };

  const otherCollaborators = collaborators.filter(c => c.id !== clientIdentity?.id);

  return (
    <header className="h-10 flex items-center justify-between px-2 border-b border-border bg-surface shrink-0 relative z-50 gap-1 select-none">
      {/* Left: Back & Filename */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate('/dashboard')}
          className="size-7 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors mr-1"
          title="Back to Dashboard"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Filename & Live dot on mobile */}
        <div className="flex items-center gap-1.5 px-1">
          <span className="text-xs text-muted-foreground">
            {activeFile?.split('/').pop() || 'index.tsx'}
          </span>
          {isInSession && (
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          )}
        </div>
      </div>

      {/* Right: Controls & Avatar Stack */}
      <div className="flex items-center gap-1.5">
        {/* Run/Stop Action Button */}
        {onRunCode && (
          isExecuting ? (
            <button
              onClick={onStopExecution}
              className="flex items-center justify-center rounded-lg transition-all hover:opacity-90 text-red-500 bg-red-500/20 shadow-sm shrink-0"
              style={{ height: '24px', width: '38px', minHeight: '24px', maxHeight: '24px' }}
              title="Stop execution"
            >
              <Square size={10} className="text-red-500" />
            </button>
          ) : (
            <button
              onClick={isReadOnly ? onRequestSignIn : onRunCode}
              disabled={!activeFile || !isInSession || isReadOnly}
              className="flex items-center justify-center rounded-lg transition-all hover:opacity-90 text-emerald-500 bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
              style={{ height: '24px', width: '38px', minHeight: '24px', maxHeight: '24px' }}
              title={!activeFile ? 'No file selected' : !isInSession ? 'Not in a session' : isReadOnly ? 'Sign in to run code' : 'Run code'}
            >
              <Play size={10} className="text-emerald-500" />
            </button>
          )
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="size-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Avatar Stack */}
        <div className="flex items-center ml-1">
          <div className="flex -space-x-1.5">
            <div
              className="w-6 h-6 rounded-full border border-surface flex items-center justify-center text-[10px] font-bold text-white bg-emerald-600 shadow-sm relative z-10"
              title={user?.name || user?.email || 'You'}
            >
              {getInitials(user?.name || user?.email || 'You')}
            </div>

            {otherCollaborators.slice(0, 2).map((collab, index) => {
              const collabName = collab.name && collab.name.trim() ? collab.name : 'Collaborator';
              const collabInitial = getInitials(collabName);
              return (
                <div
                  key={collab.id}
                  className="w-6 h-6 rounded-full border border-surface flex items-center justify-center text-[10px] font-semibold text-white shadow-sm relative"
                  style={{ background: collab.color || '#c2410c', zIndex: 9 - index }}
                  title={collabName}
                >
                  {collabInitial}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

export function MobileTabs() {
  return <FileTabs />;
}

interface MobileCodeViewProps {
  session: any;
  isReadOnly: boolean;
  collaborators: any[];
  breakpoints: any[];
  setBreakpoints: (bps: any[]) => void;
  editorRef: any;
  editMode: boolean;
  setEditMode: (val: boolean) => void;
}

export function MobileCodeView({
  session,
  isReadOnly,
  collaborators,
  breakpoints,
  setBreakpoints,
  editorRef,
  editMode,
  setEditMode,
}: MobileCodeViewProps) {
  const activeFile = session?.active_file || '';
  const fileExt = activeFile.split('.').pop()?.toLowerCase() || '';
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp', 'tiff'].includes(fileExt);
  const isPdf = fileExt === 'pdf';

  return (
    <div className="flex-1 overflow-hidden relative flex flex-col h-full w-full">
      <Suspense fallback={null}>
        {(() => {
          if (isImage && session?.project_id) {
            return (
              <ImageViewer
                key={activeFile}
                projectId={session.project_id}
                filePath={activeFile}
                sessionId={session.id}
              />
            );
          }

          if (isPdf && session?.project_id) {
            return (
              <PDFViewer
                projectId={session.project_id}
                filePath={activeFile}
                sessionId={session.id}
              />
            );
          }

          return (
            <div className="flex flex-col h-full w-full">
              {!isReadOnly && !editMode && (
                <div className="px-3 py-2 bg-emerald-600/10 border-b border-emerald-500/20 flex items-center justify-between shrink-0 select-none">
                  <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1.5">
                    <Keyboard size={12} />
                    Tap to scroll · swipe to read
                  </span>
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-[11px] text-emerald-500 font-medium hover:underline flex items-center gap-1"
                  >
                    <Check size={11} />
                    Quick edit
                  </button>
                </div>
              )}
              <div className="flex-1 flex flex-col overflow-hidden relative">
                <CodeEditor
                  ref={editorRef}
                  collaborators={collaborators}
                  readOnly={isReadOnly || !editMode}
                  activeFile={session?.active_file}
                  breakpoints={breakpoints}
                  onBreakpointsChange={setBreakpoints}
                />
              </div>
            </div>
          );
        })()}
      </Suspense>
    </div>
  );
}

interface MobileStatusBarProps {
  isConnected: boolean;
  session: any;
  saveStatus: any;
  isReadOnly?: boolean;
  branch?: string;
  onBranchClick?: () => void;
  terminalVisible?: boolean;
  onToggleTerminal?: () => void;
}

export function MobileStatusBar({
  isConnected,
  session,
  saveStatus,
  branch,
}: MobileStatusBarProps) {
  const statusLabel =
    saveStatus === 'saving' ? 'Saving...' :
      saveStatus === 'error' ? 'Save failed' :
        'Synced';

  const activeFile = session?.active_file || '';
  const fileExt = activeFile.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    ts: 'TypeScript',
    tsx: 'TypeScript JSX',
    js: 'JavaScript',
    jsx: 'JavaScript JSX',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    md: 'Markdown',
    py: 'Python',
    txt: 'Plaintext',
  };
  const language = languageMap[fileExt] || 'Plaintext';

  return (
    <footer className="h-6 flex items-center justify-between px-3 border-t border-border bg-surface text-[10px] text-muted-foreground select-none shrink-0 font-normal">
      {/* Left Side */}
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div className="flex items-center gap-1">
          <GitBranch size={10} />
          <span>{branch || 'main'}</span>
        </div>

        <div className="flex items-center gap-1.5 opacity-80" title={isConnected ? 'Connected' : 'Disconnected'}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className="hidden xs:inline">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>

        <div className="flex items-center gap-1 text-emerald-500 font-medium">
          <Check size={11} />
          <span>{statusLabel}</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="hidden xxs:inline">{language}</span>
        <span className="opacity-80">UTF-8</span>
        <span className="opacity-80">Ln 1, Col 1</span>
      </div>
    </footer>
  );
}

interface MobileBottomToolbarProps {
  leftPanel: any;
  rightPanel: any;
  terminalOpen: boolean;
  onLeft: (id: any) => void;
  onRight: (id: any) => void;
  onRun: () => void;
  onTerminal: () => void;
  onMore: () => void;
  gitChangesCount: number;
  collaboratorsCount: number;
  MobileToolbarComponent: any;
}

export function MobileBottomToolbar({
  leftPanel,
  rightPanel,
  terminalOpen,
  onLeft,
  onRight,
  onRun,
  onTerminal,
  onMore,
  gitChangesCount,
  collaboratorsCount,
  MobileToolbarComponent,
}: MobileBottomToolbarProps) {
  const MobileToolbar = MobileToolbarComponent;
  return (
    <MobileToolbar
      leftPanel={leftPanel}
      rightPanel={rightPanel}
      terminalOpen={terminalOpen}
      onLeft={onLeft}
      onRight={onRight}
      onRun={onRun}
      onTerminal={onTerminal}
      onMore={onMore}
      gitChangesCount={gitChangesCount}
      collaboratorsCount={collaboratorsCount}
    />
  );
}

interface MobileEditorShellProps {
  collaborators: any[];
  session: any;
  isReadOnly: boolean;
  isConnected: boolean;
  saveStatus: any;
  currentBranch?: string;
  isExecuting: boolean;
  terminalVisible: boolean;
  setTerminalVisible: (visible: boolean) => void;
  activePanel: any;
  activeRightPanel: any;
  handleLeft: (id: any) => void;
  handleRight: (id: any) => void;
  handleRunCode: () => void;
  handleStopExecution: () => void;
  handleSave: () => void;
  previewSupported: boolean;
  togglePreview: () => void;
  isPreviewing: boolean;
  webPreviewUrl: string | null;
  gitChangesCount: number;
  editorRef: any;
  breakpoints: any[];
  setBreakpoints: (bps: any[]) => void;
  moreOpen: boolean;
  setMoreOpen: (open: boolean) => void;
  leftContent: any;
  rightContent: any;
  closeLeft: () => void;
  closeRight: () => void;
  MobileToolbarComponent: any;
  MobileMoreSheetComponent: any;
  terminalHeight: string;
  children?: ReactNode;
}

export function MobileEditorShell({
  collaborators,
  session,
  isReadOnly,
  isConnected,
  saveStatus,
  currentBranch,
  isExecuting,
  terminalVisible,
  setTerminalVisible,
  activePanel,
  activeRightPanel,
  handleLeft,
  handleRight,
  handleRunCode,
  handleStopExecution,
  handleSave,
  previewSupported,
  togglePreview,
  isPreviewing,
  webPreviewUrl,
  gitChangesCount,
  editorRef,
  breakpoints,
  setBreakpoints,
  moreOpen,
  setMoreOpen,
  leftContent,
  rightContent,
  closeLeft,
  closeRight,
  MobileToolbarComponent,
  MobileMoreSheetComponent,
  terminalHeight,
  children,
}: MobileEditorShellProps) {
  // Read props to satisfy strict unused checks
  const _unused = { handleSave, previewSupported, togglePreview, isPreviewing, webPreviewUrl };
  Object.values(_unused);

  const MobileMoreSheet = MobileMoreSheetComponent;
  const [editMode, setEditMode] = useState(false);
  const [lastLeftContent, setLastLeftContent] = useState<ReactNode>(null);
  const [lastRightContent, setLastRightContent] = useState<ReactNode>(null);

  useEffect(() => {
    if (activePanel) {
      setLastLeftContent(leftContent[activePanel]);
    }
  }, [activePanel, leftContent]);

  useEffect(() => {
    if (activeRightPanel) {
      setLastRightContent(rightContent[activeRightPanel]);
    }
  }, [activeRightPanel, rightContent]);

  useEffect(() => {
    setEditMode(false);
  }, [session?.active_file]);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-background"
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        overflowX: 'hidden',
        maxWidth: '100vw',
      }}
    >
      {/* MobileHeader */}
      <MobileHeader
        collaborators={collaborators}
        onRunCode={handleRunCode}
        onStopExecution={handleStopExecution}
        isExecuting={isExecuting}
        activeFile={session?.active_file}
        isReadOnly={isReadOnly}
        onInviteClick={undefined}
      />

      {/* MobileTabs */}
      <MobileTabs />

      {/* MobileCodeView */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <MobileCodeView
          session={session}
          isReadOnly={isReadOnly}
          collaborators={collaborators}
          breakpoints={breakpoints}
          setBreakpoints={setBreakpoints}
          editorRef={editorRef}
          editMode={editMode}
          setEditMode={setEditMode}
        />

        {/* Dedicated mobile terminal overlay */}
        {terminalVisible && (
          <div className="absolute bottom-0 inset-x-0 z-40 bg-surface border-t border-border" style={{ height: terminalHeight }}>
            <Terminal
              onClose={() => setTerminalVisible(false)}
              height="100%"
            />
          </div>
        )}
      </div>

      {/* MobileStatusBar */}
      <MobileStatusBar
        isConnected={isConnected}
        session={session}
        saveStatus={saveStatus}
        isReadOnly={isReadOnly}
        branch={currentBranch}
        onBranchClick={undefined}
        terminalVisible={terminalVisible}
        onToggleTerminal={() => setTerminalVisible(!terminalVisible)}
      />

      {/* MobileBottomToolbar */}
      <MobileBottomToolbar
        leftPanel={activePanel}
        rightPanel={activeRightPanel}
        terminalOpen={terminalVisible}
        onLeft={handleLeft}
        onRight={handleRight}
        onRun={handleRunCode}
        onTerminal={() => setTerminalVisible(!terminalVisible)}
        onMore={() => setMoreOpen(true)}
        gitChangesCount={gitChangesCount}
        collaboratorsCount={collaborators.length}
        MobileToolbarComponent={MobileToolbarComponent}
      />

      {/* Mobile More Sheet */}
      <MobileMoreSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        onLeft={handleLeft}
        onRight={handleRight}
        onTerminal={() => {
          setTerminalVisible(!terminalVisible)
          setMoreOpen(false)
        }}
      />

      {/* Mobile Overlay panels as Drawer mounts */}
      <Drawer open={!!activePanel} onClose={closeLeft} side="left">
        {lastLeftContent}
      </Drawer>

      <Drawer open={!!activeRightPanel} onClose={closeRight} side="right">
        {lastRightContent}
      </Drawer>

      {children}
    </div>
  );
}
