import { useState, useEffect } from 'react'

const TEAM_ID = '133604'
const RED = '#da020a'

export default function ManUnitedWidget() {
  const [next, setNext] = useState(null)
  const [last, setLast] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('mufc')
    const cachedAt = sessionStorage.getItem('mufc_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 30 * 60 * 1000) {
      const d = JSON.parse(cached)
      setNext(d.next)
      setLast(d.last)
      setLoading(false)
      return
    }

    Promise.all([
      fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnext5.php?id=${TEAM_ID}`).then(r => r.json()),
      fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast5.php?id=${TEAM_ID}`).then(r => r.json()),
    ])
      .then(([nd, ld]) => {
        const n = nd.events?.[0] ?? null
        const l = ld.results?.[0] ?? null
        setNext(n)
        setLast(l)
        sessionStorage.setItem('mufc', JSON.stringify({ next: n, last: l }))
        sessionStorage.setItem('mufc_at', String(Date.now()))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="card animate-pulse-soft" style={{ height: 80, borderColor: `${RED}22` }} />
    )
  }

  if (!next && !last) return null

  const nextIsHome = next?.strHomeTeam === 'Manchester United'
  const nextOpponent = next ? (nextIsHome ? next.strAwayTeam : next.strHomeTeam) : null
  const matchDate = next?.strDate ? new Date(next.strDate) : null
  const daysUntil = matchDate
    ? Math.ceil((matchDate.setHours(12) - Date.now()) / 86400000)
    : null

  const lastIsHome = last?.strHomeTeam === 'Manchester United'
  const muScore = last ? Number(lastIsHome ? last.intHomeScore : last.intAwayScore) : 0
  const oppScore = last ? Number(lastIsHome ? last.intAwayScore : last.intHomeScore) : 0
  const lastOpponent = last ? (lastIsHome ? last.strAwayTeam : last.strHomeTeam) : null
  const won = muScore > oppScore
  const drew = muScore === oppScore
  const resultColor = won ? 'var(--success)' : drew ? '#f97316' : 'var(--danger)'
  const resultLabel = won ? 'W' : drew ? 'D' : 'L'

  return (
    <div className="card" style={{
      background: `linear-gradient(135deg, rgba(218,2,10,0.07) 0%, transparent 70%)`,
      borderColor: `rgba(218,2,10,0.2)`,
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>🔴</span>
          <span className="text-xs font-bold tracking-wide" style={{ color: 'var(--muted)' }}>MAN UNITED</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {next?.strLeague?.replace('English Premier League', 'Premier League') || ''}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {next && (
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Næsti leikur</div>
            <div className="text-sm font-semibold truncate">
              {nextIsHome ? 'vs' : '@'} {nextOpponent}
            </div>
            <div className="text-xs mt-0.5 font-medium" style={{
              color: daysUntil === 0 ? RED : daysUntil !== null && daysUntil <= 3 ? 'var(--accent)' : 'var(--muted)',
            }}>
              {daysUntil === 0 ? '🔴 Í dag!' : daysUntil === 1 ? '⚡ Á morgun' : daysUntil !== null ? `${daysUntil} dagar` : ''}
              {matchDate ? ` · ${new Date(next.strDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}` : ''}
            </div>
          </div>
        )}

        {last && (
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Síðasti leikur</div>
            <div className="text-sm font-semibold truncate">
              {lastIsHome ? 'vs' : '@'} {lastOpponent}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold tabular-nums" style={{ color: resultColor }}>
                {muScore}–{oppScore}
              </span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: `${resultColor}22`, color: resultColor }}>
                {resultLabel}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
