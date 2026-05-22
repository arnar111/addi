import { useSports, LEAGUES } from '../../hooks/useSports'

function GameCard({ game }) {
  const isLive = game.status === 'STATUS_IN_PROGRESS'
  const isFinal = game.status === 'STATUS_FINAL'
  const hasScore = game.home.score != null

  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium truncate">{game.away.name}</span>
          {hasScore && (
            <span className="text-sm font-bold tabular-nums ml-2 shrink-0"
                  style={{ color: game.away.winner ? 'var(--text)' : 'var(--muted)' }}>
              {game.away.score}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium truncate">{game.home.name}</span>
          {hasScore && (
            <span className="text-sm font-bold tabular-nums ml-2 shrink-0"
                  style={{ color: game.home.winner ? 'var(--text)' : 'var(--muted)' }}>
              {game.home.score}
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0 text-right min-w-[52px]">
        <span className="text-xs px-1.5 py-0.5 rounded-lg font-medium"
              style={{
                background: isLive ? 'rgba(239,68,68,0.15)' : 'var(--surface2)',
                color: isLive ? '#ef4444' : 'var(--muted)',
              }}>
          {isLive ? '🔴 ' : ''}{game.statusShort}
        </span>
      </div>
    </div>
  )
}

export default function SportsWidget() {
  const { games, loading, activeLeague, setActiveLeague } = useSports()
  const currentLeague = LEAGUES.find(l => l.id === activeLeague)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">⚽ Leikir</h3>
        <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {LEAGUES.map(l => (
            <button key={l.id} onClick={() => setActiveLeague(l.id)}
              className="text-xs px-2 py-1 rounded-lg shrink-0 transition-all"
              style={{
                background: activeLeague === l.id ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                color: activeLeague === l.id ? 'var(--accent)' : 'var(--muted)',
                border: `1px solid ${activeLeague === l.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
              }}>
              {l.icon} {l.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-6 text-center text-sm animate-pulse-soft" style={{ color: 'var(--muted)' }}>
          Hleð leikjum...
        </div>
      ) : games.length === 0 ? (
        <div className="py-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
          Engir leikir í dag · {currentLeague?.full}
        </div>
      ) : (
        <div>
          {games.slice(0, 6).map(g => <GameCard key={g.id} game={g} />)}
          {games.length > 6 && (
            <p className="text-xs text-center pt-2" style={{ color: 'var(--muted)' }}>
              + {games.length - 6} fleiri leikir
            </p>
          )}
        </div>
      )}
    </div>
  )
}
