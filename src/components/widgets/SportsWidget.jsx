import { useSports } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { ChevronRight, Newspaper } from 'lucide-react'

export default function SportsWidget() {
  const { news, scores, loading } = useSports('eng.1')

  const tottScores = scores.filter(s =>
    s.homeTeam?.toLowerCase().includes('tot') ||
    s.awayTeam?.toLowerCase().includes('tot') ||
    s.homeTeam?.toLowerCase().includes('spurs') ||
    s.awayTeam?.toLowerCase().includes('spurs')
  )
  const latestMatch = tottScores[0] || scores[0]
  const topNews = news[0]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-base">⚽</span>
          <h3 className="font-semibold text-sm">Fótbolti</h3>
        </div>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2 animate-pulse-soft">
          <div className="h-4 rounded w-3/4" style={{ background: 'var(--surface2)' }} />
          <div className="h-3 rounded w-1/2" style={{ background: 'var(--surface2)' }} />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {latestMatch && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-xs font-semibold w-16 text-right truncate">{latestMatch.homeTeam}</span>
              <div className="flex items-center gap-1 shrink-0">
                {latestMatch.homeScore != null ? (
                  <span className="font-bold tabular-nums text-sm px-2 py-0.5 rounded-lg"
                        style={{ background: 'var(--surface)', minWidth: 40, textAlign: 'center' }}>
                    {latestMatch.homeScore} – {latestMatch.awayScore}
                  </span>
                ) : (
                  <span className="text-xs px-2" style={{ color: 'var(--muted)' }}>vs</span>
                )}
              </div>
              <span className="text-xs font-semibold w-16 truncate">{latestMatch.awayTeam}</span>
            </div>
          )}

          {topNews && (
            <a href={topNews.link} target="_blank" rel="noopener noreferrer"
               className="flex items-start gap-2 group">
              <Newspaper size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--muted)' }} />
              <p className="text-xs leading-snug group-hover:underline" style={{ color: 'var(--text)' }}>
                {topNews.headline}
              </p>
            </a>
          )}

          {!latestMatch && !topNews && (
            <p className="text-sm text-center py-1" style={{ color: 'var(--muted)' }}>Engar niðurstöður</p>
          )}
        </div>
      )}
    </div>
  )
}
