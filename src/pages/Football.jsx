import { useState } from 'react'
import { useFootball, ENGLAND_SQUAD } from '../hooks/useFootball'
import { RefreshCw } from 'lucide-react'

const POS_COLOR = { GKR: '#f59e0b', VB: '#3b82f6', MF: '#8b5cf6', FW: '#ef4444' }
const POS_LABEL = { GKR: 'Markvörður', VB: 'Varnarmenn', MF: 'Miðjumenn', FW: 'Framherjar' }
const POS_GROUPS = ['GKR', 'VB', 'MF', 'FW']

function MatchCard({ match }) {
  const comps = match.competitions?.[0]
  const home = comps?.competitors?.find(c => c.homeAway === 'home')
  const away = comps?.competitors?.find(c => c.homeAway === 'away')
  const status = match.status?.type
  const isLive = status?.state === 'in'
  const isDone = status?.state === 'post'
  if (!home || !away) return null

  return (
    <div className="card py-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 text-right">
          <div className="text-sm font-semibold">{home.team?.shortDisplayName || home.team?.displayName}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{home.team?.abbreviation}</div>
        </div>
        <div className="text-center min-w-[72px]">
          {(isLive || isDone) ? (
            <>
              <div className="font-bold text-xl">{home.score} – {away.score}</div>
              {isLive && (
                <div className="text-xs font-bold animate-pulse" style={{ color: 'var(--danger)' }}>
                  {status?.detail || 'LIVE'}
                </div>
              )}
              {isDone && <div className="text-xs" style={{ color: 'var(--muted)' }}>Lokið</div>}
            </>
          ) : (
            <>
              <div className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
                {match.date
                  ? new Date(match.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
                  : 'TBD'}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>vs</div>
            </>
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{away.team?.shortDisplayName || away.team?.displayName}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{away.team?.abbreviation}</div>
        </div>
      </div>
      {comps?.venue?.fullName && (
        <div className="text-center text-xs mt-2" style={{ color: 'var(--muted)' }}>
          {comps.venue.fullName}
        </div>
      )}
    </div>
  )
}

function StandingsTable({ group }) {
  const entries = group.standings?.entries || []
  const getStat = (entry, name) => entry.stats?.find(s => s.name === name)?.value ?? 0
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">{group.name}</h3>
      <div className="text-xs mb-1 flex gap-1 px-1" style={{ color: 'var(--muted)' }}>
        <span style={{ width: 20 }}>#</span>
        <span className="flex-1">Lið</span>
        <span style={{ width: 22, textAlign: 'center' }}>L</span>
        <span style={{ width: 22, textAlign: 'center' }}>W</span>
        <span style={{ width: 22, textAlign: 'center' }}>D</span>
        <span style={{ width: 22, textAlign: 'center' }}>T</span>
        <span style={{ width: 28, textAlign: 'center', color: 'var(--accent)' }}>Stig</span>
      </div>
      {entries.map((entry, i) => (
        <div key={i} className="flex items-center gap-1 py-1.5 text-xs border-t" style={{ borderColor: 'var(--border)' }}>
          <span style={{ width: 20, color: i < 2 ? 'var(--accent)' : 'var(--muted)' }}>{i + 1}</span>
          <span className="flex-1 font-medium truncate">{entry.team?.displayName || entry.team?.name}</span>
          <span style={{ width: 22, textAlign: 'center', color: 'var(--muted)' }}>{getStat(entry, 'gamesPlayed')}</span>
          <span style={{ width: 22, textAlign: 'center', color: 'var(--muted)' }}>{getStat(entry, 'wins')}</span>
          <span style={{ width: 22, textAlign: 'center', color: 'var(--muted)' }}>{getStat(entry, 'draws')}</span>
          <span style={{ width: 22, textAlign: 'center', color: 'var(--muted)' }}>{getStat(entry, 'losses')}</span>
          <span style={{ width: 28, textAlign: 'center', color: 'var(--accent)', fontWeight: 700 }}>{getStat(entry, 'points')}</span>
        </div>
      ))}
    </div>
  )
}

export default function Football() {
  const { matches, standings, loading, error, liveMatches, todayMatches, upcomingMatches, recentMatches, lastUpdated, refresh } = useFootball()
  const [tab, setTab] = useState('matches')

  const squadByPos = {}
  POS_GROUPS.forEach(pos => {
    squadByPos[pos] = ENGLAND_SQUAD.filter(p => p.pos === pos)
  })

  const matchesToShow = tab === 'matches' ? (
    liveMatches.length > 0 ? liveMatches :
    todayMatches.length > 0 ? todayMatches :
    [...recentMatches.slice(0, 3), ...upcomingMatches.slice(0, 3)]
  ) : []

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">⚽ Knattspyrna</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            FIFA World Cup 2026
            {lastUpdated && (
              <span> · {lastUpdated.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </p>
        </div>
        <button onClick={refresh} className="btn btn-ghost p-2" style={{ borderColor: 'var(--border)' }}>
          <RefreshCw size={16} style={{ color: 'var(--muted)' }} />
        </button>
      </div>

      {liveMatches.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--danger)' }} />
          <span className="text-xs font-bold" style={{ color: 'var(--danger)' }}>{liveMatches.length} LEIKUR LIVE</span>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['matches', '📅 Leikir'], ['standings', '🏆 Taflan'], ['england', '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'matches' && (
        <div className="flex flex-col gap-3">
          {loading && (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="animate-pulse">Sæki leiki...</div>
            </div>
          )}
          {error && !loading && (
            <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>
              <div className="text-2xl mb-2">📡</div>
              <div className="text-sm">Gat ekki sótt leiki frá ESPN</div>
              <div className="text-xs mt-1">{error}</div>
              <button onClick={refresh} className="btn btn-ghost text-xs mt-3">Reyna aftur</button>
            </div>
          )}
          {!loading && !error && matchesToShow.length === 0 && (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">⚽</div>
              <div>Engir leikir þessa stundina</div>
            </div>
          )}
          {liveMatches.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2 px-1 flex items-center gap-1.5" style={{ color: 'var(--danger)' }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--danger)' }} /> LIVE
              </div>
              {liveMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          )}
          {todayMatches.filter(m => m.status?.type?.state !== 'in').length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--muted)' }}>LEIKIR Í DAG</div>
              {todayMatches.filter(m => m.status?.type?.state !== 'in').map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          )}
          {liveMatches.length === 0 && todayMatches.length === 0 && recentMatches.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--muted)' }}>NÝLEGIR NIÐURSTÖÐUR</div>
              {recentMatches.slice(0, 5).map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          )}
          {liveMatches.length === 0 && todayMatches.length === 0 && upcomingMatches.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--muted)' }}>VÆNTANLEGIR LEIKIR</div>
              {upcomingMatches.slice(0, 5).map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'standings' && (
        <div className="flex flex-col gap-3">
          {standings.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">🏆</div>
              <div>Engar töflur tiltækar ennþá</div>
            </div>
          ) : (
            standings.map((group, i) => <StandingsTable key={i} group={group} />)
          )}
        </div>
      )}

      {tab === 'england' && (
        <div className="flex flex-col gap-3">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,32,91,0.5), rgba(0,32,91,0.2))', borderColor: 'rgba(0,32,91,0.6)' }}>
            <div className="flex items-center gap-4">
              <span className="text-5xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
              <div>
                <h2 className="font-bold text-lg">England</h2>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>FIFA World Cup 2026</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Þjálfari: Thomas Tuchel</p>
              </div>
            </div>
            <div className="mt-3 p-2.5 rounded-xl text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--muted)' }}>
              ❌ Utan liðs: Foden, Palmer, Maguire
            </div>
          </div>
          {POS_GROUPS.map(pos => (
            <div key={pos} className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold"
                      style={{ background: `${POS_COLOR[pos]}22`, color: POS_COLOR[pos] }}>{pos}</span>
                <h3 className="text-sm font-semibold">{POS_LABEL[pos]}</h3>
              </div>
              <div className="flex flex-col gap-2">
                {squadByPos[pos].map(p => (
                  <div key={p.name} className="flex items-center gap-2 text-sm py-0.5">
                    <span className="flex-1 font-medium">{p.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-lg"
                          style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>{p.club}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
