/**
 * fakeDeployments.ts
 * Animated deployment simulation with realistic progress, logs, and fake URLs.
 */

import { demoDb, uuid } from './fakeDatabase'

export interface DeploymentLog {
  time: string
  message: string
  level: 'info' | 'success' | 'error' | 'warn'
}

export interface Deployment {
  id: string
  projectId: string
  projectName: string
  status: 'building' | 'deploying' | 'live' | 'failed'
  progress: number
  url: string
  logs: DeploymentLog[]
  createdAt: string
  completedAt?: string
}

function formatTime(offset: number = 0): string {
  const d = new Date(Date.now() + offset * 1000)
  return d.toTimeString().slice(0, 8)
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function generateFakeUrl(projectName: string): string {
  const slug = slugify(projectName)
  const hash = Math.random().toString(36).slice(2, 7)
  return `https://${slug}-${hash}.codepark.app`
}

export function startDeployment(
  projectId: string,
  projectName: string,
  onProgress: (deployment: Deployment) => void,
  onComplete: (deployment: Deployment) => void
): () => void {
  let cancelled = false
  const id = uuid()
  const url = generateFakeUrl(projectName)
  const logs: DeploymentLog[] = []

  let deployment: Deployment = {
    id,
    projectId,
    projectName,
    status: 'building',
    progress: 0,
    url,
    logs: [],
    createdAt: new Date().toISOString(),
  }

  const addLog = (message: string, level: DeploymentLog['level'] = 'info') => {
    logs.push({ time: formatTime(), message, level })
    deployment = { ...deployment, logs: [...logs] }
  }

  // Build steps with timing
  const steps: Array<{ delay: number; progress: number; action: () => void }> = [
    {
      delay: 0, progress: 5,
      action: () => {
        addLog('[00:00] 🔍 Detecting project type...', 'info')
        addLog('[00:01] ✓ Detected: React + TypeScript', 'success')
      }
    },
    {
      delay: 800, progress: 15,
      action: () => {
        addLog('[00:02] 📦 Installing dependencies...', 'info')
        addLog('[00:03] ✓ Added 247 packages in 1.8s', 'success')
      }
    },
    {
      delay: 1800, progress: 30,
      action: () => {
        addLog('[00:04] 🔨 Running type checking...', 'info')
        addLog('[00:05] ✓ No type errors found', 'success')
      }
    },
    {
      delay: 2800, progress: 50,
      action: () => {
        addLog('[00:06] ⚡ Building production bundle...', 'info')
        addLog('[00:08] ✓ 847 modules transformed', 'info')
        addLog('[00:09] ✓ Bundle: 342.7 kB (gzip: 108.4 kB)', 'success')
      }
    },
    {
      delay: 4200, progress: 65,
      action: () => {
        addLog('[00:10] 🧪 Running post-build checks...', 'info')
        addLog('[00:11] ✓ All checks passed', 'success')
      }
    },
    {
      delay: 5200, progress: 80,
      action: () => {
        deployment = { ...deployment, status: 'deploying' }
        addLog('[00:12] 🌍 Uploading to CDN (3 regions)...', 'info')
      }
    },
    {
      delay: 6500, progress: 90,
      action: () => {
        addLog('[00:13] ✓ Deployed to us-east-1', 'success')
        addLog('[00:14] ✓ Deployed to eu-west-1', 'success')
        addLog('[00:14] ✓ Deployed to ap-south-1', 'success')
      }
    },
    {
      delay: 7500, progress: 95,
      action: () => {
        addLog('[00:15] 🔄 Invalidating CDN cache...', 'info')
        addLog('[00:16] ✓ Cache cleared globally', 'success')
      }
    },
    {
      delay: 8500, progress: 100,
      action: () => {
        addLog('[00:17] 🔐 Running SSL certificate check...', 'info')
        addLog(`[00:18] ✅ Deployment live at: ${url}`, 'success')
        deployment = {
          ...deployment,
          status: 'live',
          progress: 100,
          completedAt: new Date().toISOString(),
          logs: [...logs],
        }
        // Persist deployment
        demoDb.addDeployment(projectId, deployment)
        onComplete(deployment)
      }
    },
  ]

  let stepIndex = 0

  function runNextStep() {
    if (cancelled || stepIndex >= steps.length) return
    const step = steps[stepIndex++]

    setTimeout(() => {
      if (cancelled) return
      step.action()
      deployment = { ...deployment, progress: step.progress, logs: [...logs] }
      onProgress(deployment)
      if (stepIndex < steps.length) runNextStep()
    }, step.delay)
  }

  runNextStep()

  return () => { cancelled = true }
}

export function getDeploymentHistory(projectId: string): any[] {
  const saved = demoDb.getDeployments(projectId)
  if (saved.length > 0) return saved

  // Generate fake history if none exists
  const projects = demoDb.getProjects()
  const project = projects.find(p => p.id === projectId)
  const name = project?.name || 'project'

  return [
    {
      id: uuid(),
      projectId,
      status: 'live',
      progress: 100,
      url: generateFakeUrl(name),
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      completedAt: new Date(Date.now() - 3 * 86400000 + 8500).toISOString(),
    },
    {
      id: uuid(),
      projectId,
      status: 'live',
      progress: 100,
      url: generateFakeUrl(name),
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      completedAt: new Date(Date.now() - 7 * 86400000 + 9200).toISOString(),
    },
    {
      id: uuid(),
      projectId,
      status: 'failed',
      progress: 55,
      url: generateFakeUrl(name),
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
  ]
}
