import { Link } from 'react-router-dom'
import { useFootball } from '../../hooks/useFootball'
import { Trophy, RefreshCw } from 'lucide-react'

const MY_TEAMS = ['Liverpool', 'LFC', 'Man City', 'Manchester City']

function isMyTeam(name) {
  return MY_TEAMS.some(t => name?.includes(t))
}

function MatchRow({ match }) {
  const live = match.status.state === 'in'
  const done = match.status.state === 'post'
  const myTeamInvolved = isMyTeam(match.home.name) || isMyTeam(match.away.name)

  return (
    <div className="flex items-center gap-2 py-1.5"
         style={{ borderBottom: '1px solid var(--border)', opacity: !live && !done ? 0.7 : 1 }}>
      <div className="flex-1 grid items-center" style={{ gridTemplateColumns: '1fr 52px 1fr', gap: 4 }}>
        <span className="text-xs text-right truncate"
              style={{ fontWeight: isMyTeam(match.home.name) ? 700 : 400, color: isMyTeam(match.home.name) ? 'var(--text)' : 'var(--muted)' }}>
          {match.home.name}
        </span>
        <div className="flex items-center justify-center">
          {done || live ? (
            <span className="text-xs font-bold font-mono tabular-nums"
                  style={{ color: live ? 'var(--success)' : myTeamInvolved ? 'var(--text)' : 'var(--muted)' }}>
              {match.home.score}–{match.away.score}
            </span>
          ) : (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(match.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <span className="text-xs truncate"
              style={{ fontWeight: isMyTeam(match.away.name) ? 700 : 400, color: isMyTeam(match.away.name) ? 'var(--text)' : 'var(--muted)' }}>
          {match.away.name}
        </span>
      </div>
      {live && (
        <span className="text-xs shrink-0 px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', fontSize: 10 }}>
          {match.status.clock}'
        </span>
      )}
      {done && (
        <span className="text-xs shrink-0" style={{ color: 'var(--muted)', fontSize: 10 }}>
          {match.status.detail}
        </span>
      )}
    </div>
  )
}

export default function SportsWidget() {
  const { data, loading } = useFootball('eng.1')

  if (loading) {
    return (
      <div className="card animate-pulse-soft" style={{ height: 100 }}>
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={13} style={{ color: 'var(--muted)' }} />
          <div className="h-3 w-28 rounded" style={{ background: 'var(--surface2)' }} />
        </div>
        {[1, 2].map(i => <div key={i} className="h-7 rounded mb-1.5" style={{ background: 'var(--surface2)' }} />)}
      </div>
    )
  }

  if (!data?.events?.length) return null

  const live = data.events.filter(e => e.status.state === 'in')
  const done = data.events.filter(e => e.status.state === 'post')
  const shown = live.length > 0 ? live.slice(0, 4) : done.slice(0, 4)

  if (!shown.length) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Trophy size={13} style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Premier League</span>
          </div>
          <Link to="/sports" className="text-xs" style={{ color: 'var(--accent)' }}>Allt →</Link>
        </div>
        <p className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>Engar leikir í dag</p>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: '14px 14px 10px' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Trophy size={13} style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
            Premier League {live.length > 0 && <span style={{ color: 'var(--success)' }}>· Í gangi</span>}
          </span>
        </div>
        <Link to="/sports" className="text-xs" style={{ color: 'var(--accent)' }}>Allt →</Link>
      </div>
      <div className="flex flex-col">
        {shown.map(m => <MatchRow key={m.id} match={m} />)}
      </div>
    </div>
  )
}
