import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
    Play, Download, Plus, Trash2, File,
    Terminal as TerminalIcon, Loader2, Lock, ArrowLeft
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { WasmManager } from '../services/wasm/WasmManager';
import { Button } from '../components/ui';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface GuestFile {
    name: string;
    content: string;
    language: string;
}

const MAX_FILES = 2; // Strict limit as per request



export default function GuestEditorPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { settings, themeColors } = useTheme();

    // State
    const [files, setFiles] = useState<GuestFile[]>([
        { name: 'main.py', content: 'print("Hello from Guest Session!")\nprint("This code runs in your browser.")\n', language: 'python' }
    ]);
    const [activeFileName, setActiveFileName] = useState('main.py');
    const [terminalLines, setTerminalLines] = useState<{ type: 'output' | 'error', content: string }[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isZipping, setIsZipping] = useState(false);

    const wasmManager = useRef<WasmManager | null>(null);


    const activeFile = files.find(f => f.name === activeFileName) || files[0];

    // Initialize WasmManager
    useEffect(() => {
        wasmManager.current = new WasmManager({
            onOutput: (output) => {
                // Check for ZIP download token
                if (output.chunk.includes('ZIP_START:')) {
                    handleZipDownload(output.chunk);
                    return;
                }
                setTerminalLines(prev => [...prev, { type: 'output', content: output.chunk }]);
            },
            onComplete: (result) => {
                setIsExecuting(false);
                setIsZipping(false);
                setTerminalLines(prev => [...prev, {
                    type: 'output',
                    content: `\nExecution finished in ${result.duration.toFixed(3)}s (Exit Code: ${result.exitCode})`
                }]);
            },
            onError: (err) => {
                setIsExecuting(false);
                setIsZipping(false);
                setTerminalLines(prev => [...prev, { type: 'error', content: err }]);
            }
        });

        return () => {
            wasmManager.current?.stop();
        };
    }, []);

    const handleZipDownload = (chunk: string) => {
        try {
            const match = chunk.match(/ZIP_START:(.*):ZIP_END/);
            if (match && match[1]) {
                const base64 = match[1];
                const binaryString = window.atob(base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: 'application/zip' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'guest-project.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                toast.success('Project downloaded!');
            }
        } catch (e) {
            console.error('Zip download failed', e);
            toast.error('Failed to generate download');
        }
    };

    const handleRun = async () => {
        if (!wasmManager.current) return;
        if (activeFile.language !== 'python') {
            toast.error('Only Python execution is supported in the guest playground.');
            return;
        }

        setIsExecuting(true);
        setTerminalLines([{ type: 'output', content: `Running ${activeFile.name}...\n` }]);

        try {
            await wasmManager.current.run(activeFile.content, activeFile.language);
        } catch (e: any) {
            setTerminalLines(prev => [...prev, { type: 'error', content: e.message }]);
            setIsExecuting(false);
        }
    };

    const handleDownloadProject = async () => {
        if (!wasmManager.current) return;
        setIsZipping(true);
        toast.info('Preparing download...');

        // Generate Python script to zip files
        const fileDict = files.reduce((acc, f) => {
            acc[f.name] = f.content;
            return acc;
        }, {} as Record<string, string>);

        const pythonZipScript = `
import zipfile, io, base64

files = ${JSON.stringify(fileDict)}
bio = io.BytesIO()

with zipfile.ZipFile(bio, 'w') as zf:
    for name, content in files.items():
        zf.writestr(name, content)

# Print base64 token for JS to intercept
print(f"ZIP_START:{base64.b64encode(bio.getvalue()).decode()}:ZIP_END")
`;

        try {
            await wasmManager.current.run(pythonZipScript, 'python');
        } catch (e) {
            setIsZipping(false);
            toast.error('Failed to create zip archive');
        }
    };

    const handleCreateFile = () => {
        if (files.length >= MAX_FILES) {
            toast.error(`Guest session limited to ${MAX_FILES} files.`);
            return;
        }
        const newName = `script${files.length + 1}.py`;
        setFiles([...files, { name: newName, content: '# New python script\n', language: 'python' }]);
        setActiveFileName(newName);
    };

    const handleDeleteFile = (name: string) => {
        if (files.length <= 1) {
            toast.error('Cannot delete the last file');
            return;
        }
        const newFiles = files.filter(f => f.name !== name);
        setFiles(newFiles);
        if (activeFileName === name) {
            setActiveFileName(newFiles[0].name);
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value === undefined) return;
        setFiles(files.map(f => f.name === activeFileName ? { ...f, content: value } : f));
    };

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden" style={{ background: themeColors.bg, color: themeColors.text }}>
            {/* Header */}
            <header className="h-14 border-b flex items-center justify-between px-4 shrink-0"
                style={{ borderColor: themeColors.border, background: settings.uiTheme === 'light' ? '#f8fafc' : '#0f172a' }}>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/')} title="Exit to Home">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="CodePark" className="w-6 h-6" />
                        <span className="font-bold text-lg">CodePark</span>
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 font-medium opacity-70 hidden md:block">
                    Playground
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownloadProject}
                        disabled={isZipping || isExecuting}
                        title="Download as ZIP"
                    >
                        {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        <span className="ml-2 hidden sm:inline">Download</span>
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/auth?signup=true')}
                        className="shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}dd)` }}
                    >
                        Sign up to save projects
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r flex flex-col shrink-0" style={{ borderColor: themeColors.border, background: themeColors.bg }}>
                    <div className="p-3 border-b flex justify-between items-center" style={{ borderColor: themeColors.border }}>
                        <span className="text-sm font-semibold opacity-70">Files ({files.length}/{MAX_FILES})</span>
                        <button onClick={handleCreateFile} className="p-1 hover:bg-white/10 rounded" title="New File">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 p-2 space-y-1">
                        {files.map(file => (
                            <div
                                key={file.name}
                                onClick={() => setActiveFileName(file.name)}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm group ${activeFileName === file.name ? 'bg-white/10 font-medium' : 'hover:bg-white/5 opacity-80'
                                    }`}
                                style={{ color: activeFileName === file.name ? settings.accentColor : 'inherit' }}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <File className="w-4 h-4 shrink-0" />
                                    <span className="truncate">{file.name}</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.name); }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t mt-auto" style={{ borderColor: themeColors.border }}>
                        <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20 text-xs">
                            <div className="flex items-center gap-2 mb-2 text-blue-400 font-semibold">
                                <Lock className="w-3 h-3" />
                                <span>Restricted Mode</span>
                            </div>
                            <p className="opacity-80 mb-2">
                                This session is temporary. All files will be lost upon refresh.
                            </p>
                            <ul className="list-disc pl-3 opacity-70 space-y-1">
                                <li>No server access</li>
                                <li>No containers</li>
                                <li>Python & JS only</li>
                                <li>Max {MAX_FILES} files</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Editor & Terminal */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            path={activeFile.name}
                            language={activeFile.language}
                            value={activeFile.content}
                            onChange={handleEditorChange}
                            theme={settings.editorTheme === 'light' ? 'light' : 'vs-dark'}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: 'JetBrains Mono, monospace',
                                scrollBeyondLastLine: false,
                                padding: { top: 16 }
                            }}
                        />

                        {/* Run Button Overlay */}
                        <div className="absolute top-4 right-6 z-10">
                            <Button
                                onClick={handleRun}
                                disabled={isExecuting}
                                className="shadow-xl"
                                style={{ backgroundColor: '#22c55e', color: 'white' }}
                            >
                                {isExecuting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                Run Code
                            </Button>
                        </div>
                    </div>

                    {/* Terminal */}
                    <div className="h-48 border-t flex flex-col" style={{ borderColor: themeColors.border, background: '#0f172a' }}>
                        <div className="h-8 flex items-center px-4 border-b bg-white/5" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                            <TerminalIcon className="w-3 h-3 mr-2 opacity-50" />
                            <span className="text-xs font-mono opacity-70">TERMINAL OUTPUT</span>
                            <button onClick={() => setTerminalLines([])} className="ml-auto text-xs opacity-50 hover:opacity-100 hover:text-red-400">
                                Clear
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 font-mono text-sm space-y-1">
                            {terminalLines.length === 0 && (
                                <div className="text-gray-500">Ready to run...</div>
                            )}
                            {terminalLines.map((line, i) => (
                                <div key={i} className={line.type === 'error' ? 'text-red-400' : 'text-gray-300'}>
                                    {line.content}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
