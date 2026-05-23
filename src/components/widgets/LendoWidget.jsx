import { useLendo } from '../../hooks/useLendo'
import { formatISK } from '../../utils/currency'
import { useNavigate } from 'react-router-dom'

export default function LendoWidget() {
  const { monthlyRevenue, paidRevenue, upcomingBookings, pendingAmount } = useLendo()
  const navigate = useNavigate()
  const upcoming = upcomingBookings().slice(0, 2)
  const monthly = monthlyRevenue()
  const paid = paidRevenue()
  const pending = pendingAmount()

  return (
    <div
      className="card cursor-pointer"
      onClick={() => navigate('/lendo')}
      style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.05))' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🪑</span>
        <span className="text-sm font-semibold">Lendó</span>
        <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>Leigurekstur</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Þessi mánuður</span>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{formatISK(monthly)}</span>
        </div>
        <div className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Greitt</span>
          <span className="text-sm font-bold" style={{ color: 'var(--success)' }}>{formatISK(paid)}</span>
        </div>
        <div className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Ógreitt</span>
          <span className="text-sm font-bold" style={{ color: pending > 0 ? 'var(--accent3)' : 'var(--muted)' }}>{formatISK(pending)}</span>
        </div>
      </div>

      {upcoming.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Næstar bókanir</div>
          {upcoming.map(b => (
            <div key={b.id} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg" style={{ background: 'var(--surface2)' }}>
              <span>🗓️</span>
              <span className="flex-1 font-medium">{b.customer}</span>
              <span style={{ color: 'var(--muted)' }}>
                {new Date(b.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                {b.startDate !== b.endDate ? ` – ${new Date(b.endDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}` : ''}
              </span>
              <span style={{ color: b.paid ? 'var(--success)' : 'var(--accent3)' }}>
                {b.paid ? '✓' : '⏳'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-center py-1" style={{ color: 'var(--muted)' }}>
          Engar bókanir skráðar · Bættu við
        </div>
      )}
    </div>
  )
}
