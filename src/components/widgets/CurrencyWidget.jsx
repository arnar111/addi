import { useCurrency } from '../../hooks/useCurrency'
import { TrendingUp } from 'lucide-react'

const PAIRS = [
  { code: 'USD', flag: '🇺🇸', label: 'USD' },
  { code: 'EUR', flag: '🇪🇺', label: 'EUR' },
  { code: 'GBP', flag: '🇬🇧', label: 'GBP' },
  { code: 'DKK', flag: '🇩🇰', label: 'DKK' },
]

export default function CurrencyWidget() {
  const { rates, loading } = useCurrency()

  if (loading) return (
    <div className="card flex gap-2 animate-pulse-soft">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex-1 h-14 rounded-xl" style={{ background: 'var(--surface2)' }} />
      ))}
    </div>
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold text-sm">Gengi · ISK</h3>
        </div>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Uppf. {rates?.updatedAt}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {PAIRS.map(p => (
          <div key={p.code}
               className="flex flex-col items-center gap-0.5 p-2.5 rounded-xl"
               style={{ background: 'var(--surface2)' }}>
            <span className="text-base leading-none">{p.flag}</span>
            <span className="text-sm font-bold font-mono mt-1">{rates?.[p.code] ?? '—'}</span>
            <span style={{ fontSize: 9, color: 'var(--muted)' }}>kr/{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
