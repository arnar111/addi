import { useSports } from '../hooks/useSports'
import { RefreshCw, Trophy, Calendar } from 'lucide-react'
import { useState } from 'react'

function StatusBadge({ state, status }) {
  if (state === 'in') return (
    <span className="text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse-soft"
          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>● LIVE</span>
  )
  if (state === 'post') return (
    <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>Lokið</span>
  )
  return (
    <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>Ókomið</span>
  )
}

function GameCard({ home, away, status, state, date, name }) {
  const isLive = state === 'in'
  const isDone = state === 'post'
  const d = new Date(date)
  const dateStr = d.toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })
  const timeStr = d.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar size={13} style={{ color: 'var(--muted)' }} />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {isDone || isLive ? status : `${dateStr} ${timeStr}`}
          </span>
        </div>
        <StatusBadge state={state} status={status} />
      </div>

      <div className="flex items-center">
        <div className="flex-1">
          <div className="text-base font-semibold">{away.name}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Gestir</div>
        </div>
        <div className="flex flex-col items-center px-4">
          {isDone || isLive ? (
            <div className="text-2xl font-bold tabular-nums">
              {away.score} <span style={{ color: 'var(--muted)' }}>–</span> {home.score}
            </div>
          ) : (
            <div className="text-lg font-light" style={{ color: 'var(--muted)' }}>vs</div>
          )}
        </div>
        <div className="flex-1 text-right">
          <div className="text-base font-semibold">{home.name}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Heimamenn</div>
        </div>
      </div>
    </div>
  )
}

export default function Sports() {
  const { nba, soccer, loading } = useSports()
  const [tab, setTab] = useState('inter')

  const tabs = [
    { id: 'inter', label: '⚫🔵 Inter', hasData: soccer?.all?.length > 0 },
    { id: 'nba', label: '🏀 NBA', hasData: nba?.all?.length > 0 },
  ]

  const refresh = () => {
    sessionStorage.removeItem('espn_nba')
    sessionStorage.removeItem('espn_nba_at')
    sessionStorage.removeItem('espn_ita')
    sessionStorage.removeItem('espn_ita_at')
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Inter Milan · NBA</p>
        </div>
        <button onClick={refresh} className="btn btn-ghost" style={{ padding: '8px 10px' }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Team tabs */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="btn flex-1 justify-center text-sm"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse-soft" style={{ height: 100 }}>
              <div className="h-4 w-32 rounded mb-2" style={{ background: 'var(--surface2)' }} />
              <div className="h-6 w-full rounded" style={{ background: 'var(--surface2)' }} />
            </div>
          ))}
        </div>
      )}

      {!loading && tab === 'inter' && (
        <div className="flex flex-col gap-3">
          {/* Inter highlight */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,0,80,0.3), rgba(0,0,160,0.15))', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚫🔵</span>
              <div>
                <div className="font-bold">FC Internazionale Milano</div>
                <div className="text-sm" style={{ color: 'var(--muted)' }}>Serie A · Italia</div>
              </div>
            </div>
          </div>

          {soccer?.inter && soccer.inter.length > 0 ? (
            soccer.inter.map(g => <GameCard key={g.id} {...g} />)
          ) : soccer?.all && soccer.all.length > 0 ? (
            <>
              <div className="text-xs px-1" style={{ color: 'var(--muted)' }}>Serie A leikir í dag</div>
              {soccer.all.map(g => <GameCard key={g.id} {...g} />)}
            </>
          ) : (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <Trophy size={32} className="mx-auto mb-2 opacity-30" />
              <p>Engir Serie A leikir í dag</p>
              <p className="text-xs mt-1">Inter Milan · Næsti leikur á leiðinni</p>
            </div>
          )}
        </div>
      )}

      {!loading && tab === 'nba' && (
        <div className="flex flex-col gap-3">
          {/* NBA header */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.2), rgba(185,28,28,0.1))', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏀</span>
              <div>
                <div className="font-bold">NBA 2025-26</div>
                <div className="text-sm" style={{ color: 'var(--accent)' }}>Cleveland Cavaliers ▶</div>
              </div>
            </div>
          </div>

          {nba?.cavs && nba.cavs.length > 0 ? (
            <>
              <div className="text-xs px-1" style={{ color: 'var(--muted)' }}>Cleveland Cavaliers leikir</div>
              {nba.cavs.map(g => <GameCard key={g.id} {...g} />)}
              {nba.all && nba.all.length > nba.cavs.length && (
                <>
                  <div className="text-xs px-1 mt-2" style={{ color: 'var(--muted)' }}>Aðrir leikir í dag</div>
                  {nba.all.filter(g => !nba.cavs.find(c => c.id === g.id)).slice(0, 4).map(g => (
                    <GameCard key={g.id} {...g} />
                  ))}
                </>
              )}
            </>
          ) : nba?.all && nba.all.length > 0 ? (
            <>
              <div className="text-xs px-1" style={{ color: 'var(--muted)' }}>NBA leikir í dag</div>
              {nba.all.map(g => <GameCard key={g.id} {...g} />)}
            </>
          ) : (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <span className="text-4xl block mb-2">🏀</span>
              <p>Engir NBA leikir í dag</p>
              <p className="text-xs mt-1">Cavaliers · Næsti leikur á leiðinni</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
