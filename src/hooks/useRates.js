import { useState, useEffect } from 'react'

export function useRates() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_rates')
    const cachedAt = sessionStorage.getItem('addi_ratesAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 3_600_000) {
      setRates(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://api.frankfurter.app/latest?from=ISK&to=USD,EUR,GBP,DKK')
      .then(r => r.json())
      .then(d => {
        const r = {}
        Object.entries(d.rates).forEach(([cur, rate]) => {
          r[cur] = Math.round(1 / rate)
        })
        sessionStorage.setItem('addi_rates', JSON.stringify(r))
        sessionStorage.setItem('addi_ratesAt', String(Date.now()))
        setRates(r)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { rates, loading }
}
