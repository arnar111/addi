import { useSports } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function matchDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.round((d - now) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Í dag'
  if (diff === 1) return 'Á morgun'
  if (diff > 0 && diff < 7) return `${diff} dagar`
  return d.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })
}

export default function SportsWidget() {
  const { nextMatch, lastResult, loading } = useSports()

  const isHome = lastResult?.strHomeTeam?.includes('West Ham')
  const whScore = lastResult ? Number(isHome ? lastResult.intHomeScore : lastResult.intAwayScore) : null
  const oppScore = lastResult ? Number(isHome ? lastResult.intAwayScore : lastResult.intHomeScore) : null
  const won = whScore > oppScore
  const drew = whScore === oppScore
  const opponent = lastResult ? (isHome ? lastResult.strAwayTeam : lastResult.strHomeTeam) : null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⚒️</span>
          <h3 className="font-semibold text-sm">West Ham</h3>
        </div>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {loading ? (
        <div className="h-10 rounded-xl animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
      ) : (
        <div className="flex gap-2">
          {/* Next match */}
          {nextMatch && (
            <div className="flex-1 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Næsti leikur</div>
              <div className="text-xs font-medium truncate">
                {nextMatch.strHomeTeam?.includes('West Ham') ? nextMatch.strAwayTeam : nextMatch.strHomeTeam}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
                {matchDate(nextMatch.dateEvent)}
              </div>
            </div>
          )}

          {/* Last result */}
          {lastResult && whScore !== null && (
            <div className="flex-1 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Síðasti leikur</div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: won ? 'rgba(34,197,94,0.2)' : drew ? 'rgba(100,116,139,0.2)' : 'rgba(239,68,68,0.2)',
                        color: won ? 'var(--success)' : drew ? 'var(--muted)' : 'var(--danger)',
                      }}>
                  {won ? 'W' : drew ? 'D' : 'L'}
                </span>
                <span className="text-xs font-bold tabular-nums">{whScore}–{oppScore}</span>
              </div>
              <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{opponent}</div>
            </div>
          )}

          {!nextMatch && !lastResult && (
            <div className="flex-1 text-xs text-center py-2" style={{ color: 'var(--muted)' }}>
              Engar upplýsingar
            </div>
          )}
        </div>
      )}
    </div>
  )
}
