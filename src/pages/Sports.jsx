import { useSports } from '../hooks/useSports'
import { ExternalLink, Loader } from 'lucide-react'

const QUICK_LINKS = [
  { name: 'The Athletic', url: 'https://theathletic.com', icon: '📰', color: '#e4002b' },
  { name: 'BBC Sport', url: 'https://bbc.co.uk/sport/football', icon: '⚽', color: '#0052cc' },
  { name: 'Sofascore', url: 'https://sofascore.com', icon: '📊', color: '#00d4aa' },
  { name: 'Transfermarkt', url: 'https://transfermarkt.com', icon: '🔄', color: '#003087' },
  { name: 'World Cup 2026', url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026', icon: '🏆', color: '#d4af37' },
  { name: 'ATP Tennis', url: 'https://www.atptour.com', icon: '🎾', color: '#8b5cf6' },
  { name: 'Eurosport', url: 'https://eurosport.com', icon: '📺', color: '#003580' },
  { name: 'Flashscore', url: 'https://flashscore.com', icon: '⚡', color: '#f97316' },
]

function matchDate(dateStr, timeStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T' + (timeStr || '00:00:00'))
  return d.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
}

function matchTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  return `${h}:${m}`
}

function ResultBadge({ match }) {
  const isHome = match.strHomeTeam === 'West Ham United' || match.strHomeTeam?.includes('West Ham')
  const whScore = Number(isHome ? match.intHomeScore : match.intAwayScore)
  const oppScore = Number(isHome ? match.intAwayScore : match.intHomeScore)
  const opponent = isHome ? match.strAwayTeam : match.strHomeTeam
  const won = whScore > oppScore
  const drew = whScore === oppScore

  return (
    <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
      <span className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{
              background: won ? 'rgba(34,197,94,0.2)' : drew ? 'rgba(100,116,139,0.2)' : 'rgba(239,68,68,0.2)',
              color: won ? 'var(--success)' : drew ? 'var(--muted)' : 'var(--danger)',
            }}>
        {won ? 'W' : drew ? 'D' : 'L'}
      </span>
      <span className="text-sm flex-1 truncate">{opponent}</span>
      <span className="text-sm font-bold tabular-nums">{whScore} – {oppScore}</span>
      <span className="text-xs" style={{ color: 'var(--muted)' }}>
        {matchDate(match.dateEvent, match.strTime)}
      </span>
    </div>
  )
}

export default function Sports() {
  const { nextMatches, lastMatches, loading, error } = useSports()
  const next = nextMatches[0]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>West Ham · Heimsmeistaramót 2026</p>
      </div>

      {/* West Ham Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(129,15,22,0.15), rgba(0,0,0,0))',
        border: '1px solid rgba(129,15,22,0.25)',
      }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
               style={{ background: 'rgba(129,15,22,0.2)' }}>⚒️</div>
          <div>
            <div className="font-semibold">West Ham United</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Championship 2026/27</div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 py-4 justify-center" style={{ color: 'var(--muted)' }}>
            <Loader size={15} className="animate-spin" /> Hleð leikjum...
          </div>
        )}

        {error && (
          <div className="text-xs text-center py-3" style={{ color: 'var(--muted)' }}>
            Gat ekki sótt leikjaáætlun. Prófaðu síðar.
          </div>
        )}

        {!loading && !error && (
          <>
            {next ? (
              <div className="mb-4">
                <div className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>NÆSTI LEIKUR</div>
                <div className="p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: 'var(--accent)' }}>{next.strLeague}</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {matchDate(next.dateEvent, next.strTime)} · {matchTime(next.strTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold flex-1">{next.strHomeTeam}</span>
                    <span className="text-xs font-bold px-3" style={{ color: 'var(--muted)' }}>vs</span>
                    <span className="text-sm font-semibold flex-1 text-right">{next.strAwayTeam}</span>
                  </div>
                  {next.strVenue && (
                    <div className="text-xs text-center mt-1.5" style={{ color: 'var(--muted)' }}>
                      📍 {next.strVenue}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-center py-3 mb-3" style={{ color: 'var(--muted)' }}>
                Engir leikir skráðir
              </div>
            )}

            {lastMatches.length > 0 && (
              <div>
                <div className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>NÝLEGAR NIÐURSTÖÐUR</div>
                <div className="flex flex-col gap-1.5">
                  {lastMatches.slice(0, 4).map(m => (
                    <ResultBadge key={m.idEvent} match={m} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* World Cup 2026 */}
      <a href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026"
         target="_blank" rel="noopener noreferrer"
         className="card flex items-center gap-4"
         style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), transparent)', border: '1px solid rgba(212,175,55,0.25)', textDecoration: 'none', color: 'inherit' }}>
        <div className="text-3xl">🏆</div>
        <div className="flex-1">
          <div className="font-semibold text-sm">FIFA World Cup 2026</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>USA · Canada · Mexíkó · Júní–Júlí 2026</div>
        </div>
        <ExternalLink size={14} style={{ color: 'var(--muted)' }} />
      </a>

      {/* ATP / Tennis */}
      <a href="https://www.atptour.com/en/scores/current" target="_blank" rel="noopener noreferrer"
         className="card flex items-center gap-4"
         style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), transparent)', border: '1px solid rgba(139,92,246,0.2)', textDecoration: 'none', color: 'inherit' }}>
        <div className="text-3xl">🎾</div>
        <div className="flex-1">
          <div className="font-semibold text-sm">ATP Tour — Jannik Sinner</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Lífstegar, niðurstöður og töflur</div>
        </div>
        <ExternalLink size={14} style={{ color: 'var(--muted)' }} />
      </a>

      {/* Quick links */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Flýtitenglar</h3>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_LINKS.map(l => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
               className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-center transition-opacity hover:opacity-80"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="text-xl">{l.icon}</span>
              <span className="text-xs leading-tight" style={{ color: 'var(--muted)' }}>{l.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
