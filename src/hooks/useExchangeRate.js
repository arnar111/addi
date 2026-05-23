import { useState, useEffect } from 'react'

export function useExchangeRate() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('exch_v2')
    const cachedAt = sessionStorage.getItem('exch_v2_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 2 * 60 * 60 * 1000) {
      setRates(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(r => r.json())
      .then(d => {
        const isk = d.rates?.ISK
        if (!isk) throw new Error('no ISK')
        const r = {
          EUR: Math.round(isk / d.rates.EUR),
          GBP: Math.round(isk / d.rates.GBP),
          DKK: Math.round(isk / d.rates.DKK),
          USD: Math.round(isk),
          updatedAt: new Date().toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' }),
        }
        sessionStorage.setItem('exch_v2', JSON.stringify(r))
        sessionStorage.setItem('exch_v2_at', String(Date.now()))
        setRates(r)
        setLoading(false)
      })
      .catch(() => {
        setRates({ EUR: 148, GBP: 173, DKK: 20, USD: 136, updatedAt: '--:--' })
        setLoading(false)
      })
  }, [])

  return { rates, loading }
}
