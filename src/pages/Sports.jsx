import { useState } from 'react'
import { useSports, LEAGUES } from '../hooks/useSports'
import { RefreshCw, Clock, Trophy, Zap } from 'lucide-react'

const WC2026_START = new Date('2026-06-11T19:00:00Z')
const WC2026_FINAL = new Date('2026-08-19T19:00:00Z')

function getDaysUntil(date) {
  return Math.max(0, Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)))
}

function MatchCard({ match }) {
  const isLive = match.isLive
  const isFinal = match.isFinal

  return (
    <div className="card py-3 px-4 flex flex-col gap-2.5"
         style={{ borderColor: isLive ? 'rgba(0,212,170,0.3)' : 'var(--border)' }}>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium"
              style={{ color: isLive ? 'var(--accent)' : isFinal ? 'var(--muted)' : 'var(--muted)' }}>
          {isLive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />}
          {match.detail}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {match.home.logo ? (
            <img src={match.home.logo} alt={match.home.name} className="w-7 h-7 object-contain shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full shrink-0" style={{ background: 'var(--surface2)' }} />
          )}
          <span className="text-sm font-medium truncate"
                style={{ opacity: isFinal && match.away.winner ? 0.55 : 1 }}>
            {match.home.name}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 shrink-0 font-mono font-bold text-lg tabular-nums">
          <span style={{ color: isFinal && match.home.winner ? 'var(--text)' : 'var(--muted)' }}>
            {match.home.score}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>–</span>
          <span style={{ color: isFinal && match.away.winner ? 'var(--text)' : 'var(--muted)' }}>
            {match.away.score}
          </span>
        </div>

        {/* Away */}
        <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
          <span className="text-sm font-medium truncate text-right"
                style={{ opacity: isFinal && match.home.winner ? 0.55 : 1 }}>
            {match.away.name}
          </span>
          {match.away.logo ? (
            <img src={match.away.logo} alt={match.away.name} className="w-7 h-7 object-contain shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full shrink-0" style={{ background: 'var(--surface2)' }} />
          )}
        </div>
      </div>
    </div>
  )
}

function WorldCupTab() {
  const daysUntil = getDaysUntil(WC2026_START)
  const isStarted = daysUntil === 0

  const USMNT_NEWS = [
    { player: 'Gio Reyna', news: 'Confirmed in Pochettino\'s 26-man roster', flag: '🇺🇸' },
    { player: 'Christian Pulisic', news: 'Captain — key to USMNT attack', flag: '🇺🇸' },
    { player: 'Phil Foden', news: '❌ Out of England squad (injury)', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  ]

  const KEY_DATES = [
    { date: 'June 11', event: 'Opening match — Mexico City 🇲🇽', highlight: true },
    { date: 'June 12', event: 'USMNT first match 🇺🇸', highlight: true },
    { date: 'June 15', event: 'England first match 🏴󠁧󠁢󠁥󠁮󠁧󠁿', highlight: false },
    { date: 'Aug 19', event: 'World Cup Final 🏆', highlight: false },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Countdown */}
      <div className="card text-center py-6"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.08))' }}>
        <div className="text-5xl mb-1">🌍</div>
        {isStarted ? (
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            World Cup 2026 is LIVE!
          </div>
        ) : (
          <>
            <div className="text-5xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
              {daysUntil}
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              days until FIFA World Cup 2026
            </div>
            <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
              USA · Canada · Mexico · Opens June 11
            </div>
          </>
        )}
      </div>

      {/* Key dates */}
      <div className="card flex flex-col gap-3">
        <h3 className="font-semibold text-sm">Key Dates</h3>
        {KEY_DATES.map(d => (
          <div key={d.date} className="flex items-center gap-3">
            <div className="text-xs font-mono w-14 shrink-0" style={{ color: 'var(--accent)' }}>{d.date}</div>
            <div className="text-sm" style={{ color: d.highlight ? 'var(--text)' : 'var(--muted)' }}>{d.event}</div>
          </div>
        ))}
      </div>

      {/* Squad news */}
      <div className="card flex flex-col gap-3">
        <h3 className="font-semibold text-sm">Squad News</h3>
        {USMNT_NEWS.map(n => (
          <div key={n.player} className="flex items-start gap-2.5">
            <span className="text-base shrink-0">{n.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{n.player}</div>
              <div className="text-xs leading-snug" style={{ color: 'var(--muted)' }}>{n.news}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Hosts */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Host Cities</h3>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {['New York 🗽', 'Los Angeles 🌴', 'Dallas ⭐', 'Miami 🌴', 'Boston 🦞', 'Seattle 🌲'].map(c => (
            <div key={c} className="p-2 rounded-xl" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>{c}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LeagueScores({ leagueId }) {
  const { events, loading, error, refresh } = useSports(leagueId)
  const live = events.filter(e => e.isLive)
  const final = events.filter(e => e.isFinal)
  const scheduled = events.filter(e => e.isScheduled)

  if (loading) return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="card animate-pulse-soft h-20" style={{ background: 'var(--surface)' }} />
      ))}
    </div>
  )

  if (error) return (
    <div className="card text-center py-8 flex flex-col items-center gap-3">
      <div style={{ color: 'var(--muted)' }}>Could not load scores</div>
      <button onClick={refresh} className="btn btn-ghost text-xs">
        <RefreshCw size={13} /> Try again
      </button>
    </div>
  )

  if (events.length === 0) return (
    <div className="card text-center py-10 flex flex-col items-center gap-2">
      <Trophy size={28} style={{ color: 'var(--muted)' }} />
      <div className="text-sm" style={{ color: 'var(--muted)' }}>No matches this week</div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>Check back during match days</div>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {live.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            <Zap size={13} style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>Live</span>
          </div>
          {live.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
      {final.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Results</span>
          </div>
          {final.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
      {scheduled.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            <Clock size={13} style={{ color: 'var(--muted)' }} />
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Upcoming</span>
          </div>
          {scheduled.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  )
}

export default function Sports() {
  const [activeLeague, setActiveLeague] = useState('eng.1')
  const isWC = activeLeague === 'FIFA.WORLD'

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Live scores & fixtures</p>
      </div>

      {/* League tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {LEAGUES.map(l => (
          <button key={l.id} onClick={() => setActiveLeague(l.id)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: activeLeague === l.id ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: activeLeague === l.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${activeLeague === l.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>
            {l.flag} {l.short}
          </button>
        ))}
      </div>

      {isWC ? <WorldCupTab /> : <LeagueScores leagueId={activeLeague} />}
    </div>
  )
}
