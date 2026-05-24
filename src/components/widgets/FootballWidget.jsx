import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function FootballWidget() {
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('football_widget')
    const cachedAt = sessionStorage.getItem('football_widget_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 15 * 60 * 1000) {
      setMatch(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328')
      .then(r => r.json())
      .then(d => {
        const next = d.events?.[0] || null
        sessionStorage.setItem('football_widget', JSON.stringify(next))
        sessionStorage.setItem('football_widget_at', String(Date.now()))
        setMatch(next)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="card" style={{ background: 'rgba(139,92,246,0.04)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">⚽</span>
          <div className="flex-1">
            <div className="h-3 rounded" style={{ background: 'var(--surface2)', width: '60%' }} />
          </div>
        </div>
      </div>
    )
  }

  if (!match) return null

  const date = new Date(match.strTimestamp || match.dateEvent + 'T' + (match.strTime || '12:00:00'))
  const isToday = new Date().toDateString() === date.toDateString()
  const isTomorrow = new Date(Date.now() + 86400000).toDateString() === date.toDateString()

  const when = isToday ? `Í dag · ${match.strTime?.slice(0, 5)}`
    : isTomorrow ? `Á morgun · ${match.strTime?.slice(0, 5)}`
    : date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="card" style={{ background: 'rgba(139,92,246,0.04)', borderColor: 'rgba(139,92,246,0.2)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
          <span>⚽</span>
          <span>Premier League</span>
          {isToday && (
            <span className="badge" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)', fontSize: 10 }}>
              Í dag
            </span>
          )}
        </div>
        <Link to="/football" className="text-xs flex items-center gap-0.5" style={{ color: '#8b5cf6' }}>
          Meira <ArrowRight size={11} />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {match.strHomeTeamBadge ? (
          <img src={match.strHomeTeamBadge} alt="" className="w-7 h-7 object-contain" />
        ) : <span className="w-7 h-7 flex items-center justify-center text-base">🛡️</span>}
        <span className="text-sm font-medium flex-1 truncate">{match.strHomeTeam}</span>
        <span className="text-xs px-1.5" style={{ color: 'var(--muted)' }}>vs</span>
        <span className="text-sm font-medium flex-1 text-right truncate">{match.strAwayTeam}</span>
        {match.strAwayTeamBadge ? (
          <img src={match.strAwayTeamBadge} alt="" className="w-7 h-7 object-contain" />
        ) : <span className="w-7 h-7 flex items-center justify-center text-base">🛡️</span>}
      </div>

      <div className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
        {when}{match.strVenue ? ` · ${match.strVenue}` : ''}
      </div>
    </div>
  )
}
