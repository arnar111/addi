import { useState } from 'react'
import { useCurrency } from '../../hooks/useCurrency'
import { TrendingUp } from 'lucide-react'

const CURRENCIES = [
  { code: 'EUR', flag: '🇪🇺', name: 'Evra' },
  { code: 'USD', flag: '🇺🇸', name: 'Dollari' },
  { code: 'GBP', flag: '🇬🇧', name: 'Sterling' },
  { code: 'DKK', flag: '🇩🇰', name: 'D. Króna' },
]

export default function CurrencyWidget() {
  const { rates, loading } = useCurrency()
  const [amount, setAmount] = useState('')
  const [from, setFrom] = useState('EUR')

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-16 rounded-xl" style={{ background: 'var(--surface2)' }} />
    </div>
  )

  if (!rates) return null

  const converted = amount && !isNaN(Number(amount)) && rates[from]
    ? Math.round(Number(amount) * rates[from]).toLocaleString('is-IS')
    : null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-1.5">
          <TrendingUp size={14} style={{ color: 'var(--accent)' }} /> Gengi
        </h3>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>kr á mann</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {CURRENCIES.map(c => (
          <div
            key={c.code}
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl"
            style={{ background: 'var(--surface2)' }}
          >
            <span className="text-lg">{c.flag}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{c.code}</span>
            <span className="text-sm font-bold leading-tight">
              {rates[c.code] ? rates[c.code].toLocaleString('is-IS') : '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Mini converter */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
        <input
          className="input text-sm py-1.5 flex-1"
          type="number"
          placeholder="Upphæð..."
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ minWidth: 0 }}
        />
        <select
          className="input text-sm py-1.5 px-2 shrink-0"
          style={{ width: 80, background: 'var(--surface)' }}
          value={from}
          onChange={e => setFrom(e.target.value)}
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
          ))}
        </select>
        <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>=</span>
        <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--accent)', minWidth: 56, textAlign: 'right' }}>
          {converted ? `${converted} kr` : '— kr'}
        </span>
      </div>
    </div>
  )
}
