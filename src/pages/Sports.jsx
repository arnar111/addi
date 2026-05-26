import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { timeAgo } from '../utils/time'

function GameCard({ game }) {
  const isLive = game.status === 'in'
  const isDone = game.status === 'post'
  const isPre = game.status === 'pre'

  return (
    <div className={`card p-3 transition-all ${isLive ? 'border-[var(--danger)] glow-accent' : ''}`}
      style={isLive ? { borderColor: 'rgba(239,68,68,0.4)' } : {}}>
      {/* Status badge */}
      <div className="flex justify-center mb-2">
        {isLive && (
          <div className="flex items-center gap-1.5 badge badge-danger">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)] animate-pulse" />
            LIVE · {game.statusText}
          </div>
        )}
        {isDone && (
          <span className="badge badge-muted">Lokið</span>
        )}
        {isPre && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {game.date ? new Date(game.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' }) : 'Í bíð'}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex-1 flex flex-col items-center gap-1">
          {game.homeLogo && (
            <img src={game.homeLogo} alt="" className="w-10 h-10 object-contain"
              onError={e => e.target.style.display = 'none'} />
          )}
          <span className="text-xs font-medium text-center leading-tight">{game.home}</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 shrink-0">
          {isDone || isLive ? (
            <>
              <span className={`text-2xl font-bold ${isLive ? 'text-[var(--danger)]' : ''}`}>
                {game.homeScore}
              </span>
              <span style={{ color: 'var(--muted)' }}>:</span>
              <span className={`text-2xl font-bold ${isLive ? 'text-[var(--danger)]' : ''}`}>
                {game.awayScore}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold" style={{ color: 'var(--muted)' }}>vs</span>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex flex-col items-center gap-1">
          {game.awayLogo && (
            <img src={game.awayLogo} alt="" className="w-10 h-10 object-contain"
              onError={e => e.target.style.display = 'none'} />
          )}
          <span className="text-xs font-medium text-center leading-tight">{game.away}</span>
        </div>
      </div>
    </div>
  )
}

function StandingsTable({ standings, loading }) {
  if (loading) return (
    <div className="space-y-2">
      {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-10 rounded-xl" />)}
    </div>
  )
  if (!standings.length) return (
    <div className="text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>
      Gat ekki sótt stöðutöflu
    </div>
  )

  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              <th className="px-3 py-2 text-left font-medium" style={{ color: 'var(--muted)', width: '28px' }}>#</th>
              <th className="px-2 py-2 text-left font-medium" style={{ color: 'var(--muted)' }}>Lið</th>
              <th className="px-2 py-2 text-center font-medium" style={{ color: 'var(--muted)' }}>L</th>
              <th className="px-2 py-2 text-center font-medium" style={{ color: 'var(--muted)' }}>W</th>
              <th className="px-2 py-2 text-center font-medium" style={{ color: 'var(--muted)' }}>D</th>
              <th className="px-2 py-2 text-center font-medium" style={{ color: 'var(--muted)' }}>Lo</th>
              <th className="px-2 py-2 text-center font-medium" style={{ color: 'var(--muted)' }}>GD</th>
              <th className="px-3 py-2 text-center font-bold" style={{ color: 'var(--text)' }}>Stig</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((t, i) => {
              const isCL = i < 4
              const isEL = i === 4 || i === 5
              const isConf = i === 6
              const isRel = i >= standings.length - 3
              const isArsenal = t.abbr === 'ARS' || t.team?.toLowerCase().includes('arsenal')
              const isKnicks = t.abbr === 'NYK' || t.team?.toLowerCase().includes('knicks')

              return (
                <tr
                  key={i}
                  className="transition-colors hover:bg-[var(--surface2)]"
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: (isArsenal || isKnicks) ? 'rgba(0,212,170,0.05)' : undefined,
                  }}
                >
                  <td className="px-3 py-2.5 text-left">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-1 h-4 rounded-full shrink-0"
                        style={{
                          background: isCL ? '#3b82f6' : isEL ? '#f97316' : isConf ? '#8b5cf6' : isRel ? '#ef4444' : 'transparent'
                        }}
                      />
                      <span style={{ color: 'var(--muted)' }}>{i + 1}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {t.logo && (
                        <img src={t.logo} alt="" className="w-4 h-4 object-contain"
                          onError={e => e.target.style.display='none'} />
                      )}
                      <span className={`font-medium ${(isArsenal || isKnicks) ? 'text-[var(--accent)]' : ''}`}>
                        {t.abbr || t.team}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center" style={{ color: 'var(--text2)' }}>{t.played}</td>
                  <td className="px-2 py-2.5 text-center" style={{ color: 'var(--success)' }}>{t.won}</td>
                  <td className="px-2 py-2.5 text-center" style={{ color: 'var(--text2)' }}>{t.drawn}</td>
                  <td className="px-2 py-2.5 text-center" style={{ color: 'var(--danger)' }}>{t.lost}</td>
                  <td className="px-2 py-2.5 text-center" style={{ color: 'var(--text2)' }}>{t.gd}</td>
                  <td className="px-3 py-2.5 text-center font-bold">{t.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 p-3 text-[10px]" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Champions League</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f97316]" /> Europa League</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Conference League</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#ef4444]" /> Stigi-niðurfall</div>
      </div>
    </div>
  )
}

export default function Sports() {
  const { epl, nba, eplTable, liveGames, refresh, lastUpdated } = useSports()
  const [league, setLeague] = useState('epl')
  const [eplView, setEplView] = useState('scores')

  const liveOnly = (league === 'epl' ? epl.games : nba.games).filter(g => g.status === 'in')
  const today = (league === 'epl' ? epl.games : nba.games).filter(g => g.status !== 'in')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 px-1">
        <div>
          <h1 className="text-xl font-bold">Sport</h1>
          {lastUpdated && (
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Uppfært {lastUpdated.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
        <button
          onClick={refresh}
          className="btn btn-ghost btn-sm flex items-center gap-1.5"
        >
          <RefreshCw size={13} />
          Uppfæra
        </button>
      </div>

      {/* Live banner */}
      {liveGames.length > 0 && (
        <div className="card p-3 flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--danger)]" />
            <div className="absolute inset-0 rounded-full bg-[var(--danger)] animate-ping-slow" />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
            {liveGames.length} {liveGames.length === 1 ? 'leikur' : 'leikir'} í gangi núna
          </span>
        </div>
      )}

      {/* League switcher */}
      <div className="tab-bar">
        <button className={`tab-item ${league === 'epl' ? 'active' : ''}`} onClick={() => setLeague('epl')}>
          ⚽ Premier League
        </button>
        <button className={`tab-item ${league === 'nba' ? 'active' : ''}`} onClick={() => setLeague('nba')}>
          🏀 NBA
        </button>
      </div>

      {/* EPL view toggle */}
      {league === 'epl' && (
        <div className="tab-bar">
          <button className={`tab-item ${eplView === 'scores' ? 'active' : ''}`} onClick={() => setEplView('scores')}>
            Niðurstöður
          </button>
          <button className={`tab-item ${eplView === 'table' ? 'active' : ''}`} onClick={() => setEplView('table')}>
            Stöðutafla
          </button>
        </div>
      )}

      {/* Content */}
      {league === 'epl' && eplView === 'table' ? (
        <StandingsTable standings={eplTable.standings} loading={eplTable.loading} />
      ) : (
        <>
          {/* Live games */}
          {liveOnly.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--danger)' }}>🔴 LIVE</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {liveOnly.map(g => <GameCard key={g.id} game={g} />)}
              </div>
            </div>
          )}

          {/* Other games */}
          {(league === 'epl' ? epl.loading : nba.loading) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
            </div>
          ) : today.length === 0 && liveOnly.length === 0 ? (
            <div className="card text-center py-10">
              <div className="text-4xl mb-2">😴</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>
                {league === 'epl' ? 'Engir Premier League leikir í dag' : 'Engir NBA leikir í dag'}
              </div>
            </div>
          ) : (
            <div>
              {today.length > 0 && (
                <h2 className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--text2)' }}>
                  {today.some(g => g.status === 'post') ? 'Lokið / Í bíð' : 'Leikir í dag'}
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {today.map(g => <GameCard key={g.id} game={g} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
