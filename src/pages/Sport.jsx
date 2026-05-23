import { useFootball } from '../hooks/useFootball'
import { RefreshCw } from 'lucide-react'

const MUFC_COLOR = '#DA291C'

function resultFor(match) {
  if (!match || match.intHomeScore == null) return null
  const isHome = match.strHomeTeam?.toLowerCase().includes('manchester united')
  const ms = Number(isHome ? match.intHomeScore : match.intAwayScore)
  const os = Number(isHome ? match.intAwayScore : match.intHomeScore)
  return {
    isHome,
    homeTeam: match.strHomeTeam,
    awayTeam: match.strAwayTeam,
    homeScore: match.intHomeScore,
    awayScore: match.intAwayScore,
    date: match.dateEvent,
    outcome: ms > os ? 'W' : ms < os ? 'L' : 'D',
    ms, os,
  }
}

const RC = { W: 'var(--success)', L: 'var(--danger)', D: '#f97316' }
const RL = { W: 'Sigur', L: 'Tap', D: 'Jafntefli' }

function MatchCard({ match }) {
  const r = resultFor(match)
  if (!r) return null
  const date = new Date(r.date)
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
           style={{ background: `${RC[r.outcome]}18`, color: RC[r.outcome] }}>
        {r.outcome}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">
          {r.homeTeam?.replace('Manchester', 'Man')} {r.homeScore}–{r.awayScore} {r.awayTeam?.replace('Manchester', 'Man')}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
          {' · '}{r.isHome ? 'Heimaleikur' : 'Útileikur'}
        </div>
      </div>
      <span className="text-xs font-semibold px-2 py-1 rounded-lg"
            style={{ background: `${RC[r.outcome]}18`, color: RC[r.outcome] }}>
        {RL[r.outcome]}
      </span>
    </div>
  )
}

function TableRow({ row, rank }) {
  const isMufc = row.strTeam?.toLowerCase().includes('manchester united')
  const gd = (Number(row.intGoalsFor) - Number(row.intGoalsAgainst))
  return (
    <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-sm transition-all"
         style={{
           background: isMufc ? `${MUFC_COLOR}15` : 'transparent',
           border: isMufc ? `1px solid ${MUFC_COLOR}30` : '1px solid transparent',
         }}>
      <span className="w-5 text-center text-xs font-bold shrink-0"
            style={{ color: isMufc ? MUFC_COLOR : rank <= 4 ? 'var(--accent)' : rank >= 18 ? 'var(--danger)' : 'var(--muted)' }}>
        {rank}
      </span>
      {row.strBadge ? (
        <img src={`${row.strBadge}/tiny`} alt="" className="w-5 h-5 object-contain shrink-0 rounded" />
      ) : (
        <div className="w-5 h-5 rounded shrink-0" style={{ background: 'var(--surface2)' }} />
      )}
      <span className="flex-1 truncate font-medium text-sm"
            style={{ color: isMufc ? '#fff' : 'var(--text)', fontWeight: isMufc ? 700 : 500 }}>
        {row.strTeam}
      </span>
      <span className="text-xs tabular-nums w-5 text-center" style={{ color: 'var(--muted)' }}>{row.intPlayed}</span>
      <span className="text-xs tabular-nums w-6 text-center" style={{ color: 'var(--muted)' }}>
        {gd > 0 ? `+${gd}` : gd}
      </span>
      <span className="text-sm tabular-nums w-7 text-center font-bold"
            style={{ color: isMufc ? MUFC_COLOR : 'var(--text)' }}>
        {row.intPoints}
      </span>
    </div>
  )
}

export default function Sport() {
  const { table, recentMatches, nextMatch, mufcRow, loading } = useFootball()
  const hasData = table?.length > 0 || recentMatches.length > 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League 2025–2026</p>
        </div>
        <span className="text-2xl">⚽</span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse-soft">
              <div className="h-4 w-32 rounded mb-3" style={{ background: 'var(--surface2)' }} />
              <div className="h-3 w-full rounded mb-2" style={{ background: 'var(--surface2)' }} />
              <div className="h-3 w-3/4 rounded" style={{ background: 'var(--surface2)' }} />
            </div>
          ))}
        </div>
      ) : !hasData ? (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-4xl mb-3">⚽</div>
          <div className="font-semibold">Engin gögn tiltæk</div>
          <div className="text-xs mt-1">Gögn frá TheSportsDB. Reyndu aftur síðar.</div>
        </div>
      ) : (
        <>
          {/* Man Utd card */}
          <div className="card" style={{ background: `linear-gradient(135deg, ${MUFC_COLOR}12, transparent)`, borderColor: `${MUFC_COLOR}25` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                   style={{ background: `${MUFC_COLOR}20` }}>🔴</div>
              <div className="flex-1">
                <div className="font-bold text-base">Manchester United</div>
                {mufcRow ? (
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    Sæti #{mufcRow.intRank} · {mufcRow.intPlayed} leikir spilaðir
                  </div>
                ) : (
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>Engin stigatafla tiltæk</div>
                )}
              </div>
              {mufcRow && (
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: MUFC_COLOR }}>{mufcRow.intPoints}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>stig</div>
                </div>
              )}
            </div>

            {mufcRow && (
              <div className="grid grid-cols-5 gap-2 text-center">
                {[
                  [mufcRow.intWin, 'W', 'var(--success)'],
                  [mufcRow.intDraw, 'D', '#f97316'],
                  [mufcRow.intLoss, 'L', 'var(--danger)'],
                  [mufcRow.intGoalsFor, 'M+', 'var(--accent)'],
                  [mufcRow.intGoalsAgainst, 'M-', 'var(--muted)'],
                ].map(([val, label, color]) => (
                  <div key={label} className="py-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <div className="text-lg font-bold" style={{ color }}>{val}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Next match */}
          {nextMatch && (
            <div className="card" style={{ border: '1px solid rgba(0,212,170,0.25)' }}>
              <div className="text-xs font-bold mb-2" style={{ color: 'var(--accent)' }}>NÆSTI LEIKUR</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm flex-1 text-right">
                  {nextMatch.strHomeTeam?.replace('Manchester', 'Man')}
                </span>
                <div className="flex flex-col items-center px-3 shrink-0">
                  <span className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>VS</span>
                  <span className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    {new Date(nextMatch.dateEvent).toLocaleDateString('is-IS', {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </span>
                </div>
                <span className="font-semibold text-sm flex-1">
                  {nextMatch.strAwayTeam?.replace('Manchester', 'Man')}
                </span>
              </div>
            </div>
          )}

          {/* Recent results */}
          {recentMatches.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-sm mb-3">Síðustu leikir</h3>
              <div className="flex flex-col gap-2">
                {recentMatches.map((m, i) => <MatchCard key={m.idEvent || i} match={m} />)}
              </div>
            </div>
          )}

          {/* PL Table */}
          {table && table.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm">Stigatafla</h3>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
                  <span>L</span><span>GD</span><span>Stig</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 mt-2">
                {[...table]
                  .sort((a, b) => Number(b.intPoints) - Number(a.intPoints))
                  .map((row, i) => (
                    <TableRow key={row.idTeam || i} row={row} rank={i + 1} />
                  ))}
              </div>
              <div className="mt-3 flex gap-3 text-xs" style={{ color: 'var(--muted)' }}>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--accent)' }} />
                  UCL
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--danger)' }} />
                  Niðurstigsmótun
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
