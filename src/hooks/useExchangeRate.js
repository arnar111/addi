import { useState, useEffect } from 'react'

export function useExchangeRate() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('exchange_rates')
      const cachedAt = sessionStorage.getItem('exchange_rates_at')
      if (cached && cachedAt && Date.now() - Number(cachedAt) < 60 * 60 * 1000) {
        setRates(JSON.parse(cached))
        setLoading(false)
        return
      }
    } catch {}

    fetch('https://open.er-api.com/v6/latest/EUR')
      .then(r => r.json())
      .then(d => {
        if (!d.rates) return
        const result = {
          EUR: Math.round(d.rates.ISK),
          USD: d.rates.USD ? Math.round(d.rates.ISK / d.rates.USD) : null,
          GBP: d.rates.GBP ? Math.round(d.rates.ISK / d.rates.GBP) : null,
          DKK: d.rates.DKK ? Math.round(d.rates.ISK / d.rates.DKK) : null,
        }
        try {
          sessionStorage.setItem('exchange_rates', JSON.stringify(result))
          sessionStorage.setItem('exchange_rates_at', String(Date.now()))
        } catch {}
        setRates(result)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { rates, loading }
}
