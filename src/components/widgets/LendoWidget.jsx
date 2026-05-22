import { Link } from 'react-router-dom'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Plus, ArrowRight } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyIncome, goal, totalRentals } = useLendo()
  const income = monthlyIncome()
  const pct = Math.min(100, Math.round((income / goal) * 100))
  const isGoalMet = income >= goal

  return (
    <div className="card" style={{
      background: isGoalMet
        ? 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(0,212,170,0.06))'
        : 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(0,212,170,0.02))',
    }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm">🏠</span>
            <span className="text-sm font-semibold">Lendó</span>
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {totalRentals()} {totalRentals() === 1 ? 'leiga' : 'leigur'} þennan mánuð
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--accent)' }}>
            {formatShortISK(income)}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(goal)}
          </div>
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: isGoalMet ? 'var(--success)' : 'var(--accent)' }} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {isGoalMet ? '🎉 Markmið náð!' : `${pct}% af markmiði`}
        </span>
        <Link to="/lendo" className="flex items-center gap-1 text-xs"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}>
          Skoða <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  )
}
