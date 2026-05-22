import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, Plus } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyIncome, monthlyGoal, totalRentals, goalProgress } = useLendo()
  const income = monthlyIncome()
  const pct = goalProgress()
  const isGoalMet = pct >= 100

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(139,92,246,0.06))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.15)' }}>
            <span style={{ fontSize: 14 }}>🪑</span>
          </div>
          <h3 className="font-semibold text-sm">Lendó leigutekjur</h3>
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: '#f97316' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-2xl font-semibold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--text)' }}>
            {formatShortISK(income)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(monthlyGoal)} marki · {totalRentals()} leig{totalRentals() === 1 ? 'a' : 'ur'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: isGoalMet ? 'var(--success)' : '#f97316' }}>
            {pct}%
          </div>
          {isGoalMet && <div className="text-xs" style={{ color: 'var(--success)' }}>🎉 Náð!</div>}
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${pct}%`, background: isGoalMet ? 'var(--success)' : '#f97316' }} />
      </div>

      <Link to="/lendo"
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-medium transition-all"
        style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>
        <Plus size={12} /> Skrá leiguna
      </Link>
    </div>
  )
}
