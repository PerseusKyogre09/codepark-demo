/**
 * fakeTerminal.ts
 * Full simulated terminal with realistic command handling.
 */

import { demoDb } from './fakeDatabase'

export interface TerminalOutput {
  text: string
  stream: 'stdout' | 'stderr'
}

interface FsNode {
  type: 'file' | 'dir'
  children?: Record<string, FsNode>
  content?: string
}

function buildFsFromFiles(files: Record<string, any>): Record<string, FsNode> {
  const root: Record<string, FsNode> = {}

  for (const filePath of Object.keys(files)) {
    const parts = filePath.split('/').filter(Boolean)
    let current = root
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = { type: 'dir', children: {} }
      }
      current = current[parts[i]].children!
    }
    const filename = parts[parts.length - 1]
    current[filename] = { type: 'file', content: files[filePath]?.content || '' }
  }

  return root
}

function resolvePath(cwd: string, arg: string): string {
  if (arg.startsWith('/')) return arg
  const parts = cwd.split('/').filter(Boolean)
  for (const segment of arg.split('/')) {
    if (segment === '..') parts.pop()
    else if (segment !== '.') parts.push(segment)
  }
  return '/' + parts.join('/')
}

function getNodeAt(root: Record<string, FsNode>, path: string): FsNode | null {
  const parts = path.split('/').filter(Boolean)
  let current: Record<string, FsNode> = root
  for (const part of parts) {
    if (!current[part]) return null
    const node = current[part]
    if (node.type === 'dir') {
      current = node.children || {}
    } else {
      // If last segment, return the file node
      if (part === parts[parts.length - 1]) {
        return node
      }
      return null
    }
  }
  // Reaching here means we traversed all parts into dirs
  return { type: 'dir', children: current }
}

export class FakeTerminal {
  private cwd: string
  private fs: Record<string, FsNode>
  private history: string[] = []
  private projectName: string

  constructor(projectId: string, projectName: string) {
    this.projectName = projectName
    this.cwd = `/workspace/${projectName}`
    const files = demoDb.getFiles(projectId)
    this.fs = buildFsFromFiles(files)
  }

  async handleCommand(
    command: string,
    onOutput: (out: TerminalOutput) => void,
    onComplete: (exitCode: number) => void
  ): Promise<void> {
    const trimmed = command.trim()
    if (!trimmed) { onComplete(0); return }
    this.history.push(trimmed)

    const parts = trimmed.split(/\s+/)
    const cmd = parts[0]
    const args = parts.slice(1)

    const out = (text: string, stream: 'stdout' | 'stderr' = 'stdout') => onOutput({ text, stream })
    const err = (text: string) => onOutput({ text, stream: 'stderr' })

    // Stream helper with delay
    const stream = async (lines: string[], delayMs = 40) => {
      for (const line of lines) {
        out(line)
        await new Promise(r => setTimeout(r, delayMs))
      }
    }

    switch (cmd) {
      case 'help': {
        out('Available commands:')
        out('  ls [-la]        List directory contents')
        out('  pwd             Print working directory')
        out('  cd <dir>        Change directory')
        out('  cat <file>      Display file contents')
        out('  mkdir <dir>     Create directory')
        out('  touch <file>    Create empty file')
        out('  rm <file>       Remove file')
        out('  echo <text>     Print text')
        out('  clear           Clear terminal')
        out('  npm install     Install dependencies')
        out('  npm run dev     Start dev server')
        out('  npm run build   Build for production')
        out('  python <file>   Run Python script')
        out('  git status      Show git status')
        out('  git log         Show commit history')
        out('  git add <file>  Stage changes')
        out("  git commit -m   Commit staged changes")
        onComplete(0)
        break
      }

      case 'pwd': {
        out(this.cwd)
        onComplete(0)
        break
      }

      case 'ls': {
        const longFormat = args.includes('-la') || args.includes('-l') || args.includes('-a')
        const targetPath = args.find(a => !a.startsWith('-')) || this.cwd
        const resolved = resolvePath(this.cwd, targetPath)
        const node = getNodeAt(this.fs, resolved.replace(`/workspace/${this.projectName}`, '') || '/')
        
        if (!node || node.type !== 'dir') {
          err(`ls: cannot access '${targetPath}': No such file or directory`)
          onComplete(1)
          break
        }

        const children = node.children || {}
        const entries = Object.entries(children)
        
        if (longFormat) {
          out(`total ${entries.length * 4}`)
          out('drwxr-xr-x  2 user user 4096 Jul  9 03:20 .')
          out('drwxr-xr-x  3 user user 4096 Jul  9 03:20 ..')
          for (const [name, child] of entries) {
            const isDir = child.type === 'dir'
            const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--'
            const size = isDir ? 4096 : (child.content?.length || 0)
            out(`${perms}  1 user user ${String(size).padStart(5)} Jul  9 03:20 \x1b[${isDir ? '34' : '0'}m${name}\x1b[0m`)
          }
        } else {
          const names = entries.map(([name, child]) =>
            child.type === 'dir' ? `\x1b[34m${name}/\x1b[0m` : name
          )
          out(names.join('  '))
        }
        onComplete(0)
        break
      }

      case 'cd': {
        const target = args[0] || `~`
        if (target === '~' || target === '') {
          this.cwd = `/workspace/${this.projectName}`
          onComplete(0)
          break
        }
        const newPath = resolvePath(this.cwd, target)
        const relPath = newPath.replace(`/workspace/${this.projectName}`, '') || '/'
        const node = getNodeAt(this.fs, relPath)
        if (node && node.type === 'dir') {
          this.cwd = newPath
          onComplete(0)
        } else {
          err(`cd: ${target}: No such file or directory`)
          onComplete(1)
        }
        break
      }

      case 'cat': {
        if (!args[0]) { err('cat: missing file operand'); onComplete(1); break }
        const filePath = resolvePath(this.cwd, args[0])
        const rel = filePath.replace(`/workspace/${this.projectName}/`, '')
        const node = getNodeAt(this.fs, rel)
        if (node && node.type === 'file') {
          const lines = (node.content || '').split('\n')
          await stream(lines, 0)
          onComplete(0)
        } else {
          err(`cat: ${args[0]}: No such file or directory`)
          onComplete(1)
        }
        break
      }

      case 'mkdir': {
        if (!args[0]) { err('mkdir: missing operand'); onComplete(1); break }
        out('')
        onComplete(0)
        break
      }

      case 'touch': {
        if (!args[0]) { err('touch: missing file operand'); onComplete(1); break }
        onComplete(0)
        break
      }

      case 'rm': {
        if (!args[0]) { err('rm: missing operand'); onComplete(1); break }
        out('')
        onComplete(0)
        break
      }

      case 'echo': {
        out(args.join(' ').replace(/^["']|["']$/g, ''))
        onComplete(0)
        break
      }

      case 'clear': {
        onComplete(0)
        break
      }

      case 'npm': {
        const subCmd = args[0]
        if (subCmd === 'install' || subCmd === 'i') {
          out('\n\x1b[33mnpm\x1b[0m warn deprecated ...')
          await new Promise(r => setTimeout(r, 200))
          await stream([
            '',
            '> added 0 packages',
            '',
            '\x1b[32m⠸\x1b[0m resolving dependencies...',
          ], 100)
          await new Promise(r => setTimeout(r, 400))
          await stream([
            '\x1b[32m⠼\x1b[0m fetching packages...',
          ], 100)
          await new Promise(r => setTimeout(r, 600))
          await stream([
            '\x1b[32m⠦\x1b[0m linking dependencies...',
            '',
            '\x1b[32madded 247 packages\x1b[0m, and audited 248 packages in 1.8s',
            '',
            '38 packages are looking for funding',
            '  run `npm fund` for details',
            '',
            'found \x1b[32m0 vulnerabilities\x1b[0m',
            '',
          ], 60)
          onComplete(0)
        } else if (subCmd === 'run') {
          const script = args[1]
          if (script === 'dev') {
            await stream([
              '',
              '  \x1b[32mVITE\x1b[0m v7.2.4  \x1b[34mready in 312 ms\x1b[0m',
              '',
              '  ➜  \x1b[1mLocal\x1b[0m:   \x1b[36mhttp://localhost:5173/\x1b[0m',
              '  ➜  \x1b[1mNetwork\x1b[0m: use \x1b[33m--host\x1b[0m to expose',
              '  ➜  \x1b[1mpress h + enter\x1b[0m to show help',
              '',
              '\x1b[32m[vite]\x1b[0m server running...',
            ], 120)
            // Keep running
          } else if (script === 'build') {
            await stream([
              '',
              '\x1b[36mvite v7.2.4 building for production...\x1b[0m',
              '',
              'transforming...',
              '✓ 847 modules transformed.',
              '',
              'rendering chunks...',
              '✓ built in 2.34s',
              '',
              '\x1b[1mdist/index.html\x1b[0m            0.46 kB │ gzip: 0.30 kB',
              '\x1b[1mdist/assets/index-Bg7TlQaE.css\x1b[0m  18.23 kB │ gzip: 4.92 kB',
              '\x1b[1mdist/assets/index-CpZJJBqZ.js\x1b[0m  342.71 kB │ gzip: 108.44 kB',
              '',
              '\x1b[32m✓ Build complete.\x1b[0m',
            ], 100)
            onComplete(0)
          } else if (script === 'test') {
            await stream([
              '',
              '\x1b[1m VITEST\x1b[0m v4.0.15 starting...',
              '',
              ' ✓ src/components/MetricsCard.test.tsx (3)',
              ' ✓ src/utils/format.test.ts (7)',
              ' ✓ src/hooks/useMetrics.test.ts (5)',
              '',
              ' Test Files  3 passed (3)',
              '      Tests  15 passed (15)',
              '   Start at  03:20:41',
              '   Duration  1.23s',
            ], 80)
            onComplete(0)
          } else {
            err(`npm run: missing script '${script || ''}'`)
            onComplete(1)
          }
        } else {
          err(`npm: unknown command '${subCmd}'`)
          onComplete(1)
        }
        break
      }

      case 'python':
      case 'python3': {
        const file = args[0]
        if (!file) { err('Usage: python <file>'); onComplete(1); break }
        if (file === 'main.py') {
          await stream([
            '🚀 Loading dataset from data/train.csv...',
            '✅ Loaded 45,231 samples with 28 features',
            '',
            '🧠 Training xgboost model for 100 epochs...',
            '  Epoch   1/100  loss=0.6931  val_acc=0.5124',
            '  Epoch  10/100  loss=0.4821  val_acc=0.7348',
            '  Epoch  50/100  loss=0.2134  val_acc=0.9012',
            '  Epoch 100/100  loss=0.1456  val_acc=0.9387',
            '',
            '✅ Model saved to models/model.pkl',
          ], 120)
          onComplete(0)
        } else {
          out(`Running ${file}...`)
          await new Promise(r => setTimeout(r, 400))
          out('Done.')
          onComplete(0)
        }
        break
      }

      case 'git': {
        const sub = args[0]
        if (sub === 'status') {
          out('On branch main')
          out("Your branch is up to date with 'origin/main'.")
          out('')
          out('Changes not staged for commit:')
          out('  (use "git add <file>..." to update what will be committed)')
          out('')
          out('\t\x1b[31mmodified:   src/App.tsx\x1b[0m')
          out('\t\x1b[31mmodified:   src/components/Dashboard.tsx\x1b[0m')
          out('')
          out('Untracked files:')
          out('  (use "git add <file>..." to include in what will be committed)')
          out('')
          out('\t\x1b[31msrc/components/NewWidget.tsx\x1b[0m')
          out('')
          out('no changes added to commit (use "git add" and/or "git commit -a")')
          onComplete(0)
        } else if (sub === 'log') {
          const commits = [
            ['a3f8c12', 'feat: add real-time metrics dashboard', 'Alice Chen', '2 hours ago'],
            ['b9e2d45', 'fix: resolve memory leak in data polling', 'Bob Martinez', '5 hours ago'],
            ['c7a1f89', 'refactor: extract MetricsCard component', 'You', '1 day ago'],
            ['d4b6e23', 'chore: update dependencies', 'You', '2 days ago'],
            ['e1c9d67', 'docs: add API documentation', 'Alice Chen', '3 days ago'],
          ]
          for (const [hash, msg, author, time] of commits) {
            out(`\x1b[33mcommit ${hash}f2e1a9b\x1b[0m`)
            out(`Author: ${author}`)
            out(`Date:   ${time}`)
            out('')
            out(`    ${msg}`)
            out('')
          }
          onComplete(0)
        } else if (sub === 'add') {
          onComplete(0)
        } else if (sub === 'commit') {
          const msgIdx = args.indexOf('-m')
          const message = msgIdx !== -1 ? args.slice(msgIdx + 1).join(' ').replace(/^["']|["']$/g, '') : 'Update'
          await new Promise(r => setTimeout(r, 500))
          const hash = Math.random().toString(16).slice(2, 10)
          out(`[main ${hash}] ${message}`)
          out(' 2 files changed, 47 insertions(+), 12 deletions(-)')
          onComplete(0)
        } else if (sub === 'push') {
          await stream([
            'Enumerating objects: 5, done.',
            'Counting objects: 100% (5/5), done.',
            'Delta compression using up to 8 threads',
            'Compressing objects: 100% (3/3), done.',
            'Writing objects: 100% (3/3), 1.24 KiB | 1.24 MiB/s, done.',
            'Total 3 (delta 2), reused 0 (delta 0), pack-reused 0',
            'To github.com:demo/project.git',
            '   a3f8c12..e4b9d21  main -> main',
          ], 100)
          onComplete(0)
        } else if (sub === 'pull') {
          out("Already up to date.")
          onComplete(0)
        } else if (sub === 'branch') {
          out('* \x1b[32mmain\x1b[0m')
          out('  feature/auth')
          out('  feature/dashboard')
          onComplete(0)
        } else if (sub === 'checkout') {
          const branch = args[1]
          out(`Switched to branch '${branch}'`)
          onComplete(0)
        } else {
          out(`git: '${sub}' is not a git command. See 'git help'.`)
          onComplete(1)
        }
        break
      }

      case 'node': {
        const file = args[0]
        if (!file) { err('Usage: node <file>'); onComplete(1); break }
        await stream([
          `\x1b[32m🚀 Server running on http://localhost:3000\x1b[0m`,
          `✓ Database connected`,
          `✓ Routes registered`,
          `[GET] /health 200 2ms`,
        ], 150)
        break
      }

      case 'which':
      case 'where': {
        const prog = args[0]
        if (['node', 'npm', 'python', 'python3', 'git'].includes(prog || '')) {
          out(`/usr/bin/${prog}`)
          onComplete(0)
        } else {
          onComplete(1)
        }
        break
      }

      case 'env': {
        out('NODE_ENV=development')
        out(`TERM=xterm-256color`)
        out(`HOME=/home/user`)
        out(`PATH=/usr/local/bin:/usr/bin:/bin`)
        onComplete(0)
        break
      }

      case 'uname': {
        out('Linux workspace 6.11.0 #1 SMP x86_64 GNU/Linux')
        onComplete(0)
        break
      }

      default: {
        err(`${cmd}: command not found`)
        onComplete(127)
        break
      }
    }
  }

  getPrompt(): string {
    const rel = this.cwd.replace(`/workspace/${this.projectName}`, '') || '~'
    const display = rel === '' ? '~' : rel === '/' ? '~' : `~${rel}`
    return `\x1b[32muser\x1b[0m@\x1b[34mcodepark\x1b[0m:\x1b[33m${display}\x1b[0m$ `
  }

  getHistory(): string[] {
    return this.history
  }
}

// Singleton per project session
const terminals = new Map<string, FakeTerminal>()

export function getOrCreateTerminal(projectId: string, projectName: string): FakeTerminal {
  if (!terminals.has(projectId)) {
    terminals.set(projectId, new FakeTerminal(projectId, projectName))
  }
  return terminals.get(projectId)!
}
