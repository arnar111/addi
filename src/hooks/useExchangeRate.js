import { useState, useEffect } from 'react'

export function useExchangeRate() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('isk_rates')
    const cachedAt = sessionStorage.getItem('isk_rates_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 60 * 60 * 1000) {
      setRates(JSON.parse(cached))
      setLoading(false)
      return
    }

    // Fetches USD base rates, then we calculate ISK equivalents
    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/isk.min.json')
      .then(r => r.json())
      .then(data => {
        const isk = data.isk
        if (!isk) throw new Error('no data')
        const result = {
          usdPerIsk: isk.usd,
          eurPerIsk: isk.eur,
          gbpPerIsk: isk.gbp,
          dkkPerIsk: isk.dkk,
          // ISK per 1 foreign unit
          iskPerUsd: Math.round(1 / isk.usd),
          iskPerEur: Math.round(1 / isk.eur),
          iskPerGbp: Math.round(1 / isk.gbp),
          iskPerDkk: Math.round(1 / isk.dkk),
          updatedAt: new Date().toISOString(),
        }
        sessionStorage.setItem('isk_rates', JSON.stringify(result))
        sessionStorage.setItem('isk_rates_at', String(Date.now()))
        setRates(result)
      })
      .catch(() => {
        // Fallback approximate rates
        setRates({ iskPerUsd: 138, iskPerEur: 150, iskPerGbp: 175, iskPerDkk: 20, updatedAt: null })
      })
      .finally(() => setLoading(false))
  }, [])

  return { rates, loading }
}
