import { NavLink } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useInterMilan, useKnicks } from '../../hooks/useSports'

function ResultBadge({ won, drew }) {
  if (drew) return (
    <span className="text-xs px-1.5 py-0.5 rounded font-bold"
          style={{ background: 'rgba(100,116,139,0.2)', color: 'var(--muted)' }}>J</span>
  )
  if (won) return (
    <span className="text-xs px-1.5 py-0.5 rounded font-bold"
          style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>W</span>
  )
  return (
    <span className="text-xs px-1.5 py-0.5 rounded font-bold"
          style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>L</span>
  )
}

function Row({ label, score, opponentScore, won, drew, logo }) {
  return (
    <div className="flex items-center gap-2">
      {logo ? (
        <img src={logo} alt={label} className="w-4 h-4 object-contain shrink-0" />
      ) : (
        <div className="w-4 h-4 rounded-full shrink-0" style={{ background: 'var(--surface2)' }} />
      )}
      <span className="text-xs font-medium flex-1 truncate" style={{ maxWidth: 70 }}>{label}</span>
      <span className="text-xs tabular-nums font-bold">{score}–{opponentScore}</span>
      <ResultBadge won={won} drew={drew} />
    </div>
  )
}

export default function SportsWidget() {
  const inter = useInterMilan()
  const knicks = useKnicks()

  const lastInter = inter.data?.recent?.[0]
  const lastKnicks = knicks.data?.recent?.[0]

  if (inter.loading && knicks.loading) return (
    <div className="card animate-pulse-soft" style={{ height: 76 }} />
  )

  if (!lastInter && !lastKnicks) return null

  return (
    <NavLink to="/sports" style={{ textDecoration: 'none' }}>
      <div className="card" style={{ cursor: 'pointer' }}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Íþróttir</span>
          <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
        </div>
        <div className="flex flex-col gap-2">
          {lastInter && (
            <Row
              label="Inter"
              score={lastInter.myScore}
              opponentScore={lastInter.opponentScore}
              won={lastInter.won}
              drew={lastInter.drew}
              logo={inter.data?.team?.logo}
            />
          )}
          {lastKnicks && (
            <Row
              label="Knicks"
              score={lastKnicks.myScore}
              opponentScore={lastKnicks.opponentScore}
              won={lastKnicks.won}
              drew={lastKnicks.drew}
              logo={knicks.data?.team?.logo}
            />
          )}
        </div>
      </div>
    </NavLink>
  )
}
