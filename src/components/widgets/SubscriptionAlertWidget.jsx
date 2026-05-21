import { useNavigate } from 'react-router-dom'
import { AlertCircle, ChevronRight } from 'lucide-react'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatISK } from '../../utils/currency'

export default function SubscriptionAlertWidget() {
  const { alerts, upcomingRenewals } = useSubscriptions()
  const navigate = useNavigate()

  if (alerts.length === 0 && upcomingRenewals.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {alerts.map(s => (
        <button
          key={s.id}
          onClick={() => navigate('/finance?tab=subs')}
          className="card w-full text-left flex items-center gap-3"
          style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)' }}
        >
          <AlertCircle size={18} style={{ color: 'var(--danger)', shrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
              {s.name} — Pausaður
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {s.note || 'Greiðsluvandamál — þarf aðgerð'}
            </div>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
        </button>
      ))}

      {upcomingRenewals.map(s => {
        const days = Math.ceil((new Date(s.renewDate) - new Date()) / (1000 * 60 * 60 * 24))
        return (
          <button
            key={s.id}
            onClick={() => navigate('/finance?tab=subs')}
            className="card w-full text-left flex items-center gap-3"
            style={{ borderColor: 'rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.06)' }}
          >
            <span className="text-lg">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{s.name}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {formatISK(s.amount)} · Endurnýjast eftir {days} daga
              </div>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
          </button>
        )
      })}
    </div>
  )
}
