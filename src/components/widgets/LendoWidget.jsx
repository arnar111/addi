import { Link } from 'react-router-dom'
import { Package, ChevronRight, Plus, Calendar } from 'lucide-react'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'

export default function LendoWidget() {
  const { monthlyIncome, upcomingBookings, monthlyTarget } = useLendo()

  const income = monthlyIncome()
  const upcoming = upcomingBookings()
  const next = upcoming[0] || null
  const pct = Math.min(100, Math.round((income / monthlyTarget) * 100))
  const isParty = pct >= 100
  const barColor = isParty ? 'var(--success)' : pct >= 80 ? '#f97316' : 'var(--accent)'

  const nextDateStr = next ? (() => {
    try {
      const d = new Date(next.date)
      return d.toLocaleDateString('is-IS', { weekday: 'short', day: 'numeric', month: 'short' })
    } catch { return next.date }
  })() : null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
               style={{ background: 'rgba(0,212,170,0.15)' }}>
            <Package size={14} style={{ color: 'var(--accent)' }} />
          </div>
          <h3 className="font-semibold text-sm">Lendó</h3>
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="mb-3">
        <div className="flex items-end justify-between mb-1.5">
          <div>
            <div className="text-xl font-bold" style={{ color: isParty ? 'var(--success)' : 'var(--text)' }}>
              {formatShortISK(income)} {isParty && '🎉'}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              af {formatShortISK(monthlyTarget)} marki
            </div>
          </div>
          <span className="text-sm font-bold" style={{
            color: isParty ? 'var(--success)' : pct >= 80 ? '#f97316' : 'var(--accent)'
          }}>{pct}%</span>
        </div>

        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${pct}%`, background: barColor }} />
        </div>
      </div>

      {next ? (
        <div className="rounded-xl p-2.5 mb-3" style={{ background: 'var(--surface2)' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Næsta leiga</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{next.customer}</div>
              <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--muted)' }}>
                <Calendar size={10} /> {nextDateStr}
              </div>
            </div>
            <div className="font-bold text-sm" style={{ color: 'var(--accent)' }}>
              {formatShortISK(next.amount)}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-center py-2 mb-3" style={{ color: 'var(--muted)' }}>
          Engar væntanlegar leigur
        </div>
      )}

      <Link to="/lendo" className="btn btn-ghost w-full justify-center text-xs gap-1.5"
            style={{ color: 'var(--accent)', borderColor: 'rgba(0,212,170,0.25)' }}>
        <Plus size={13} /> Bæta við bókun
      </Link>
    </div>
  )
}
