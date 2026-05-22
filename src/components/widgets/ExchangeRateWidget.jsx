import { useState, useEffect } from 'react'

function useExchangeRates() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_fx')
    const cachedAt = sessionStorage.getItem('addi_fx_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 3_600_000) {
      setRates(JSON.parse(cached))
      setLoading(false)
      return
    }
    fetch('https://api.frankfurter.app/latest?to=ISK,USD,GBP,DKK,NOK')
      .then(r => r.json())
      .then(d => {
        const isk = d.rates.ISK
        const result = {
          EUR: Math.round(isk),
          USD: Math.round(isk / d.rates.USD),
          GBP: Math.round(isk / d.rates.GBP),
          DKK: Math.round(isk / d.rates.DKK),
          NOK: Math.round(isk / d.rates.NOK),
        }
        sessionStorage.setItem('addi_fx', JSON.stringify(result))
        sessionStorage.setItem('addi_fx_at', String(Date.now()))
        setRates(result)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { rates, loading }
}

const CURRENCIES = [
  { code: 'USD', flag: '🇺🇸' },
  { code: 'EUR', flag: '🇪🇺' },
  { code: 'GBP', flag: '🇬🇧' },
  { code: 'DKK', flag: '🇩🇰' },
  { code: 'NOK', flag: '🇳🇴' },
]

export default function ExchangeRateWidget() {
  const { rates, loading } = useExchangeRates()

  return (
    <div className="card py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>💱 Gengi gagnvart ISK</span>
        {rates && (
          <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>
            Frankfurter · í dag
          </span>
        )}
      </div>
      {loading ? (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-14 w-14 rounded-xl shrink-0 animate-pulse-soft"
                 style={{ background: 'var(--surface2)' }} />
          ))}
        </div>
      ) : rates ? (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CURRENCIES.map(c => (
            <div key={c.code}
                 className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl shrink-0 transition-all"
                 style={{ background: 'var(--surface2)', minWidth: 58 }}>
              <span className="text-lg leading-none">{c.flag}</span>
              <span className="font-semibold text-sm tabular-nums">{rates[c.code]}</span>
              <span style={{ color: 'var(--muted)', fontSize: 10 }}>{c.code}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
