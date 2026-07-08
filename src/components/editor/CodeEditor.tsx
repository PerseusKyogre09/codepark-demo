import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useTheme } from '../../contexts/ThemeContext';
import { useSession } from '../../contexts/SessionContext';
import { useSocket } from '../../contexts/SocketContext';
import { getMonacoKeybindings } from '../../utils/keyboardShortcuts';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import type { CollaboratorUser, Breakpoint, AwarenessUserState } from '../../types';

interface CodeEditorProps {
  collaborators: CollaboratorUser[];
  readOnly: boolean;
  activeFile?: string;
  breakpoints: Breakpoint[];
  onBreakpointsChange: (breakpoints: Breakpoint[]) => void;
}


//for handling 10digit hex code literally what kind of error is this
//fuck this shit
function getHexAlpha(hexColor: string, newAlpha: string): string {
  let cleanHex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
  if (cleanHex.length === 8) {
    cleanHex = cleanHex.slice(0, 6);
  }

  return "#" + cleanHex + newAlpha;
}

export interface CodeEditorHandle {
  getCurrentContent: () => string | null;
  getCurrentFile: () => string | null;
  getCurrentLanguage: () => string | null;
  focus: () => void;
}


// defining all the text files..........
const isTextFile = (filename: string): boolean => {
  const binaryExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.s', '.zip', '.tar', '.gz', '.7z', '.exe', '.bin',
    '.mp3', '.mp4', '.wav', '.mov', '.avi', '.ttf', '.woff', '.woff2', '.eot', '.webp'
  ];
  return !binaryExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};


/**
 * CodeEditor Component using Yjs for Real-time Collaboration
 * 
 * Uses Yjs CRDTs for collaborative editing.
 * - Yjs Doc: The single source of truth for document state.
 * - RealtimeProvider: Custom adapter bridging Yjs <-> realtime websocket events.
 * - MonacoBinding: Automatically syncs Yjs Text type with Monaco Model.
 * 
 */


export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(({
  collaborators,
  readOnly,
  activeFile,
  breakpoints,
  onBreakpointsChange
}, ref) => {
  const { settings, themeColors } = useTheme();
  const editorTheme = settings.editorTheme;
  const { session, clientIdentity, ydoc, provider, isSynced } = useSession();
  const { socket, isConnected } = useSocket();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isEditorReady, setIsEditorReady] = useState(false);
  const decorationIdsRef = useRef<string[]>([]);
  const isUpdatingDecorationsRef = useRef(false);

  // Define activeFile from prop or fallback
  const currentActiveFile = activeFile || session?.active_file || 'untitled.txt';

  const activeFileRef = useRef(currentActiveFile);
  useEffect(() => {
    activeFileRef.current = currentActiveFile;
  }, [currentActiveFile]);


  //get the current file idk what i am doing I am just making it work atp
  const yesdisp = isTextFile(currentActiveFile)

  // Yjs State
  const bindingRef = useRef<MonacoBinding | null>(null);
  const bindingFileIdRef = useRef<string | null>(null);
  const lastBeforeBindLogRef = useRef<any>(null);
  const lastAfterBindLogRef = useRef<any>(null);
  const lastCreateLogRef = useRef<any>(null);
  const lastDestroyLogRef = useRef<any>(null);

  // Timeout ref for content sync - MUST be at top level
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isFileContentReady, setIsFileContentReady] = useState(false);
  const loadingFilesRef = useRef<Set<string>>(new Set());



  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return 12;
      case 'large': return 16;
      default: return 14;
    }
  };

  const getLineHeight = () => {
    switch (settings.lineHeight) {
      case 'compact': return 18;
      case 'relaxed': return 24;
      default: return 21;
    }
  };

  const getFontFamily = () => {
    switch (settings.editorFont) {
      case 'fira': return 'Fira Code, monospace';
      case 'jetbrains': return 'JetBrains Mono, monospace';
      case 'space': return 'Space Mono, monospace';
      case 'ibm': return 'IBM Plex Mono, monospace';
      case 'consolas': return 'Consolas, monospace';
      default: return 'Cascadia Code, monospace';
    }
  };

  // Detect language from file extension
  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'mjs': 'javascript',
      'cjs': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'pyw': 'python',
      'java': 'java',
      'class': 'java',
      'cpp': 'cpp',
      'cc': 'cpp',
      'cxx': 'cpp',
      'h': 'cpp',
      'hpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'php': 'php',
      'php3': 'php',
      'php4': 'php',
      'phtml': 'php',
      'html': 'html',
      'htm': 'html',
      'xhtml': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'scss',
      'less': 'less',
      'json': 'json',
      'xml': 'xml',
      'svg': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'sql': 'sql',
      'sh': 'shell',
      'bash': 'shell',
      'zsh': 'shell',
      'ps1': 'powershell',
      'bat': 'bat',
      'cmd': 'bat',
      'dockerfile': 'dockerfile',
      'makefile': 'makefile',
      'ini': 'ini',
      'conf': 'ini',
      'txt': 'plaintext',
      'log': 'plaintext',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  const language = getLanguage(currentActiveFile);

  // Get Monaco theme based on application theme
  const getMonacoTheme = (): string => {
    return `${editorTheme}-syntax`;
  };

  // Define syntax highlighting themes
  const defineThemes = (monaco: typeof import('monaco-editor')) => {
    // Base themes with syntax highlighting
    const themes = {
      'light-syntax': {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#ffffff',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '20'),
          'editor.lineHighlightBackground': '#00000008',
        }
      },
      'dark-syntax': {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#0a0a0f',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '40'),
          'editor.inactiveSelectionBackground': getHexAlpha(settings.accentColor, '20'),
          'editor.lineHighlightBackground': '#ffffff08',
        }
      },
      'forest-syntax': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6b8e23' },
          { token: 'keyword', foreground: '66cdaa' },
          { token: 'string', foreground: '98fb98' },
          { token: 'number', foreground: '9acd32' },
        ],
        colors: {
          'editor.background': '#0f2027',
          'editor.foreground': '#e8f5e9',
          'editor.lineHighlightBackground': '#2c3e50',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '40'),
          'editor.inactiveSelectionBackground': getHexAlpha(settings.accentColor, '20'),
        }
      },
      'ocean-syntax': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6272a4' },
          { token: 'keyword', foreground: '8be9fd' },
          { token: 'string', foreground: 'f1fa8c' },
          { token: 'number', foreground: 'bd93f9' },
        ],
        colors: {
          'editor.background': '#0a192f',
          'editor.foreground': '#e0f2fe',
          'editor.lineHighlightBackground': '#112240',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '40'),
          'editor.inactiveSelectionBackground': getHexAlpha(settings.accentColor, '20'),
        }
      },
      'sunset-syntax': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'b08d55' },
          { token: 'keyword', foreground: 'ff7f50' },
          { token: 'string', foreground: 'f0e68c' },
          { token: 'number', foreground: 'ffa07a' },
        ],
        colors: {
          'editor.background': '#1a0a2e',
          'editor.foreground': '#fef3c7',
          'editor.lineHighlightBackground': '#2d1545',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '40'),
          'editor.inactiveSelectionBackground': getHexAlpha(settings.accentColor, '20'),
        }
      },
      'midnight-syntax': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '708090' },
          { token: 'keyword', foreground: '9370db' },
          { token: 'string', foreground: 'ffb6c1' },
          { token: 'number', foreground: 'add8e6' },
        ],
        colors: {
          'editor.background': '#000000',
          'editor.foreground': '#ffffff',
          'editor.lineHighlightBackground': '#1a1a1a',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '40'),
          'editor.inactiveSelectionBackground': getHexAlpha(settings.accentColor, '20'),
        }
      },
      'cyberpunk-syntax': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'ff1493' },
          { token: 'keyword', foreground: '00ffff' },
          { token: 'string', foreground: 'ff4500' },
          { token: 'number', foreground: 'ffff00' },
        ],
        colors: {
          'editor.background': '#0f0326',
          'editor.foreground': '#ffffff',
          'editor.lineHighlightBackground': '#1f0a36',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '40'),
          'editor.inactiveSelectionBackground': getHexAlpha(settings.accentColor, '20'),
        }
      },
      'rose-syntax': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '9d4b6b' },
          { token: 'keyword', foreground: 'ff1493' },
          { token: 'string', foreground: 'ffb6c1' },
          { token: 'number', foreground: 'ff69b4' },
        ],
        colors: {
          'editor.background': '#2d1b2e',
          'editor.foreground': '#ffe4e6',
          'editor.lineHighlightBackground': '#3d2a3d',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '40'),
          'editor.inactiveSelectionBackground': getHexAlpha(settings.accentColor, '20'),
        }
      },
      // Light Syntax Themes
      'forest-light-syntax': {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '006400' },
          { token: 'keyword', foreground: '228b22' },
          { token: 'string', foreground: '2e8b57' },
          { token: 'number', foreground: '32cd32' },
        ],
        colors: {
          'editor.background': '#e8f5e9',
          'editor.foreground': '#1b4332',
          'editor.lineHighlightBackground': '#c8e6c9',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '30'),
        }
      },
      'ocean-light-syntax': {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '0077b6' },
          { token: 'keyword', foreground: '023e8a' },
          { token: 'string', foreground: '0096c7' },
          { token: 'number', foreground: '48cae4' },
        ],
        colors: {
          'editor.background': '#e0f2fe',
          'editor.foreground': '#0c4a6e',
          'editor.lineHighlightBackground': '#bae6fd',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '30'),
        }
      },
      'sunny-light-syntax': {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'd97706' },
          { token: 'keyword', foreground: 'ea580c' },
          { token: 'string', foreground: 'b45309' },
          { token: 'number', foreground: 'f59e0b' },
        ],
        colors: {
          'editor.background': '#fff7ed',
          'editor.foreground': '#7c2d12',
          'editor.lineHighlightBackground': '#ffedd5',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '30'),
        }
      },
      'beach-light-syntax': {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '0891b2' },
          { token: 'keyword', foreground: '0e7490' },
          { token: 'string', foreground: '06b6d4' },
          { token: 'number', foreground: '22d3ee' },
        ],
        colors: {
          'editor.background': '#fffbeb',
          'editor.foreground': '#0e7490',
          'editor.lineHighlightBackground': '#fef3c7',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '30'),
        }
      },
      'anime-light-syntax': {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'a21caf' },
          { token: 'keyword', foreground: 'c026d3' },
          { token: 'string', foreground: 'db2777' },
          { token: 'number', foreground: 'e879f9' },
        ],
        colors: {
          'editor.background': '#fae8ff',
          'editor.foreground': '#701a75',
          'editor.lineHighlightBackground': '#f0abfc',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '30'),
        }
      },
      'rose-light-syntax': {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'be123c' },
          { token: 'keyword', foreground: 'e11d48' },
          { token: 'string', foreground: 'f43f5e' },
          { token: 'number', foreground: 'fb7185' },
        ],
        colors: {
          'editor.background': '#fff1f2',
          'editor.foreground': '#881337',
          'editor.lineHighlightBackground': '#ffe4e6',
          'editorCursor.foreground': settings.accentColor,
          'editor.selectionBackground': getHexAlpha(settings.accentColor, '30'),
        }
      }
    };

    Object.entries(themes).forEach(([themeName, themeData]) => {
      monaco.editor.defineTheme(themeName, themeData as any);
    });
  };

  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Enforce LF line endings to prevent character offset drift between Windows/Mac clients
    // This is critical for Yjs collaborative editing to align correctly
    const model = editor.getModel();
    if (model) {
      model.setEOL(monaco.editor.EndOfLineSequence.LF);
    }

    // Disable conflicting Monaco keybindings
    const keybindings = getMonacoKeybindings(monaco);
    keybindings.forEach(binding => {
      editor.addCommand(binding.keybinding, () => { }, undefined);
    });

    // Ensure Tab accepts a suggestion if the widget is open; otherwise insert a tab
    editor.addCommand(
      monaco.KeyMod.None | monaco.KeyCode.Tab,
      () => editor.trigger('keyboard', 'acceptSelectedSuggestion', {}),
      'suggestWidgetVisible'
    );

    // Fallback: when the suggest widget is not visible, Tab inserts a tab character
    editor.addCommand(
      monaco.KeyMod.None | monaco.KeyCode.Tab,
      () => editor.trigger('keyboard', 'type', { text: '\t' }),
      '!suggestWidgetVisible'
    );

    // Define custom syntax themes
    defineThemes(monaco);

    // Track cursor position locally (visual only, real cursors handled by Yjs Awareness)
    editor.onDidChangeCursorPosition((e) => {
      const pos = {
        line: e.position.lineNumber,
        column: e.position.column
      };
      setCursorPosition(pos);
      if (session?.id && currentActiveFile) {
        try {
          localStorage.setItem(
            `codepark_cursor_${session.id}_${currentActiveFile}`,
            JSON.stringify(pos)
          );
        } catch (err) {
          console.error('[CodeEditor] Failed to save cursor position:', err);
        }
      }
    });

    // Handle breakpoint toggle on glyph margin click
    editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
        const lineNumber = e.target.position?.lineNumber;
        if (!lineNumber) return;

        const currentBreakpoints = [...breakpoints];
        const existingIdx = currentBreakpoints.findIndex(bp => bp.file === currentActiveFile && bp.line === lineNumber);

        if (existingIdx !== -1) {
          // Remove breakpoint
          currentBreakpoints.splice(existingIdx, 1);
        } else {
          // Add breakpoint
          currentBreakpoints.push({
            id: `${currentActiveFile}-${lineNumber}-${Date.now()}`,
            file: currentActiveFile,
            line: lineNumber,
            enabled: true
          });
        }
        onBreakpointsChange(currentBreakpoints);
      }
    });

    // Handle breakpoint hover ghost effect
    const ghostDecorationIdsRef = { current: [] as string[] };
    editor.onMouseMove((e) => {
      if (isUpdatingDecorationsRef.current) return;

      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
        const lineNumber = e.target.position?.lineNumber;
        if (!lineNumber) {
          isUpdatingDecorationsRef.current = true;
          ghostDecorationIdsRef.current = editor.deltaDecorations(ghostDecorationIdsRef.current, []);
          isUpdatingDecorationsRef.current = false;
          return;
        }

        const hasBreakpoint = breakpoints.some(bp => bp.file === currentActiveFile && bp.line === lineNumber);
        if (hasBreakpoint) {
          isUpdatingDecorationsRef.current = true;
          ghostDecorationIdsRef.current = editor.deltaDecorations(ghostDecorationIdsRef.current, []);
          isUpdatingDecorationsRef.current = false;
          return;
        }

        const newGhostDecorations = [{
          range: new monaco.Range(lineNumber, 1, lineNumber, 1),
          options: {
            isWholeLine: true,
            glyphMarginClassName: 'breakpoint-ghost',
            glyphMarginHoverMessage: { value: 'Add Breakpoint' }
          }
        }];
        isUpdatingDecorationsRef.current = true;
        ghostDecorationIdsRef.current = editor.deltaDecorations(ghostDecorationIdsRef.current, newGhostDecorations);
        isUpdatingDecorationsRef.current = false;
      } else {
        isUpdatingDecorationsRef.current = true;
        ghostDecorationIdsRef.current = editor.deltaDecorations(ghostDecorationIdsRef.current, []);
        isUpdatingDecorationsRef.current = false;
      }
    });

    editor.onMouseLeave(() => {
      if (isUpdatingDecorationsRef.current) return;
      isUpdatingDecorationsRef.current = true;
      ghostDecorationIdsRef.current = editor.deltaDecorations(ghostDecorationIdsRef.current, []);
      isUpdatingDecorationsRef.current = false;
    });

    editor.updateOptions({ readOnly, domReadOnly: readOnly });

    // Enable auto-closing for HTML tags
    const autoCloseTags = (e: editor.IModelContentChangedEvent) => {
      if (e.changes.length !== 1) return;
      const change = e.changes[0];
      if (change.text !== '>') return;

      const model = editor.getModel();
      if (!model) return;

      const position = editor.getPosition();
      if (!position) return;

      const lineContent = model.getLineContent(position.lineNumber);
      const textBefore = lineContent.substring(0, position.column - 2);

      // Match an opening tag: <tag but not </tag and not <tag />
      const openingTagMatch = textBefore.match(/<([a-zA-Z0-9-]+)(?:\s+[^>]*)*$/);
      if (!openingTagMatch) return;

      const tagName = openingTagMatch[1];
      const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

      if (selfClosingTags.includes(tagName.toLowerCase())) return;

      // Insert closing tag
      const closingTag = `</${tagName}>`;
      editor.executeEdits('auto-close-tag', [
        {
          range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
          text: closingTag,
          forceMoveMarkers: false
        }
      ]);

      // Keep cursor position before the closing tag
      editor.setPosition(position);
    };

    // Only enable auto-tag closing for relevant languages
    const tagLanguages = ['html', 'xml', 'javascript', 'typescript', 'php', 'markdown']; // javascript/typescript for JSX/TSX
    if (tagLanguages.includes(language)) {
      const disposable = editor.onDidChangeModelContent(autoCloseTags);
      editor.onDidDispose(() => disposable.dispose());
    }

    // Enable autocompletion features - especially Tab completion
    // Register custom completion provider for words in the current file
    // We register for many languages to ensure it works across "all kinds of languages"
    const allLanguages = [
      'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp',
      'go', 'rust', 'ruby', 'php', 'html', 'css', 'scss', 'json', 'xml',
      'yaml', 'markdown', 'sql', 'shell', 'powershell', 'bat', 'dockerfile', 'plaintext',
      'jsx', 'tsx' // Added for completeness
    ];

    const languageKeywords: Record<string, { label: string; insertText: string; kind: number }[]> = {
      python: [
        { label: 'print', insertText: 'print($0)', kind: monaco.languages.CompletionItemKind.Function },
        { label: 'def', insertText: 'def ${1:name}($2):\n    $0', kind: monaco.languages.CompletionItemKind.Snippet },
        { label: 'class', insertText: 'class ${1:Name}:\n    def __init__(self, $2):\n        $0', kind: monaco.languages.CompletionItemKind.Snippet }
      ],
      javascript: [
        { label: 'function', insertText: 'function ${1:name}($2) {\n  $0\n}', kind: monaco.languages.CompletionItemKind.Snippet },
        { label: 'console.log', insertText: 'console.log($0)', kind: monaco.languages.CompletionItemKind.Function }
      ],
      typescript: [
        { label: 'function', insertText: 'function ${1:name}($2): ${3:void} {\n  $0\n}', kind: monaco.languages.CompletionItemKind.Snippet },
        { label: 'console.log', insertText: 'console.log($0)', kind: monaco.languages.CompletionItemKind.Function }
      ]
    };

    const providerDisposables = allLanguages.map(lang =>
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: (model: editor.ITextModel, position: any) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });

          const words = model.getValue().match(/\b[a-zA-Z_]\w*\b/g) || [];
          const uniqueWords = Array.from(new Set(words));
          const currentPrefixLen = textUntilPosition.match(/[a-zA-Z_]\w*$/)?.[0].length || 0;

          const baseRange = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column - currentPrefixLen,
            endColumn: position.column
          };

          const keywordItems = (languageKeywords[lang] || []).map(item => ({
            label: item.label,
            insertText: item.insertText,
            insertTextRules: item.insertText.includes('$') ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet : undefined,
            kind: item.kind,
            sortText: `000${item.label}`,
            range: baseRange
          }));

          const wordItems = uniqueWords.map(word => ({
            label: word,
            kind: monaco.languages.CompletionItemKind.Text,
            insertText: word,
            range: baseRange,
            sortText: `100${word}`
          }));

          return { suggestions: [...keywordItems, ...wordItems] };
        }
      })
    );

    // HTML tag snippets that insert paired open/close tags when accepting completion (Tab/Enter)
    const htmlTags = ['html', 'head', 'body', 'div', 'span', 'main', 'section', 'article', 'header', 'footer', 'nav', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'button', 'input', 'form', 'label', 'textarea', 'img', 'script', 'style', 'link', 'meta', 'title'];
    const htmlTagProvider = monaco.languages.registerCompletionItemProvider('html', {
      triggerCharacters: ['<'],
      provideCompletionItems: (model: editor.ITextModel, position: any) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });

        // Capture tag being typed including the leading '<'
        const tagMatch = textUntilPosition.match(/<([a-zA-Z_]\w*)$/);
        const currentWord = tagMatch?.[1] || '';
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column - currentWord.length - 1, // include '<'
          endColumn: position.column
        };

        const suggestions = htmlTags.map(tag => ({
          label: `<${tag}>…</${tag}>`,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: `<${tag}>$0</${tag}>`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          sortText: `000${tag}`, // prefer our snippets
          filterText: `<${tag}>`,
          range
        }));

        return { suggestions };
      }
    });
    providerDisposables.push(htmlTagProvider);

    // Cleanup completion providers on unmount
    editor.onDidDispose(() => {
      providerDisposables.forEach(d => d.dispose());
    });

    // Apply custom theme colors - now using the syntax theme
    monaco.editor.setTheme(getMonacoTheme());

    setIsEditorReady(true);
  };

  // Sync content to backend for Git/Server operations
  useEffect(() => {
    if (!isEditorReady || !editorRef.current || !socket || !isConnected || !session?.id || readOnly) return;

    const editor = editorRef.current;

    const syncContentToBackend = (content: string) => {

      if (isBindingTransitionRef.current) return;

      if (!content || content.length === 0) return;
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(() => {
        if (socket && isConnected && session?.id) {
          // Using current values from closures/refs will work because this function is recreated 
          // every time useEffect runs, which happens when dependencies change.

          // CRITICAL: Normalize content to LF before sending to backend
          // This prevents the backend from storing CRLF which causes double-spacing and offset drift
          const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

          socket.emit('content_change', {
            session_id: session.id,
            file_name: currentActiveFile,
            content: normalizedContent
          });

          // Also emit an operation-like event to trigger GitPanel refresh
          socket.emit('files_changed', {
            session_id: session.id,
            reason: 'edit'
          });
        }
      }, 1000);
    };


    const disposable = editor.onDidChangeModelContent((event) => {
      if (event.isFlush) return;
      syncContentToBackend(editor.getValue());
      
      // Dispatch event to indicate content changed
      window.dispatchEvent(new CustomEvent('codepark_content_changed'));
    });

    return () => {
      disposable.dispose();
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isEditorReady, socket, isConnected, session?.id, currentActiveFile, readOnly]);


  // 1.5. Manage File Content Loading (Lazy Loading from Filesystem)
  useEffect(() => {
    if (!session?.id || !currentActiveFile || !ydoc) {
      setIsFileContentReady(false);
      return;
    }

    const yText = ydoc.getText(currentActiveFile);

    if (yText.length > 0) {
      console.log('[Yjs] Content already present in Y.Text for:', currentActiveFile);
      setIsFileContentReady(true);
      return;
    }

    // Y.Text is empty, we must fetch from backend
    setIsFileContentReady(false);

    if (socket && isConnected) {
      if (loadingFilesRef.current.has(currentActiveFile)) {
        console.log('[Yjs] Request already in flight for:', currentActiveFile);
        return;
      }
      loadingFilesRef.current.add(currentActiveFile);
      console.log('[Yjs] Requesting content for empty file:', currentActiveFile);
      socket.emit('open_file_request', {
        session_id: session.id,
        file_name: currentActiveFile,
      });
    }
  }, [currentActiveFile, session?.id, socket, isConnected, ydoc]);

  useEffect(() => {
    if (!socket) return;

    const handleOpenFileResponse = (data: { file_name: string; content: string }) => {
      loadingFilesRef.current.delete(data.file_name);
      if (!ydoc) return;

      const yText = ydoc.getText(data.file_name);

      if (yText.length === 0 && data.content && data.content.length > 0) {
        console.log('[Yjs] Populating file content from open_file_response for:', data.file_name);
        ydoc.transact(() => {
          yText.insert(0, data.content);
        }, 'initial-populate');
      }

      if (data.file_name === activeFileRef.current) {
        setIsFileContentReady(true);
      }
    };

    socket.on('open_file_response', handleOpenFileResponse as any);

    return () => {
      socket.off('open_file_response', handleOpenFileResponse as any);
    };
  }, [socket, ydoc]);

  // 3. Manage Binding (Editor <-> Y.Doc)
  // Track if we're currently in the middle of creating/destroying bindings to prevent recursion
  const isBindingTransitionRef = useRef(false);

  useEffect(() => {
    console.log('[Yjs] 🔍 BINDING EFFECT TRIGGERED for:', currentActiveFile, {
      editor: !!editorRef.current,
      provider: !!provider,
      sessionId: !!session?.id,
      isEditorReady,
      isSynced
    });

    // ✅ CRITICAL: Wait for provider to be synced AND editor to be ready AND file content to be loaded
    // If we create binding before sync or before content is loaded, it gets bound to incomplete/empty state
    if (!editorRef.current || !provider || !session?.id || !isEditorReady || !isSynced || !isFileContentReady || !ydoc) {
      console.log('[Yjs] ⛔ STALLING binding (waiting for dependencies): ', {
        editor: !!editorRef.current,
        provider: !!provider,
        sessionId: !!session?.id,
        isEditorReady,
        isSynced,
        isFileContentReady
      });
      return;
    }

    if (isBindingTransitionRef.current) {
      console.log('[Yjs] ⚠️ Skipping binding creation - binding transition in progress for:', currentActiveFile);
      return;
    }

    console.log('[Yjs-Debug] 🔄 Attempting binding for:', currentActiveFile, {
      isTransitioning: isBindingTransitionRef.current,
      editorReady: !!editorRef.current,
      providerReady: !!provider
    });

    const yText = ydoc.getText(currentActiveFile);

    // Repopulate logic - use a separate transact to avoid binding conflicts
    const sessionContent = session.files[currentActiveFile]?.content || "";
    if (yText.length === 0 && sessionContent.length > 0) {
      console.log("[Yjs] Repopulating empty text for:", currentActiveFile);
      const lenBefore = yText.length;
      ydoc.transact(() => {
        yText.insert(0, sessionContent);
        console.log('[YJS_WRITE]', {
          timestamp: new Date().toISOString(),
          clientId: clientIdentity?.id || 'unknown',
          fileName: currentActiveFile,
          functionName: 'repopulateActiveFile',
          triggerSource: 'FILE_SWITCH',
          lengthBefore: lenBefore,
          lengthAfter: yText.length
        });
      }, 'initial-populate');
    }

    const model = editorRef.current.getModel();
    if (!model) return;

    if (!(model as any).__uniqueId) {
      (model as any).__uniqueId = `model_${Math.random().toString(36).slice(2, 10)}`;
    }
    const modelObjectId = (model as any).__uniqueId;

    // Cache the mapping status
    console.log('[ACTIVE_FILE_MODEL_MAPPING]', {
      activeFile: currentActiveFile,
      modelUri: model.uri.toString(),
      modelObjectId: modelObjectId,
    });

    let prevYTextContent = yText.toString();
    let prevModelContent = model.getValue();

    const checkDuplication = (oldContent: string, newContent: string, source: 'monaco' | 'ytext') => {
      if (oldContent && oldContent.length > 0 && newContent.length >= oldContent.length * 2) {
        const doubleOld = oldContent + oldContent;
        const isDuplicated = newContent === doubleOld || newContent.includes(doubleOld);
        if (isDuplicated) {
          console.log('[DUPLICATION_DETECTED]', {
            fileId: currentActiveFile,
            previousContent: oldContent,
            newContent: newContent,
            source,
            activeFile: currentActiveFile,
            modelObjectId: modelObjectId,
            currentBindingFileId: bindingFileIdRef.current,
            currentYTextName: currentActiveFile,
            lastBindingLogs: {
              MONACO_MODEL_BEFORE_BIND: lastBeforeBindLogRef.current,
              MONACO_MODEL_AFTER_BIND: lastAfterBindLogRef.current,
              MONACO_BINDING_CREATE: lastCreateLogRef.current,
              MONACO_BINDING_DESTROY: lastDestroyLogRef.current
            }
          });
        }
      }
    };

    // Observe mutations on the Y.Text object
    const ytextObserver = (_event: Y.YTextEvent) => {
      const currentContent = yText.toString();
      checkDuplication(prevYTextContent, currentContent, 'ytext');
      prevYTextContent = currentContent;
    };
    yText.observe(ytextObserver);

    // Observe content changes in the Monaco model
    const contentChangeDisposable = model.onDidChangeContent(() => {
      const currentContent = model.getValue();
      checkDuplication(prevModelContent, currentContent, 'monaco');
      prevModelContent = currentContent;
    });

    // Protect against recursion by setting flag before binding creation
    isBindingTransitionRef.current = true;
    if (provider) {
      provider.setBindingTransition(true);
    }
    console.log('[Yjs] 🟡 Creating MonacoBinding for:', currentActiveFile);
    console.log('[Yjs-Debug] GUID Check:', {
      editorYDocGuid: ydoc.guid,
      providerYDocGuid: (provider as any).doc?.guid
    });

    try {
      lastBeforeBindLogRef.current = {
        fileId: currentActiveFile,
        modelUri: model.uri.toString(),
        modelObjectId: modelObjectId,
        modelLength: model.getValue().length,
        modelContent: model.getValue(),
        yTextLength: yText.length,
        yTextContent: yText.toString(),
      };

      const binding = new MonacoBinding(
        yText,
        model,
        new Set([editorRef.current]),
        provider.awareness
      );
      bindingRef.current = binding;
      bindingFileIdRef.current = currentActiveFile;

      lastAfterBindLogRef.current = {
        fileId: currentActiveFile,
        modelUri: model.uri.toString(),
        modelObjectId: modelObjectId,
        modelLength: model.getValue().length,
        modelContent: model.getValue(),
        yTextLength: yText.length,
        yTextContent: yText.toString(),
      };

      lastCreateLogRef.current = {
        fileId: currentActiveFile,
        modelUri: model.uri.toString(),
        yTextName: currentActiveFile,
        modelObjectId: modelObjectId,
        timestamp: new Date().toISOString()
      };

      // Restore cursor position from localStorage after binding is active
      if (session?.id && currentActiveFile && editorRef.current) {
        try {
          const cachedCursor = localStorage.getItem(`codepark_cursor_${session.id}_${currentActiveFile}`);
          if (cachedCursor) {
            const pos = JSON.parse(cachedCursor);
            if (pos && typeof pos.line === 'number' && typeof pos.column === 'number') {
              editorRef.current.setPosition({
                lineNumber: pos.line,
                column: pos.column
              });
              editorRef.current.revealPositionInCenter({
                lineNumber: pos.line,
                column: pos.column
              });
            }
          }
        } catch (err) {
          console.error('[CodeEditor] Failed to restore cursor position:', err);
        }
      }
    } catch (err) {
      console.error('[Yjs] ❌ Error creating MonacoBinding for:', currentActiveFile, err);
    } finally {
      // Reset flag after binding is created
      isBindingTransitionRef.current = false;
      if (provider) {
        provider.setBindingTransition(false);
      }
      console.log('[Yjs] 🟢 Binding transition complete for:', currentActiveFile);
    }

    return () => {
      isBindingTransitionRef.current = true;
      if (provider) {
        provider.setBindingTransition(true);
      }
      try {
        yText.unobserve(ytextObserver);
        contentChangeDisposable.dispose();

        if (bindingRef.current) {
          lastDestroyLogRef.current = {
            fileId: currentActiveFile,
            modelUri: model.uri.toString(),
            yTextName: currentActiveFile,
            modelObjectId: modelObjectId,
            timestamp: new Date().toISOString()
          };
          bindingRef.current.destroy();
          bindingRef.current = null;
          bindingFileIdRef.current = null;
        }
      } catch (err) {
        console.error('[Yjs] Error destroying binding for:', currentActiveFile, err);
      } finally {
        isBindingTransitionRef.current = false;
        if (provider) {
          provider.setBindingTransition(false);
        }
      }
    };
  }, [currentActiveFile, session?.id, isSynced, isEditorReady, isFileContentReady, ydoc, provider]);
  // The binding will still have access to latest editorRef via closure

  // 3.5. Sync content when active file changes
  useEffect(() => {
    if (!isEditorReady || !editorRef.current || !socket || !isConnected || !session?.id || readOnly) return;

    // Force sync current content when switching files to ensure previous file's content is saved
    const currentContent = editorRef.current.getValue();
    if (!currentContent || currentContent.length === 0) return;
    if (socket && isConnected && session?.id) {
      socket.emit('content_change', {
        session_id: session.id,
        file_name: currentActiveFile,
        content: currentContent
      });
    }
  }, [currentActiveFile, isEditorReady, socket, isConnected, session?.id, readOnly]);

  // 4. Manage Awareness (User Identity)
  // Set awareness as soon as provider + identity are available.
  // clientIdentity.color is already the canonical color: it is set to computedCollaboratorColor
  // in SessionContext, which applies the correct pro/free precedence:
  //   - Pro users: settings.collaboratorColor (their chosen custom color)
  //   - Free users: user.color (profile color) || getStableCollaboratorColor() (stable random)
  // We do NOT re-derive the color here — clientIdentity is the single source of truth.
  useEffect(() => {
    if (!provider || !clientIdentity) return;

    // clientIdentity.color is the canonical collaborator color — use it directly.
    const userColor = clientIdentity.color || '#a0a0a0';
    const displayName = clientIdentity.name || 'Collaborator';

    // Broadcast identity as AwarenessUserState — the typed contract for what peers receive.
    // Include avatar now so future cursor tooltips don't require a protocol change.
    const awarenessState: AwarenessUserState = {
      name: displayName,
      color: userColor,
      avatar: clientIdentity.avatar,
    };
    console.log('[Awareness] Setting local state — user:', displayName, 'color:', userColor);
    provider.awareness.setLocalStateField('user', awarenessState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientIdentity, provider]);

  // 5. Dynamic Cursor Styling
  // Generates per-clientId CSS rules that apply the user's assigned color to:
  //   • The cursor caret line
  //   • The cursor-head flag dot
  //   • The name label (always visible for ~2 s, then fades; reappears fully on hover)
  //   • The selection highlight region
  // No hardcoded cyan anywhere — fallback is grey (#a0a0a0).
  useEffect(() => {
    if (!provider) return;

    const styleId = 'yjs-cursor-styles';
    let styleSheet = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = styleId;
      document.head.appendChild(styleSheet);
    }

    const updateCursorStyles = () => {
      const states = provider.awareness.getStates();
      const selfClientId = provider.awareness.clientID;
      let css = '';

      // Keyframe animation: label appears immediately, then fades after 2 s.
      // On hover the label snaps back to opacity 1 via the :hover rule below.
      css += `
@keyframes cpLabelFadeOut {
  0%   { opacity: 1; }
  60%  { opacity: 1; }
  100% { opacity: 0; }
}
`;

      states.forEach((state: any, clientId: number) => {
        // Skip our own cursor — Monaco renders the local caret natively
        if (clientId === selfClientId) return;

        // Type the awareness user state for safe field access
        const userState = state.user as AwarenessUserState | undefined;
        const color = userState?.color || '#a0a0a0';
        const name  = userState?.name  || 'Collaborator';
        // Escape the name for CSS content: replace backslash first, then double-quotes
        const safeName = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

        // Selection highlight — user color at ~25 % opacity
        const selectionBg = getHexAlpha(color, '40');
        css += `.yRemoteSelection-${clientId} {
  background-color: ${selectionBg} !important;
  border-radius: 1px !important;
}\n`;

        // Cursor caret — thin vertical line in user's color
        css += `.yRemoteSelectionHead-${clientId} {
  position: absolute !important;
  border-left: 2px solid ${color} !important;
  height: 100% !important;
  box-sizing: border-box !important;
  pointer-events: auto !important;
  cursor: default !important;
}\n`;

        // Flag dot at the top of the caret
        css += `.yRemoteSelectionHead-${clientId}::after {
  content: "" !important;
  position: absolute !important;
  width: 7px !important;
  height: 7px !important;
  background-color: ${color} !important;
  border-radius: 50% 50% 50% 0 !important;
  left: -4px !important;
  top: -7px !important;
  display: block !important;
}\n`;

        // Name label — always rendered; fades out after 2 s, re-appears on hover.
        // Uses animation-fill-mode: forwards so it stays hidden after the fade.
        css += `.yRemoteSelectionHead-${clientId}::before {
  content: "${safeName}" !important;
  position: absolute !important;
  top: -22px !important;
  left: -1px !important;
  background-color: ${color} !important;
  color: #fff !important;
  padding: 1px 6px 2px !important;
  border-radius: 3px 3px 3px 0 !important;
  font-size: 10px !important;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif !important;
  font-weight: 600 !important;
  line-height: 1.4 !important;
  letter-spacing: 0.01em !important;
  white-space: nowrap !important;
  pointer-events: none !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
  z-index: 200 !important;
  animation: cpLabelFadeOut 2s ease-in 0.5s forwards !important;
  opacity: 1 !important;
}\n`;

        // On hover: show the label at full opacity regardless of animation state.
        css += `.yRemoteSelectionHead-${clientId}:hover::before {
  opacity: 1 !important;
  animation: none !important;
}\n`;

        // Hovering the selection body also surfaces the label.
        css += `.yRemoteSelection-${clientId}:hover ~ .yRemoteSelectionHead-${clientId}::before,
.yRemoteSelection-${clientId}:hover + .yRemoteSelectionHead-${clientId}::before {
  opacity: 1 !important;
  animation: none !important;
}\n`;
      });

      if (styleSheet.innerHTML !== css) {
        styleSheet.innerHTML = css;
      }
    };

    updateCursorStyles();
    provider.awareness.on('change', updateCursorStyles);

    return () => {
      provider.awareness.off('change', updateCursorStyles);
    };
  }, [isSynced]);

  // Cleanup Monaco models on unmount
  useEffect(() => {
    return () => {
      if (monacoRef.current) {
        const models = monacoRef.current.editor.getModels();
        models.forEach((model: any) => {
          model.dispose();
        });
      }
    };
  }, []);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getCurrentContent: () => {
      if (editorRef.current) {
        return editorRef.current.getValue();
      }
      return null;
    },
    getCurrentFile: () => {
      return currentActiveFile || null;
    },
    getCurrentLanguage: () => {
      if (currentActiveFile) {
        const extension = currentActiveFile.split('.').pop()?.toLowerCase();
        // Map extensions to languages
        const langMap: { [key: string]: string } = {
          'py': 'python',
          'js': 'javascript',
          'ts': 'typescript',
          'cpp': 'cpp',
          'c': 'c',
          'java': 'java',
          'go': 'go',
          'rs': 'rust',
          'php': 'php',
          'rb': 'ruby',
          'sh': 'shell',
          'bash': 'shell'
        };
        return langMap[extension || ''] || 'python';
      }
      return 'python'; // default
    },
    focus: () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  }), [currentActiveFile]);

  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: getFontSize(),
        lineHeight: getLineHeight(),
        fontFamily: getFontFamily(),
        minimap: { enabled: settings.minimap },
        lineNumbers: settings.lineNumbers,
        wordWrap: settings.wordWrap,
      });
    }
  }, [settings.fontSize, settings.lineHeight, settings.editorFont, settings.minimap, settings.lineNumbers, settings.wordWrap]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly, domReadOnly: readOnly });
    }
  }, [readOnly]);

  // Update theme when editorTheme changes
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(getMonacoTheme());
    }
  }, [editorTheme]);

  // Update breakpoint decorations
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const fileBreakpoints = breakpoints.filter(bp => bp.file === currentActiveFile && bp.enabled);

    const newDecorations = fileBreakpoints.map(bp => ({
      range: new monacoRef.current!.Range(bp.line, 1, bp.line, 1),
      options: {
        isWholeLine: true,
        glyphMarginClassName: 'breakpoint-glyph',
        glyphMarginHoverMessage: { value: 'Breakpoint' },
        className: 'breakpoint-line'
      }
    }));

    isUpdatingDecorationsRef.current = true;
    decorationIdsRef.current = editor.deltaDecorations(decorationIdsRef.current, newDecorations);
    isUpdatingDecorationsRef.current = false;
  }, [breakpoints, currentActiveFile, isEditorReady]);


  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ overflowX: 'hidden' }}>

      {/* Monaco Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/*Adding the yesdisp logic*/}
        {yesdisp ? (
          <Editor
            height="100%"
            language={language}
            // Value handled by Yjs - do not bind `value` prop to state to avoid conflicts
            defaultValue={session?.files[currentActiveFile]?.content || ''}
            theme={getMonacoTheme()}
            onMount={handleEditorDidMount}
            options={{
              readOnly,
              domReadOnly: readOnly,
              fontSize: getFontSize(),
              lineHeight: getLineHeight(),
              fontFamily: getFontFamily(),
              minimap: { enabled: settings.minimap },
              lineNumbers: settings.lineNumbers,
              lineNumbersMinChars: 3,
              wordWrap: settings.wordWrap,
              glyphMargin: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              formatOnType: true,
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              autoClosingDelete: 'always',
              autoClosingOvertype: 'always',
              smoothScrolling: true,
              cursorSmoothCaretAnimation: 'on',
              cursorBlinking: 'smooth',
              // Autocompletion settings
              scrollbar: {
                horizontal: 'hidden',
                horizontalScrollbarSize: 0,
              },
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true,
              },
              parameterHints: {
                enabled: true,
              },
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              tabCompletion: 'on',
              wordBasedSuggestions: 'allDocuments',
              suggest: {
                showWords: true,
                showSnippets: true,
              },
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>This File Cannot be displayed</p>
          </div>
        )}
      </div>

      {/*ACTUAL LOLGIC TO DISPLAY ABOVE I CANT FIGURE OUT HOW TO PUT COMMENTS IN MIDDLE OF FUNCTONI IT BROKE IT*/}

      {/* Status Bar */}
      {/* Status Bar - Hidden on mobile to prevent overlap with global footer */}
      <div
        className="hidden md:flex items-center justify-between px-4 h-7 text-xs border-t font-medium animate-slide-up"
        style={{
          background: `linear-gradient(135deg, ${settings.accentColor}, ${getHexAlpha(settings.accentColor, 'dd')})`,
          color: 'white',
          borderColor: themeColors.border,
          transition: 'all 0.3s ease'
        }}
      >
        <div className="flex items-center gap-4">
          <span className="transition-all duration-300 hover:scale-110">{language.charAt(0).toUpperCase() + language.slice(1)}</span>
          <span className="transition-all duration-300 hover:scale-110">UTF-8</span>
          <span className={`transition-all duration-500 ${isSynced ? 'animate-pulse-subtle' : 'animate-pulse'}`}>
            {isSynced ? '✓ Synced' : '⟳ Connecting...'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="transition-all duration-200 tabular-nums">Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
          {collaborators.length > 1 && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white/20 rounded transition-all duration-300 hover:bg-white/30 hover:scale-105 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
              {collaborators.length} online
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';
// in this file and statusbar.tsx the hex usage is being used by the newly created gethexalpha function
//fuck this shit bro im not working on frontend i tried to change a single fucking color 
