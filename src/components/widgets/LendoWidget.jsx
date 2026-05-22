import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingUp, Home } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyRevenue, monthlyGoal, goalProgress, netProfit, currentMonthBookings } = useLendo()
  const rev = monthlyRevenue()
  const pct = goalProgress()
  const profit = netProfit()
  const bookings = currentMonthBookings()

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(255,107,53,0.07), rgba(139,92,246,0.05))',
      border: '1px solid rgba(255,107,53,0.18)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
               style={{ background: 'rgba(255,107,53,0.15)' }}>
            <Home size={14} style={{ color: '#ff6b35' }} />
          </div>
          <span className="font-semibold text-sm">Lendó</span>
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: '#ff6b35' }}>
          Opna <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
          <div className="text-2xl font-bold">{formatShortISK(rev)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(monthlyGoal)} marki · {bookings.length} bókanir
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: profit >= 0 ? '#22c55e' : 'var(--danger)' }}>
            <TrendingUp size={13} />
            {formatShortISK(Math.abs(profit))}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>hagnaður</div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{
               width: `${pct}%`,
               background: pct >= 100 ? '#22c55e' : pct > 50 ? '#ff6b35' : 'rgba(255,107,53,0.7)',
             }} />
      </div>
      <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span>{pct}% af marki</span>
        <span>{formatShortISK(Math.max(0, monthlyGoal - rev))} eftir</span>
      </div>
    </div>
  )
}
