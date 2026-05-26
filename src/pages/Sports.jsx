import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { RefreshCw } from 'lucide-react'

function TeamLogo({ logo, name, size = 32 }) {
  if (logo) return <img src={logo} alt={name} style={{ width: size, height: size, objectFit: 'contain' }} />
  return <div style={{ width: size, height: size, background: 'var(--surface2)', borderRadius: 8 }} />
}

function MatchRow({ match }) {
  const { home, away, status, statusDisplay, live, date } = match
  const isFinal = status === 'STATUS_FINAL'
  const hasScore = home.score !== null && away.score !== null

  return (
    <div className="card py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {live ? '' : isFinal ? 'Lokið' : new Date(date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: live ? 'rgba(239,68,68,0.15)' : isFinal ? 'rgba(0,212,170,0.1)' : 'rgba(100,116,139,0.1)',
            color: live ? '#ef4444' : isFinal ? 'var(--accent)' : 'var(--muted)',
          }}>
          {live ? `🔴 ${statusDisplay || 'LIVE'}` : isFinal ? 'FT' : statusDisplay || new Date(date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <TeamLogo logo={home.logo} name={home.name} size={28} />
          <span className="text-sm font-medium truncate"
                style={{ color: isFinal && home.winner ? 'var(--text)' : isFinal ? 'var(--muted)' : 'var(--text)' }}>
            {home.name}
          </span>
        </div>
        <div className="shrink-0 text-center px-2">
          {hasScore ? (
            <span className="text-lg font-bold tabular-nums">{home.score} - {away.score}</span>
          ) : (
            <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>vs</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 flex-row-reverse">
          <TeamLogo logo={away.logo} name={away.name} size={28} />
          <span className="text-sm font-medium truncate text-right"
                style={{ color: isFinal && away.winner ? 'var(--text)' : isFinal ? 'var(--muted)' : 'var(--text)' }}>
            {away.name}
          </span>
        </div>
      </div>
    </div>
  )
}

function Section({ title, matches, emptyMsg }) {
  if (!matches || matches.length === 0) return (
    <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>{emptyMsg}</div>
  )
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: 'var(--muted)' }}>{title}</h3>
      {matches.map(m => <MatchRow key={m.id} match={m} />)}
    </div>
  )
}

export default function Sports() {
  const { inter, knicks, loading, error, refresh } = useSports()
  const [tab, setTab] = useState('inter')

  const TABS = [
    { id: 'inter', label: '⚫🔵 Inter Milan' },
    { id: 'knicks', label: '🏀 Knicks' },
  ]

  const data = tab === 'inter' ? inter : knicks

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Live scores &amp; stöður</p>
        </div>
        <button onClick={refresh} className="btn btn-ghost" style={{ padding: '8px 12px' }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Team tabs */}
      <div className="flex gap-2">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: tab === id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="card animate-pulse-soft" style={{ height: 80 }} />
          ))}
        </div>
      ) : error && !data ? (
        <div className="card text-center py-8">
          <div className="text-2xl mb-2">😕</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Gat ekki sótt gögn</div>
          <button onClick={refresh} className="btn btn-ghost mt-3 mx-auto">Reyna aftur</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Live / Today */}
          {data?.upcoming?.filter(m => m.live).length > 0 && (
            <Section
              title="🔴 Í beinni útsendingu"
              matches={data.upcoming.filter(m => m.live)}
              emptyMsg=""
            />
          )}

          {/* Upcoming */}
          <Section
            title="Væntanlegir leikir"
            matches={data?.upcoming?.filter(m => !m.live).slice(0, 5)}
            emptyMsg="Engir væntanlegir leikir"
          />

          {/* Recent results */}
          <Section
            title="Nýlegar niðurstöður"
            matches={data?.recent?.slice(0, 5)}
            emptyMsg="Engar nýlegar niðurstöður"
          />
        </div>
      )}

      {/* Team crests */}
      <div className="card flex items-center justify-center gap-6 py-4" style={{ background: 'linear-gradient(135deg, rgba(0,104,168,0.08), rgba(0,212,170,0.08))' }}>
        <div className="flex flex-col items-center gap-2">
          <img src="https://a.espncdn.com/i/teamlogos/soccer/500/110.png" alt="Inter" className="w-12 h-12 object-contain" />
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Serie A</span>
        </div>
        <span className="text-2xl" style={{ color: 'var(--border)' }}>|</span>
        <div className="flex flex-col items-center gap-2">
          <img src="https://a.espncdn.com/i/teamlogos/nba/500/ny.png" alt="Knicks" className="w-12 h-12 object-contain" />
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>NBA</span>
        </div>
      </div>
    </div>
  )
}
