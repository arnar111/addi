import { useState, useEffect } from 'react'

export function useCurrency() {
  const [rates, setRates] = useState(null) // { EUR: 143, USD: 133, GBP: 168, DKK: 19 } — ISK per 1 unit
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_rates')
    const cachedAt = sessionStorage.getItem('addi_rates_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 3600000) {
      setRates(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://api.frankfurter.app/latest?base=ISK&symbols=EUR,USD,GBP,DKK')
      .then(r => r.json())
      .then(d => {
        const iskPer = {}
        Object.entries(d.rates).forEach(([k, v]) => {
          iskPer[k] = Math.round(1 / v)
        })
        sessionStorage.setItem('addi_rates', JSON.stringify(iskPer))
        sessionStorage.setItem('addi_rates_at', String(Date.now()))
        setRates(iskPer)
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  return { rates, loading, error }
}
