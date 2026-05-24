import { useSports } from '../../hooks/useSports'
import { useNavigate } from 'react-router-dom'

function ScoreRow({ match }) {
  const live = match.status === 'in'
  const finished = match.status === 'post'
  const hasScore = match.homeScore !== null && match.awayScore !== null

  return (
    <div className="flex items-center gap-2 text-sm py-1">
      <div className="flex-1 text-right text-xs truncate">{match.home}</div>
      <div className="flex items-center gap-1 shrink-0">
        {hasScore ? (
          <span className="font-bold tabular-nums px-2 py-0.5 rounded-lg text-xs"
                style={{ background: live ? 'rgba(239,68,68,0.12)' : 'var(--surface2)',
                         color: live ? 'var(--danger)' : 'var(--text)' }}>
            {match.homeScore} – {match.awayScore}
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-lg"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
            {match.statusDesc || 'vs'}
          </span>
        )}
        {live && (
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft shrink-0"
                style={{ background: 'var(--danger)' }} />
        )}
      </div>
      <div className="flex-1 text-xs truncate">{match.away}</div>
    </div>
  )
}

export default function SportsWidget() {
  const { scores, loading } = useSports('eng.1')
  const navigate = useNavigate()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-28 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      {[1,2,3].map(i => <div key={i} className="h-7 rounded mb-1.5" style={{ background: 'var(--surface2)' }} />)}
    </div>
  )

  const relevant = scores.slice(0, 4)
  if (!relevant.length) return null

  return (
    <div className="card cursor-pointer" onClick={() => navigate('/sports')}
         style={{ borderColor: 'rgba(249,115,22,0.2)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>⚽</span>
          <h3 className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>PREMIER LEAGUE</h3>
        </div>
        <span className="text-xs" style={{ color: 'var(--accent)' }}>Meira →</span>
      </div>
      <div className="flex flex-col divide-y" style={{ '--tw-divide-opacity': 0.05 }}>
        {relevant.map(m => <ScoreRow key={m.id} match={m} />)}
      </div>
    </div>
  )
}
