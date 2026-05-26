import { useState, useEffect } from 'react'

export function useExchangeRate() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    const hit = sessionStorage.getItem('fx_rates')
    if (hit) {
      const { data, at } = JSON.parse(hit)
      if (Date.now() - at < 60 * 60 * 1000) {
        setRates(data)
        setUpdatedAt(new Date(at))
        setLoading(false)
        return
      }
    }

    // Use exchangerate-api free tier (EUR base, no key needed)
    fetch('https://open.er-api.com/v6/latest/EUR')
      .then(r => r.json())
      .then(d => {
        const iskPerEur = d.rates?.ISK || 145
        const iskPerUsd = d.rates?.ISK ? d.rates.ISK / (d.rates?.USD || 1) : 133
        const iskPerGbp = d.rates?.ISK ? d.rates.ISK / (d.rates?.GBP || 0.79) : 183

        const data = {
          eurToIsk: Math.round(iskPerEur),
          usdToIsk: Math.round(iskPerUsd),
          gbpToIsk: Math.round(iskPerGbp),
          iskToEur: (1 / iskPerEur).toFixed(4),
          iskToUsd: (1 / iskPerUsd).toFixed(4),
        }
        sessionStorage.setItem('fx_rates', JSON.stringify({ data, at: Date.now() }))
        setRates(data)
        setUpdatedAt(new Date())
        setLoading(false)
      })
      .catch(() => {
        // Fallback to approximate rates if API fails
        setRates({ eurToIsk: 148, usdToIsk: 136, gbpToIsk: 179, iskToEur: '0.0068', iskToUsd: '0.0074' })
        setLoading(false)
      })
  }, [])

  return { rates, loading, updatedAt }
}
