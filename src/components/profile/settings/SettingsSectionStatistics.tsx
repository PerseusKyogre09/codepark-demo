import { useEffect, useState } from 'react'
import { apiClient } from '../../../services/api'
import { Button } from '../../ui'
import { useAuth } from '../../../contexts/AuthContext';


export default function SettingsSectionStatistics() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any | null>(null)
  const [contributions, setContributions] = useState<number>(0);      //instead of activbity
  const [error, setError] = useState<string | null>(null)
  const [cachedUntil, setCachedUntil] = useState<string | null>(null)
  const [nowTs, setNowTs] = useState<number>(Date.now())



  //getting user info
  const { user } = useAuth();
  const username = user?.username;


  // Tick time to allow a small countdown UI update
  useEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.getMyStats()
      setStats(res)
      if (res && res.cached_until) {
        setCachedUntil(res.cached_until)
      } else {
        setCachedUntil(null)
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  // Fetch contributions from heatmap data
  const fetchContributions = async () => {
    if (!username) return;
    try {
      const { heatmap: heatmapData } = await apiClient.getUserActivity(username);
      const total = Object.values(heatmapData).reduce((s, c) => s + c, 0);
      setContributions(total);
    } catch (e) {
      console.error('Failed to fetch contributions', e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchContributions();
  }, [username]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#3fff8b', fontFamily: 'Space Mono, monospace' }}>
            <span style={{ color: '#acaab1' }}>&gt;</span> Statistics
          </h2>
          <p className="text-sm mb-6 pb-4 border-b" style={{ color: '#acaab1', fontFamily: 'Space Mono, monospace', borderColor: 'rgba(63, 255, 139, 0.1)' }}>detailed usage and coding metrics for nerds.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchStats} variant="ghost" size="sm" disabled={loading || (!!cachedUntil && Date.parse(cachedUntil) > Date.now())}>
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-400">{error}</div>
      )}

      {stats ? (
        <div className="space-y-4">
          {/* Stats Table */}
          <div className="rounded border overflow-hidden" style={{ borderColor: 'rgba(63, 255, 139, 0.3)' }}>
            {/* Header */}
            <div className="grid grid-cols-2 bg-black/20 border-b" style={{ borderColor: 'rgba(63, 255, 139, 0.2)' }}>
              <div className="px-4 py-3 font-semibold" style={{ fontFamily: 'Space Mono, monospace', color: '#3fff8b' }}>property</div>
              <div className="px-4 py-3 font-semibold text-right" style={{ fontFamily: 'Space Mono, monospace', color: '#3fff8b' }}>value</div>
            </div>
            {/* Rows */}
            <div className="divide-y" style={{ borderColor: 'rgba(63, 255, 139, 0.15)' }}>
              <div className="grid grid-cols-2 hover:bg-black/20 transition-colors">
                <div className="px-4 py-2" style={{ fontFamily: 'Space Mono, monospace', color: '#acaab1' }}>total_projects</div>
                <div className="px-4 py-2 text-right" style={{ fontFamily: 'Space Mono, monospace', color: '#3fff8b' }}>{String(stats.total_projects ?? 0)}</div>
              </div>
              <div className="grid grid-cols-2 hover:bg-black/20 transition-colors">
                <div className="px-4 py-2" style={{ fontFamily: 'Space Mono, monospace', color: '#acaab1' }}>total_files</div>
                <div className="px-4 py-2 text-right" style={{ fontFamily: 'Space Mono, monospace', color: '#3fff8b' }}>{String(stats.total_files ?? 0)}</div>
              </div>
              <div className="grid grid-cols-2 hover:bg-black/20 transition-colors">
                <div className="px-4 py-2" style={{ fontFamily: 'Space Mono, monospace', color: '#acaab1' }}>total_contributions</div>
                <div className="px-4 py-2 text-right" style={{ fontFamily: 'Space Mono, monospace', color: '#3fff8b' }}>{contributions}</div>
              </div>
            </div>
          </div>

          {/* File Extensions Table */}
          {stats.extensions && Object.keys(stats.extensions).length > 0 && (
            <div className="rounded border overflow-hidden" style={{ borderColor: 'rgba(63, 255, 139, 0.3)' }}>
              {/* Header */}
              <div className="grid grid-cols-2 bg-black/20 border-b" style={{ borderColor: 'rgba(63, 255, 139, 0.2)' }}>
                <div className="px-4 py-3 font-semibold" style={{ fontFamily: 'Space Mono, monospace', color: '#3fff8b' }}>file_type</div>
                <div className="px-4 py-3 font-semibold text-right" style={{ fontFamily: 'Space Mono, monospace', color: '#3fff8b' }}>count</div>
              </div>
              {/* Rows */}
              <div className="divide-y" style={{ borderColor: 'rgba(63, 255, 139, 0.15)' }}>
                {Object.entries(stats.extensions).sort((a: any, b: any) => (b[1] - a[1])).map(([ext, count]) => (
                  <div key={ext} className="grid grid-cols-2 hover:bg-black/20 transition-colors">
                    <div className="px-4 py-2" style={{ fontFamily: 'Space Mono, monospace', color: '#acaab1' }}>{ext}</div>
                    <div className="px-4 py-2 text-right" style={{ fontFamily: 'Space Mono, monospace', color: '#3fff8b' }}>{String(count)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="rounded border p-4" style={{ borderColor: 'rgba(63, 255, 139, 0.2)', backgroundColor: 'rgba(63, 255, 139, 0.04)' }}>
            <div className="text-xs space-y-2" style={{ fontFamily: 'Space Mono, monospace', color: '#acaab1' }}>
              <div><span style={{ color: '#3fff8b' }}>$</span> stat --partial: {stats.partial ? 'yes (some data may be missing)' : 'no'}</div>
              <div><span style={{ color: '#3fff8b' }}>$</span> stat --cached-until: {cachedUntil ? new Date(cachedUntil).toLocaleString() : 'n/a'}</div>
              {cachedUntil && Date.parse(cachedUntil) > nowTs && (() => {
                const totalSeconds = Math.max(0, Math.ceil((Date.parse(cachedUntil) - nowTs) / 1000));
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                let timeStr = '';
                if (hours > 0) timeStr += `${hours}h `;
                if (minutes > 0 || hours > 0) timeStr += `${minutes}m `;
                timeStr += `${seconds}s`;
                return <div><span style={{ color: '#3fff8b' }}>$</span> next-refresh: {timeStr.trim()}</div>;
              })()}
              <div className="pt-2 text-xs text-opacity-70" style={{ color: '#acaab1' }}>
                note: some metrics (detailed LOC, uploads, deletes, exact time spent) require additional backend instrumentation. ask to add more endpoints.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted">{loading ? 'Loading...' : 'No stats available yet.'}</div>
      )}
    </div>
  )
}
