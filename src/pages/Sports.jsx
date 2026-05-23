import { useState } from 'react'
import { useSports, LEAGUES } from '../hooks/useSports'
import { RefreshCw, Trophy } from 'lucide-react'

function TeamLogo({ logo, name, size = 28 }) {
  if (logo) {
    return <img src={logo} alt={name} width={size} height={size} className="rounded-full object-contain"
                style={{ background: 'rgba(255,255,255,0.05)' }} />
  }
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-xs"
         style={{ width: size, height: size, background: 'var(--surface2)', color: 'var(--muted)' }}>
      {name?.[0] || '?'}
    </div>
  )
}

function MatchCard({ event }) {
  const isLive = event.isLive
  const isFinal = event.isFinal
  const isScheduled = !isLive && !isFinal

  const kickoff = new Date(event.date)
  const timeStr = kickoff.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
  const dateStr = kickoff.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="card py-3" style={{ padding: '12px 16px' }}>
      {/* Status bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {isFinal ? dateStr : isLive ? dateStr : dateStr}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse-soft"
                style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
            ● LIVE · {event.statusDetail}
          </span>
        ) : isFinal ? (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
            Lokið
          </span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--accent)' }}>{timeStr}</span>
        )}
      </div>

      {/* Match row */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-sm font-medium truncate text-right"
                style={{ color: event.home.winner ? 'var(--text)' : isFinal ? 'var(--muted)' : 'var(--text)' }}>
            {event.home.name}
          </span>
          <TeamLogo logo={event.home.logo} name={event.home.name} />
        </div>

        {/* Score */}
        <div className="flex items-center gap-1 shrink-0">
          {isScheduled ? (
            <span className="text-sm font-bold w-12 text-center" style={{ color: 'var(--muted)' }}>vs</span>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold w-6 text-center"
                    style={{ color: event.home.winner ? 'var(--text)' : isLive ? 'var(--text)' : 'var(--muted)' }}>
                {event.home.score}
              </span>
              <span style={{ color: 'var(--border)' }}>–</span>
              <span className="text-lg font-bold w-6 text-center"
                    style={{ color: event.away.winner ? 'var(--text)' : isLive ? 'var(--text)' : 'var(--muted)' }}>
                {event.away.score}
              </span>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <TeamLogo logo={event.away.logo} name={event.away.name} />
          <span className="text-sm font-medium truncate"
                style={{ color: event.away.winner ? 'var(--text)' : isFinal ? 'var(--muted)' : 'var(--text)' }}>
            {event.away.name}
          </span>
        </div>
      </div>

      {event.venue && (
        <div className="text-xs mt-2 text-center" style={{ color: 'var(--muted)' }}>📍 {event.venue}</div>
      )}
    </div>
  )
}

function LeagueTab({ leagueKey, current, onChange }) {
  const l = LEAGUES[leagueKey]
  const isActive = leagueKey === current
  return (
    <button onClick={() => onChange(leagueKey)}
      className="btn shrink-0 text-xs py-1.5 gap-1"
      style={{
        background: isActive ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
        color: isActive ? 'var(--accent)' : 'var(--muted)',
        border: `1px solid ${isActive ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
      }}>
      <span>{l.flag}</span> {l.name}
    </button>
  )
}

export default function Sports() {
  const [activeLeague, setActiveLeague] = useState('PL')
  const { data, loading, error } = useSports(activeLeague)

  const live    = data?.events?.filter(e => e.isLive) || []
  const final   = data?.events?.filter(e => e.isFinal) || []
  const sched   = data?.events?.filter(e => !e.isLive && !e.isFinal) || []

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Trophy size={18} style={{ color: 'var(--accent)' }} /> Íþróttir
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {data?.events?.length ? `${data.events.length} leikir` : 'Fótbolti & fleira'}
        </p>
      </div>

      {/* League tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {Object.keys(LEAGUES).map(k => (
          <LeagueTab key={k} leagueKey={k} current={activeLeague} onChange={setActiveLeague} />
        ))}
      </div>

      {/* Live section */}
      {live.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: 'var(--danger)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>Í beinni</span>
          </div>
          {live.map(e => <MatchCard key={e.id} event={e} />)}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="card animate-pulse-soft h-20" style={{ background: 'var(--surface2)' }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="card text-center py-8" style={{ border: '1px solid var(--border)' }}>
          <div className="text-3xl mb-2">📡</div>
          <div className="text-sm font-medium mb-1">Gat ekki sótt leiki</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Athugaðu nettengingu eða reyndu aftur
          </div>
          <button onClick={() => window.location.reload()}
            className="btn btn-ghost mt-3 mx-auto text-xs">
            <RefreshCw size={12} /> Reyna aftur
          </button>
        </div>
      )}

      {/* Scheduled */}
      {!loading && sched.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold px-1" style={{ color: 'var(--muted)' }}>Fyrirhugaðir leikir</div>
          {sched.map(e => <MatchCard key={e.id} event={e} />)}
        </div>
      )}

      {/* Final results */}
      {!loading && final.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold px-1" style={{ color: 'var(--muted)' }}>Niðurstöður</div>
          {final.map(e => <MatchCard key={e.id} event={e} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && data?.events?.length === 0 && (
        <div className="card text-center py-10">
          <div className="text-4xl mb-2">⚽</div>
          <div className="text-sm font-medium mb-1">Engir leikir í dag</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Prófaðu aðra deild eða athugaðu aftur seinna
          </div>
        </div>
      )}

      {/* The Athletic promo link */}
      <div className="card flex items-center gap-3" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
        <span className="text-2xl">📰</span>
        <div className="flex-1">
          <div className="text-sm font-medium">The Athletic</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Dýpri greinur um leikina þína</div>
        </div>
        <a href="https://theathletic.com" target="_blank" rel="noreferrer"
           className="btn text-xs py-1.5" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}>
          Opna
        </a>
      </div>
    </div>
  )
}
