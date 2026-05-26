import { useExchangeRate } from '../../hooks/useExchangeRate'
import { TrendingUp } from 'lucide-react'

export default function ExchangeRateWidget() {
  const { rates, loading } = useExchangeRate()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-24 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map(i => <div key={i} className="h-14 rounded-xl" style={{ background: 'var(--surface2)' }} />)}
      </div>
    </div>
  )

  if (!rates) return null

  const pairs = [
    { from: 'EUR', to: 'ISK', rate: rates.eurToIsk, flag: '🇪🇺', color: '#3b82f6' },
    { from: 'USD', to: 'ISK', rate: rates.usdToIsk, flag: '🇺🇸', color: '#22c55e' },
    { from: 'GBP', to: 'ISK', rate: rates.gbpToIsk, flag: '🇬🇧', color: '#8b5cf6' },
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-1.5">
          <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
          Gengi / ISK
        </h3>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>í dag</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {pairs.map(({ from, to, rate, flag, color }) => (
          <div key={from} className="flex flex-col items-center gap-1 p-2.5 rounded-xl"
               style={{ background: 'var(--surface2)' }}>
            <span className="text-lg">{flag}</span>
            <span className="text-xs font-medium" style={{ color }}>1 {from}</span>
            <span className="text-sm font-bold">{rate.toLocaleString('is-IS')}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>ISK</span>
          </div>
        ))}
      </div>
    </div>
  )
}
