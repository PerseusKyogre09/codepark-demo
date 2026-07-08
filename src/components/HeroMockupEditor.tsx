import { Folder, FileCode, FileText, Play, UserPlus, Settings, GitBranch, Search, Minimize2, Trash2, X } from "lucide-react";

export function HeroMockupEditor() {
  return (
    <div className="w-full rounded-xl border border-[#242b27] bg-[#101412] shadow-2xl overflow-hidden text-xs flex flex-col font-mono max-w-full">
      {/* Top Menu / Header Bar */}
      <div className="flex items-center justify-between border-b border-[#242b27] bg-[#1a201d]/60 px-3 py-1.5 text-[11px] font-sans">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary flex items-center gap-1">
            <span className="size-2 rounded bg-primary" /> CodePark
          </span>
          <div className="hidden md:flex items-center gap-2.5 text-muted-foreground text-[10px]">
            <span className="hover:text-foreground cursor-default">File</span>
            <span className="hover:text-foreground cursor-default">Edit</span>
            <span className="hover:text-foreground cursor-default">Help</span>
            <span className="hover:text-foreground cursor-default">Scan</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] text-primary flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" /> Live
          </span>
          <button className="px-2.5 py-0.5 bg-primary text-primary-foreground font-semibold rounded text-[10px] flex items-center gap-0.5">
            <Play size={10} className="fill-current" /> Run
          </button>
          <button className="px-2.5 py-0.5 border border-[#242b27] text-foreground hover:bg-[#1a201d] font-semibold rounded text-[10px] flex items-center gap-0.5">
            <UserPlus size={10} /> Invite
          </button>
          <span className="text-muted-foreground text-[10px]">3 in session</span>
          <div className="flex -space-x-1.5">
            <div className="size-5 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-bold text-white border border-[#242b27]">L</div>
            <div className="size-5 rounded-full bg-blue-500 flex items-center justify-center text-[9px] font-bold text-white border border-[#242b27]">C</div>
            <div className="size-5 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white border border-[#242b27]">J</div>
          </div>
        </div>
      </div>

      {/* Main Workspace Row */}
      <div className="flex flex-row h-[380px] md:h-[440px]">
        {/* Thin Icons Sidebar (Activity Bar) */}
        <div className="w-10 border-r border-[#242b27] bg-[#131715]/40 flex flex-col items-center py-4 space-y-5 text-muted-foreground">
          <Folder size={14} className="text-primary hover:text-foreground cursor-pointer" />
          <Search size={14} className="hover:text-foreground cursor-pointer" />
          <GitBranch size={14} className="hover:text-foreground cursor-pointer" />
          <Settings size={14} className="hover:text-foreground cursor-pointer" />
        </div>

        {/* Explorer Sidebar */}
        <div className="w-40 border-r border-[#242b27] bg-[#131715]/20 p-2 hidden sm:flex flex-col space-y-1.5 select-none text-[11px] overflow-y-auto no-scrollbar">
          <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1 flex items-center justify-between">
            <span>Explorer</span>
            <Settings size={10} className="text-muted-foreground hover:text-foreground cursor-pointer" />
          </div>
          <div className="pl-1 flex flex-col space-y-1 text-muted-foreground">
            <div className="flex items-center gap-1.5"><Folder size={11} /> <span>src</span></div>
            <div className="pl-3 flex flex-col space-y-1">
              <div className="pl-3 text-primary font-medium flex items-center gap-1.5 bg-primary/10 px-1 py-0.5 rounded-sm">
                <FileCode size={11} className="text-primary" /> <span>main.py</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5"><FileText size={11} /> <span>package.json</span></div>
            <div className="flex items-center gap-1.5"><FileText size={11} /> <span>tsconfig.json</span></div>
            <div className="flex items-center gap-1.5"><FileText size={11} /> <span>README.md</span></div>
          </div>
        </div>

        {/* Editor Content Panel (Middle Column containing Tabs, Code, Status bar, Terminal) */}
        <div className="flex-1 flex flex-col bg-[#131715]/10 min-w-0">
          {/* File Tab and Breadcrumbs */}
          <div className="flex flex-col border-b border-[#242b27] shrink-0">
            <div className="flex bg-[#181c19]/30">
              <div className="border-r border-[#242b27] bg-[#131715] px-3 py-1.5 flex items-center gap-1.5 text-primary font-medium">
                <FileCode size={11} className="text-primary" />
                <span>main.py</span>
                <span className="text-[9px] hover:bg-muted p-0.5 rounded ml-1">×</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-1 bg-[#1a201d]/10 text-[9px] text-muted-foreground border-t border-[#242b27]/30">
              <span>src &gt; main.py</span>
              <div className="flex gap-2">
                <span className="hover:text-foreground cursor-default">Imports (2)</span>
                <span className="hover:text-foreground cursor-default">Imported By (1)</span>
              </div>
            </div>
          </div>

          {/* Code Viewer (Scrollable editor area) */}
          <div className="flex-1 overflow-y-auto p-3 text-[11px] leading-relaxed relative font-mono select-none bg-[#131715]">
            <div className="flex flex-row h-full">
              {/* Line Numbers */}
              <div className="text-muted-foreground/30 text-right pr-2.5 select-none border-r border-[#242b27]/40 mr-2.5 space-y-0.5 w-6">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>

              {/* Code Block */}
              <div className="flex-1 space-y-0.5 text-foreground/90 overflow-x-auto whitespace-pre">
                <div>
                  <span className="text-purple-400">import</span> time
                </div>
                <div>
                  <span className="text-purple-400">import</span> sys
                </div>
                <div />
                <div>
                  <span className="text-purple-400">def</span> <span className="text-blue-400">main</span>():
                </div>
                <div className="relative">
                  {"    "}<span className="text-blue-400">print</span>(<span className="text-emerald-500">"Welcome to CodePark!"</span>)
                  {/* Leon Cursor */}
                  <div className="absolute top-0 right-1/4 flex flex-col items-start z-10 scale-90 pointer-events-none">
                    <span className="text-red-500 text-[14px]">⬉</span>
                    <span className="bg-red-500 text-white text-[9px] px-1 py-0.5 rounded font-sans -mt-1 shadow-sm whitespace-nowrap">
                      Leon <span className="text-[7px] opacity-80">(Owner)</span>
                    </span>
                  </div>
                </div>
                <div className="relative">
                  {"    "}<span className="text-purple-400">for</span> i <span className="text-purple-400">in</span> <span className="text-blue-400">range</span>(<span className="text-orange-400">5</span>):
                  {/* Jill Cursor */}
                  <div className="absolute top-0 right-1/3 flex flex-col items-start z-10 scale-90 pointer-events-none">
                    <span className="text-emerald-500 text-[14px]">⬉</span>
                    <span className="bg-emerald-500 text-white text-[9px] px-1 py-0.5 rounded font-sans -mt-1 shadow-sm whitespace-nowrap">Jill</span>
                  </div>
                </div>
                <div>
                  {"        "}time.sleep(<span className="text-orange-400">0.5</span>)
                </div>
                <div className="relative">
                  {"        "}<span className="text-blue-400">print</span>(f<span className="text-emerald-500">"Processing item "</span> + i + <span className="text-emerald-500">"..."</span>)
                  {/* Chris Cursor */}
                  <div className="absolute top-0 left-24 flex flex-col items-start z-10 scale-90 pointer-events-none">
                    <span className="text-blue-500 text-[14px]">⬉</span>
                    <span className="bg-blue-500 text-white text-[9px] px-1 py-0.5 rounded font-sans -mt-1 shadow-sm whitespace-nowrap">Chris</span>
                  </div>
                </div>
                <div>
                  {"    "}<span className="text-blue-400">print</span>(<span className="text-emerald-500">"Done."</span>)
                </div>
                <div />
                <div>
                  <span className="text-purple-400">if</span> __name__ == <span className="text-emerald-500">"__main__"</span>:
                </div>
                <div>
                  {"    "}main()
                </div>
              </div>

              {/* Minimap Mockup */}
              <div className="w-10 border-l border-[#242b27]/30 pl-1.5 hidden md:flex flex-col space-y-0.5 opacity-30 select-none scale-90 origin-top-right">
                <div className="h-1 bg-purple-400 w-full rounded-sm" />
                <div className="h-1 bg-blue-400 w-2/3 rounded-sm" />
                <div className="h-1 bg-emerald-400 w-3/4 rounded-sm" />
                <div className="h-1 bg-purple-400 w-1/2 rounded-sm" />
                <div className="h-1 bg-foreground/40 w-full rounded-sm" />
              </div>
            </div>
          </div>

          {/* Inner Editor Green Status Bar */}
          <div className="border-t border-[#242b27] bg-[#1a201d] px-3 py-1 flex items-center justify-between text-[9px] text-[#e0f2fe] font-sans shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-emerald-400">Python</span>
              <span className="opacity-80">UTF-8</span>
              <span className="text-emerald-400 font-bold">✓ Synced</span>
            </div>
            <div>
              <span>Ln 12, Col 1</span>
            </div>
          </div>

          {/* Terminal Panel (Nested directly inside Editor pane, under Code Viewer & Status Bar) */}
          <div className="border-t border-[#242b27] flex flex-col bg-[#0b0d0c] text-[10px] h-[140px] shrink-0 overflow-y-auto">
            <div className="flex items-center justify-between px-3 py-1 border-b border-[#242b27]/50 bg-[#121614]">
              <span className="font-bold text-emerald-500 tracking-wider">TERMINAL</span>
              <div className="flex items-center gap-2 text-muted-foreground scale-90">
                <Trash2 size={10} className="hover:text-foreground cursor-pointer" />
                <Minimize2 size={10} className="hover:text-foreground cursor-pointer" />
                <X size={10} className="hover:text-foreground cursor-pointer" />
              </div>
            </div>
            <div className="p-2.5 font-mono space-y-1 text-zinc-300">
              <p className="text-fuchsia-400">CodePark Collaborative Terminal v2.0</p>
              <p className="text-zinc-500">Type standard bash commands.</p>
              <div className="pt-1.5">
                <p className="text-foreground"><span className="text-emerald-500">shared@codepark</span> <span className="text-sky-500">~/workspace</span> % python main.py</p>
                <p className="pl-2 text-zinc-400">Welcome to CodePark!</p>
                <p className="pl-2 text-zinc-400">Processing item 0...</p>
                <p className="pl-2 text-zinc-400">Processing item 1...</p>
                <p className="pl-2 text-zinc-400">Processing item 2...</p>
                <p className="pl-2 text-zinc-400">Processing item 3...</p>
                <p className="pl-2 text-zinc-400">Processing item 4...</p>
                <p className="pl-2 text-zinc-400">Done.</p>
                <p className="text-foreground"><span className="text-emerald-500">shared@codepark</span> <span className="text-sky-500">~/workspace</span> % <span className="inline-block w-1.5 h-3 bg-zinc-300 animate-pulse align-middle"></span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Session / Collaboration Sidebar (Right Panel) */}
        <div className="w-48 border-l border-[#242b27] bg-[#131715]/30 p-2.5 flex flex-col justify-between select-none text-[10px] shrink-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#242b27]/60 pb-1.5">
              <span className="font-semibold text-foreground">Session <span className="text-[9px] text-muted-foreground font-normal">(3 active)</span></span>
              <span className="text-muted-foreground text-[10px]">✕</span>
            </div>

            <div className="space-y-2">
              {/* Copy Invite Link */}
              <div className="bg-[#1a201d]/30 p-1.5 rounded border border-[#242b27]/40">
                <div className="text-primary font-medium text-[9px] flex items-center justify-between">
                  <span>Copy invite link</span>
                  <span className="text-emerald-500 font-bold text-[8px]">✓ active</span>
                </div>
                <div className="text-muted-foreground text-[8px] mt-0.5 truncate">s_Ab8JJp...</div>
              </div>

              {/* Participants */}
              <div className="space-y-1.5">
                <div className="text-[9px] uppercase font-bold text-muted-foreground">Participants</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="size-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-[9px] font-bold text-red-400">L</div>
                    <div>
                      <div className="font-medium text-foreground leading-none">Leon <span className="text-[8px] text-red-400">(Owner)</span></div>
                      <div className="text-muted-foreground text-[8px]">Coding main</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[9px] font-bold text-emerald-400">J</div>
                    <div>
                      <div className="font-medium text-foreground leading-none">Jill</div>
                      <div className="text-muted-foreground text-[8px]">Typing loop</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-[9px] font-bold text-blue-400">C</div>
                    <div>
                      <div className="font-medium text-foreground leading-none">Chris</div>
                      <div className="text-muted-foreground text-[8px]">Reviewing stdout</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Friends & Connections */}
              <div className="space-y-1.5 pt-1.5 border-t border-[#242b27]/30">
                <div className="text-[9px] uppercase font-bold text-muted-foreground">Friends & Connections</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="size-4 rounded-full bg-purple-500/20 text-purple-400 text-[8px] flex items-center justify-center font-semibold">A</div>
                      <span className="text-muted-foreground">Ada Wong</span>
                    </div>
                    <button className="text-[8px] bg-primary/10 hover:bg-primary/20 text-primary px-1 py-0.5 rounded border border-primary/20">Invite</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="size-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] flex items-center justify-center font-semibold">C</div>
                      <span className="text-muted-foreground">Claire Redfield</span>
                    </div>
                    <button className="text-[8px] bg-primary/10 hover:bg-primary/20 text-primary px-1 py-0.5 rounded border border-[#242b27]/20">Invite</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-[#242b27]/40">
            <button className="w-full py-1 bg-primary text-primary-foreground font-semibold rounded text-[9px] hover:bg-primary/90 transition-colors">
              Invite teammates
            </button>
            <button className="w-full py-1 border border-[#242b27] text-foreground font-semibold rounded text-[9px] hover:bg-muted transition-colors">
              Lock Session
            </button>
          </div>
        </div>
      </div>

      {/* Global Bottom Status Bar */}
      <div className="border-t border-[#242b27] bg-[#1a201d]/60 px-3 py-1 flex items-center justify-between text-[9px] text-muted-foreground font-sans">
        <div className="flex items-center gap-3">
          <span className="text-emerald-500 font-semibold flex items-center gap-0.5">🌿 stable-backend</span>
          <span className="flex items-center gap-0.5">✓ Saved</span>
          <span>Connected</span>
          <span className="hidden sm:inline">FastAPI + React</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span>Python</span>
          <span>UTF-8</span>
          <span>Synced</span>
          <span>Ln 12, Col 1</span>
        </div>
      </div>
    </div>
  );
}
