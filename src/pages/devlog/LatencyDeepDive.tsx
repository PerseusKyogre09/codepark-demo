import { MarketingLayout } from '../../components/ui'
import { useTheme } from '../../contexts/ThemeContext'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'

export default function LatencyDeepDive() {
  const { themeColors } = useTheme()

  return (
    <MarketingLayout maxWidth="max-w-4xl" showDarkVeil={true}>
      <div className="mb-8">
        <Link
          to="/devlog"
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-blue-500 transition-colors"
          style={{ color: themeColors.textSecondary }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Devlog
        </Link>
      </div>

      <article className="space-y-10">
        <header className="space-y-6">
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-blue-500">
            <Tag className="w-3 h-3" /> Engineering Deep Dive
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: themeColors.text }}>
            How we keep CodePark sessions under 50ms latency
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 py-6 border-y" style={{ borderColor: themeColors.border }}>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                AS
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: themeColors.text }}>Alex Smith</p>
                <p className="text-xs" style={{ color: themeColors.textSecondary }}>CTO</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <Calendar className="w-4 h-4" /> Sep 28, 2025
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <Clock className="w-4 h-4" /> 12 min read
            </div>
          </div>
        </header>

        <div className="aspect-video w-full rounded-3xl overflow-hidden border shadow-2xl" style={{ borderColor: themeColors.border }}>
          <img 
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200" 
            alt="Server Infrastructure"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none" style={{ color: themeColors.textSecondary }}>
          <p className="text-xl leading-relaxed" style={{ color: themeColors.text }}>
            Latency is the killer of collaboration. In a pair-programming session, even a 200ms delay can lead to "collision" where two developers try to edit the same line at once, leading to frustration and broken flow.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-6" style={{ color: themeColors.text }}>The Synchronization Engine</h2>
          <p>
            CodePark uses a custom implementation of Yjs, a high-performance CRDT (Conflict-free Replicated Data Type) library. Unlike OT, CRDTs allow for decentralized synchronization, which is crucial for our peer-to-peer fallback modes.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6" style={{ color: themeColors.text }}>Edge Computing</h2>
          <p>
            We don't just rely on a single central server. CodePark sessions are hosted on the edge, as close to the collaborators as possible. When you start a session, we dynamically provision a lightweight container in the nearest data center.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6" style={{ color: themeColors.text }}>Binary Protocols</h2>
          <p>
            To minimize packet size, we moved away from JSON for our synchronization messages. We now use a custom binary protocol built on top of WebSockets, reducing overhead by nearly 60%.
          </p>

          <blockquote className="border-l-4 border-blue-500 pl-6 my-10 italic text-2xl" style={{ color: themeColors.text }}>
            "Engineering for speed is a never-ending journey, but the results—a seamless, 'local-feeling' experience—are worth it."
          </blockquote>

          <p className="mt-8">
            Stay tuned for more technical deep dives into our infrastructure.
          </p>
        </div>
      </article>
    </MarketingLayout>
  )
}
