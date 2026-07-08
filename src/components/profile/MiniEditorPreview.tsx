import { useTheme, editorThemes } from '../../contexts/ThemeContext';
import { Files, Bug, GitBranch, Settings, Play, Terminal as TerminalIcon } from 'lucide-react';

export default function MiniEditorPreview() {
    const { settings, themeColors } = useTheme();
    const editorColors = editorThemes[settings.editorTheme] || editorThemes.dark;

    // Font family mapping
    const fontFamilies = {
        cascadia: '"Cascadia Code", Consolas, monospace',
        fira: '"Fira Code", monospace',
        jetbrains: '"JetBrains Mono", monospace',
        consolas: 'Consolas, monospace',
        space: '"Space Mono", monospace',
        ibm: '"IBM Plex Mono", monospace'
    };

    // Font size mapping
    const fontSizes = {
        small: '10px',
        medium: '12px',
        large: '14px'
    };

    // Line height mapping
    const lineHeights = {
        compact: '1.2',
        normal: '1.5',
        relaxed: '1.8'
    };

    const isLightTheme = settings.editorTheme.includes('light') || settings.editorTheme === 'light';

    // Syntax colors based on light/dark mode
    const syntax = isLightTheme ? {
        func: '#795e26',   // Brown/Gold
        keyword: '#3fff8b', // Neon Green
        number: '#098658',  // Green
        comment: '#008000', // Forest Green
        operator: '#000000'
    } : {
        func: '#dcdcaa',   // Light Yellow
        keyword: settings.accentColor,
        number: '#b5cea8',  // Light Green
        comment: '#6a9955', // Grey-Green
        operator: themeColors.textSecondary
    };

    return (
        <div
            className="w-full rounded-2xl border overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{
                background: editorColors.bg,
                borderColor: editorColors.border || themeColors.border,
                height: '320px'
            }}
        >
            {/* Window Header */}
            <div className="h-8 flex items-center justify-center px-3 border-b"
                style={{
                    background: editorColors.navBg || 'rgba(0,0,0,0.05)',
                    borderColor: editorColors.border || themeColors.border
                }}>
                <div className="text-[10px] opacity-60 font-medium" style={{ color: editorColors.text }}>preview.py — CodePark</div>
            </div>

            <div className="flex h-[calc(100%-32px)]">
                {/* Mini Activity Bar */}
                <div className="w-10 flex flex-col items-center py-3 gap-4 border-r"
                    style={{
                        background: editorColors.navBg || 'rgba(0,0,0,0.05)',
                        borderColor: editorColors.border || themeColors.border
                    }}>
                    <Files size={14} className="opacity-60" style={{ color: editorColors.text }} />
                    <Bug size={14} className="opacity-60" style={{ color: editorColors.text }} />
                    <GitBranch size={14} className="opacity-60" style={{ color: editorColors.text }} />
                    <div className="mt-auto">
                        <Settings size={14} style={{ color: settings.accentColor }} />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden" style={{ background: editorColors.bg }}>
                    {/* Tabs */}
                    <div className="h-7 flex border-b" style={{ background: editorColors.navBg || 'rgba(0,0,0,0.05)', borderColor: editorColors.border || themeColors.border }}>
                        <div className="px-3 flex items-center gap-2 h-full border-r text-[10px] font-medium"
                            style={{ background: editorColors.bg, borderColor: editorColors.border || themeColors.border, color: editorColors.text }}>
                            <span>preview.py</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Gutter */}
                        {settings.lineNumbers === 'on' && (
                            <div className="w-8 py-3 text-right pr-2 select-none opacity-40 font-mono text-[10px]" style={{ color: editorColors.text }}>
                                <div>1</div>
                                <div>2</div>
                                <div>3</div>
                                <div>4</div>
                                <div>5</div>
                                <div>6</div>
                                <div>7</div>
                                <div>8</div>
                            </div>
                        )}

                        {/* Editor Text */}
                        <div className="flex-1 py-3 px-1 overflow-hidden relative">
                            <pre className="m-0 font-mono whitespace-pre"
                                style={{
                                    fontFamily: fontFamilies[settings.editorFont],
                                    fontSize: fontSizes[settings.fontSize],
                                    lineHeight: lineHeights[settings.lineHeight],
                                    color: editorColors.text
                                }}>
                                <span style={{ color: isLightTheme ? '#0000ff' : settings.accentColor }}>def</span> <span style={{ color: syntax.func }}>fibonacci</span>(n):{'\n'}
                                {'    '}<span style={{ color: isLightTheme ? '#0000ff' : settings.accentColor }}>if</span> n <span style={{ color: syntax.operator }}>&lt;=</span> <span style={{ color: syntax.number }}>1</span>:{'\n'}
                                {'        '}<span style={{ color: isLightTheme ? '#0000ff' : settings.accentColor }}>return</span> n{'\n'}
                                {'    '}<span style={{ color: isLightTheme ? '#0000ff' : settings.accentColor }}>return</span> <span style={{ color: syntax.func }}>fibonacci</span>(n<span style={{ color: syntax.operator }}>-</span><span style={{ color: syntax.number }}>1</span>) <span style={{ color: syntax.operator }}>+</span> <span style={{ color: syntax.func }}>fibonacci</span>(n<span style={{ color: syntax.operator }}>-</span><span style={{ color: syntax.number }}>2</span>){'\n'}
                                {'\n'}
                                <span style={{ color: syntax.comment }}># Test the function</span>{'\n'}
                                <span style={{ color: syntax.func }}>print</span>(<span style={{ color: syntax.func }}>fibonacci</span>(<span style={{ color: syntax.number }}>10</span>))
                            </pre>

                            {/* Minimap Mock */}
                            {settings.minimap && (
                                <div className="absolute right-1 top-3 w-12 h-24 opacity-20 select-none pointer-events-none" style={{ background: editorColors.textSecondary + '22' }}>
                                    <div className="h-full w-full flex flex-col gap-0.5 p-1">
                                        {[...Array(12)].map((_, i) => (
                                            <div key={i} className="h-0.5 rounded-full" style={{ width: `${Math.random() * 80 + 20}%`, background: editorColors.textSecondary }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mini Terminal */}
                    <div className="h-20 border-t flex flex-col" style={{ background: editorColors.bg, borderColor: editorColors.border || themeColors.border }}>
                        <div className="h-6 flex items-center px-3 justify-between border-b"
                            style={{
                                background: editorColors.navBg || 'rgba(0,0,0,0.05)',
                                borderColor: editorColors.border || themeColors.border
                            }}>
                            <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest opacity-60" style={{ color: editorColors.text }}>
                                <TerminalIcon size={10} /> Terminal
                            </div>
                            <Play size={10} className="text-green-500" />
                        </div>
                        <div className="flex-1 p-2 font-mono text-[9px] opacity-70 overflow-hidden" style={{ color: editorColors.text }}>
                            <div>$ python preview.py</div>
                            <div style={{ color: isLightTheme ? '#0000ff' : settings.accentColor }}>55</div>
                            <div>$ _</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
