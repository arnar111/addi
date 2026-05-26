import { useNBAScores } from '../../hooks/useSports'
import { ExternalLink, Trophy } from 'lucide-react'

function GameCard({ game }) {
  const isLive = game.state === 'in'
  const isDone = game.state === 'post'
  const isPre = game.state === 'pre'
  const isKnicksHome = game.homeTeam.includes('Knicks')
  const isKnicksAway = game.awayTeam.includes('Knicks')
  const knicksWon = (isKnicksHome && game.homeWinner) || (isKnicksAway && game.awayWinner)

  return (
    <div className="flex flex-col gap-1.5 px-2 py-2 rounded-xl shrink-0"
         style={{
           background: isLive ? 'rgba(239,68,68,0.08)' : 'var(--surface2)',
           border: `1px solid ${isLive ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`,
           minWidth: 140,
         }}>
      {/* Status */}
      <div className="flex items-center justify-between">
        {isLive ? (
          <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#ef4444' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {game.clock ? `${game.clock} Q${game.period}` : 'LIVE'}
          </span>
        ) : isDone ? (
          <span className="text-xs" style={{ color: knicksWon ? 'var(--success)' : 'var(--muted)' }}>
            {knicksWon ? '✓ Sigur' : 'Lokið'}
          </span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(game.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-1">
        {[
          { name: game.awayAbbr, score: game.awayScore, winner: game.awayWinner, isKnicks: isKnicksAway },
          { name: game.homeAbbr, score: game.homeScore, winner: game.homeWinner, isKnicks: isKnicksHome },
        ].map((t, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className={`text-xs font-semibold ${t.isKnicks ? '' : ''}`}
                  style={{ color: t.isKnicks ? 'var(--text)' : 'var(--muted)' }}>
              {t.isKnicks ? '🗽 ' : ''}{t.name}
            </span>
            {(isLive || isDone) && (
              <span className="text-sm font-bold tabular-nums"
                    style={{ color: t.winner ? 'var(--text)' : 'var(--muted)' }}>
                {t.score}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SportsWidget() {
  const { games, loading, error } = useNBAScores()

  const hasKnicks = games.some(g => g.isKnicks)

  return (
    <div className="card" style={{ background: 'rgba(0,31,63,0.4)', border: '1px solid rgba(0,119,190,0.25)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏀</span>
          <span className="font-semibold text-sm">NBA</span>
          {hasKnicks && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(0,119,190,0.2)', color: '#4fc3f7', border: '1px solid rgba(0,119,190,0.3)' }}>
              Knicks
            </span>
          )}
        </div>
        <a href="https://www.espn.com/nba/" target="_blank" rel="noreferrer"
           className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--muted)' }}>
          ESPN <ExternalLink size={10} />
        </a>
      </div>

      {/* Finals banner */}
      {hasKnicks && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
             style={{ background: 'linear-gradient(135deg, rgba(0,119,190,0.15), rgba(245,130,32,0.15))', border: '1px solid rgba(0,119,190,0.2)' }}>
          <Trophy size={14} style={{ color: '#f5a623' }} />
          <span className="text-xs font-semibold" style={{ color: '#f5a623' }}>NBA Finals 2026 — Go Knicks! 🗽</span>
        </div>
      )}

      {loading ? (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {[1, 2].map(i => (
            <div key={i} className="rounded-xl shrink-0 animate-pulse-soft"
                 style={{ width: 140, height: 70, background: 'var(--surface2)', minWidth: 140 }} />
          ))}
        </div>
      ) : error || games.length === 0 ? (
        <div className="text-xs text-center py-3" style={{ color: 'var(--muted)' }}>
          {hasKnicks ? '' : 'Engar leikir í dag'}
          {!hasKnicks && <div className="mt-1 font-semibold" style={{ color: '#4fc3f7' }}>NY Knicks eru í NBA Finals! 🏆</div>}
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {games.map(g => <GameCard key={g.id} game={g} />)}
        </div>
      )}
    </div>
  )
}
