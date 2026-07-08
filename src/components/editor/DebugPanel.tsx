import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Play,
  Square,
  RotateCcw,
  Trash2,
  Bot,
  Sparkles,
  Bug,
  SkipForward,
  CornerDownRight,
  CornerUpLeft,
  Pause,
  Circle,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Terminal as TerminalIcon
} from 'lucide-react'; import { useTheme } from '../../contexts/ThemeContext';
import { useSocket } from '../../contexts/SocketContext';
import { useSession } from '../../contexts/SessionContext';
import { apiClient } from '../../services/api';
import type { Breakpoint, DebugState } from '../../types';

interface DebugPanelProps {
  onRun: () => void;
  onStop: () => void;
  isExecuting: boolean;
  getCurrentContent: () => string | null;
  getCurrentFile: () => string | null;
  getCurrentLanguage: () => string | null;
  breakpoints: Breakpoint[];
  onBreakpointsChange: (breakpoints: Breakpoint[]) => void;
}

interface LogMessage {
  type: 'info' | 'error' | 'warning' | 'success';
  text: string;
  timestamp: Date;
}

type DebugMode = 'standard' | 'ai';

interface SectionProps {
  title: string;
  icon: React.ElementType;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  themeColors: any;
  settings: any;
}

function DebugSection({ title, icon: Icon, isExpanded, onToggle, children, themeColors }: Omit<SectionProps, 'settings'>) {
  return (
    <div className="flex flex-col border-b border-white/5 last:border-0 overflow-hidden">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors text-left"
        style={{ color: themeColors.text }}
      >
        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
          <ChevronRight size={14} style={{ color: themeColors.textSecondary }} />
        </div>
        {Icon && <Icon size={14} style={{ color: themeColors.textSecondary }} className="opacity-70" />}
        <span className="text-[10px] font-bold uppercase tracking-wider flex-1 opacity-80">
          {title}
        </span>
      </button>
      {isExpanded && (
        <div className="flex-1 overflow-auto bg-black/5">
          {children}
        </div>
      )}
    </div>
  );
}

export function DebugPanel({
  onRun,
  onStop,
  isExecuting,
  getCurrentContent,
  getCurrentFile,
  getCurrentLanguage,
  breakpoints,
  onBreakpointsChange
}: DebugPanelProps) {
  const { settings, themeColors } = useTheme();
  const { socket } = useSocket();
  const { session } = useSession();

  // Debug state
  const [debugState, setDebugState] = useState<DebugState>({
    isActive: false,
    isPaused: false,
    stackFrames: [],
    variables: {},
    breakpoints: [] // This will be used for server-reported breakpoints if different
  });

  // UI state
  const [messages, setMessages] = useState<LogMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [debugMode, setDebugMode] = useState<DebugMode>('standard');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    console: true,
    variables: true,
    stack: false,
    breakpoints: true
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const [aiCheckResult, setAiCheckResult] = useState<string>('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiResultRef = useRef<HTMLDivElement>(null);

  const sessionId = session?.id;

  // Auto-scroll effects
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollAiResultToBottom();
  }, [aiCheckResult]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollAiResultToBottom = () => {
    aiResultRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Message handling
  const addMessage = (type: LogMessage['type'], text: string) => {
    setMessages(prev => [...prev, { type, text, timestamp: new Date() }]);
  };

  const handleClearLogs = () => {
    setMessages([]);
  };

  const handleClearAiCheck = () => {
    setAiCheckResult('');
  };

  // Debug command handlers
  const handleStartDebug = () => {
    if (!socket || !sessionId) return;

    const code = getCurrentContent();
    const fileName = getCurrentFile();
    const language = getCurrentLanguage();

    if (!code || !fileName || !language) {
      addMessage('error', 'No code to debug. Please open a file and ensure it has content.');
      return;
    }

    // Collect breakpoints from Monaco editor (this would need to be passed from parent)
    const breakpoints: Breakpoint[] = []; // TODO: Get from Monaco editor

    socket.emit('start_debug', {
      session_id: sessionId,
      code,
      file_name: fileName,
      language,
      breakpoints: breakpoints.map(bp => ({ ...bp, id: undefined })) // Send clean breakpoints to server
    });

    addMessage('info', 'Starting debug session...');
  };

  const handleStopDebug = () => {
    if (!socket || !sessionId) return;

    socket.emit('stop_debug', { session_id: sessionId });
    setDebugState(prev => ({ ...prev, isActive: false, isPaused: false }));
    addMessage('warning', 'Debug session stopped.');
  };

  const handleDebugCommand = (command: string) => {
    if (!socket || !sessionId || !debugState.isActive) return;

    socket.emit('debug_command', {
      session_id: sessionId,
      command
    });

    addMessage('info', `Debug command: ${command}`);
  };



  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleDebugStarted = (data: any) => {
      setDebugState(prev => ({
        ...prev,
        isActive: true,
        breakpoints: data.breakpoints || []
      }));
      addMessage('success', 'Debug session started successfully.');
    };

    const handleDebugStopped = () => {
      setDebugState(prev => ({
        ...prev,
        isActive: false,
        isPaused: false,
        stackFrames: [],
        variables: {}
      }));
      addMessage('info', 'Debug session ended.');
    };

    const handleDebugStateUpdate = (data: any) => {
      setDebugState(prev => ({
        ...prev,
        ...data.state,
        isPaused: data.command !== 'continue'
      }));
    };

    const handleDebugError = (data: any) => {
      addMessage('error', `Debug error: ${data.message}`);
    };

    const handleDebugEvaluationResult = (data: any) => {
      addMessage('success', `${data.expression} = ${data.result?.result || 'undefined'}`);
    };

    const handleDebugStackTrace = (data: any) => {
      setDebugState(prev => ({
        ...prev,
        stackFrames: data.stack_frames || []
      }));
    };

    const handleDebugVariables = (data: any) => {
      setDebugState(prev => ({
        ...prev,
        variables: {
          ...prev.variables,
          [data.frame_id || 0]: data.variables || []
        }
      }));
    };

    // Register all debug event handlers
    socket.on('debug_started', handleDebugStarted);
    socket.on('debug_stopped', handleDebugStopped);
    socket.on('debug_state_update', handleDebugStateUpdate);
    socket.on('debug_error', handleDebugError);
    socket.on('debug_evaluation_result', handleDebugEvaluationResult);
    socket.on('debug_stack_trace', handleDebugStackTrace);
    socket.on('debug_variables', handleDebugVariables);

    // Execution events
    const handleRunStarted = () => {
      addMessage('info', 'Execution started...');
    };

    const handleRunComplete = (data: { exit_code: number }) => {
      addMessage('success', `Execution completed with exit code ${data.exit_code}.`);
    };

    const handleRunError = (data: { message: string }) => {
      addMessage('error', data.message);
    };

    const handleExecutionStopped = () => {
      addMessage('warning', 'Execution stopped by user.');
    };

    const handleRunOutput = (data: { chunk: string, stream: 'stdout' | 'stderr' }) => {
      const type = data.stream === 'stderr' ? 'error' : 'info';
      addMessage(type, data.chunk);
    };

    socket.on('run_started', handleRunStarted);
    socket.on('run_complete', handleRunComplete);
    socket.on('run_error', handleRunError);
    socket.on('execution_stopped', handleExecutionStopped);
    socket.on('run_output', handleRunOutput);

    return () => {
      // Cleanup all event listeners
      socket.off('debug_started', handleDebugStarted);
      socket.off('debug_stopped', handleDebugStopped);
      socket.off('debug_state_update', handleDebugStateUpdate);
      socket.off('debug_error', handleDebugError);
      socket.off('debug_evaluation_result', handleDebugEvaluationResult);
      socket.off('debug_stack_trace', handleDebugStackTrace);
      socket.off('debug_variables', handleDebugVariables);

      socket.off('run_started', handleRunStarted);
      socket.off('run_complete', handleRunComplete);
      socket.off('run_error', handleRunError);
      socket.off('execution_stopped', handleExecutionStopped);
      socket.off('run_output', handleRunOutput);
    };
  }, [socket]);

  // AI check functionality
  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    addMessage('info', `You: ${aiInput}`);
    // Placeholder - AI debugging functionality
    setTimeout(() => {
      addMessage('info', 'AI: I am currently offline. Please try again later.');
    }, 500);

    setAiInput('');
  };

  const handleAiCheck = useCallback(async () => {
    if (!sessionId) {
      setAiCheckResult('No active session.');
      return;
    }

    const currentContent = getCurrentContent();
    if (!currentContent || !currentContent.trim()) {
      setAiCheckResult('No code to check in the editor.');
      return;
    }

    setIsCheckingCode(true);
    setAiCheckResult('Analyzing your code...');

    try {
      // Use the newly added analyzeCode function which corresponds to the POST endpoint
      const result = await apiClient.analyzeCode(sessionId, currentContent);
      setAiCheckResult(result.response || result.error || 'No response from AI.');
    } catch (error) {
      console.error('Error checking code with AI:', error);
      setAiCheckResult(`Error: ${error instanceof Error ? error.message : 'Failed to check code with AI'}`);
    } finally {
      setIsCheckingCode(false);
    }
  }, [sessionId, getCurrentContent]);

  const handleRestart = () => {
    if (isExecuting) {
      onStop();
      setTimeout(() => {
        onRun();
      }, 500);
    } else {
      onRun();
    }
  };



  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Tabs */}
      <div className="flex border-b shrink-0" style={{ borderColor: themeColors.border }}>
        <button
          onClick={() => setDebugMode('standard')}
          className={`flex-1 p-3 text-[10px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 ${debugMode === 'standard' ? '' : 'opacity-40 hover:opacity-70'}`}
          style={{
            color: debugMode === 'standard' ? settings.accentColor : themeColors.textSecondary,
            borderBottom: debugMode === 'standard' ? `2px solid ${settings.accentColor}` : 'none'
          }}
        >
          <Bug size={14} />
          Standard
        </button>
        <button
          onClick={() => setDebugMode('ai')}
          className={`flex-1 p-3 text-[10px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 ${debugMode === 'ai' ? '' : 'opacity-40 hover:opacity-70'}`}
          style={{
            color: debugMode === 'ai' ? settings.accentColor : themeColors.textSecondary,
            borderBottom: debugMode === 'ai' ? `2px solid ${settings.accentColor}` : 'none'
          }}
        >
          <Bot size={14} />
          AI Debugger
        </button>
      </div>

      {/* Header Actions */}
      <div className="px-3 py-2 border-b flex justify-between items-center shrink-0" style={{ borderColor: themeColors.border }}>
        <h2 className="text-[10px] uppercase tracking-wider font-bold opacity-50" style={{ color: themeColors.textSecondary }}>
          {debugMode === 'standard' ? 'Standard Debugger' : 'AI Assistant'}
        </h2>
        <button
          onClick={debugMode === 'standard' ? handleClearLogs : handleClearAiCheck}
          className="p-1.5 hover:bg-white/10 rounded transition-colors"
          title={debugMode === 'standard' ? 'Clear logs' : 'Clear AI history'}
        >
          <Trash2 size={14} style={{ color: themeColors.textSecondary }} />
        </button>
      </div>

      {debugMode === 'standard' && (
        <div className="flex items-center gap-1 p-2 border-b overflow-x-auto no-scrollbar shrink-0" style={{ borderColor: themeColors.border }}>
          {!debugState.isActive ? (
            <button onClick={handleStartDebug} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Start Debug" style={{ color: '#4ade80' }}>
              <Bug size={16} />
            </button>
          ) : (
            <button onClick={handleStopDebug} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Stop Debug" style={{ color: '#f87171' }}>
              <Square size={16} fill="currentColor" />
            </button>
          )}
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button onClick={() => handleDebugCommand('continue')} disabled={!debugState.isActive || !debugState.isPaused} className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${!debugState.isActive || !debugState.isPaused ? 'opacity-30' : ''}`} title="Continue" style={{ color: '#4ade80' }}>
            <Play size={16} />
          </button>
          <button onClick={() => handleDebugCommand('step_over')} disabled={!debugState.isActive || !debugState.isPaused} className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${!debugState.isActive || !debugState.isPaused ? 'opacity-30' : ''}`} title="Step Over" style={{ color: themeColors.textSecondary }}>
            <SkipForward size={16} />
          </button>
          <button onClick={() => handleDebugCommand('step_into')} disabled={!debugState.isActive || !debugState.isPaused} className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${!debugState.isActive || !debugState.isPaused ? 'opacity-30' : ''}`} title="Step Into" style={{ color: themeColors.textSecondary }}>
            <CornerDownRight size={16} />
          </button>
          <button onClick={() => handleDebugCommand('step_out')} disabled={!debugState.isActive || !debugState.isPaused} className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${!debugState.isActive || !debugState.isPaused ? 'opacity-30' : ''}`} title="Step Out" style={{ color: themeColors.textSecondary }}>
            <CornerUpLeft size={16} />
          </button>
          <button onClick={() => handleDebugCommand('pause')} disabled={!debugState.isActive || debugState.isPaused} className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${!debugState.isActive || debugState.isPaused ? 'opacity-30' : ''}`} title="Pause" style={{ color: '#fbbf24' }}>
            <Pause size={16} />
          </button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button onClick={onRun} disabled={isExecuting} className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${isExecuting ? 'opacity-30' : ''}`} title="Run" style={{ color: '#4ade80' }}>
            <Play size={16} />
          </button>
          <button onClick={onStop} disabled={!isExecuting} className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${!isExecuting ? 'opacity-30' : ''}`} title="Stop" style={{ color: '#f87171' }}>
            <Square size={16} fill="currentColor" />
          </button>
          <button onClick={handleRestart} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Restart" style={{ color: themeColors.textSecondary }}>
            <RotateCcw size={16} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto no-scrollbar">
        {debugMode === 'standard' ? (
          <div className="flex flex-col">
            <DebugSection title="Console" icon={TerminalIcon} isExpanded={expandedSections.console} onToggle={() => toggleSection('console')} themeColors={themeColors}>
              <div className="p-2 space-y-1 font-mono text-[11px]">
                {messages.map((log, idx) => (
                  <div key={idx} className="flex gap-2 py-0.5">
                    <span className="opacity-30 shrink-0">
                      {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className={log.type === 'error' ? 'text-red-400' : log.type === 'warning' ? 'text-yellow-400' : log.type === 'success' ? 'text-green-400' : 'text-blue-300'}>
                      {log.text}
                    </span>
                  </div>
                ))}
                {messages.length === 0 && <div className="text-center py-6 opacity-30 text-[10px] italic">No debug messages</div>}
                <div ref={messagesEndRef} />
              </div>
            </DebugSection>

            <DebugSection title="Variables" icon={Bot} isExpanded={expandedSections.variables} onToggle={() => toggleSection('variables')} themeColors={themeColors}>
              <div className="p-2 space-y-0.5">
                {Object.entries(debugState.variables).map(([scope, vars]) => (
                  <div key={scope} className="mb-2">
                    <div className="px-2 py-1 text-[9px] uppercase tracking-widest opacity-40 font-bold">{scope === '0' ? 'Locals' : `Frame ${scope}`}</div>
                    {Array.isArray(vars) && vars.map((v, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors group">
                        <span className="font-mono text-[11px]" style={{ color: settings.accentColor }}>{v.name}</span>
                        <span className="opacity-40 text-[10px]">:</span>
                        <span className="font-mono text-[11px] opacity-80 truncate">{v.value}</span>
                        <span className="ml-auto text-[9px] opacity-20 group-hover:opacity-60 shrink-0">{v.type}</span>
                      </div>
                    ))}
                  </div>
                ))}
                {Object.keys(debugState.variables).length === 0 && <div className="text-center py-6 opacity-30 text-[10px] italic">No variables active</div>}
              </div>
            </DebugSection>

            <DebugSection title="Call Stack" icon={RotateCcw} isExpanded={expandedSections.stack} onToggle={() => toggleSection('stack')} themeColors={themeColors}>
              <div className="p-2">
                {debugState.stackFrames.map((frame, idx) => (
                  <div key={idx} className="px-3 py-1.5 rounded hover:bg-white/5 cursor-pointer transition-all border-l-2 border-transparent hover:border-accent group">
                    <div className="text-[11px] font-bold truncate group-hover:text-accent transition-colors">{frame.name}</div>
                    <div className="flex items-center gap-1 opacity-40 text-[10px]">
                      <span>{frame.file.split('/').pop()}</span>
                      <span>:</span>
                      <span>{frame.line}</span>
                    </div>
                  </div>
                ))}
                {debugState.stackFrames.length === 0 && <div className="text-center py-6 opacity-30 text-[10px] italic">Call stack empty</div>}
              </div>
            </DebugSection>

            <DebugSection title="Breakpoints" icon={Circle} isExpanded={expandedSections.breakpoints} onToggle={() => toggleSection('breakpoints')} themeColors={themeColors}>
              <div className="p-2">
                {breakpoints.map((bp) => (
                  <div key={bp.id} className="group flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all mb-0.5">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${bp.enabled ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-white/20'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium truncate opacity-90">{bp.file.split('/').pop()}</div>
                      <div className="text-[10px] opacity-40">Line {bp.line}</div>
                    </div>
                    <button onClick={() => onBreakpointsChange(breakpoints.filter(b => b.id !== bp.id))} className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all">
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </div>
                ))}
                {breakpoints.length === 0 && <div className="text-center py-6 opacity-30 text-[10px] italic">No breakpoints set</div>}
              </div>
            </DebugSection>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between shrink-0" style={{ borderColor: themeColors.border }}>
              <div className="flex items-center gap-3">
                <Sparkles size={14} style={{ color: settings.accentColor }} />
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">AI Code Analysis</span>
              </div>
              <button
                onClick={handleAiCheck}
                disabled={isCheckingCode}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 ${isCheckingCode ? 'opacity-50' : 'hover:bg-white/10'}`}
                style={{ backgroundColor: isCheckingCode ? themeColors.border : `${settings.accentColor}15`, color: settings.accentColor, border: `1px solid ${settings.accentColor}33` }}
              >
                {isCheckingCode ? 'Analysing...' : 'Analyse Code'}
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 no-scrollbar">
              {!aiCheckResult ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 text-center space-y-4 px-6">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10"><Bot size={40} /></div>
                  <div className="space-y-1">
                    <p className="font-bold text-xs uppercase tracking-wider">AI Debugger Ready</p>
                    <p className="text-[10px] leading-relaxed">I can help you find bugs, explain errors, or optimize your code.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiCheckResult.split('\n\n').map((block, idx) => {
                    const isError = /\*\*(Error|Incorrect Line):\*\*/i.test(block);
                    const isCorrection = /\*\*(Correction|Corrected Line):\*\*/i.test(block);

                    if (isError) {
                      const title = /Error/i.test(block) ? 'Error Detected' : 'Incorrect Line';
                      const content = block.replace(/\*\*(Error|Incorrect Line):\*\*/i, '').trim();
                      return (
                        <div key={idx} className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle size={12} className="text-red-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">{title}</span>
                          </div>
                          <div className="text-xs font-mono bg-black/40 p-2.5 rounded-lg border border-white/5 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {content.replace(/```python|```/g, '').trim()}
                          </div>
                        </div>
                      );
                    }
                    if (isCorrection) {
                      const title = /Correction/i.test(block) ? 'Correction' : 'Corrected Line';
                      const content = block.replace(/\*\*(Correction|Corrected Line):\*\*/i, '').trim();
                      return (
                        <div key={idx} className="p-3 rounded-xl border border-green-500/20 bg-green-500/5 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 size={12} className="text-green-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">{title}</span>
                          </div>
                          <div className="text-xs font-mono bg-black/40 p-2.5 rounded-lg border border-white/5 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {content.replace(/```python|```/g, '').trim()}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="p-4 rounded-xl border leading-relaxed shadow-sm transition-all hover:bg-white/5 ai-markdown-content prose prose-invert prose-sm max-w-none text-xs" style={{ backgroundColor: `${settings.accentColor}05`, borderColor: `${settings.accentColor}20`, color: themeColors.text }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{block}</ReactMarkdown>
                      </div>
                    );
                  })}
                  <div ref={aiResultRef} />
                </div>
              )}
            </div>

            <div className="p-3 border-t bg-black/10 shrink-0" style={{ borderColor: themeColors.border }}>
              <form onSubmit={handleAiSubmit} className="relative">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-white/5 border rounded-xl text-xs outline-none transition-all focus:bg-white/10"
                  style={{ borderColor: themeColors.border, color: themeColors.text }}
                  placeholder="Ask for help or explain an error..."
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors" style={{ color: settings.accentColor }}>
                  <Sparkles size={14} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
