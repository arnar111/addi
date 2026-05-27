import { useState, useEffect } from 'react'

export function useFX() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('fx')
    const cachedAt = sessionStorage.getItem('fxAt')
    // Cache for 30 minutes
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 30 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    // Use a free, no-key exchange rate API
    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json')
      .then(r => r.json())
      .then(json => {
        const rates = json.usd
        const fxData = {
          // How many ISK per 1 unit of foreign currency
          usdToIsk: rates.isk ? Math.round(rates.isk) : 138,
          eurToIsk: rates.isk && rates.eur ? Math.round(rates.isk / rates.eur) : 150,
          gbpToIsk: rates.isk && rates.gbp ? Math.round(rates.isk / rates.gbp) : 175,
          // ISK per USD/EUR/GBP
          updatedAt: new Date().toISOString(),
        }
        sessionStorage.setItem('fx', JSON.stringify(fxData))
        sessionStorage.setItem('fxAt', String(Date.now()))
        setData(fxData)
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  return { data, loading, error }
}
