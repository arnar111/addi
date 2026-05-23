import { useState } from 'react'
import { ExternalLink, Trophy, Zap } from 'lucide-react'
import { useWCCountdown, useESPNScores } from '../hooks/useSports'

function CountdownBlock({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  )
}

function MatchRow({ match }) {
  const isLive = match.state === 'in'
  const isDone = match.completed
  const date = new Date(match.date)
  const timeStr = date.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
  const dateStr = date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })

  const homeWin = isDone && match.home.winner
  const awayWin = isDone && match.away.winner

  return (
    <div className="flex items-center gap-3 py-3 px-1"
         style={{ borderBottom: '1px solid var(--border)' }}>
      {/* Home */}
      <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
        <span className="text-sm font-medium truncate" style={{ fontWeight: homeWin ? 700 : 500 }}>
          {match.home.name}
        </span>
        {match.home.logo && (
          <img src={match.home.logo} alt="" className="w-6 h-6 object-contain shrink-0" />
        )}
      </div>

      {/* Score / Time */}
      <div className="flex flex-col items-center shrink-0 min-w-[72px]">
        {isLive || isDone ? (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{match.home.score}</span>
            <span style={{ color: 'var(--muted)' }}>–</span>
            <span className="text-lg font-bold">{match.away.score}</span>
          </div>
        ) : (
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{timeStr}</span>
        )}
        <span className="text-xs mt-0.5"
              style={{ color: isLive ? '#22c55e' : 'var(--muted)', fontWeight: isLive ? 700 : 400 }}>
          {isLive ? '● LIVE' : isDone ? 'Lokið' : dateStr}
        </span>
      </div>

      {/* Away */}
      <div className="flex items-center gap-2 flex-1 justify-start min-w-0">
        {match.away.logo && (
          <img src={match.away.logo} alt="" className="w-6 h-6 object-contain shrink-0" />
        )}
        <span className="text-sm truncate" style={{ fontWeight: awayWin ? 700 : 500 }}>
          {match.away.name}
        </span>
      </div>
    </div>
  )
}

function ScoreSection({ title, matches, loading, error }) {
  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-32 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      {[1, 2, 3].map(i => (
        <div key={i} className="h-12 rounded mb-2" style={{ background: 'var(--surface2)' }} />
      ))}
    </div>
  )

  return (
    <div className="card flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        {matches.length > 0 && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{matches.length} leikir</span>
        )}
      </div>
      {error || matches.length === 0 ? (
        <div className="py-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
          {error ? 'Gat ekki sótt gögn' : 'Engir leikir í dag'}
        </div>
      ) : (
        matches.map(m => <MatchRow key={m.id} match={m} />)
      )}
    </div>
  )
}

export default function Sports() {
  const wc = useWCCountdown()
  const { matches: wcMatches, loading: wcLoading, error: wcError } = useESPNScores('fifa.world')
  const [tab, setTab] = useState('wc')

  const liveMatches = wcMatches.filter(m => m.state === 'in')
  const todayMatches = wcMatches.filter(m => {
    const d = new Date(m.date)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })
  const upcomingMatches = wcMatches
    .filter(m => !m.completed && m.state !== 'in')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6)
  const recentMatches = wcMatches
    .filter(m => m.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  const displayMatches = liveMatches.length > 0 ? liveMatches
    : todayMatches.length > 0 ? todayMatches
    : upcomingMatches

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Sport</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {wc.started ? 'Heimsmeistaramótið 2026 er hafið! 🏆' : 'Heimsmeistaramótið 2026 · USA / Canada / Mexico'}
        </p>
      </div>

      {/* World Cup Countdown */}
      {!wc.started ? (
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(139,92,246,0.1))',
          border: '1px solid rgba(0,212,170,0.2)'
        }}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} style={{ color: '#f97316' }} />
            <span className="text-sm font-semibold">FIFA World Cup 2026</span>
            <span className="badge ml-auto" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
              Í bið
            </span>
          </div>
          <div className="flex items-center justify-around mb-4">
            <CountdownBlock value={wc.days} label="Dagar" />
            <div style={{ color: 'var(--border)', fontSize: 24, fontWeight: 300 }}>:</div>
            <CountdownBlock value={wc.hours} label="Klukkur" />
            <div style={{ color: 'var(--border)', fontSize: 24, fontWeight: 300 }}>:</div>
            <CountdownBlock value={wc.minutes} label="Mínútur" />
            <div style={{ color: 'var(--border)', fontSize: 24, fontWeight: 300 }}>:</div>
            <CountdownBlock value={wc.seconds} label="Sekúndur" />
          </div>
          <div className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            Opnunarleiknir: 11. júní 2026 · Mexico City
          </div>
        </div>
      ) : (
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(239,68,68,0.08))',
          border: '1px solid rgba(249,115,22,0.3)'
        }}>
          <div className="flex items-center gap-2">
            <Zap size={18} style={{ color: '#f97316' }} />
            <span className="font-semibold">Heimsmeistaramótið er hafið!</span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            FIFA World Cup 2026 · USA / Canada / Mexico
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          ['wc', '🏆 World Cup'],
          ['epl', '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England'],
        ].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'wc' && (
        <>
          {/* Live now */}
          {liveMatches.length > 0 && (
            <div className="card" style={{ border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: '#22c55e' }} />
                <span className="text-sm font-semibold" style={{ color: '#22c55e' }}>LIVE</span>
              </div>
              {liveMatches.map(m => <MatchRow key={m.id} match={m} />)}
            </div>
          )}

          <ScoreSection
            title={liveMatches.length > 0 ? 'Fleiri leikir í dag' : wc.started ? 'Næstu leikir' : 'Á dagskrá'}
            matches={displayMatches}
            loading={wcLoading}
            error={wcError}
          />

          {recentMatches.length > 0 && (
            <ScoreSection title="Nýlegar niðurstöður" matches={recentMatches} loading={false} error={null} />
          )}
        </>
      )}

      {tab === 'epl' && (
        <EPLSection />
      )}

      {/* Quick Links */}
      <div className="card flex flex-col gap-2">
        <h3 className="text-sm font-semibold mb-1">Hlekkir</h3>
        {[
          { label: 'The Athletic', url: 'https://www.nytimes.com/athletic/', icon: '📰' },
          { label: 'ESPN FC', url: 'https://www.espn.com/soccer/', icon: '⚽' },
          { label: 'FIFA WC 2026', url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026', icon: '🏆' },
          { label: 'r/soccer', url: 'https://reddit.com/r/soccer', icon: '🤖' },
        ].map(({ label, url, icon }) => (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-3 py-2 px-1"
             style={{ borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)' }}>
            <span className="text-base">{icon}</span>
            <span className="flex-1 text-sm">{label}</span>
            <ExternalLink size={13} style={{ color: 'var(--muted)' }} />
          </a>
        ))}
      </div>
    </div>
  )
}

function EPLSection() {
  const { matches, loading, error } = useESPNScores('eng.1')
  const upcoming = matches.filter(m => !m.completed).slice(0, 5)
  const recent = matches.filter(m => m.completed).slice(0, 5)

  return (
    <>
      <ScoreSection title="Premier League · Næstu leikir" matches={upcoming} loading={loading} error={error} />
      {recent.length > 0 && (
        <ScoreSection title="Nýlegar niðurstöður" matches={recent} loading={false} error={null} />
      )}
    </>
  )
}
