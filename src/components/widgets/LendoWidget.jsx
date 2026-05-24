import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, Plus } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyRevenue, upcoming, thisMonth } = useLendo()
  const revenue = monthlyRevenue()
  const next = upcoming().slice(0, 2)
  const monthCount = thisMonth().length

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(249,115,22,0.07), rgba(0,212,170,0.04))',
      border: '1px solid rgba(249,115,22,0.2)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏠</span>
          <h3 className="font-semibold text-sm">Lendó</h3>
          <span className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
            Leiga
          </span>
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Tekjur þ.m.</div>
          <div className="text-xl font-bold" style={{ color: '#f97316' }}>{formatShortISK(revenue)}</div>
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Bókanir þ.m.</div>
          <div className="text-xl font-bold">{monthCount}</div>
        </div>
      </div>

      {next.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Næstar bókanir</div>
          {next.map(b => (
            <div key={b.id} className="flex items-center justify-between px-2 py-2 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium truncate">{b.customerName}</span>
                <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>{b.equipment}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  {new Date(b.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-xs font-semibold" style={{ color: '#f97316' }}>
                  {formatShortISK(b.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Link to="/lendo" className="flex items-center justify-center gap-2 py-2 rounded-xl text-sm"
              style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          <Plus size={14} /> Skrá bókun
        </Link>
      )}
    </div>
  )
}
