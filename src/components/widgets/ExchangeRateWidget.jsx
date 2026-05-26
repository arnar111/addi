import { useExchangeRate } from '../../hooks/useExchangeRate'
import { TrendingUp } from 'lucide-react'

const PAIRS = [
  { key: 'iskPerUsd', label: 'USD', flag: '🇺🇸' },
  { key: 'iskPerEur', label: 'EUR', flag: '🇪🇺' },
  { key: 'iskPerGbp', label: 'GBP', flag: '🇬🇧' },
  { key: 'iskPerDkk', label: 'DKK', flag: '🇩🇰' },
]

export default function ExchangeRateWidget() {
  const { rates, loading } = useExchangeRate()

  if (loading) return (
    <div className="card animate-pulse-soft" style={{ height: 60 }}>
      <div className="h-3 w-32 rounded" style={{ background: 'var(--surface2)' }} />
    </div>
  )

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
        <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>GENGI • ISK</span>
        {rates?.updatedAt && (
          <span className="ml-auto text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>
            {new Date(rates.updatedAt).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {PAIRS.map(({ key, label, flag }) => (
          <div key={key} className="flex flex-col items-center gap-1 py-2 rounded-xl"
               style={{ background: 'var(--surface2)' }}>
            <span className="text-base">{flag}</span>
            <span className="text-xs font-bold">{rates?.[key] ?? '—'}</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
