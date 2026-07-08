import { Card, MarketingLayout } from '../components/ui'
import { useTheme } from '../contexts/ThemeContext'
import { Link } from 'react-router-dom'

function BlogPage() {
  const { themeColors } = useTheme()
  const cardStyle = { background: themeColors.cardBg, borderColor: themeColors.border }

  const posts = [
    {
      title: 'Designing a collaborative IDE that feels native',
      tag: 'Product',
      date: 'November 2025',
      slug: 'collaborative-ide',
      excerpt: 'How we balanced the power of a desktop editor with the seamlessness of the web.'
    },
    {
      title: 'How we keep CodePark sessions under 50ms latency',
      tag: 'Engineering',
      date: 'September 2025',
      slug: 'latency-deep-dive',
      excerpt: 'A technical look at our synchronization engine and global edge network.'
    },
    {
      title: 'Running better remote pairing sessions with your team',
      tag: 'Guides',
      date: 'July 2025',
      slug: 'remote-pairing',
      excerpt: 'Practical tips for maintaining flow and clarity during live coding sessions.'
    },
  ]

  return (
    <MarketingLayout maxWidth="max-w-5xl" showDarkVeil={true}>
      <header className="mb-10 space-y-3">
        <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: themeColors.textSecondary }}>
          Blog
        </p>
        <h1 className="text-4xl md:text-5xl font-bold" style={{ color: themeColors.text }}>
          Inside CodePark
        </h1>
        <p className="text-base md:text-lg max-w-2xl" style={{ color: themeColors.textSecondary }}>
          Product updates, engineering deep dives, and practical guides to help your team get more out of collaborative coding.
        </p>
      </header>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.title} to={post.slug ? `/blog/${post.slug}` : '#'}>
            <Card
              variant="bordered"
              className="p-5 md:p-6 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer group mb-4"
              style={cardStyle}
            >
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: themeColors.textSecondary }}>
                {post.tag} • {post.date}
              </p>
              <h2 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-blue-500 transition-colors" style={{ color: themeColors.text }}>
                {post.title}
              </h2>
              <p className="text-xs md:text-sm" style={{ color: themeColors.textSecondary }}>
                {post.excerpt}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </MarketingLayout>
  )
}

export default BlogPage


