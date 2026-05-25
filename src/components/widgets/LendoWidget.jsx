import { useLendo } from '../../hooks/useLendo'
import { formatISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, Calendar } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyRevenue, upcomingBookings, unpaidRevenue } = useLendo()
  const upcoming = upcomingBookings().slice(0, 2)
  const revenue = monthlyRevenue()
  const unpaid = unpaidRevenue()

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(139,92,246,0.06) 100%)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏠</span>
          <h3 className="font-semibold text-sm">Lendó</h3>
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent3)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex gap-3 mb-3">
        <div className="flex-1 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Þessi mánuður</div>
          <div className="text-xl font-semibold" style={{ color: '#fb923c' }}>{formatISK(revenue)}</div>
        </div>
        {unpaid > 0 && (
          <div className="flex-1 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Ógreitt</div>
            <div className="text-xl font-semibold" style={{ color: 'var(--danger)' }}>{formatISK(unpaid)}</div>
          </div>
        )}
      </div>

      {upcoming.length > 0 ? (
        <div className="flex flex-col gap-2">
          {upcoming.map(b => (
            <div key={b.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <Calendar size={14} style={{ color: 'var(--accent3)', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{b.customerName}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {new Date(b.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  {b.startDate !== b.endDate && ` – ${new Date(b.endDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}`}
                </div>
              </div>
              <span className="text-xs font-semibold" style={{ color: '#fb923c' }}>{formatISK(b.total)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>Engar komandi pantanir</p>
      )}
    </div>
  )
}
