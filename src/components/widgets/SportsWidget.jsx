import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, ChevronRight, Zap } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

function isToday(dateStr) {
  if (!dateStr) return false
  return dateStr === new Date().toISOString().split('T')[0]
}

export default function SportsWidget() {
  const [nextMatch, setNextMatch] = useState(null)
  const [todayMatches, setTodayMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [favTeam] = useLocalStorage('addi_fav_team', 'Arsenal')

  useEffect(() => {
    fetch('https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328')
      .then(r => r.json())
      .then(d => {
        const events = d.events || []
        const todays = events.filter(e => isToday(e.dateEvent))
        setTodayMatches(todays)
        const fav = events.find(e =>
          e.strHomeTeam?.includes(favTeam) || e.strAwayTeam?.includes(favTeam)
        )
        setNextMatch(fav || events[0] || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [favTeam])

  if (loading) {
    return (
      <div className="card flex items-center gap-3 py-3">
        <div className="w-7 h-7 rounded-lg animate-pulse" style={{ background: 'var(--surface2)' }} />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-3 rounded-full w-2/3 animate-pulse" style={{ background: 'var(--surface2)' }} />
          <div className="h-2.5 rounded-full w-1/2 animate-pulse" style={{ background: 'var(--surface2)' }} />
        </div>
      </div>
    )
  }

  if (!nextMatch) {
    return (
      <Link to="/sports" className="card flex items-center gap-3 py-3 no-underline"
            style={{ textDecoration: 'none' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
             style={{ background: 'rgba(0,212,170,0.1)' }}>⚽</div>
        <div className="flex-1">
          <div className="text-sm font-medium">Premier League</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Sjá töflu og leiki</div>
        </div>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </Link>
    )
  }

  const matchDate = new Date(`${nextMatch.dateEvent}T${nextMatch.strTime?.slice(0, 5) || '15:00'}:00`)
  const isLive = isToday(nextMatch.dateEvent)

  return (
    <Link to="/sports" className="card no-underline" style={{ textDecoration: 'none' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Trophy size={13} style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
            {isLive ? 'Í DAG' : 'NÆSTI LEIKUR'} · {favTeam.toUpperCase()}
          </span>
          {isLive && (
            <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
              <Zap size={10} />LIVE
            </span>
          )}
        </div>
        <ChevronRight size={13} style={{ color: 'var(--muted)' }} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 text-right">
          <div className="text-sm font-semibold leading-tight">
            {nextMatch.strHomeTeam?.replace('Wolverhampton Wanderers', 'Wolves')}
          </div>
        </div>

        <div className="flex flex-col items-center gap-0.5 shrink-0 px-3">
          <div className="text-base font-bold px-2 py-0.5 rounded-lg"
               style={{ background: 'var(--surface2)', minWidth: 48, textAlign: 'center' }}>
            {isLive ? 'LIVE' : matchDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </div>
          {!isLive && (
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {matchDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="text-sm font-semibold leading-tight">
            {nextMatch.strAwayTeam?.replace('Wolverhampton Wanderers', 'Wolves')}
          </div>
        </div>
      </div>

      {todayMatches.length > 1 && (
        <div className="mt-2 pt-2 text-xs" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
          +{todayMatches.length - 1} leikur í viðbót í dag
        </div>
      )}
    </Link>
  )
}
