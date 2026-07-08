import { MarketingLayout } from '../../components/ui'
import { useTheme } from '../../contexts/ThemeContext'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'

export default function CollaborativeIde() {
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
            <Tag className="w-3 h-3" /> Product Update
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: themeColors.text }}>
            Designing a collaborative IDE that feels native
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 py-6 border-y" style={{ borderColor: themeColors.border }}>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: themeColors.text }}>Jane Doe</p>
                <p className="text-xs" style={{ color: themeColors.textSecondary }}>Product Lead</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <Calendar className="w-4 h-4" /> Nov 12, 2025
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.textSecondary }}>
              <Clock className="w-4 h-4" /> 8 min read
            </div>
          </div>
        </header>

        <div className="aspect-video w-full rounded-3xl overflow-hidden border shadow-2xl" style={{ borderColor: themeColors.border }}>
          <img 
            src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1200" 
            alt="Collaborative Coding"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none" style={{ color: themeColors.textSecondary }}>
          <p className="text-xl leading-relaxed" style={{ color: themeColors.text }}>
            When we started building CodePark, we knew that the biggest hurdle for collaborative coding wasn't just the technology—it was the feel. Most web-based editors feel like... well, web-based editors. They lack the snappiness, the keyboard-first focus, and the deep integration that developers expect from their local environment.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-6" style={{ color: themeColors.text }}>The 50ms Budget</h2>
          <p>
            We set a strict latency budget of 50ms for every interaction. Whether it's a keystroke, a file switch, or a terminal command, if it takes longer than 50ms, it's not native enough. This required us to rethink our entire synchronization engine, moving away from traditional request-response cycles to a highly optimized Operational Transformation (OT) system.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6" style={{ color: themeColors.text }}>Aesthetics Matter</h2>
          <p>
            Developers spend hours in their editor. It shouldn't just be functional; it should be beautiful. We spent weeks perfecting the "glow" of our themes and the smoothness of the cursor trails. These aren't just "eye candy"—they provide vital visual feedback in a multi-user environment.
          </p>

          <blockquote className="border-l-4 border-blue-500 pl-6 my-10 italic text-2xl" style={{ color: themeColors.text }}>
            "The goal wasn't to build a web editor that supports collaboration. It was to build a collaboration engine that happens to be an editor."
          </blockquote>

          <p className="mt-8 italic">
            Stay tuned for more deep dives into our design process.
          </p>
        </div>
      </article>
    </MarketingLayout>
  )
}
