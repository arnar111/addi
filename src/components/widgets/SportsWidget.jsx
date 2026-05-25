import { useSports } from '../../hooks/useSports'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function ScoreRow({ game, sport }) {
  if (!game) return null
  const [a, b] = game.teams
  if (!a || !b) return null
  const home = game.teams.find(t => t.homeAway === 'home') || b
  const away = game.teams.find(t => t.homeAway === 'away') || a

  const statusColor = game.isLive ? '#ef4444' : 'var(--muted)'
  const statusLabel = game.isLive
    ? (sport === 'nba' ? `Q${game.period} ${game.clock}` : `${game.clock}'`)
    : game.isFinal ? 'Lokið' : new Date(game.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col gap-1">
      {game.note && (
        <div className="text-xs font-medium" style={{ color: 'var(--accent)' }}>{game.note}</div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-sm">
            <span className={`font-medium ${away.winner ? 'text-white' : ''}`}>{away.name}</span>
            <span className="font-bold tabular-nums">{game.isFinal || game.isLive ? away.score : ''}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-0.5">
            <span className={`font-medium ${home.winner ? 'text-white' : ''}`}>{home.name}</span>
            <span className="font-bold tabular-nums">{game.isFinal || game.isLive ? home.score : ''}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs font-semibold" style={{ color: statusColor }}>
            {game.isLive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse" />}
            {statusLabel}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SportsWidget() {
  const { topNbaGame, topInterGame, loading } = useSports()
  const navigate = useNavigate()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-24 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      <div className="h-10 rounded" style={{ background: 'var(--surface2)' }} />
    </div>
  )

  if (!topNbaGame && !topInterGame) return null

  return (
    <button
      onClick={() => navigate('/sports')}
      className="card w-full text-left"
      style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(139,92,246,0.06))' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">⚽ 🏀 Íþróttir</h3>
        <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
      </div>
      <div className="flex flex-col gap-3">
        {topInterGame && (
          <div>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
              Serie A · Inter Milan
            </div>
            <ScoreRow game={topInterGame} sport="soccer" />
          </div>
        )}
        {topNbaGame && (
          <div style={topInterGame ? { borderTop: '1px solid var(--border)', paddingTop: 12 } : {}}>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>NBA</div>
            <ScoreRow game={topNbaGame} sport="nba" />
          </div>
        )}
      </div>
    </button>
  )
}
