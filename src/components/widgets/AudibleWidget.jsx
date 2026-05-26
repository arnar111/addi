import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatISK } from '../../utils/currency'
import { BookOpen, AlertCircle } from 'lucide-react'

export default function AudibleWidget() {
  const { audibleCredits, setAudibleCredits, monthlyTotal } = useSubscriptions()
  const { count, expiringSoon } = audibleCredits

  return (
    <div className="flex flex-col gap-2">
      {/* Audible credits alert */}
      {count > 0 && (
        <div className="card flex items-center gap-3"
             style={{
               border: expiringSoon > 0 ? '1px solid rgba(249,115,22,0.4)' : '1px solid var(--border)',
               background: expiringSoon > 0 ? 'rgba(249,115,22,0.05)' : 'var(--surface)',
             }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: 'rgba(249,115,22,0.15)' }}>
            <BookOpen size={18} style={{ color: '#f97316' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Audible: {count} einingar</div>
            <div className="text-xs" style={{ color: expiringSoon > 0 ? '#f97316' : 'var(--muted)' }}>
              {expiringSoon > 0
                ? `⚠️ ${expiringSoon} rennur út fljótlega!`
                : 'Allar einingar í lagi'
              }
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <button
              onClick={() => setAudibleCredits(p => ({ ...p, count: Math.max(0, p.count - 1), expiringSoon: Math.max(0, p.expiringSoon - 1) }))}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
              Nota −1
            </button>
          </div>
        </div>
      )}

      {/* Monthly subscriptions total */}
      <div className="card flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(139,92,246,0.15)' }}>
          <span style={{ fontSize: 18 }}>💳</span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Mánaðarleg áskrift</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Samtals virkar áskriftir</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold text-base" style={{ color: 'var(--accent2)' }}>{formatISK(monthlyTotal)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>/ mánuður</div>
        </div>
      </div>
    </div>
  )
}
