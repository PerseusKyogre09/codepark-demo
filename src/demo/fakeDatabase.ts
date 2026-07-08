/**
 * fakeDatabase.ts
 * Central localStorage persistence layer for the CodePark demo.
 * All other fake modules read/write through this store.
 */

import type { User, Project, Notification } from '../types'

const KEYS = {
  USER: 'cp_demo_user',
  SESSION: 'cp_demo_session',
  PROJECTS: 'cp_demo_projects',
  FILES: 'cp_demo_files',
  NOTIFICATIONS: 'cp_demo_notifications',
  SETTINGS: 'cp_demo_settings',
  DEPLOYMENTS: 'cp_demo_deployments',
  INITIALIZED: 'cp_demo_initialized',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage errors in demo
  }
}

export function uuid(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export function hoursAgo(n: number): string {
  const d = new Date()
  d.setHours(d.getHours() - n)
  return d.toISOString()
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const DEMO_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B',
  '#EF4444', '#14B8A6', '#F97316', '#6366F1', '#22C55E',
]

const DEMO_PROJECT_SEEDS = [
  {
    name: 'ai-dashboard',
    description: 'Real-time AI analytics dashboard with React and Chart.js',
    template: 'react',
    branch: 'main',
  },
  {
    name: 'rest-api-server',
    description: 'FastAPI backend with authentication, CRUD, and PostgreSQL',
    template: 'fastapi',
    branch: 'main',
  },
  {
    name: 'portfolio-site',
    description: 'Personal portfolio with animations and dark mode',
    template: 'react',
    branch: 'main',
  },
  {
    name: 'ml-pipeline',
    description: 'Machine learning training pipeline with data preprocessing',
    template: 'python-cli',
    branch: 'feature/training-loop',
  },
  {
    name: 'ecommerce-app',
    description: 'Full-stack e-commerce platform with Next.js and Stripe',
    template: 'nextjs',
    branch: 'main',
  },
]

// Realistic file content for each template
export const TEMPLATE_FILES: Record<string, Record<string, string>> = {
  react: {
    'src/App.tsx': `import { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { Sidebar } from './components/Sidebar'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <Dashboard activeTab={activeTab} />
      </main>
    </div>
  )
}

export default App`,
    'src/components/Dashboard.tsx': `import { useEffect, useState } from 'react'
import { MetricsCard } from './MetricsCard'
import { ActivityChart } from './ActivityChart'

interface DashboardProps {
  activeTab: string
}

export function Dashboard({ activeTab }: DashboardProps) {
  const [metrics, setMetrics] = useState({
    users: 12847,
    revenue: 48290,
    requests: 1204839,
    uptime: 99.97,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        users: prev.users + Math.floor(Math.random() * 5),
        requests: prev.requests + Math.floor(Math.random() * 100),
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Analytics Overview</h1>
      <div className="grid grid-cols-4 gap-4">
        <MetricsCard title="Active Users" value={metrics.users.toLocaleString()} trend="+12.3%" />
        <MetricsCard title="Revenue" value={\`$\${metrics.revenue.toLocaleString()}\`} trend="+8.1%" />
        <MetricsCard title="API Requests" value={metrics.requests.toLocaleString()} trend="+24.7%" />
        <MetricsCard title="Uptime" value={\`\${metrics.uptime}%\`} trend="+0.02%" />
      </div>
      <ActivityChart />
    </div>
  )
}`,
    'src/components/MetricsCard.tsx': `interface MetricsCardProps {
  title: string
  value: string
  trend: string
}

export function MetricsCard({ title, value, trend }: MetricsCardProps) {
  const isPositive = trend.startsWith('+')
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <p className="text-sm text-gray-400 mb-2">{title}</p>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <span className={\`text-sm font-medium \${isPositive ? 'text-green-400' : 'text-red-400'}\`}>
        {trend} this week
      </span>
    </div>
  )
}`,
    'src/components/Sidebar.tsx': `import { BarChart2, Users, Settings, Home, Bell } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview', icon: Home, label: 'Overview' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
  { id: 'users', icon: Users, label: 'Users' },
  { id: 'notifications', icon: Bell, label: 'Alerts' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export function Sidebar({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white">AI Dashboard</h2>
        <p className="text-xs text-gray-500 mt-1">v2.4.1</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors \${
              activeTab === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }\`}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}`,
    'package.json': `{
  "name": "ai-dashboard",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.555.0",
    "recharts": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "vite": "^7.0.0",
    "@vitejs/plugin-react": "^5.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}`,
    'README.md': `# AI Dashboard

Real-time analytics dashboard built with React and TypeScript.

## Features
- Live metrics with auto-refresh
- Interactive charts with Recharts
- Responsive sidebar navigation
- Dark mode design

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:5173 to view the dashboard.

## Tech Stack
- React 19 + TypeScript
- Vite 7
- Recharts
- Lucide Icons
- Tailwind CSS`,
  },
  fastapi: {
    'main.py': `from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
from routers import users, projects, auth
from database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables created")
    yield
    # Shutdown
    await engine.dispose()
    print("🔌 Database connection closed")

app = FastAPI(
    title="REST API Server",
    description="Production-ready FastAPI backend with auth and CRUD",
    version="2.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "2.1.0"}`,
    'routers/users.py': `from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models import User
from schemas import UserCreate, UserUpdate, UserResponse
from auth import get_current_user

router = APIRouter()

@router.get("/", response_model=list[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """List all users (admin only)."""
    result = await db.execute(
        select(User).offset(skip).limit(limit).order_by(User.created_at.desc())
    )
    return result.scalars().all()

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user."""
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_me(
    body: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the current user's profile."""
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    await db.commit()
    await db.refresh(current_user)
    return current_user`,
    'models.py': `from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime, UTC

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    bio = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    is_public = Column(Boolean, default=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    owner = relationship("User", back_populates="projects")`,
    'requirements.txt': `fastapi==0.115.0
uvicorn[standard]==0.32.0
sqlalchemy[asyncio]==2.0.36
asyncpg==0.30.0
alembic==1.14.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.17
pydantic-settings==2.6.1
httpx==0.27.2`,
    '.env.example': `DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/mydb
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]`,
  },
  nextjs: {
    'app/page.tsx': `import { Suspense } from 'next/dist/client/components/suspense'
import { HeroSection } from '@/components/HeroSection'
import { FeaturesGrid } from '@/components/FeaturesGrid'
import { PricingSection } from '@/components/PricingSection'
import { CTASection } from '@/components/CTASection'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <HeroSection />
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
        <FeaturesGrid />
      </Suspense>
      <PricingSection />
      <CTASection />
    </main>
  )
}

export const metadata = {
  title: 'My SaaS — Build faster, ship smarter',
  description: 'The platform that helps teams build and ship software 10x faster.',
}`,
    'app/layout.tsx': `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'My SaaS',
    template: '%s | My SaaS',
  },
  description: 'Build faster, ship smarter.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`,
    'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

module.exports = nextConfig`,
    'package.json': `{
  "name": "ecommerce-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "stripe": "^17.0.0",
    "@prisma/client": "^6.0.0",
    "next-auth": "^5.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "prisma": "^6.0.0"
  }
}`,
  },
  'python-cli': {
    'main.py': `#!/usr/bin/env python3
"""
ML Pipeline CLI — Train and evaluate machine learning models.
"""
import argparse
import sys
from pathlib import Path
from utils import load_dataset, preprocess, save_model
from trainer import Trainer
from evaluator import Evaluator


def parse_args():
    parser = argparse.ArgumentParser(description="ML Pipeline CLI")
    subparsers = parser.add_subparsers(dest="command")

    # Train command
    train_parser = subparsers.add_parser("train", help="Train a model")
    train_parser.add_argument("--data", required=True, help="Path to training data")
    train_parser.add_argument("--model", default="xgboost", choices=["xgboost", "lightgbm", "rf"])
    train_parser.add_argument("--epochs", type=int, default=100)
    train_parser.add_argument("--output", default="models/model.pkl")

    # Evaluate command
    eval_parser = subparsers.add_parser("evaluate", help="Evaluate a trained model")
    eval_parser.add_argument("--model", required=True, help="Path to model file")
    eval_parser.add_argument("--data", required=True, help="Path to test data")

    return parser.parse_args()


def main():
    args = parse_args()

    if args.command == "train":
        print(f"🚀 Loading dataset from {args.data}...")
        X, y = load_dataset(args.data)
        X_train, X_val, y_train, y_val = preprocess(X, y)

        print(f"🧠 Training {args.model} model for {args.epochs} epochs...")
        trainer = Trainer(model_type=args.model, epochs=args.epochs)
        model = trainer.fit(X_train, y_train, X_val, y_val)

        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        save_model(model, output_path)
        print(f"✅ Model saved to {output_path}")

    elif args.command == "evaluate":
        print(f"📊 Evaluating model from {args.model}...")
        evaluator = Evaluator(args.model)
        metrics = evaluator.evaluate(args.data)
        
        print("\\n📈 Results:")
        for metric, value in metrics.items():
            print(f"  {metric}: {value:.4f}")

    else:
        print("Error: Please specify a command. Use --help for usage.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()`,
    'utils.py': `"""Utility functions for data loading and preprocessing."""
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle
from pathlib import Path


def load_dataset(path: str) -> tuple[np.ndarray, np.ndarray]:
    """Load dataset from CSV or parquet file."""
    p = Path(path)
    if p.suffix == '.csv':
        df = pd.read_csv(p)
    elif p.suffix in ('.parquet', '.pq'):
        df = pd.read_parquet(p)
    else:
        raise ValueError(f"Unsupported file format: {p.suffix}")

    target_col = df.columns[-1]
    X = df.drop(columns=[target_col]).values
    y = df[target_col].values
    return X, y


def preprocess(X: np.ndarray, y: np.ndarray, test_size: float = 0.2):
    """Split and normalize the dataset."""
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=test_size, random_state=42, stratify=y if y.ndim == 1 else None
    )
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_val = scaler.transform(X_val)
    return X_train, X_val, y_train, y_val


def save_model(model, path: Path) -> None:
    """Serialize model to disk."""
    with open(path, 'wb') as f:
        pickle.dump(model, f)


def load_model(path: Path):
    """Deserialize model from disk."""
    with open(path, 'rb') as f:
        return pickle.load(f)`,
    'requirements.txt': `numpy>=2.0.0
pandas>=2.2.0
scikit-learn>=1.5.0
xgboost>=2.1.0
lightgbm>=4.5.0
matplotlib>=3.9.0
seaborn>=0.13.0
tqdm>=4.66.0`,
    'README.md': `# ML Pipeline

Command-line ML training pipeline with support for multiple model types.

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

### Train a model
\`\`\`bash
python main.py train --data data/train.csv --model xgboost --epochs 200
\`\`\`

### Evaluate a model
\`\`\`bash
python main.py evaluate --model models/model.pkl --data data/test.csv
\`\`\`

## Supported Models
- XGBoost (default)
- LightGBM
- Random Forest`,
  },
}

// ─── Store Class ──────────────────────────────────────────────────────────────

class DemoStore {
  // ─── User ───────────────────────────────────────────────────────────────────

  getUser(): User | null {
    return read<User | null>(KEYS.USER, null)
  }

  saveUser(user: User): void {
    write(KEYS.USER, user)
  }

  getSession(): string | null {
    return localStorage.getItem(KEYS.SESSION)
  }

  setSession(username: string): void {
    localStorage.setItem(KEYS.SESSION, username)
  }

  clearSession(): void {
    localStorage.removeItem(KEYS.SESSION)
  }

  // ─── Projects ────────────────────────────────────────────────────────────────

  getProjects(): Project[] {
    return read<Project[]>(KEYS.PROJECTS, [])
  }

  saveProjects(projects: Project[]): void {
    write(KEYS.PROJECTS, projects)
  }

  addProject(project: Project): void {
    const projects = this.getProjects()
    projects.unshift(project)
    this.saveProjects(projects)
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getProjects()
    const idx = projects.findIndex(p => p.id === id)
    if (idx === -1) return null
    projects[idx] = { ...projects[idx], ...updates, updated_at: new Date().toISOString() }
    this.saveProjects(projects)
    return projects[idx]
  }

  deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id)
    this.saveProjects(projects)
    localStorage.removeItem(`${KEYS.FILES}_${id}`)
  }

  // ─── Files ───────────────────────────────────────────────────────────────────

  getFiles(projectId: string): Record<string, { content: string; version: number }> {
    return read(`${KEYS.FILES}_${projectId}`, {})
  }

  saveFiles(projectId: string, files: Record<string, { content: string; version: number }>): void {
    write(`${KEYS.FILES}_${projectId}`, files)
  }

  saveFile(projectId: string, path: string, content: string): void {
    const files = this.getFiles(projectId)
    files[path] = { content, version: (files[path]?.version ?? 0) + 1 }
    this.saveFiles(projectId, files)
  }

  deleteFile(projectId: string, path: string): void {
    const files = this.getFiles(projectId)
    delete files[path]
    this.saveFiles(projectId, files)
  }

  // ─── Notifications ───────────────────────────────────────────────────────────

  getNotifications(): Notification[] {
    return read<Notification[]>(KEYS.NOTIFICATIONS, [])
  }

  saveNotifications(notifications: Notification[]): void {
    write(KEYS.NOTIFICATIONS, notifications)
  }

  // ─── Deployments ─────────────────────────────────────────────────────────────

  getDeployments(projectId: string): any[] {
    return read<any[]>(`${KEYS.DEPLOYMENTS}_${projectId}`, [])
  }

  addDeployment(projectId: string, deployment: any): void {
    const deployments = this.getDeployments(projectId)
    deployments.unshift(deployment)
    write(`${KEYS.DEPLOYMENTS}_${projectId}`, deployments.slice(0, 10))
  }

  // ─── Seed ────────────────────────────────────────────────────────────────────

  isInitialized(): boolean {
    return localStorage.getItem(KEYS.INITIALIZED) === 'true'
  }

  seedProjects(username: string): void {
    if (this.getProjects().length > 0) return

    const projects: Project[] = DEMO_PROJECT_SEEDS.map((seed, i) => {
      const id = uuid()
      const template = TEMPLATE_FILES[seed.template] || TEMPLATE_FILES['react']

      // Store files for this project
      const files: Record<string, { content: string; version: number }> = {}
      for (const [path, content] of Object.entries(template)) {
        files[path] = { content, version: 1 }
      }
      this.saveFiles(id, files)

      return {
        id,
        name: seed.name,
        description: seed.description,
        created_at: daysAgo(30 - i * 5),
        updated_at: hoursAgo(i * 8 + Math.floor(Math.random() * 4)),
        storage_type: 'workspace',
        branch: seed.branch,
        active_file: Object.keys(template)[0],
        recent_files: Object.keys(template).slice(0, 3),
        all_files: Object.keys(template),
        owner_id: username,
        role: 'owner',
      } as Project
    })

    this.saveProjects(projects)
  }

  seedNotifications(): void {
    if (this.getNotifications().length > 0) return

    const now = Date.now() / 1000
    const notifications: Notification[] = [
      {
        id: uuid(),
        user_id: 'demo',
        type: 'deployment_success',
        title: 'Deployment complete',
        text: '🚀 ai-dashboard deployed successfully to production',
        description: 'Your project is now live at ai-dashboard-x4k2.codepark.app',
        created_at: now - 3600,
        read: false,
      },
      {
        id: uuid(),
        user_id: 'demo',
        type: 'collaborator_joined',
        title: 'Alice joined your workspace',
        text: '👥 Alice Chen joined ai-dashboard',
        created_at: now - 7200,
        read: false,
      },
      {
        id: uuid(),
        user_id: 'demo',
        type: 'ai_complete',
        title: 'AI generation complete',
        text: '🤖 AI finished generating your React component',
        description: 'Your TodoList component with TypeScript is ready',
        created_at: now - 14400,
        read: true,
      },
    ]
    this.saveNotifications(notifications)
  }

  markInitialized(): void {
    localStorage.setItem(KEYS.INITIALIZED, 'true')
  }
}

export const demoDb = new DemoStore()
