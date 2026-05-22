import { useState } from 'react'
import { useCurrency } from '../../hooks/useCurrency'

const PAIRS = [
  { code: 'EUR', flag: '🇪🇺', label: 'EUR' },
  { code: 'USD', flag: '🇺🇸', label: 'USD' },
  { code: 'DKK', flag: '🇩🇰', label: 'DKK' },
  { code: 'GBP', flag: '🇬🇧', label: 'GBP' },
  { code: 'NOK', flag: '🇳🇴', label: 'NOK' },
]

export default function CurrencyWidget() {
  const { rates, loading, convert } = useCurrency()
  const [iskInput, setIskInput] = useState('10000')

  const isk = Number(iskInput) || 0

  if (loading && !rates) {
    return (
      <div className="card animate-pulse-soft">
        <div className="h-4 w-32 rounded mb-3" style={{ background: 'var(--surface2)' }} />
        <div className="flex gap-2">
          {[1,2,3,4].map(i => <div key={i} className="h-10 flex-1 rounded-xl" style={{ background: 'var(--surface2)' }} />)}
        </div>
      </div>
    )
  }

  if (!rates) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Gengið</h3>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>ISK til</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="number"
          className="input text-sm"
          value={iskInput}
          onChange={e => setIskInput(e.target.value)}
          placeholder="10000"
        />
        <span className="text-sm font-medium shrink-0" style={{ color: 'var(--muted)' }}>ISK =</span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {PAIRS.map(p => {
          const val = convert(isk, p.code)
          return (
            <div key={p.code} className="flex flex-col items-center gap-1 py-2 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <span className="text-base">{p.flag}</span>
              <span className="text-xs font-semibold">{val !== null ? (val >= 1000 ? Math.round(val) : val.toFixed(1)) : '—'}</span>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{p.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
