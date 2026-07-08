/**
 * fakeAI.ts
 * Deterministic streaming AI responses with intent detection.
 */

// ─── Response library ─────────────────────────────────────────────────────────

const AI_RESPONSES: Array<{ patterns: string[]; response: string }> = [
  {
    patterns: ['generate', 'create', 'build', 'todo', 'react'],
    response: `I'll generate a complete React Todo app with TypeScript and hooks.

\`\`\`tsx
// TodoApp.tsx
import { useState, useCallback } from 'react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Set up project structure', completed: true, createdAt: new Date() },
    { id: '2', text: 'Implement authentication', completed: false, createdAt: new Date() },
    { id: '3', text: 'Add dark mode support', completed: false, createdAt: new Date() },
  ])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const addTodo = useCallback(() => {
    const text = input.trim()
    if (!text) return
    setTodos(prev => [...prev, {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    }])
    setInput('')
  }, [input])

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const remaining = todos.filter(t => !t.completed).length

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Todo App
        </h1>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="What needs to be done?"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={addTodo}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-1 mb-4 bg-gray-900 rounded-lg p-1">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={\`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize \${
                filter === f ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }\`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-2">
          {filtered.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3 group"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="accent-indigo-500 w-4 h-4 cursor-pointer"
              />
              <span className={\`flex-1 text-sm \${todo.completed ? 'line-through text-gray-500' : ''}\`}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
              >
                ✕
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-8">
              {filter === 'completed' ? 'No completed tasks yet' : 'Nothing to do! 🎉'}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">
          {remaining} item{remaining !== 1 ? 's' : ''} remaining
        </div>
      </div>
    </div>
  )
}
\`\`\`

This implementation includes:
- ✅ TypeScript interfaces for type safety
- ✅ \`useCallback\` for optimized re-renders
- ✅ Filter tabs (All / Active / Completed)
- ✅ Enter key support for quick adding
- ✅ Smooth hover interactions
- ✅ Empty state handling
- ✅ Item count in footer

Import it in your \`App.tsx\` and you're good to go!`,
  },
  {
    patterns: ['explain', 'what does', 'how does', 'understand'],
    response: `Let me explain this code for you.

**Overview**

This code implements a React component that manages state using hooks. Here's a breakdown:

**Key Concepts**

1. **State Management** — \`useState\` holds the component's data and triggers re-renders when updated.

2. **Effect Hook** — \`useEffect\` runs side effects (like API calls or subscriptions) after renders. The dependency array controls when it re-runs.

3. **Callback Optimization** — \`useCallback\` memoizes functions to prevent unnecessary child re-renders.

4. **Event Handling** — The component responds to user interactions through event handler functions passed as props.

**Data Flow**

\`\`\`
User Action → Event Handler → State Update → Re-render → DOM Update
\`\`\`

**Best Practices Applied**

- Immutable state updates (spreading arrays/objects)
- Cleanup functions in \`useEffect\` to prevent memory leaks
- Proper TypeScript typing for all props and state
- Separation of concerns with helper functions

Is there a specific part you'd like me to dive deeper into?`,
  },
  {
    patterns: ['fix', 'bug', 'error', 'issue', 'problem', 'broken'],
    response: `I found the issue and here's how to fix it.

**Root Cause**

The bug is likely caused by one of these common patterns:

1. **Stale closure** — The event handler captures an old value of the state variable. Fix by using the functional update form:

\`\`\`tsx
// ❌ Bug: captures stale 'count'
const increment = () => setCount(count + 1)

// ✅ Fix: uses latest state
const increment = () => setCount(prev => prev + 1)
\`\`\`

2. **Missing dependency** — The \`useEffect\` dependency array is incomplete:

\`\`\`tsx
// ❌ ESLint warning: 'fetchData' missing in deps
useEffect(() => {
  fetchData()
}, [])

// ✅ Fix: include all dependencies
useEffect(() => {
  fetchData()
}, [fetchData])
\`\`\`

3. **Async race condition** — If your component unmounts before an async operation completes:

\`\`\`tsx
useEffect(() => {
  let cancelled = false
  
  async function load() {
    const data = await fetchData()
    if (!cancelled) setData(data)  // Safe to update
  }
  
  load()
  return () => { cancelled = true }  // Cleanup
}, [])
\`\`\`

**Which pattern matches your issue?** Share the error message or the specific function and I can give you a more targeted fix.`,
  },
  {
    patterns: ['refactor', 'improve', 'clean', 'optimize'],
    response: `Here's a refactored version with improved readability and performance.

**Before**
\`\`\`tsx
function Component({ data }) {
  const [items, setItems] = useState([])
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(d => setItems(d))
  }, [])
  return <div>{items.map(i => <div key={i.id}>{i.name}</div>)}</div>
}
\`\`\`

**After — Refactored**
\`\`\`tsx
// Separate data fetching into a custom hook
function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchItems() {
      try {
        const response = await fetch('/api/data')
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`)
        const data: Item[] = await response.json()
        if (!cancelled) setItems(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchItems()
    return () => { cancelled = true }
  }, [])

  return { items, loading, error }
}

// Clean, readable component
function ItemList() {
  const { items, loading, error } = useItems()

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage message={error.message} />
  if (items.length === 0) return <EmptyState />

  return (
    <ul className="space-y-2">
      {items.map(item => (
        <ItemRow key={item.id} item={item} />
      ))}
    </ul>
  )
}
\`\`\`

**Improvements made:**
- ✅ Extracted custom hook for reusability
- ✅ Added loading and error states
- ✅ Fixed async race condition with cancel flag
- ✅ TypeScript types for type safety
- ✅ Proper error handling
- ✅ Separated concerns (data vs. presentation)`,
  },
  {
    patterns: ['write', 'function', 'implement', 'method'],
    response: `Here's a well-typed, production-ready implementation:

\`\`\`typescript
/**
 * Debounces a function, delaying its execution until after
 * the specified wait time has elapsed since the last call.
 * 
 * @param fn - The function to debounce
 * @param wait - Delay in milliseconds (default: 300)
 * @param options - Optional configuration
 * @returns Debounced version of the function with a cancel method
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300,
  options: { leading?: boolean; trailing?: boolean } = { trailing: true }
): ((...args: Parameters<T>) => void) & { cancel: () => void; flush: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  function invoke() {
    if (lastArgs !== null) {
      fn(...lastArgs)
      lastArgs = null
    }
  }

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args

    if (options.leading && timer === null) {
      invoke()
    }

    if (timer !== null) clearTimeout(timer)

    timer = setTimeout(() => {
      timer = null
      if (options.trailing) invoke()
    }, wait)
  }

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    lastArgs = null
  }

  debounced.flush = () => {
    debounced.cancel()
    invoke()
  }

  return debounced
}

// Usage example:
const debouncedSearch = debounce(async (query: string) => {
  const results = await searchAPI(query)
  setResults(results)
}, 300)

// In your input handler:
<input onChange={e => debouncedSearch(e.target.value)} />

// Clean up on unmount:
useEffect(() => () => debouncedSearch.cancel(), [])
\`\`\`

Features included:
- Leading and trailing edge support
- TypeScript generics preserving argument types
- \`cancel()\` for cleanup (prevent memory leaks)
- \`flush()\` to immediately invoke the pending call`,
  },
  {
    patterns: ['test', 'spec', 'unit', 'vitest', 'jest'],
    response: `Here are comprehensive tests using Vitest and Testing Library:

\`\`\`tsx
// TodoApp.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoApp } from './TodoApp'

describe('TodoApp', () => {
  const user = userEvent.setup()

  it('renders initial todos', () => {
    render(<TodoApp />)
    expect(screen.getByText('Set up project structure')).toBeInTheDocument()
    expect(screen.getByText('Implement authentication')).toBeInTheDocument()
  })

  it('adds a new todo on Enter key', async () => {
    render(<TodoApp />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    
    await user.type(input, 'Write unit tests')
    await user.keyboard('{Enter}')
    
    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('adds a new todo on button click', async () => {
    render(<TodoApp />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    const button = screen.getByRole('button', { name: /add/i })
    
    await user.type(input, 'Deploy to production')
    await user.click(button)
    
    expect(screen.getByText('Deploy to production')).toBeInTheDocument()
  })

  it('does not add empty todos', async () => {
    render(<TodoApp />)
    const initialCount = screen.getAllByRole('checkbox').length
    
    await user.click(screen.getByRole('button', { name: /add/i }))
    
    expect(screen.getAllByRole('checkbox')).toHaveLength(initialCount)
  })

  it('toggles todo completion', async () => {
    render(<TodoApp />)
    const checkboxes = screen.getAllByRole('checkbox')
    const unchecked = checkboxes.find(cb => !(cb as HTMLInputElement).checked)!
    
    await user.click(unchecked)
    expect(unchecked).toBeChecked()
    
    await user.click(unchecked)
    expect(unchecked).not.toBeChecked()
  })

  it('filters todos correctly', async () => {
    render(<TodoApp />)
    
    await user.click(screen.getByRole('button', { name: /completed/i }))
    expect(screen.getByText('Set up project structure')).toBeInTheDocument()
    expect(screen.queryByText('Implement authentication')).not.toBeInTheDocument()
    
    await user.click(screen.getByRole('button', { name: /active/i }))
    expect(screen.queryByText('Set up project structure')).not.toBeInTheDocument()
    expect(screen.getByText('Implement authentication')).toBeInTheDocument()
  })
})
\`\`\`

Run with: \`npm run test\``,
  },
]

// ─── Catch-all response ───────────────────────────────────────────────────────

const GENERIC_RESPONSE = `I can help you with that! Here's my analysis:

Based on the context of your code, I'd recommend approaching this by:

1. **Breaking it into smaller pieces** — Large functions are harder to reason about. Extract logical units into focused helper functions.

2. **Adding proper types** — TypeScript types at function boundaries catch bugs early and improve IDE support.

3. **Error boundaries** — Wrap async operations in try/catch and handle edge cases explicitly.

Here's a starting point:

\`\`\`typescript
// Start with a clear interface
interface Config {
  timeout: number
  retries: number
  onError?: (err: Error) => void
}

// Then implement with proper error handling
async function processData(input: unknown, config: Config): Promise<Result> {
  for (let attempt = 0; attempt <= config.retries; attempt++) {
    try {
      const validated = validate(input)
      return await transform(validated, { timeout: config.timeout })
    } catch (err) {
      if (attempt === config.retries) throw err
      config.onError?.(err instanceof Error ? err : new Error(String(err)))
      await sleep(Math.pow(2, attempt) * 100) // Exponential backoff
    }
  }
  throw new Error('Should not reach here')
}
\`\`\`

Would you like me to expand on any specific part of this?`

// ─── Streaming AI ─────────────────────────────────────────────────────────────

function detectIntent(prompt: string): string {
  const lower = prompt.toLowerCase()
  for (const item of AI_RESPONSES) {
    if (item.patterns.some(p => lower.includes(p))) {
      return item.response
    }
  }
  return GENERIC_RESPONSE
}

export function streamAIResponse(
  prompt: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): void {
  const response = detectIntent(prompt)
  const chars = response.split('')
  let i = 0

  // Stream chars in variable-size chunks for natural feel
  function next() {
    if (signal?.aborted || i >= chars.length) {
      onDone()
      return
    }

    // Send 1-4 chars at a time for natural streaming feel
    const chunkSize = Math.floor(Math.random() * 4) + 1
    const chunk = chars.slice(i, i + chunkSize).join('')
    onChunk(chunk)
    i += chunkSize

    // Variable delay: faster for regular text, pause at newlines
    const delay = chunk.includes('\n') ? 20 : Math.random() * 15 + 8
    setTimeout(next, delay)
  }

  // Small initial delay to feel like AI "thinking"
  setTimeout(next, 300)
}
