import { useExchangeRate } from '../../hooks/useExchangeRate'

const PAIRS = [
  { code: 'EUR', flag: '🇪🇺' },
  { code: 'USD', flag: '🇺🇸' },
  { code: 'GBP', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
]

export default function ExchangeRateWidget() {
  const { rates, loading } = useExchangeRate()

  return (
    <div className="card flex flex-col justify-between" style={{ minHeight: 100 }}>
      <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>Gengi · ISK</div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="h-3 rounded animate-pulse-soft" style={{ background: 'var(--surface2)', width: `${60 + i * 10}%` }} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {PAIRS.map(({ code, flag }) => (
            rates?.[code] ? (
              <div key={code} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{flag} {code}</span>
                <span className="text-sm font-bold tabular-nums">{rates[code].toLocaleString('is-IS')}</span>
              </div>
            ) : null
          ))}
        </div>
      )}
    </div>
  )
}
