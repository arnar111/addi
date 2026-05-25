import { useSports } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function GameRow({ game }) {
  const isFinal = game.status.includes('FINAL')
  const isLive = game.status.includes('IN_PROGRESS') || game.status === 'STATUS_HALFTIME'

  return (
    <div className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl"
         style={{ background: 'var(--surface2)', border: isLive ? '1px solid rgba(239,68,68,0.2)' : '1px solid transparent' }}>
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {game.home.logo && (
          <img src={game.home.logo} alt="" className="w-5 h-5 object-contain shrink-0"
               onError={e => { e.target.style.display = 'none' }} />
        )}
        <span className="text-xs truncate" style={{ fontWeight: game.home.winner ? 700 : 400 }}>
          {game.home.name}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0 px-1">
        {isFinal || isLive ? (
          <>
            <span className="text-xs font-bold">{game.home.score}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>–</span>
            <span className="text-xs font-bold">{game.away.score}</span>
          </>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(game.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        {isLive && (
          <span className="text-xs font-bold animate-pulse ml-1" style={{ color: 'var(--danger)' }}>●</span>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
        <span className="text-xs truncate text-right" style={{ fontWeight: game.away.winner ? 700 : 400 }}>
          {game.away.name}
        </span>
        {game.away.logo && (
          <img src={game.away.logo} alt="" className="w-5 h-5 object-contain shrink-0"
               onError={e => { e.target.style.display = 'none' }} />
        )}
      </div>
    </div>
  )
}

export default function SportsWidget() {
  const { inter, nba, loading } = useSports()

  if (loading) return (
    <div className="card flex items-center gap-3" style={{ minHeight: 72 }}>
      <span className="text-xl">🏆</span>
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="h-3 w-16 rounded animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
        <div className="h-3 w-32 rounded animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
      </div>
    </div>
  )

  if (inter.length === 0 && nba.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">🏆 Íþróttir</h3>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {inter.length > 0 && (
        <div className="mb-3">
          <div className="text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>⚽ Inter Milan</div>
          <div className="flex flex-col gap-1">
            {inter.slice(0, 1).map(g => <GameRow key={g.id} game={g} />)}
          </div>
        </div>
      )}

      {nba.length > 0 && (
        <div>
          <div className="text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>🏀 NBA</div>
          <div className="flex flex-col gap-1">
            {nba.slice(0, 2).map(g => <GameRow key={g.id} game={g} />)}
          </div>
        </div>
      )}
    </div>
  )
}
