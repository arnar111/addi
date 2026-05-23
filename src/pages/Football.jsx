import { useState, useEffect } from 'react'
import { useFootball, useWorldCup } from '../hooks/useFootball'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WC_GROUPS = [
  { group: 'A', teams: ['USA', 'Jamaíka', 'Panama', 'Aserbadsjan'] },
  { group: 'B', teams: ['Mexíkó', 'Kanada', 'Honduras', 'Nýja-Sjáland'] },
  { group: 'C', teams: ['Argentína', 'Perú', 'Chile', 'Albanía'] },
  { group: 'D', teams: ['Frakkland', 'Marókkó', 'Belskó', 'Sádi-Arabía'] },
  { group: 'E', teams: ['Spánn', 'Brasilía', 'Japan', 'Kamerún'] },
  { group: 'F', teams: ['Þýskaland', 'Portúgal', 'Mexíkó', 'Óman'] },
  { group: 'G', teams: ['Englandi', 'Holland', 'Úrúgvæ', 'Kenía'] },
  { group: 'H', teams: ['Ítalía', 'Argentína', 'Egyptaland', 'Nýja-Sjáland'] },
]

const OPENING_MATCH = {
  home: 'Mexíkó',
  away: 'USA',
  date: '2026-06-11T18:00:00Z',
  venue: 'Azteca, Mexíkóborg',
}

function MatchCard({ match, label }) {
  const isSpurs = (n) => n?.toLowerCase().includes('tottenham') || n?.toLowerCase().includes('spurs')
  const spursWon = match.completed && (
    (isSpurs(match.home) && Number(match.homeScore) > Number(match.awayScore)) ||
    (isSpurs(match.away) && Number(match.awayScore) > Number(match.homeScore))
  )
  const spursLost = match.completed && (
    (isSpurs(match.home) && Number(match.homeScore) < Number(match.awayScore)) ||
    (isSpurs(match.away) && Number(match.awayScore) < Number(match.homeScore))
  )
  const drew = match.completed && !spursWon && !spursLost

  const resultColor = spursWon ? 'var(--success)' : spursLost ? 'var(--danger)' : drew ? '#f97316' : 'var(--muted)'

  return (
    <div className="card py-3 flex flex-col gap-2">
      {label && <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex flex-col items-center gap-0.5">
          <span className="text-sm font-semibold text-center">{match.home}</span>
          {match.completed && <span className="text-2xl font-bold">{match.homeScore}</span>}
        </div>
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          {match.completed
            ? <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: resultColor + '22', color: resultColor }}>
                {spursWon ? 'W' : spursLost ? 'L' : 'D'}
              </span>
            : <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>VS</span>
          }
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(match.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          </span>
          {!match.completed && (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(match.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center gap-0.5">
          <span className="text-sm font-semibold text-center">{match.away}</span>
          {match.completed && <span className="text-2xl font-bold">{match.awayScore}</span>}
        </div>
      </div>
      {match.venue && (
        <div className="text-xs text-center" style={{ color: 'var(--muted)' }}>📍 {match.venue}</div>
      )}
    </div>
  )
}

function CountdownTile({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 p-3 rounded-2xl" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}>
      <span className="text-3xl font-bold" style={{ color: '#f97316' }}>{String(value).padStart(2, '0')}</span>
      <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
    </div>
  )
}

export default function Football() {
  const { nextMatch, lastResult, recentResults, loading } = useFootball()
  const { days, hours, started } = useWorldCup()
  const [tab, setTab] = useState('spurs')
  const [mins, setMins] = useState(0)
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    const wc = new Date('2026-06-11T18:00:00Z')
    const update = () => {
      const diff = wc - new Date()
      if (diff <= 0) { setMins(0); setSecs(0); return }
      const totalSecs = Math.floor(diff / 1000)
      const s = totalSecs % 60
      const m = Math.floor((totalSecs % 3600) / 60)
      setMins(m)
      setSecs(s)
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">⚽ Knattspyrna</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Tottenham · World Cup 2026</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['spurs', '⚪ Spurs'], ['wc', '🏆 World Cup']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'spurs' && (
        <div className="flex flex-col gap-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card h-20 animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
            ))
          ) : (
            <>
              {nextMatch && <MatchCard match={nextMatch} label="🔜 Næsti leikur" />}
              {lastResult && <MatchCard match={lastResult} label="Síðasti leikur" />}
              {recentResults.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold px-1">Nýlegar niðurstöður</div>
                  {recentResults.map(r => <MatchCard key={r.id} match={r} />)}
                </div>
              )}
              {!nextMatch && !lastResult && (
                <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
                  Engar leikjaupplýsingar í boði
                </div>
              )}
            </>
          )}

          <div className="card" style={{ borderColor: 'rgba(0,212,170,0.2)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Hlekkir</div>
            <div className="flex flex-col gap-1">
              {[
                ['The Athletic', 'https://theathletic.com/team/tottenham-hotspur/'],
                ['BBC Sport', 'https://www.bbc.com/sport/football/teams/tottenham-hotspur'],
                ['Premier League', 'https://www.premierleague.com/clubs/21/Tottenham-Hotspur/overview'],
              ].map(([label, url]) => (
                <a key={url} href={url} target="_blank" rel="noreferrer"
                  className="text-sm flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--accent)', background: 'var(--surface2)' }}>
                  ↗ {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'wc' && (
        <div className="flex flex-col gap-3">
          {/* Countdown */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(239,68,68,0.1))', borderColor: 'rgba(249,115,22,0.3)' }}>
            <div className="text-center mb-4">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-xl font-bold">FIFA World Cup 2026</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>USA · Canada · México</div>
            </div>
            {started ? (
              <div className="text-center text-xl font-bold" style={{ color: '#f97316' }}>
                Heimsmeistaramótið er hafið!
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <CountdownTile label="Dagar" value={days} />
                  <CountdownTile label="Klukkustundir" value={hours} />
                  <CountdownTile label="Mínútur" value={mins} />
                  <CountdownTile label="Sekúndur" value={secs} />
                </div>
                <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>
                  Opnunarleikur: {new Date(OPENING_MATCH.date).toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
              </>
            )}
          </div>

          {/* Opening match */}
          <MatchCard match={{ ...OPENING_MATCH, completed: false }} label="🎉 Opnunarleikur" />

          {/* USMNT */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🇺🇸</span>
              <span className="font-semibold text-sm">USA Karlalandslið</span>
            </div>
            <div className="flex flex-col gap-1.5 text-sm" style={{ color: 'var(--muted)' }}>
              <div className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
                <span>📍</span><span>Heimaland — leikir í 11 borgum</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
                <span>⭐</span><span>Christian Pulisic, Gio Reyna, Tyler Adams</span>
              </div>
              <a href="https://www.espn.com/soccer/team/_/id/660/usmnt" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'var(--surface2)', color: 'var(--accent)' }}>
                <span>↗</span><span>ESPN — USMNT dagskrá</span>
              </a>
            </div>
          </div>

          {/* Iceland */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🇮🇸</span>
              <span className="font-semibold text-sm">Ísland</span>
            </div>
            <div className="text-sm p-2 rounded-xl" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
              Ísland keppist áfram um sæti í heimsmeistaramóti — fylgstu með UEFA
              <a href="https://www.ksi.is" target="_blank" rel="noreferrer"
                className="block mt-1" style={{ color: 'var(--accent)' }}>↗ KSÍ — ksi.is</a>
            </div>
          </div>

          <div className="card" style={{ borderColor: 'rgba(249,115,22,0.2)' }}>
            <div className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Gagnlegir hlekkir</div>
            <div className="flex flex-col gap-1">
              {[
                ['FIFA WC 2026', 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026'],
                ['ESPN World Cup', 'https://www.espn.com/soccer/league/_/name/FIFA.WORLD'],
                ['The Athletic', 'https://theathletic.com/soccer/international/'],
              ].map(([label, url]) => (
                <a key={url} href={url} target="_blank" rel="noreferrer"
                  className="text-sm flex items-center gap-2 px-2 py-1.5 rounded-lg"
                  style={{ color: '#f97316', background: 'var(--surface2)' }}>
                  ↗ {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
