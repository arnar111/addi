import { useSports } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function getResultLabel(ev, team = 'Arsenal') {
  const isHome = ev.homeTeam?.includes(team)
  const myScore = isHome ? parseInt(ev.homeScore) : parseInt(ev.awayScore)
  const theirScore = isHome ? parseInt(ev.awayScore) : parseInt(ev.homeScore)
  if (isNaN(myScore) || isNaN(theirScore)) return { label: '–', color: 'var(--muted)' }
  if (myScore > theirScore) return { label: 'W', color: 'var(--success)' }
  if (myScore < theirScore) return { label: 'L', color: 'var(--danger)' }
  return { label: 'D', color: '#f97316' }
}

function getOpponent(ev, team = 'Arsenal') {
  return ev.homeTeam?.includes(team) ? ev.awayTeam : ev.homeTeam
}

function getScore(ev, team = 'Arsenal') {
  const isHome = ev.homeTeam?.includes(team)
  return isHome
    ? `${ev.homeScore}–${ev.awayScore}`
    : `${ev.awayScore}–${ev.homeScore}`
}

function getDaysUntil(dateStr) {
  const now = new Date()
  const then = new Date(dateStr)
  const diff = Math.round((then - now) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Í dag'
  if (diff === 1) return 'Á morgun'
  if (diff < 0) return null
  return `${diff} dagar`
}

export default function ArsenalWidget() {
  const { lastResults, nextFixtures, loading } = useSports()

  if (loading) return (
    <div className="card animate-pulse-soft" style={{ minHeight: 80 }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">⚽</span>
        <span className="text-sm font-semibold">Arsenal</span>
      </div>
      <div className="h-8 rounded-lg" style={{ background: 'var(--surface2)' }} />
    </div>
  )

  const lastGame = lastResults?.[0]
  const nextGame = nextFixtures?.[0]

  if (!lastGame && !nextGame) return null

  const last5 = lastResults?.slice(0, 5) || []

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(255,255,255,0.02))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔴</span>
          <span className="font-semibold text-sm">Arsenal FC</span>
          {/* Last 5 result dots */}
          <div className="flex gap-0.5 ml-1">
            {last5.map((ev, i) => {
              const r = getResultLabel(ev)
              return (
                <span key={i} className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                      style={{ background: r.color + '22', color: r.color, fontSize: 9 }}>
                  {r.label}
                </span>
              )
            })}
          </div>
        </div>
        <Link to="/sport" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Meira <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex gap-2">
        {/* Last result */}
        {lastGame && (
          <div className="flex-1 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Síðasta leikur</div>
            <div className="font-bold text-base">{getScore(lastGame)}</div>
            <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
              {getOpponent(lastGame)}
            </div>
            {(() => {
              const r = getResultLabel(lastGame)
              return (
                <span className="text-xs font-bold mt-1 inline-block" style={{ color: r.color }}>{r.label}</span>
              )
            })()}
          </div>
        )}

        {/* Next fixture */}
        {nextGame && (
          <div className="flex-1 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Næsti leikur</div>
            <div className="font-bold text-sm leading-tight">{getOpponent(nextGame)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
              {getDaysUntil(nextGame.date)}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(nextGame.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
