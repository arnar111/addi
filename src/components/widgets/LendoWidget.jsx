import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'

export default function LendoWidget() {
  const { monthlyIncome, monthlyPending, upcomingBookings } = useLendo()
  const income = monthlyIncome()
  const pending = monthlyPending()
  const upcoming = upcomingBookings()

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(0,212,170,0.03))',
      border: '1px solid rgba(0,212,170,0.2)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🪑</span>
          <span className="font-semibold text-sm">Lendó</span>
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Tekjur í mánuði</div>
          <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{formatShortISK(income)}</div>
        </div>
        <div className="p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Ógreiddar</div>
          <div className="text-lg font-semibold" style={{ color: pending > 0 ? '#f97316' : 'var(--muted)' }}>
            {formatShortISK(pending)}
          </div>
        </div>
      </div>

      {upcoming.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted)' }}>Næstu pantanir</div>
          {upcoming.slice(0, 2).map(b => (
            <div key={b.id} className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full shrink-0"
                   style={{ background: b.paid ? 'var(--success)' : '#f97316' }} />
              <span className="flex-1 truncate font-medium">{b.customer}</span>
              <span style={{ color: 'var(--muted)' }}>
                {new Date(b.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-center py-1" style={{ color: 'var(--muted)' }}>Engar pantanir skráðar</p>
      )}
    </div>
  )
}
