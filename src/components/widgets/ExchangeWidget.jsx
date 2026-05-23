import { useExchangeRate } from '../../hooks/useExchangeRate'
import { TrendingUp } from 'lucide-react'

const PAIRS = [
  { key: 'EUR', flag: '🇪🇺', label: 'EUR' },
  { key: 'USD', flag: '🇺🇸', label: 'USD' },
  { key: 'GBP', flag: '🇬🇧', label: 'GBP' },
  { key: 'DKK', flag: '🇩🇰', label: 'DKK' },
]

export default function ExchangeWidget() {
  const { rates, loading } = useExchangeRate()

  if (loading) {
    return (
      <div className="card animate-pulse-soft flex items-center gap-2">
        <TrendingUp size={15} style={{ color: 'var(--muted)' }} />
        <span className="text-sm" style={{ color: 'var(--muted)' }}>Gengi...</span>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: '12px 16px' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>GENGI — ISK</span>
        </div>
        {rates?.updatedAt && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{rates.updatedAt}</span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {PAIRS.map(({ key, flag, label }) => (
          <div key={key} className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl"
               style={{ background: 'var(--surface2)' }}>
            <span className="text-base">{flag}</span>
            <span className="text-xs font-bold">{rates?.[key] ?? '–'}</span>
            <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
