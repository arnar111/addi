import { useAudible } from '../../hooks/useAudible'
import { Headphones, AlertTriangle, Plus, Minus } from 'lucide-react'

export default function AudibleWidget() {
  const { credits, daysUntilBilling, expiringCount, useCredit, addCredit } = useAudible()

  const urgency = expiringCount > 0 || daysUntilBilling <= 7

  return (
    <div className="card-inset">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Headphones size={15} style={{ color: urgency ? 'var(--warning)' : 'var(--accent2)' }} />
          <span className="text-sm font-medium">Audible</span>
          {urgency && (
            <AlertTriangle size={12} style={{ color: 'var(--warning)' }} />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={useCredit} className="btn-icon btn btn-ghost" title="Nota credit">
            <Minus size={12} />
          </button>
          <span className="text-lg font-bold" style={{ color: urgency ? 'var(--warning)' : 'var(--accent2)' }}>
            {credits}
          </span>
          <button onClick={addCredit} className="btn-icon btn btn-ghost" title="Bæta við credit">
            <Plus size={12} />
          </button>
        </div>
      </div>
      <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
        {credits === 1 ? '1 credit' : `${credits} credits`} ·{' '}
        {urgency
          ? `⚠️ ${daysUntilBilling} dagar til næstu greiðslu`
          : `${daysUntilBilling} dagar til næstu greiðslu`}
      </div>
    </div>
  )
}
