import { useRates } from '../../hooks/useRates'

const CURRENCIES = [
  { code: 'USD', flag: '🇺🇸' },
  { code: 'EUR', flag: '🇪🇺' },
  { code: 'GBP', flag: '🇬🇧' },
  { code: 'DKK', flag: '🇩🇰' },
]

export default function RatesWidget() {
  const { rates, loading } = useRates()
  if (loading || !rates) return null

  return (
    <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      {CURRENCIES.map(c => rates[c.code] ? (
        <div
          key={c.code}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl shrink-0"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-lg leading-none">{c.flag}</span>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold">{rates[c.code]} ISK</span>
            <span style={{ color: 'var(--muted)', fontSize: 10 }}>1 {c.code}</span>
          </div>
        </div>
      ) : null)}
    </div>
  )
}
