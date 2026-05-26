import { useState } from 'react'
import { useKnicksSchedule, useInterMilanSchedule, useNBAScoreboard } from '../hooks/useSports'
import { Trophy, RefreshCw, Flame } from 'lucide-react'

function ScoreRow({ won, lost, completed, inProgress, opponent, isHome, kScore, oScore, iScore, date, team = 'nba' }) {
  const myScore = team === 'nba' ? kScore : iScore
  const result = completed ? (won ? 'W' : 'L') : inProgress ? '🔴' : '–'
  const resultColor = completed ? (won ? 'var(--success)' : 'var(--danger)') : inProgress ? '#f97316' : 'var(--muted)'

  return (
    <div className="flex items-center gap-3 py-2.5 border-b last:border-0"
         style={{ borderColor: 'var(--border)' }}>
      <div className="w-6 text-center">
        <span className="text-sm font-bold" style={{ color: resultColor }}>{result}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{isHome ? 'vs' : '@'} {opponent}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {new Date(date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
      {(completed || inProgress) ? (
        <div className="text-right">
          <div className="font-mono font-semibold text-sm">{myScore} – {oScore}</div>
          {inProgress && <div className="text-xs" style={{ color: '#f97316' }}>LIVE</div>}
        </div>
      ) : (
        <div className="text-xs text-right" style={{ color: 'var(--muted)' }}>
          {new Date(date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  )
}

function StatBadge({ label, value, color = 'var(--accent)' }) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl flex-1"
         style={{ background: 'var(--surface2)' }}>
      <span className="text-xl font-bold" style={{ color }}>{value}</span>
      <span className="text-xs text-center" style={{ color: 'var(--muted)', lineHeight: 1.2 }}>{label}</span>
    </div>
  )
}

function KnicksSection() {
  const { schedule, loading } = useKnicksSchedule()

  const completed = schedule.filter(g => g.completed)
  const upcoming = schedule.filter(g => !g.completed && !g.inProgress)
  const live = schedule.find(g => g.inProgress)
  const wins = completed.filter(g => g.won).length
  const losses = completed.length - wins
  const last5 = completed.slice(-5).reverse()
  const next3 = upcoming.slice(0, 3)

  return (
    <div className="card mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
             style={{ background: 'rgba(0,119,181,0.15)' }}>🏀</div>
        <div>
          <h2 className="font-bold text-lg">New York Knicks</h2>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>NBA · Madison Square Garden</div>
        </div>
        {wins > 0 && (
          <div className="ml-auto text-right">
            <div className="font-bold text-xl" style={{ color: 'var(--accent)' }}>{wins}–{losses}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Season</div>
          </div>
        )}
      </div>

      {/* Finals banner */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl"
           style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(239,68,68,0.1))', border: '1px solid rgba(249,115,22,0.25)' }}>
        <Trophy size={18} style={{ color: '#f97316' }} />
        <div>
          <div className="font-bold text-sm" style={{ color: '#f97316' }}>Knicks eru í úrslitaleik!</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>NBA Finals 2026 🏆</div>
        </div>
      </div>

      {/* Live game */}
      {live && (
        <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: '#f97316' }}>🔴 LIVE</div>
          <div className="flex items-center justify-between">
            <span className="font-bold">NYK</span>
            <span className="font-mono text-2xl font-bold">{live.kScore} – {live.oScore}</span>
            <span className="font-medium" style={{ color: 'var(--muted)' }}>{live.oppAbbr}</span>
          </div>
          <div className="text-xs text-center mt-1" style={{ color: '#f97316' }}>{live.status}</div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-2 animate-pulse-soft py-2">
          {[1,2,3].map(i => (
            <div key={i} className="h-10 rounded-xl" style={{ background: 'var(--surface2)' }} />
          ))}
        </div>
      )}

      {/* Stats */}
      {completed.length > 0 && (
        <div className="flex gap-2 mb-4">
          <StatBadge label="Sigrar" value={wins} color="var(--success)" />
          <StatBadge label="Tap" value={losses} color="var(--danger)" />
          <StatBadge label="Hlutfall" value={completed.length ? `${Math.round(wins/completed.length*100)}%` : '-'} />
        </div>
      )}

      {/* Last 5 */}
      {last5.length > 0 && (
        <>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>SÍÐUSTU LEIKIR</div>
          <div className="mb-3">
            {last5.map(g => (
              <ScoreRow key={g.id} {...g} team="nba" />
            ))}
          </div>
        </>
      )}

      {/* Upcoming */}
      {next3.length > 0 && (
        <>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>VÆNTANLEGIR LEIKIR</div>
          <div>
            {next3.map(g => (
              <ScoreRow key={g.id} {...g} team="nba" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function InterSection() {
  const { schedule, loading } = useInterMilanSchedule()

  const completed = schedule.filter(g => g.completed)
  const upcoming = schedule.filter(g => !g.completed && !g.inProgress)
  const wins = completed.filter(g => g.won).length
  const draws = completed.filter(g => g.completed && Number(g.iScore) === Number(g.oScore)).length
  const losses = completed.length - wins - draws
  const last5 = completed.slice(-5).reverse()

  return (
    <div className="card mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
             style={{ background: 'rgba(0,0,0,0.3)' }}>⚫🔵</div>
        <div>
          <h2 className="font-bold text-lg">Inter Milan</h2>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Serie A · San Siro</div>
        </div>
        {completed.length > 0 && (
          <div className="ml-auto text-right">
            <div className="font-bold text-lg">{wins}–{draws}–{losses}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>S-J-T</div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col gap-2 animate-pulse-soft py-2">
          {[1,2].map(i => <div key={i} className="h-10 rounded-xl" style={{ background: 'var(--surface2)' }} />)}
        </div>
      )}

      {completed.length > 0 && (
        <div className="flex gap-2 mb-4">
          <StatBadge label="Sigrar" value={wins} color="var(--success)" />
          <StatBadge label="Jafntefli" value={draws} color="#f97316" />
          <StatBadge label="Tap" value={losses} color="var(--danger)" />
        </div>
      )}

      {last5.length > 0 && (
        <>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>SÍÐUSTU LEIKIR</div>
          <div>
            {last5.map(g => (
              <ScoreRow key={g.id} {...g} team="soccer" iScore={g.iScore} />
            ))}
          </div>
        </>
      )}

      {last5.length === 0 && !loading && (
        <div className="text-center py-6" style={{ color: 'var(--muted)' }}>
          <div className="text-2xl mb-2">⚽</div>
          <div className="text-sm">Engar niðurstöður tiltækar</div>
        </div>
      )}

      {upcoming.slice(0, 2).length > 0 && (
        <>
          <div className="text-xs font-semibold mb-2 mt-3" style={{ color: 'var(--muted)' }}>VÆNTANLEGT</div>
          <div>
            {upcoming.slice(0, 2).map(g => (
              <ScoreRow key={g.id} {...g} team="soccer" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function NBALiveSection() {
  const { games, loading } = useNBAScoreboard()
  const liveGames = games.filter(g => g.inProgress || g.completed)

  if (!liveGames.length) return null

  return (
    <div className="card mb-4">
      <div className="text-xs font-semibold mb-3" style={{ color: 'var(--muted)' }}>
        {games.some(g => g.inProgress) ? '🔴 LIVE NBA' : 'NBA Í DAG'}
      </div>
      <div className="flex flex-col gap-2">
        {liveGames.slice(0, 5).map(g => {
          const isKnicks = g.home.abbr === 'NYK' || g.away.abbr === 'NYK'
          return (
            <div key={g.id} className="flex items-center gap-2 py-1.5 rounded-xl px-2"
                 style={{ background: isKnicks ? 'rgba(0,119,181,0.08)' : 'var(--surface2)' }}>
              <div className="flex-1 flex items-center gap-2">
                <span className="font-mono font-semibold text-sm w-8 text-center">{g.away.abbr}</span>
                <span className="text-lg font-bold font-mono">{g.away.score}</span>
              </div>
              <div className="text-xs px-2" style={{ color: 'var(--muted)' }}>–</div>
              <div className="flex-1 flex items-center justify-end gap-2">
                <span className="text-lg font-bold font-mono">{g.home.score}</span>
                <span className="font-mono font-semibold text-sm w-8 text-center">{g.home.abbr}</span>
              </div>
              <div className="w-16 text-right">
                <span className="text-xs" style={{ color: g.inProgress ? '#f97316' : 'var(--muted)' }}>
                  {g.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Sports() {
  const [tab, setTab] = useState('knicks')

  return (
    <div className="flex flex-col gap-4 pb-6 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Trophy size={20} style={{ color: '#f97316' }} /> Íþróttir
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Knicks · Inter Milan</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {[['knicks', '🏀 Knicks'], ['inter', '⚽ Inter'], ['live', '🔴 Live']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center py-2"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'knicks' && <KnicksSection />}
      {tab === 'inter' && <InterSection />}
      {tab === 'live' && (
        <>
          <NBALiveSection />
          <div className="text-center py-8" style={{ color: 'var(--muted)' }}>
            <div className="text-3xl mb-2">🏀</div>
            <div className="text-sm">Live scores sjást hér þegar leikir eru í gangi</div>
          </div>
        </>
      )}
    </div>
  )
}
