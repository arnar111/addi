import { useState } from 'react'
import { useFootball } from '../hooks/useFootball'
import { Loader2, RefreshCw, ExternalLink } from 'lucide-react'

const TABS = ['Tafla', 'Niðurstöður', 'England WC']

// England 2026 World Cup info
const WC_DATE = new Date('2026-06-11T00:00:00Z')
const daysToWC = () => Math.max(0, Math.ceil((WC_DATE - new Date()) / 86400000))

const ENGLAND_SQUAD = [
  { name: 'Bukayo Saka', club: 'Arsenal', pos: 'MF/WF', note: '🔥 In form' },
  { name: 'Jude Bellingham', club: 'Real Madrid', pos: 'CM', note: '⭐ Captain' },
  { name: 'Phil Foden', club: 'Man City', pos: 'MF/WF', note: '' },
  { name: 'Declan Rice', club: 'Arsenal', pos: 'DM', note: '' },
  { name: 'Harry Kane', club: 'Bayern Munich', pos: 'ST', note: '⚡ Top scorer' },
  { name: 'Eberechi Eze', club: 'Arsenal', pos: 'WF', note: '📈 Breakout' },
  { name: 'Cole Palmer', club: 'Chelsea', pos: 'MF', note: '' },
  { name: 'Jordan Pickford', club: 'Everton', pos: 'GK', note: '' },
]

const ENGLAND_GROUPS = [
  { team: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', games: '?', pts: '?' },
  { team: 'TBD', games: '?', pts: '?' },
  { team: 'TBD', games: '?', pts: '?' },
  { team: 'TBD', games: '?', pts: '?' },
]

export default function Sports() {
  const [tab, setTab] = useState(0)
  const { table, results, upcoming, loading, error } = useFootball()

  const dWC = daysToWC()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold">⚽ Íþróttir</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Premier League · England · WC 2026</div>
        </div>
        <a
          href="https://theathletic.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl"
          style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          The Athletic <ExternalLink size={11} />
        </a>
      </div>

      {/* WC countdown banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.12) 0%, rgba(29,185,84,0.08) 100%)',
        borderColor: 'rgba(0,212,170,0.3)'
      }}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <div className="font-semibold text-sm">FIFA World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              USA · Canada · Mexico · Byrjar 11. júní 2026
            </div>
            <div className="text-sm font-bold mt-0.5" style={{ color: 'var(--accent)' }}>
              {dWC > 0 ? `${dWC} dagar eftir 🏴󠁧󠁢󠁥󠁮󠁧󠁿` : '🎉 WC hefur byrjað!'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: tab === i ? 'var(--accent)' : 'transparent',
              color: tab === i ? '#000' : 'var(--muted)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && tab < 2 && (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={20} className="animate-spin" style={{ color: 'var(--muted)' }} />
        </div>
      )}

      {/* Error */}
      {error && tab < 2 && (
        <div className="card text-center">
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Gögn ekki aðgengileg</div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Reyndu aftur síðar</div>
        </div>
      )}

      {/* Tab 0: Table */}
      {tab === 0 && !loading && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="font-semibold text-sm">Premier League 2025–26</span>
            <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>
              {table.length > 0 ? `${table.length} lið` : ''}
            </span>
          </div>

          {table.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="text-3xl mb-2">📺</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Engar stöðugreiningar tiltækar</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Leiktíð 2025–26 er líklega á enda</div>
            </div>
          ) : (
            <div className="px-4 py-2">
              {/* Header row */}
              <div className="flex text-xs py-1 mb-1" style={{ color: 'var(--muted)' }}>
                <span className="w-6 text-center">#</span>
                <span className="flex-1 ml-2">Lið</span>
                <span className="w-7 text-center">L</span>
                <span className="w-7 text-center">Si</span>
                <span className="w-7 text-center">Ja</span>
                <span className="w-7 text-center">Tó</span>
                <span className="w-7 text-center">MD</span>
                <span className="w-8 text-center font-bold">Stig</span>
              </div>
              {table.map((row, i) => {
                const isArsenal = row.name?.toLowerCase().includes('arsenal')
                const isSpurs = row.name?.toLowerCase().includes('tottenham') || row.name?.toLowerCase().includes('spurs')
                const isFav = isArsenal || isSpurs
                const championsLeague = i < 4
                const europaLeague = i === 4 || i === 5
                const relegation = i >= table.length - 3

                return (
                  <div key={row.name}
                    className="flex items-center text-xs py-1.5"
                    style={{
                      background: isFav ? (isArsenal ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.04)') : 'transparent',
                      borderRadius: 8,
                      margin: '1px -4px',
                      padding: '6px 4px',
                      borderLeft: championsLeague ? '2px solid #3b82f6' :
                                  europaLeague ? '2px solid #f97316' :
                                  relegation ? '2px solid #ef4444' : '2px solid transparent',
                    }}>
                    <span className="w-6 text-center font-medium" style={{
                      color: championsLeague ? '#3b82f6' : relegation ? '#ef4444' : 'var(--muted)'
                    }}>
                      {i + 1}
                    </span>
                    {row.logo ? (
                      <img src={row.logo} alt={row.shortName} className="w-4 h-4 mx-1.5 object-contain" />
                    ) : (
                      <span className="w-4 mx-1.5" />
                    )}
                    <span className="flex-1 font-medium truncate"
                          style={{ color: isFav ? 'var(--accent)' : 'var(--text)' }}>
                      {row.shortName}
                      {isArsenal && ' 🔴'}
                      {isSpurs && ' ⚪'}
                    </span>
                    <span className="w-7 text-center" style={{ color: 'var(--muted)' }}>{row.played}</span>
                    <span className="w-7 text-center" style={{ color: 'var(--muted)' }}>{row.won}</span>
                    <span className="w-7 text-center" style={{ color: 'var(--muted)' }}>{row.drawn}</span>
                    <span className="w-7 text-center" style={{ color: 'var(--muted)' }}>{row.lost}</span>
                    <span className="w-7 text-center"
                          style={{ color: row.gd > 0 ? 'var(--success)' : row.gd < 0 ? 'var(--danger)' : 'var(--muted)' }}>
                      {row.gd > 0 ? '+' : ''}{row.gd}
                    </span>
                    <span className="w-8 text-center font-bold">{row.points}</span>
                  </div>
                )
              })}

              {/* Legend */}
              <div className="flex flex-wrap gap-3 pt-3 pb-1 text-xs" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)', marginTop: 8 }}>
                <span className="flex items-center gap-1"><span style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: 2, display: 'inline-block' }} /> Champions League</span>
                <span className="flex items-center gap-1"><span style={{ width: 8, height: 8, background: '#f97316', borderRadius: 2, display: 'inline-block' }} /> Europa League</span>
                <span className="flex items-center gap-1"><span style={{ width: 8, height: 8, background: '#ef4444', borderRadius: 2, display: 'inline-block' }} /> Stigi niður</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Results */}
      {tab === 1 && !loading && (
        <div className="flex flex-col gap-3">
          {results.length === 0 && upcoming.length === 0 && (
            <div className="card text-center py-8">
              <div className="text-3xl mb-2">⏸️</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Engar nýlegar leikniðurstöður</div>
            </div>
          )}

          {results.length > 0 && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="px-4 py-3 text-sm font-semibold" style={{ borderBottom: '1px solid var(--border)' }}>
                Nýlegar niðurstöður
              </div>
              {results.map(r => (
                <div key={r.id} className="flex items-center gap-2 px-4 py-3"
                     style={{ borderBottom: '1px solid rgba(31,45,64,0.5)' }}>
                  <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
                    {r.homeLogo && <img src={r.homeLogo} alt="" className="w-5 h-5 object-contain" />}
                    <span className="text-sm font-medium truncate">{r.home}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 px-3 py-1 rounded-lg"
                       style={{ background: 'var(--surface2)', fontVariantNumeric: 'tabular-nums' }}>
                    <span className="font-bold">{r.homeScore}</span>
                    <span style={{ color: 'var(--muted)' }}>–</span>
                    <span className="font-bold">{r.awayScore}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">{r.away}</span>
                    {r.awayLogo && <img src={r.awayLogo} alt="" className="w-5 h-5 object-contain" />}
                  </div>
                </div>
              ))}
            </div>
          )}

          {upcoming.length > 0 && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="px-4 py-3 text-sm font-semibold" style={{ borderBottom: '1px solid var(--border)' }}>
                Væntanlegir leikir
              </div>
              {upcoming.map(r => (
                <div key={r.id} className="flex items-center gap-2 px-4 py-3"
                     style={{ borderBottom: '1px solid rgba(31,45,64,0.5)' }}>
                  <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
                    {r.homeLogo && <img src={r.homeLogo} alt="" className="w-5 h-5 object-contain" />}
                    <span className="text-sm font-medium truncate">{r.home}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 px-3 py-1 rounded-lg"
                       style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                    <span className="text-xs">vs</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">{r.away}</span>
                    {r.awayLogo && <img src={r.awayLogo} alt="" className="w-5 h-5 object-contain" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: England WC */}
      {tab === 2 && (
        <div className="flex flex-col gap-3">
          {/* Squad */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
              <span className="font-semibold text-sm">England lið — WC 2026</span>
            </div>
            {ENGLAND_SQUAD.map((p, i) => (
              <div key={p.name}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ borderBottom: i < ENGLAND_SQUAD.length - 1 ? '1px solid rgba(31,45,64,0.4)' : 'none' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                     style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{p.club} · {p.pos}</div>
                </div>
                {p.note && (
                  <span className="text-xs shrink-0" style={{ color: 'var(--accent)' }}>{p.note}</span>
                )}
              </div>
            ))}
          </div>

          {/* Tuchel note */}
          <div className="card" style={{ background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.25)' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-sm font-semibold mb-1">Thomas Tuchel — Þjálfari</div>
                <div className="text-xs" style={{ color: 'var(--muted)', lineHeight: 1.5 }}>
                  Tuchel stýrir England í WC 2026. Lið í uppbyggingu eftir EURO 2024.
                  Eze og Saka eru í brennidepli — spennandi hlutskipti!
                </div>
                <a
                  href="https://theathletic.com/football/international/england/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs mt-2"
                  style={{ color: '#3b82f6' }}
                >
                  Fréttir á The Athletic <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            <a href="https://theathletic.com" target="_blank" rel="noopener noreferrer"
               className="card flex flex-col items-center gap-1 py-3 no-underline" style={{ textAlign: 'center' }}>
              <span className="text-xl">📰</span>
              <span className="text-xs font-medium">The Athletic</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Greinir</span>
            </a>
            <a href="https://www.bbc.com/sport/football" target="_blank" rel="noopener noreferrer"
               className="card flex flex-col items-center gap-1 py-3 no-underline" style={{ textAlign: 'center' }}>
              <span className="text-xl">📺</span>
              <span className="text-xs font-medium">BBC Sport</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Niðurstöður</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
