import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'

function useWorldCup() {
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('wc2026')
    const cachedAt = sessionStorage.getItem('wc2026At')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      setMatches(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard')
      .then(r => r.json())
      .then(d => {
        const events = (d.events || []).slice(0, 8).map(e => {
          const comp = e.competitions?.[0]
          const comps = comp?.competitors || []
          const home = comps.find(c => c.homeAway === 'home') || comps[0]
          const away = comps.find(c => c.homeAway === 'away') || comps[1]
          return {
            id: e.id,
            home: home?.team?.shortDisplayName || home?.team?.displayName || '?',
            away: away?.team?.shortDisplayName || away?.team?.displayName || '?',
            homeScore: home?.score ?? '',
            awayScore: away?.score ?? '',
            homeFlag: home?.team?.flag || '',
            awayFlag: away?.team?.flag || '',
            status: e.status?.type?.shortDetail || '',
            detail: e.status?.type?.detail || '',
            state: e.status?.type?.state || 'pre',
          }
        })
        sessionStorage.setItem('wc2026', JSON.stringify(events))
        sessionStorage.setItem('wc2026At', String(Date.now()))
        setMatches(events)
        setLoading(false)
      })
      .catch(() => {
        setMatches([])
        setLoading(false)
      })
  }, [])

  return { matches, loading }
}

export default function FootballWidget() {
  const { matches, loading } = useWorldCup()

  if (loading) {
    return (
      <div className="card animate-pulse-soft">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded" style={{ background: 'var(--surface2)' }} />
          <div className="h-4 w-36 rounded" style={{ background: 'var(--surface2)' }} />
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2].map(i => <div key={i} className="h-8 rounded-xl" style={{ background: 'var(--surface2)' }} />)}
        </div>
      </div>
    )
  }

  if (!matches || matches.length === 0) return null

  const live = matches.filter(m => m.state === 'in')
  const upcoming = matches.filter(m => m.state === 'pre')
  const finished = matches.filter(m => m.state === 'post')

  const shown = live.length > 0 ? live
    : upcoming.length > 0 ? upcoming.slice(0, 4)
    : finished.slice(0, 3)

  if (shown.length === 0) return null

  const hasLive = live.length > 0

  return (
    <div className="card" style={{ border: '1px solid rgba(249,115,22,0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={15} style={{ color: '#f97316' }} />
          <h3 className="font-semibold text-sm">FIFA World Cup 2026</h3>
          {hasLive && (
            <span className="badge animate-pulse-soft text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
              LIVE
            </span>
          )}
        </div>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {hasLive ? `${live.length} í gangi` : upcoming.length > 0 ? 'Í dag' : 'Síðasta lota'}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {shown.map(m => (
          <div key={m.id}
               className="flex items-center gap-2 px-3 py-2 rounded-xl"
               style={{ background: m.state === 'in' ? 'rgba(239,68,68,0.06)' : 'var(--surface2)' }}>
            <span className="text-sm font-medium text-right flex-1 truncate">{m.home}</span>
            <div className="flex items-center gap-1.5 shrink-0 min-w-[70px] justify-center">
              {m.state !== 'pre' ? (
                <span className="text-sm font-bold tabular-nums"
                      style={{ color: m.state === 'in' ? 'var(--danger)' : 'var(--text)' }}>
                  {m.homeScore} – {m.awayScore}
                </span>
              ) : (
                <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{m.status}</span>
              )}
            </div>
            <span className="text-sm font-medium flex-1 truncate">{m.away}</span>
            {m.state === 'in' && (
              <span className="text-xs shrink-0 font-semibold" style={{ color: 'var(--danger)' }}>
                {m.detail}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
