import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-dark-text-secondary mb-8">
          Page not found
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-forest-accent text-white rounded-lg hover:bg-forest-accent/90 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
