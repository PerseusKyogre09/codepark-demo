import { useState } from 'react';
import { Bot, Send } from 'lucide-react';

export function AIPanel() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I know your project. Ask me anything about the codebase.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input.trim() };
    const systemResponse = { 
      role: 'assistant', 
      text: 'AI Assistant is currently under construction. Please check back later!' 
    };

    setMessages(prev => [...prev, userMessage, systemResponse]);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-surface">
      <div
        className="px-4 py-3 border-b font-semibold text-sm flex items-center gap-2 shrink-0 border-border text-foreground"
      >
        <Bot size={16} />
        AI Chat
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {m.role === 'assistant' && (
              <div className="size-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={13} className="text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
              m.role === 'user' 
                ? 'bg-primary text-primary-foreground ml-auto' 
                : 'bg-muted text-foreground'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-2 shrink-0 bg-surface">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Ask about your code…"
            className="flex-1 px-2.5 py-2 bg-background border border-border rounded-md text-xs text-foreground outline-none focus:ring-1-primary placeholder:text-muted-foreground" 
          />
          <button 
            onClick={handleSend} 
            className="size-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-colors shrink-0"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}