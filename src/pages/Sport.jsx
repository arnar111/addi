import { useState } from 'react'
import { useWCCountdown, useLiveScores } from '../hooks/useSport'
import { ExternalLink, Tv } from 'lucide-react'

const LEAGUES = [
  { id: 'fifa.world', label: 'WC 2026', icon: '🌍' },
  { id: 'eng.1', label: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'ice.1', label: 'Úrvals', icon: '🇮🇸' },
]

const QUICK_LINKS = [
  { label: 'The Athletic', url: 'https://theathletic.com', icon: '📰', color: '#f97316' },
  { label: 'Transfermarkt', url: 'https://transfermarkt.com', icon: '💶', color: '#22c55e' },
  { label: 'BBC Sport', url: 'https://bbc.co.uk/sport', icon: '🎙️', color: '#3b82f6' },
  { label: 'Flashscore', url: 'https://www.flashscore.com', icon: '⚡', color: '#f59e0b' },
]

function WCCountdown() {
  const { started, days, hours, minutes, seconds } = useWCCountdown()

  if (started) {
    return (
      <div className="card text-center" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(0,212,170,0.3)' }}>
        <div className="text-3xl mb-1">🌍</div>
        <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>FIFA World Cup 2026</div>
        <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Gangi þér vel!</div>
      </div>
    )
  }

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.10), rgba(139,92,246,0.10))', border: '1px solid rgba(0,212,170,0.25)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🌍</span>
        <div>
          <div className="font-bold text-sm" style={{ color: 'var(--accent)' }}>FIFA World Cup 2026</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>USA · Canada · Mexico · 11. júní</div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          [days, 'Dagar'],
          [hours, 'Klst'],
          [minutes, 'Mín'],
          [seconds, 'Sek'],
        ].map(([val, label]) => (
          <div key={label} className="flex flex-col gap-0.5 py-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>{String(val).padStart(2, '0')}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MatchCard({ match }) {
  const isLive = match.isLive
  const isPre = match.state === 'pre'
  const date = new Date(match.date)
  const timeStr = date.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
  const dateStr = date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="card py-3 px-4 flex items-center gap-3"
         style={{ border: isLive ? '1px solid rgba(0,212,170,0.4)' : '1px solid var(--border)' }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium truncate">{match.home}</span>
          <span className="text-lg font-bold tabular-nums px-2" style={{ color: isLive ? 'var(--accent)' : 'var(--text)' }}>
            {isPre ? '-' : `${match.homeScore} - ${match.awayScore}`}
          </span>
          <span className="text-sm font-medium truncate text-right">{match.away}</span>
        </div>
      </div>
      <div className="shrink-0 text-right" style={{ minWidth: 64 }}>
        {isLive ? (
          <span className="badge text-xs animate-pulse-soft" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
            LIVE
          </span>
        ) : (
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {isPre ? (
              <><div>{dateStr}</div><div>{timeStr}</div></>
            ) : match.status}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sport() {
  const [league, setLeague] = useState('fifa.world')
  const { matches, loading } = useLiveScores(league)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Leikir, niðurstöður & WC 2026</p>
      </div>

      <WCCountdown />

      {/* League picker */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {LEAGUES.map(l => (
          <button key={l.id} onClick={() => setLeague(l.id)}
            className="btn shrink-0 text-sm"
            style={{
              background: league === l.id ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: league === l.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${league === l.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>
            {l.icon} {l.label}
          </button>
        ))}
      </div>

      {/* Matches */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse-soft py-3">
              <div className="h-5 rounded" style={{ background: 'var(--surface2)' }} />
            </div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
          <div className="text-2xl mb-2">⚽</div>
          <div className="text-sm">Engir leikir í dag</div>
          <div className="text-xs mt-1">Prófaðu aðra deild eða kíktu aftur síðar</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {matches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}

      {/* Quick links */}
      <div className="card flex flex-col gap-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Tv size={14} style={{ color: 'var(--accent)' }} /> Fljótlegar tenglar
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_LINKS.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-medium transition-all"
               style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <span className="text-lg">{l.icon}</span>
              <span style={{ color: 'var(--text)' }}>{l.label}</span>
              <ExternalLink size={12} className="ml-auto" style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
      </div>

      {/* West Ham note */}
      <div className="card flex items-start gap-3 py-3"
           style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
        <span className="text-xl mt-0.5">⚒️</span>
        <div>
          <div className="text-sm font-semibold">West Ham United</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Sæmdi niður úr Premier League 2025/26. Við komum aftur! 💪
          </div>
        </div>
      </div>
    </div>
  )
}
