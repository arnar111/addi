import { useState } from 'react'
import { useCurrency } from '../../hooks/useCurrency'
import { RefreshCw } from 'lucide-react'

const SHOW = ['USD', 'EUR', 'GBP', 'DKK']

export default function CurrencyWidget() {
  const { rates, loading, pairs, updatedAt } = useCurrency()
  const [amount, setAmount] = useState(1000)

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-24 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      <div className="grid grid-cols-2 gap-2">
        {[0,1,2,3].map(i => <div key={i} className="h-10 rounded-xl" style={{ background: 'var(--surface2)' }} />)}
      </div>
    </div>
  )

  if (!rates) return null

  const shown = pairs.filter(p => SHOW.includes(p.code))

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Gengi</h3>
        {updatedAt && (
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <RefreshCw size={10} />
            {new Date(updatedAt).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-3 items-center">
        <input
          type="number"
          className="input text-sm"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          min={1}
        />
        <span className="text-sm font-medium shrink-0" style={{ color: 'var(--muted)' }}>ISK =</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {shown.map(p => {
          const rate = rates[p.code]
          if (!rate) return null
          const converted = rate ? (amount / rate).toFixed(2) : '–'
          return (
            <div key={p.code} className="flex items-center gap-2 p-2.5 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <span className="text-lg">{p.flag}</span>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{converted} {p.code}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>1 {p.code} = {rate} kr</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
