import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function SportsWidget() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const key = 'scores_eng.1'
    const keyAt = 'scores_at_eng.1'
    const cached = sessionStorage.getItem(key)
    const cachedAt = sessionStorage.getItem(keyAt)
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      setEvents(JSON.parse(cached).events || [])
      setLoading(false)
      return
    }
    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard')
      .then(r => r.json())
      .then(d => {
        const evts = d.events || []
        sessionStorage.setItem(key, JSON.stringify(d))
        sessionStorage.setItem(keyAt, String(Date.now()))
        setEvents(evts)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const liveEvents = events.filter(e => e.competitions?.[0]?.status?.type?.state === 'in')
  const recentEvents = events.filter(e => e.competitions?.[0]?.status?.type?.state === 'post')
  const upcomingEvents = events.filter(e => e.competitions?.[0]?.status?.type?.state === 'pre')

  const displayEvents = liveEvents.length > 0 ? liveEvents.slice(0, 3)
    : recentEvents.length > 0 ? recentEvents.slice(0, 3)
    : upcomingEvents.slice(0, 3)

  if (loading) return null
  if (displayEvents.length === 0) return null

  const hasLive = liveEvents.length > 0
  const label = hasLive ? 'LIVE' : recentEvents.length > 0 ? 'Nýlegar niðurstöður' : 'Á dagskrá'

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
          <span className="font-semibold text-sm">Premier League</span>
          {hasLive && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold animate-pulse-soft"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
              ⬤ LIVE
            </span>
          )}
        </div>
        <Link to="/sports" className="text-xs" style={{ color: 'var(--accent)' }}>Allt →</Link>
      </div>

      {!hasLive && (
        <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>{label}</div>
      )}

      <div className="flex flex-col gap-1.5">
        {displayEvents.map(event => {
          const comp = event.competitions?.[0]
          const home = comp?.competitors?.find(c => c.homeAway === 'home')
          const away = comp?.competitors?.find(c => c.homeAway === 'away')
          const state = comp?.status?.type?.state
          const isLive = state === 'in'
          const isFinal = state === 'post'

          return (
            <div key={event.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg"
                 style={{ background: 'var(--surface2)' }}>
              <span className="flex-1 text-right text-xs font-medium truncate">
                {home?.team?.abbreviation || home?.team?.shortDisplayName}
              </span>
              <span className="text-xs font-bold tabular-nums shrink-0"
                    style={{ minWidth: 52, textAlign: 'center', color: isLive ? '#ef4444' : 'var(--text)' }}>
                {isFinal || isLive
                  ? `${home?.score ?? 0}–${away?.score ?? 0}`
                  : comp?.status?.type?.shortDetail || 'vs'}
              </span>
              <span className="flex-1 text-xs font-medium truncate">
                {away?.team?.abbreviation || away?.team?.shortDisplayName}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
