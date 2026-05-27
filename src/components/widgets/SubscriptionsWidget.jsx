import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, AlertCircle } from 'lucide-react'

export default function SubscriptionsWidget() {
  const { monthlyTotal, upcoming, nextPayment, daysUntilNext, active } = useSubscriptions()

  const urgent = upcoming.filter(s => {
    const days = daysUntilNext(s.nextDate)
    return days !== null && days <= 3
  })

  const huel = active.find(s => s.id === 'huel')
  const huelAlert = huel && huel.note && huel.note.includes('misheppnaðist')

  return (
    <div className="card" style={{
      background: huelAlert || urgent.length > 0
        ? 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(239,68,68,0.06))'
        : 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,170,0.06))',
      border: `1px solid ${huelAlert || urgent.length > 0 ? 'rgba(249,115,22,0.2)' : 'var(--border)'}`,
    }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Áskriftir / mánuður</div>
          <div className="text-2xl font-semibold">{formatShortISK(monthlyTotal)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{active.length} áskriftir virkar</div>
        </div>
        <Link to="/subscriptions" className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allar <ChevronRight size={12} />
        </Link>
      </div>

      {/* Alert for failed Huel payment */}
      {huelAlert && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
             style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle size={14} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <span className="text-xs" style={{ color: 'var(--danger)' }}>
            Huel greiðsla misheppnaðist! Uppfærðu kortaupplýsingar.
          </span>
        </div>
      )}

      {/* Upcoming payments */}
      {upcoming.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {upcoming.slice(0, 3).map(sub => {
            const days = daysUntilNext(sub.nextDate)
            const isUrgent = days !== null && days <= 3
            return (
              <div key={sub.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{sub.icon}</span>
                  <span className="text-xs font-medium">{sub.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{formatShortISK(sub.amount)}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-lg font-medium"
                        style={{
                          background: isUrgent ? 'rgba(239,68,68,0.15)' : 'var(--surface2)',
                          color: isUrgent ? 'var(--danger)' : 'var(--muted)',
                        }}>
                    {days === 0 ? 'Í dag' : days === 1 ? 'Á morgun' : `${days}d`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
