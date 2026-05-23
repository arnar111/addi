import { useGolf } from '../../hooks/useGolf'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function GolfWidget() {
  const { rounds, handicap, bestRound } = useGolf()
  const last = rounds[0]

  return (
    <div className="card" style={{ border: '1px solid rgba(0,180,100,0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>⛳</span>
          <h3 className="font-semibold text-sm">Golf</h3>
        </div>
        <Link to="/golf" className="flex items-center gap-0.5 text-xs" style={{ color: '#22c55e' }}>
          Allt <ChevronRight size={12} />
        </Link>
      </div>

      {rounds.length === 0 ? (
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <span className="text-2xl">🏌️</span>
          <div>
            <div className="text-sm font-medium">Skráðu fyrstu umferðina</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Golf tracker · Íslenski völlurinn</div>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          {[
            ['HCP', handicap !== null ? handicap : '–', '#8b5cf6'],
            ['Besta', bestRound ? `${bestRound.differential > 0 ? '+' : ''}${bestRound.differential}` : '–', '#22c55e'],
            ['Umferðir', rounds.length, '#00d4aa'],
          ].map(([label, val, color]) => (
            <div key={label} className="flex-1 text-center p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>{label}</div>
              <div className="font-bold text-base" style={{ color }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {last && (
        <div className="mt-2 text-xs flex items-center justify-between"
             style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
          <span>Síðast: {last.courseName}</span>
          <span className="font-semibold" style={{ color: last.differential <= 0 ? 'var(--accent)' : 'var(--danger)' }}>
            {last.total} ({last.differential > 0 ? '+' : ''}{last.differential})
          </span>
        </div>
      )}
    </div>
  )
}
