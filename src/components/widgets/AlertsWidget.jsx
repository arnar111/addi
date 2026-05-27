import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, X, ChevronRight, Flame } from 'lucide-react'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatISK } from '../../utils/currency'

// Duolingo streak: 13 years as of May 2013 → ~4749 days by May 27 2026
const DUO_START = new Date('2013-05-14')
const duoStreak = Math.floor((new Date() - DUO_START) / (1000 * 60 * 60 * 24))

export default function AlertsWidget() {
  const { failedSubs } = useSubscriptions()
  const [dismissed, setDismissed] = useState([])

  const totalFailed = failedSubs.filter(s => !dismissed.includes(s.id))
  const showDuo = !dismissed.includes('duo')

  if (totalFailed.length === 0 && !showDuo) return null

  return (
    <div className="flex flex-col gap-2">
      {/* Payment failures */}
      {totalFailed.map(sub => (
        <div key={sub.id} className="card flex items-center gap-3 py-3 animate-slide-up"
             style={{ background: 'rgba(239,68,68,0.07)', borderColor: 'rgba(239,68,68,0.35)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-base"
               style={{ background: 'rgba(239,68,68,0.15)' }}>
            <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
              {sub.icon} {sub.name} — greiðsla mistókst
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              {formatISK(sub.amount)}/mán · uppfærðu kortaupplýsingar
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Link to="/subscriptions">
              <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
            </Link>
            <button onClick={() => setDismissed(d => [...d, sub.id])}
                    style={{ color: 'var(--muted)' }}>
              <X size={14} />
            </button>
          </div>
        </div>
      ))}

      {/* Duolingo streak reminder */}
      {showDuo && (
        <div className="card flex items-center gap-3 py-3 animate-slide-up"
             style={{ background: 'rgba(249,115,22,0.06)', borderColor: 'rgba(249,115,22,0.2)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xl">
            🦜
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold flex items-center gap-1.5">
              <Flame size={13} style={{ color: '#f97316' }} />
              <span style={{ color: 'var(--accent3)' }}>{duoStreak} daga röð!</span>
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              13 ára Duolingo röð — ekki gleyma í dag 🎯
            </div>
          </div>
          <button onClick={() => setDismissed(d => [...d, 'duo'])}
                  style={{ color: 'var(--muted)' }}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
