import { useSports } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { ChevronRight, Trophy } from 'lucide-react'

function GameRow({ game }) {
  const isLive = game.state === 'in'
  const isDone = game.state === 'post'
  const knicksWon = (game.home.winner && game.isKnicks && game.home.name.includes('Knicks')) ||
                    (game.away.winner && game.isKnicks && game.away.name.includes('Knicks'))

  return (
    <div className="flex items-center gap-2 py-2" style={{ borderTop: '1px solid var(--border)' }}>
      {/* Away */}
      <span className="text-xs font-medium truncate flex-1 text-right"
            style={{ color: game.away.winner && isDone ? 'var(--text)' : 'var(--muted)' }}>
        {game.away.abbr || game.away.name}
      </span>

      {/* Score/Status */}
      <div className="shrink-0 flex flex-col items-center min-w-[64px]">
        {isLive ? (
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-bold text-sm tabular-nums">
              <span style={{ color: game.away.winner ? 'var(--text)' : 'var(--muted)' }}>{game.away.score}</span>
              <span style={{ color: 'var(--muted)', margin: '0 3px' }}>-</span>
              <span style={{ color: game.home.winner ? 'var(--text)' : 'var(--muted)' }}>{game.home.score}</span>
            </span>
            <span className="animate-pulse-soft" style={{ color: 'var(--danger)', fontSize: 9, fontWeight: 600 }}>
              {game.clock ? `Q${game.period} ${game.clock}` : 'LIVE'}
            </span>
          </div>
        ) : isDone ? (
          <span className="font-bold text-sm tabular-nums">
            <span style={{ color: game.away.winner ? 'var(--text)' : 'var(--muted)' }}>{game.away.score}</span>
            <span style={{ color: 'var(--muted)', margin: '0 3px' }}>-</span>
            <span style={{ color: game.home.winner ? 'var(--text)' : 'var(--muted)' }}>{game.home.score}</span>
          </span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {game.date.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Home */}
      <span className="text-xs font-medium truncate flex-1"
            style={{ color: game.home.winner && isDone ? 'var(--text)' : 'var(--muted)' }}>
        {game.home.abbr || game.home.name}
      </span>

      {/* Live dot */}
      {isLive && <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: 'var(--danger)' }} />}
    </div>
  )
}

export default function NBAWidget() {
  const { nba, loading } = useSports()

  const hasKnicks = nba.some(g => g.isKnicks)

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-3 w-20 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      {[0, 1].map(i => (
        <div key={i} className="h-8 rounded-lg mb-1" style={{ background: 'var(--surface2)' }} />
      ))}
    </div>
  )

  return (
    <div className="card" style={{ border: '1px solid rgba(0,119,190,0.2)', background: 'rgba(0,31,63,0.3)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>🏀</span>
          <h3 className="font-semibold text-sm">NBA</h3>
          {hasKnicks && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(0,119,190,0.2)', color: '#4fc3f7', border: '1px solid rgba(0,119,190,0.25)' }}>
              <Trophy size={10} />
              Finals
            </span>
          )}
        </div>
        <Link to="/sports?tab=nba" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {hasKnicks && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
             style={{ background: 'linear-gradient(135deg, rgba(0,119,190,0.15), rgba(245,130,32,0.1))' }}>
          <span className="text-base">🗽</span>
          <span className="text-xs font-bold" style={{ color: '#f5a623' }}>NY Knicks eru í NBA Finals!</span>
        </div>
      )}

      {nba.length === 0 ? (
        <div className="py-3 text-center">
          {hasKnicks || (
            <div>
              <div className="text-2xl mb-1">🗽</div>
              <div className="text-sm font-semibold" style={{ color: '#4fc3f7' }}>NY Knicks — NBA Finals 2026</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Engar leikir í dag</div>
            </div>
          )}
        </div>
      ) : (
        nba.slice(0, 3).map(g => <GameRow key={g.id} game={g} />)
      )}
    </div>
  )
}
