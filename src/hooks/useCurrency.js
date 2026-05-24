import { useState, useEffect } from 'react'

export function useCurrency() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [error, setError] = useState(null)

  const refresh = () => {
    setLoading(true)
    sessionStorage.removeItem('currency_v2')
    sessionStorage.removeItem('currency_v2_at')
    fetchRates()
  }

  function fetchRates() {
    fetch('https://api.frankfurter.app/latest?from=ISK')
      .then(r => r.json())
      .then(data => {
        const result = {
          EUR: data.rates.EUR,
          USD: data.rates.USD,
          GBP: data.rates.GBP,
          DKK: data.rates.DKK,
          NOK: data.rates.NOK,
          SEK: data.rates.SEK,
        }
        sessionStorage.setItem('currency_v2', JSON.stringify(result))
        sessionStorage.setItem('currency_v2_at', String(Date.now()))
        setRates(result)
        setUpdatedAt(new Date())
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    const cached = sessionStorage.getItem('currency_v2')
    const cachedAt = sessionStorage.getItem('currency_v2_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 2 * 60 * 60 * 1000) {
      setRates(JSON.parse(cached))
      setUpdatedAt(new Date(Number(cachedAt)))
      setLoading(false)
      return
    }
    fetchRates()
  }, [])

  return { rates, loading, updatedAt, error, refresh }
}
